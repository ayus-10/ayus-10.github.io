const profileImage = document.getElementsByClassName("profile-image")[0];
const bannerImage = document.getElementsByClassName("banner-image")[0];

const fullBannerImage = document.getElementsByClassName("full-banner-image")[0];
const fullProfileImage =
  document.getElementsByClassName("full-profile-image")[0];

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

const updateActiveTab = (tab) => {
  const activeTab = document.getElementsByClassName("active")[0];
  activeTab.classList.remove("active");

  history.replaceState(null, "", `#${tab.split("-")[1]}`);

  switch (tab) {
    case "tab-about":
      aboutTab.classList.add("active");
      break;
    case "tab-experience":
      experienceTab.classList.add("active");
      break;
    case "tab-contact":
      contactTab.classList.add("active");
      break;
    default:
      aboutTab.classList.add("active");
  }
};

document.addEventListener("DOMContentLoaded", () => {
  const initialTab = window.location.hash.slice(1);
  updateActiveTab(`tab-${initialTab ?? "about"}`);
});
