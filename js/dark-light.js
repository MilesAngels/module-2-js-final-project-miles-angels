// Tutorial Used: https://dev.to/whitep4nth3r/the-best-lightdark-mode-theme-toggle-in-javascript-368f
/**
* Utility function to calculate the current theme setting.
* Look for a local storage value.
* Fall back to system setting.
* Fall back to light mode.
*/
function calculateSettingAsThemeString({ localStorageTheme, systemSettingDark }) {
  if (localStorageTheme !== null) {
    return localStorageTheme;
  }

  if (systemSettingDark.matches) {
    return "dark";
  }

  return "light";
}

// Utility function to update the button text and aria-label.

function updateButton({ buttonEl, isDark }) {
  const newCta = isDark ? "Change to light theme" : "Change to dark theme";
  // use an aria-label if you are omitting text on the button
  // and using a sun/moon icon, for example
  buttonEl.setAttribute("aria-label", newCta);
  buttonEl.innerText = newCta;
}

// Utility function to update the theme setting on the html tag
function updateThemeOnHtmlEl({ theme }) {
  document.querySelector("html").setAttribute("data-theme", theme);
}

// Grab what we need from the DOM and system settings on page load

const button = document.querySelector("[data-theme-toggle]");
const localStorageTheme = localStorage.getItem("theme");
const systemSettingDark = window.matchMedia("(prefers-color-scheme: dark)");
const logo = document.createElement('img');
logo.style.width = '50px';
logo.style.height = '45px';
logo.id = 'logo';
logo.classList = 'd-inline-block align-text-top';
if (localStorageTheme === 'dark') {
  logo.src = './assets/img/light-singularity.png'

}
else {
  logo.src = './assets/img/dark-singularity.png'

}
document.querySelector('.navbar-brand').appendChild(logo);

// Work out the current site settings
let currentThemeSetting = calculateSettingAsThemeString({ localStorageTheme, systemSettingDark });

// Update the theme setting and button text according to current settings

updateButton({ buttonEl: button, isDark: currentThemeSetting === "dark" });
updateThemeOnHtmlEl({ theme: currentThemeSetting });

// Add an event listener to toggle the theme

button.addEventListener("click", (event) => {
  const newTheme = currentThemeSetting === "dark" ? "light" : "dark";

  localStorage.setItem("theme", newTheme);
  updateButton({ buttonEl: button, isDark: newTheme === "dark" });
  updateThemeOnHtmlEl({ theme: newTheme });
  if (newTheme !== "dark") {
    logo.src = "./assets/img/dark-singularity.png"
  }
  else {
    logo.src = "./assets/img/light-singularity.png"
  }
  currentThemeSetting = newTheme;
}); 
