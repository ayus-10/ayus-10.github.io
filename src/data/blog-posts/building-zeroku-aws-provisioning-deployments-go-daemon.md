---
title: "Building Zeroku: AWS Provisioning, Deployments, and a Go Daemon"
slug: "building-zeroku-aws-provisioning-deployments-go-daemon"
description: "Notes from building Zeroku, a self-hosted deployment platform using Go, AWS EC2, and Docker."
publishDate: "2026-11-06"
---

Zeroku is a self-hosted deployment tool built with Go, AWS EC2, and Docker. It provisions infrastructure, deploys applications from Git repositories, and provides a CLI to manage them.

A good chunk of the work went into making the different pieces work together. Provisioning an EC2 instance is one thing, but handling failures during provisioning, keeping track of deployments, and making sure application state stays consistent are separate problems.

Here is a look at how the pieces fit together.

## Getting the infrastructure ready

The first part is infrastructure provisioning. Zeroku handles this through its initialization process, which takes care of preparing the AWS resources needed to run the daemon.

The process involves selecting an appropriate AMI, finding the default VPC, creating a security group, generating an EC2 key pair, saving the private PEM file locally, and finally launching the EC2 instance.

The PEM file is stored under:

`~/.zeroku/zeroku-<region>.pem`

Initialization had to be reasonably safe to retry. AWS provisioning involves multiple independent API calls, and there is no transaction that rolls all of them back automatically. So if something fails halfway through, we need to clean up whatever was already created.

For example, if the instance was successfully launched but a later operation failed, simply deleting the security group would not work while it is still attached to the instance. The instance needs to be terminated first, and the security group can be removed once it is no longer attached.

The same idea applies to the key pair and the locally saved PEM file. We track what was actually created so cleanup does not blindly attempt to delete resources that never existed.

Here is roughly how that process looks:

![Initialization](https://ayus-10.github.io/assets/blog/zeroku-init.png)

The cleanup path depends on how far initialization got. The important thing is that a failed initialization should not leave behind an EC2 instance, an unused security group, or an orphaned key pair.

## The daemon and its API

The daemon is written in Go and uses the routing improvements introduced in Go 1.22. It exposes five endpoints for managing applications.

| Method | Endpoint                 | Purpose                      |
| ------ | ------------------------ | ---------------------------- |
| POST   | `/v1/apps/{name}/deploy` | Deploy an application        |
| GET    | `/v1/apps`               | List applications            |
| GET    | `/v1/apps/{name}`        | Retrieve application details |
| POST   | `/v1/apps/{name}/stop`   | Stop an application          |
| DELETE | `/v1/apps/{name}`        | Delete an application        |

The deployment endpoint is where most of the interesting work happens.

A deployment starts with validating the application name and repository URL. Once those checks pass, the daemon clones the GitHub repository and builds a Docker image from it.

A small `flushWriter` was implemented to ensure the build output is forwarded to the HTTP response and flushed as it arrives. This makes the deployment request feel much more responsive because the client can actually see what Docker is doing.

Failed repository clones and failed builds are also handled without taking down the daemon. Errors are sent back through the response stream.

The deployment pipeline looks something like this:

![Deployment pipeline](https://ayus-10.github.io/assets/blog/zeroku-deployment-pipeline.png)

## Keeping track of application state

The daemon uses a file-based JSON store to persist application state.

This was deliberately kept simple. There is no database to configure or manage. The store maintains application metadata and release history in a local file.

The store uses a mutex to protect access to shared in-memory state. Reads use a read lock, while modifications use an exclusive lock.

Writes are atomic as well. Instead of directly overwriting the existing state file, the updated state is written to a temporary file and then replaces the original. This avoids leaving a partially written state file if something goes wrong during persistence.

The data model has two main structures: `App` and `Release`.

An application stores its name, repository, container port, environment configuration, release history, current release ID, and next release ID.

A release stores its ID, Docker image, Git commit, container ID, host port, status, environment file location, creation timestamp, and any error message.

This gives each application its own deployment history instead of constantly replacing a single container record.

## The CLI

The CLI is the interface through which users interact with Zeroku.

It communicates with the daemon and supports the main workflows:

- Initializing AWS infrastructure.
- Deploying applications from Git repositories.
- Listing deployed applications.
- Retrieving individual application details.
- Stopping applications.
- Deleting applications.

The CLI handles user interaction without duplicating the daemon's responsibilities. The daemon owns the application lifecycle and state, while the CLI acts as the client.

This also means the same API can eventually be used by other clients without needing to reproduce the deployment logic.

## A few things worth getting right

There were a few design decisions that kept coming up while putting everything together.

**Failure handling matters at every layer.** AWS provisioning can fail halfway through, Git cloning can fail, Docker builds can fail, and containers can fail health checks.

**State and deployment history are different things.** An application can have many releases, but only one should be identified as its current active release.

**Concurrency cannot be ignored.** Deployments of the same application need to be isolated so that two concurrent requests do not race while allocating releases or updating the active release.

There is still plenty of room to improve things, especially around failure recovery, integration testing, and cleanup of resources that outlive their deployments. But having infrastructure provisioning, a persistent state store, a deployment pipeline, and a CLI working together gives Zeroku a solid foundation to build on.
