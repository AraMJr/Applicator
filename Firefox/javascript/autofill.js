console.log("Applicator extension loaded");

// Define the interface
const applicate = document.getElementById("applicate");
const firstNameInput = document.getElementById("first-name");
const phoneNumberInput = document.getElementById("phone-number");
const emailInput = document.getElementById("email");

// Load user data
browser.storage.local.get(["first-name", "phone-number", "email"]).then((result) => {
  firstNameInput.value = result.firstName || "";
  phoneNumberInput.value = result.phoneNumber || "";
  emailInput.value = result.email || "";
});

// Store user data on form submission
const form = document.querySelector("form");
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const firstName = firstNameInput.value;
  const phoneNumber = phoneNumberInput.value;
  const email = emailInput.value;
  browser.storage.local.set({ firstName, phoneNumber, email });
});

// Auto-populate form fields
applicate.addEventListener("click", () => {
    browser.tabs.executeScript({ file: "content-script.js" }).then(() => {
      console.log("Form auto-populated");
    }).catch((error) => {
      console.error(error);
    });
});
