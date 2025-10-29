// When the form is submitted we validate it
const formEl = document.getElementById("guest-form") || document.getElementById("contact-form");
if (formEl) {
  formEl.onsubmit = function () {
    clearErrors();

    // this is to check if everything is valid
    let isValid = true;

    // FIRST NAME 
    let fname = document.getElementById("firstName").value.trim();
    if (!fname) {
      document.getElementById("err-firstName").style.display = "block";
      isValid = false;
    }

    // LAST NAME 
    let lname = document.getElementById("lastName").value.trim();
    if (!lname) {
      document.getElementById("err-lastName").style.display = "block";
      isValid = false;
    }

    // HOW WE MET 
    let meet = document.getElementById("meet").value.trim();
    if (!meet) {
      document.getElementById("err-meet").style.display = "block";
      isValid = false;
    }

    // if "Other" selected, require the other box
    let other = document.getElementById("other").value.trim();
    if (meet.toLowerCase() === "other" && !other) {
      document.getElementById("err-other").style.display = "block";
      isValid = false;
    }

    // EMAIL 
    let email = document.getElementById("email").value.trim();
    let mailingList = document.getElementsByName("mailingList")[0];
    let emailValid = email.includes("@") && email.includes(".");

    // If user filled email, check format
    if (email && !emailValid) {
      document.getElementById("err-email").style.display = "block";
      isValid = false;
    }

    // If mailing list checked, email is required
    if (mailingList && mailingList.checked) {
      if (!email || !emailValid) {
        document.getElementById("err-email").style.display = "block";
        isValid = false;
      }
    }

    // LINKEDIN 
    let linkedin = document.getElementById("linkedin").value.trim();
    if (linkedin && !linkedin.toLowerCase().startsWith("https://linkedin.com/in/")) {
      document.getElementById("err-linkedin").style.display = "block";
      isValid = false;
    }

    // Return the final validation flag
    return isValid;
  };
}

// clear all error messages 
function clearErrors() {
  let errors = document.getElementsByClassName("error");
  for (let i = 0; i < errors.length; i++) {
    errors[i].style.display = "none";
  }
}

// Show or hide email format and other textbox 
window.onload = function () {
  let mailingList = document.getElementsByName("mailingList")[0];
  let formatGroup = document.getElementById("format-group");
  let meet = document.getElementById("meet");
  let otherGroup = document.getElementById("other-group");

  function toggleEmailFormat() {
    if (mailingList && mailingList.checked) {
      formatGroup.style.display = "";
    } else {
      formatGroup.style.display = "none";
    }
  }

  function toggleOther() {
    if (meet.value.toLowerCase() === "other") {
      otherGroup.style.display = "";
    } else {
      otherGroup.style.display = "none";
    }
  }

  toggleEmailFormat();
  toggleOther();

  // this watches for changes
  if (mailingList) mailingList.onchange = toggleEmailFormat;
  if (meet) meet.onchange = toggleOther;
};
