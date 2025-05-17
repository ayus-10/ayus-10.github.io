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
