// Function to save form data
function saveData() {
  let formData = {
    firstname: document.getElementById("fname").value,
    company: document.getElementById("company").value,
    email: document.getElementById("email").value,
    phone: document.getElementById("phone").value,
    message: document.getElementById("message").value,
  };

  if (
    !formData.firstname ||
    !formData.company ||
    !formData.email ||
    !formData.phone ||
    !formData.message
  ) {
    alert("Please fill out all fields.");
    return false;
  }
  console.log("Form data:", formData);

  let jsonData = JSON.stringify(formData);
  console.log("JSON data:", jsonData);

  localStorage.setItem("formData", jsonData);
  alert("Data saved");

  return true;
}

document
  .getElementById("contactForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    saveData();
  });
