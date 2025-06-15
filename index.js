const goBack = () => window.history.back();

const aboutTab = document.getElementById("tab-about");
const experienceTab = document.getElementById("tab-experience");
const contactTab = document.getElementById("tab-contact");

const aboutSection = document.querySelectorAll(".about-section")[0];
const experienceSection = document.querySelectorAll(".experience-section")[0];
const contactSection = document.querySelectorAll(".contact-section")[0];

const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const messageInput = document.getElementById("message");

const hideSections = (sections) => {
  sections.forEach((section) => {
    switch (section) {
      case "about":
        aboutSection.style.display = "none";
        break;
      case "experience":
        experienceSection.style.display = "none";
        break;
      case "contact":
        contactSection.style.display = "none";
    }
  });
};

const renderSection = (section) => {
  const sectionsToHide = ["experience", "contact", "about"].filter(
    (s) => s !== section
  );

  switch (section) {
    case "about":
      aboutSection.style.display = "block";
      hideSections(sectionsToHide);
      break;
    case "experience":
      experienceSection.style.display = "block";
      hideSections(sectionsToHide);
      break;
    case "contact":
      contactSection.style.display = "block";
      hideSections(sectionsToHide);
      break;
    default:
      aboutSection.style.display = "block";
      hideSections(sectionsToHide);
  }
};

const updateActiveTab = (tab) => {
  const activeTab = document.querySelectorAll(".active")[0];
  activeTab.classList.remove("active");

  history.replaceState(null, "", `#${tab.split("-")[1]}`);

  switch (tab) {
    case "tab-about":
      aboutTab.classList.add("active");
      renderSection("about");
      break;
    case "tab-experience":
      experienceTab.classList.add("active");
      renderSection("experience");
      break;
    case "tab-contact":
      contactTab.classList.add("active");
      renderSection("contact");
      break;
    default:
      aboutTab.classList.add("active");
      renderSection("about");
  }
};

const submitForm = (event) => {
  event.preventDefault();

  const name = nameInput.value;
  const email = emailInput.value;
  const message = messageInput.value;

  if (!name || !email || !message) return;

  const messageSentText = document.querySelectorAll(".message-sent-text")[0];

  fetch(
    "https://nsfcejnlucgrwfnoeiqm.supabase.co/functions/v1/dynamic-action",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        message,
      }),
    }
  )
    .then(() => {
      messageSentText.style.display = "block";
    })
    .finally(() => {
      nameInput.value = "";
      emailInput.value = "";
      messageInput.value = "";
    });
};

document.addEventListener("DOMContentLoaded", () => {
  const initialTab = window.location.hash.slice(1);
  updateActiveTab(`tab-${initialTab ?? "about"}`);
});
