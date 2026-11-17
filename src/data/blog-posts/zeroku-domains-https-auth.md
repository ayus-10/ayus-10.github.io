---
title: "Zeroku Gets Domains, HTTPS, and API Authentication"
slug: "zeroku-domains-https-auth"
description: "Zeroku now routes deployed apps through Caddy, serves them on subdomains with HTTPS, and protects its management API with bearer-token authentication."
publishDate: "2026-11-17"
---

Zeroku started as a small deployment platform: send a repository to a server, build it into a container, and run it. This update adds the pieces that make deployments easier to reach and safer to manage: app-specific domains, automatic HTTPS, and authentication for the control API.

## Apps get their own domains

In production, Caddy now sits in front of the control plane and deployed apps. Each app is available on its own subdomain:

```text
https://<app-name>.<base-domain>
```

For example, with `my-app` as the app name and `1-2-3-4.sslip.io` as the base domain, the app gets a URL like `https://my-app.1-2-3-4.sslip.io`. The default `sslip.io` domain maps the server's IP address into a domain name, so you can get started without setting up DNS records for every app.

Caddy manages the routes and obtains HTTPS certificates automatically. An ACME staging option is available for testing certificate setup without using production certificates. The control plane is reachable through its own `zeroku` subdomain, while app traffic is forwarded to each app's local container port.

## The API is protected

The control API now requires a bearer token. Set `AUTH_TOKEN` in the environment, and the CLI includes it with requests for deploying, listing, inspecting, and stopping apps. Requests without a valid token are rejected. Production configuration also validates that the token is set.

This keeps the management endpoints behind an explicit credential instead of leaving deployment operations open to anyone who can reach the server.

## More predictable configuration

Server settings are loaded together and validated at startup. This covers the listen host and port, state directory, application environment, URL scheme, base domain, ACME staging mode, and authentication token. Invalid ports, hostnames, domains, or environment values produce a configuration error instead of being accepted silently.

App names are also checked before they become part of a route. Names must be lowercase DNS-friendly labels, and `zeroku` is reserved for the control plane.

## A simpler deployment workflow

The CLI now sends authenticated requests for its management operations and includes a `stop` command alongside deploy, list, get, and destroy. A typical workflow looks like this:

```sh
zeroku deploy my-app https://github.com/you/my-app
zeroku list
zeroku get --name my-app
zeroku stop --name my-app
```

Once deployed, the app is served through its subdomain, with Caddy handling HTTPS and routing traffic to the container.

## What changed

Zeroku now connects the deployment workflow to the parts users need after a container starts: a stable app URL, HTTPS, and a protected control plane. The result is a more complete path from repository to a service you can visit and manage.
