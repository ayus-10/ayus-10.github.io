const goBack = () => window.history.back();

const profileImage = document.querySelectorAll(".profile-image")[0];
const bannerImage = document.querySelectorAll(".banner-image")[0];
const fullBannerImage = document.querySelectorAll(".full-banner-image")[0];
const fullProfileImage = document.querySelectorAll(".full-profile-image")[0];

profileImage.addEventListener("click", () =>
  fullProfileImage.classList.toggle("visible"),
);

bannerImage.addEventListener("click", () =>
  fullBannerImage.classList.toggle("visible"),
);

fullBannerImage.addEventListener("click", (e) => {
  if (e.target.tagName === "ASIDE") {
    fullBannerImage.classList.remove("visible");
  }
});

fullProfileImage.addEventListener("click", (e) => {
  if (e.target.tagName === "ASIDE") {
    fullProfileImage.classList.remove("visible");
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    fullProfileImage.classList.remove("visible");
    fullBannerImage.classList.remove("visible");
  }
});

const aboutTab = document.getElementById("tab-about");
const experienceTab = document.getElementById("tab-experience");
const contactTab = document.getElementById("tab-contact");

const aboutSection = document.querySelectorAll(".about-section")[0];
const experienceSection = document.querySelectorAll(".experience-section")[0];
const contactSection = document.querySelectorAll(".contact-section")[0];

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
    (s) => s !== section,
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

const preventDefaultSubmit = (event) => {
  event.preventDefault();
};

const submitForm = () => {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const message = document.getElementById("message").value;

  const recipientEmail = "aayushupreti2022@gmail.com";
  const subject = encodeURIComponent(`Message from ${name}, ${email}`);
  const body = encodeURIComponent(message);
  const mailtoLink = `mailto:${recipientEmail}?subject=${subject}&body=${body}`;

  window.open(mailtoLink, "_blank");
};

document.addEventListener("DOMContentLoaded", () => {
  const initialTab = window.location.hash.slice(1);
  updateActiveTab(`tab-${initialTab ?? "about"}`);
});
