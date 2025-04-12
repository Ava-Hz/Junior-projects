$(document).ready(function () {
  let currentPage = window.location.pathname.split("/").pop(); // Detect current page

  if (currentPage === "ticket.html") {
    handleTicketPage();
  } else if (currentPage === "reserved.html") {
    handleReservedPage();
  }
  // Hold the uploaded image
  let imageData = null;
  $("#fileInput").change(function () {
    let file = this.files[0]; // Get the selected file
    let maxSize = 500 * 1024; // 500KB in bytes

    if (file) {
      if (file.size > maxSize) {
        $("#profile_text")
          .text("Please select an image smaller than 500KB.")
          .show();
        $(this).val(""); // Clear the file input
      } else {
        $("#profile_text").text("").show();
        const reader = new FileReader();
        reader.onload = function (e) {
          imageData = e.target.result;
          localStorage.setItem("profileImage", imageData); // Save base64 image
          $("#file-error").hide(); // Hide error if previously shown
        };
        reader.readAsDataURL(file); // Convert to base64
      }
    }
  });
  function handleTicketPage() {
    $("#submit").click(function () {
      // Reset error messages
      $("#error-message").hide();

      // Get input values
      const fullName = $("#fullName").val();
      const email = $("#email").val();
      const github = $("#github").val();
      //
      //  const fileInput = $("#fileInput")[0].files[0];
      // console.log(fileInput);

      // Regular expressions for validation
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      const githubRegex = /^[a-zA-Z0-9-]+$/;

      let isValidEmail = true;
      let isValidGitHub = true;
      let emailErrorMessage = "";
      let gitHubErrorMessage = "";
      let fullNameErrorMessage = "";
      // check if they input their name or not!
      if (fullName.trim() === "") {
        fullNameErrorMessage = "Please enter your full name.";
        $("#fullName-text")
          .text(fullNameErrorMessage)
          .css("color", "red")
          .show();
        return;
      }
      //check if they uploaded their profile or not
      if (!imageData) {
        $("#profile_text")
          .text("Please upload a profile picture.")
          .css("color", "red")
          .show();
        return;
      }

      // Validate email
      if (!emailRegex.test(email)) {
        isValidEmail = false;
        emailErrorMessage = "Please enter a valid email address.";
      }

      // Validate GitHub username
      if (!githubRegex.test(github)) {
        isValidGitHub = false;
        gitHubErrorMessage =
          "GitHub username should contain only letters, numbers, and hyphens.";
      }

      // Show error or ticket
      if (isValidEmail == false) {
        $("#github-text").hide();
        $("#fullName-text").hide();
        $("#email-text").text(emailErrorMessage).css("color", "red").show();
      } else if (isValidGitHub == false) {
        $("#email-text").hide();
        $("#github-text").show();
        $("#github-text").text(gitHubErrorMessage).css("color", "red");
      } else {
        $("#email-text").hide();
        $("#github-text").hide();
        //$("#ticket").show();
        try {
          localStorage.setItem("newEmail", email); // Save Email
          localStorage.setItem("newFullName", fullName); // Save full name
          localStorage.setItem("newGit", github); // Save GitHub id
          window.location.href = "reserved.html"; // Redirect to reserved page
        } catch (error) {
          $("#error-message")
            .text(
              "Unable to save your data. Storage may be full or disabled. Please enable storage or clear some space."
            )
            .css("color", "red")
            .show();
        }
      }
    });
  }

  // reserved.html
  function handleReservedPage() {
    let newFullName = localStorage.getItem("newFullName");

    let newٍEmail = localStorage.getItem("newEmail");

    let newٍGit = localStorage.getItem("newGit");

    let image = localStorage.getItem("profileImage");

    const today = new Date();
    const options = { year: "numeric", month: "long", day: "numeric" };
    const formattedDate = today.toLocaleDateString("en-US", options);

    $("#heading").text(`Congrats ${newFullName}! Your ticket is ready.`);

    $("#emailed").text(
      `We've emailed your ticket to ${newٍEmail} and will send updates in the run up to the event.`
    );

    $("#profileImage").attr("src", image);

    $("#today-date").text(`${formattedDate}- Tehran, Iran`).show();

    $("#ticketName").text(newFullName);
    $("#ticketGithub").text(newٍGit);
    console.log(newٍGit);
  }
});
