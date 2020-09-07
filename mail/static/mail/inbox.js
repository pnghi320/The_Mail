document.addEventListener("DOMContentLoaded", function () {
  // Select the submit button and input to be used later

  const submit = document.querySelector("#compose-submit");
  const recipients = document.querySelector("#compose-recipients");
  const subject = document.querySelector("#compose-subject");
  const body = document.querySelector("#compose-body");

  // Disable submit button by default:
  submit.disabled = true;

  // Listen for input to be typed into the input field
  (recipients, subject, body).onkeyup = () => {
    if (
      recipients.value.length > 0 &&
      subject.value.length > 0 &&
      body.value.length > 0
    ) {
      submit.disabled = false;
    } else {
      submit.disabled = true;
    }
  };
  // Use buttons to toggle between views

  document
    .querySelector("#inbox")
    .addEventListener("click", () => load_mailbox("inbox"));
  document
    .querySelector("#sent")
    .addEventListener("click", () => load_mailbox("sent"));
  document
    .querySelector("#archived")
    .addEventListener("click", () => load_mailbox("archive"));
  document.querySelector("#compose").addEventListener("click", compose_email);

  document.querySelector("#compose-form").onsubmit = function () {
    fetch("/emails", {
      method: "POST",
      body: JSON.stringify({
        recipients: recipients.value,
        subject: subject.value,
        body: body.value,
      }),
    })
      .then((response) => {
        if (response.status === 400) {
          document.getElementById("alert").innerHTML = "The email address you want to send to does not exist.";
          throw new Error("your error message here");
        }
        return response.json();
      })
      .then((result) => {
        // Print result
        console.log(result);
        load_mailbox("sent");
      });
      
    recipients.value = "";
    body.value = "";
    subject.value = "";
    submit.disabled = true;
    return false;
  };

  // By default, load the inbox
  load_mailbox("inbox");
});

function compose_email() {
  document.getElementById("compose-recipients").value = "";
  document.getElementById("compose-body").value = "";
  document.getElementById("compose-subject").value = "";
  // Show compose view and hide other views
  document.querySelector("#emails-view").style.display = "none";
  document.querySelector("#compose-view").style.display = "block";
  document.querySelector("#email-view").style.display = "none";
}
async function load_mailbox(mailbox) {
  // Show the mailbox and hide other views
  document.querySelector("#emails-view").style.display = "block";
  document.querySelector("#compose-view").style.display = "none";
  document.querySelector("#email-view").style.display = "none";

  // Show the mailbox name
  document.querySelector("#emails-view").innerHTML = `<h3>${
    mailbox.charAt(0).toUpperCase() + mailbox.slice(1)
  }</h3>`;

  if (mailbox === "inbox") {
    let emails = await (await fetch("/emails/inbox")).json();
    // Print emails
    console.log(emails);
    var i;
    for (i = 0; i < emails.length; i++) {
      var subj = emails[i].subject;
      var sub_subj = subj.substring(0, 130);
      var bod = emails[i].body;
      var sub_bod = bod.substring(0, 129);
      const element = document.createElement("div");
      element.setAttribute("class", "e");
      element.setAttribute("data-id", `${emails[i].id}`);
      element.innerHTML = `<div>
        <span><strong>From:</strong> ${emails[i].sender}</span>
        <span id="date" style="float:right"><strong>${emails[i].timestamp}</strong></span>
        </div>
        <div>
        <strong>Subject:</strong> ${sub_subj}
        </div>
        <div>
        <strong>Content:</strong> ${sub_bod}
        </div>`;
      if (emails[i].read) {
        element.style.backgroundColor = "#ebf4ff";
      }
      document.querySelector("#emails-view").append(element);
    }
    load_email();
  } else if (mailbox === "sent") {
    let emails = await (await fetch("/emails/sent")).json();
    // Print emails
    console.log(emails);
    var i;
    for (i = 0; i < emails.length; i++) {
      var subj = emails[i].subject;
      var sub_subj = subj.substring(0, 130);
      var bod = emails[i].body;
      var sub_bod = bod.substring(0, 129);
      const element = document.createElement("div");
      element.setAttribute("class", "e");
      element.setAttribute("data-id", `${emails[i].id}`);
      element.innerHTML = `<div>
        <span><strong>From:</strong> ${emails[i].sender}</span>
        <span id="date" style="float:right"><strong>${emails[i].timestamp}</strong></span>
        </div>
        <div>
        <strong>Subject:</strong> ${sub_subj}
        </div>
        <div>
        <strong>Content:</strong> ${sub_bod}
        </div>`;
      if (emails[i].read) {
        element.style.backgroundColor = "#ebf4ff";
      }
      document.querySelector("#emails-view").append(element);
    }
    load_email();
  } else if (mailbox === "archive") {
    let emails = await (await fetch("/emails/archive")).json();
    // Print emails
    console.log(emails);
    var i;
    for (i = 0; i < emails.length; i++) {
      var subj = emails[i].subject;
      var sub_subj = subj.substring(0, 130);
      var bod = emails[i].body;
      var sub_bod = bod.substring(0, 129);
      const element = document.createElement("div");
      element.setAttribute("class", "e");
      element.setAttribute("data-id", `${emails[i].id}`);
      element.innerHTML = `<div>
        <span><strong>From:</strong> ${emails[i].sender}</span>
        <span id="date" style="float:right"><strong>${emails[i].timestamp}</strong></span>
        </div>
        <div>
        <strong>Subject:</strong> ${sub_subj}
        </div>
        <div>
        <strong>Content:</strong> ${sub_bod}
        </div>`;
      if (emails[i].read) {
        element.style.backgroundColor = "#ebf4ff";
      }
      document.querySelector("#emails-view").append(element);
    }
    load_email();
  }
}

function load_email() {
  var elements = document.getElementsByClassName("e");
  [...elements].forEach((element) => {
    var stringurl2 = `/emails/${element.dataset.id}`;
    element.addEventListener("click", function () {
      document.querySelector("#emails-view").style.display = "none";
      document.querySelector("#compose-view").style.display = "none";
      document.querySelector("#email-view").style.display = "block";
      document.querySelector("#email-view").innerHTML = "";
      fetch(stringurl2, {
        method: "PUT",
        body: JSON.stringify({
          read: true,
        }),
      });
      fetch(stringurl2)
        .then((response) => response.json())
        .then((email) => {
          // Print email
          console.log(email);

          const element = document.createElement("div");
          element.setAttribute("class", "e");
          element.setAttribute("data-id", `${email.id}`);
          element.innerHTML = `<div>
        <span><strong>From:</strong>  ${email.sender}</span>
        <span id="date" style="float:right"><strong>${email.timestamp}</strong></span>
        </div>
        <div>
        <strong>To:</strong>  ${email.recipients}
        </div>
        <div>
        <strong>Subject:</strong>  ${email.subject}
        </div>
        <div>
        <strong>Content:</strong>  ${email.body}
        </div>
        <div style="display:inline;">
        <input type="button" data-id="${email.id}" id="unarchiveButton" value="Unarchive" style="float: right;">
        <input type="button" data-id="${email.id}" id="archiveButton" value="Archive" style="float: right;">
        <input type="button" data-id="${email.id}" id="replyButton" value="Reply" style="float: right;">
        </div>`;
          document.querySelector("#email-view").append(element);
          buttonPressed();
        });
    });
  });
}

function buttonPressed() {
  document.querySelectorAll("#unarchiveButton").forEach(function (button) {
    button.onclick = async function () {
      var stringurl3 = `/emails/${button.dataset.id}`;
      await fetch(stringurl3, {
        method: "PUT",
        body: JSON.stringify({
          archived: false,
        }),
      });
      load_mailbox("inbox");
    };
  });
  document.querySelectorAll("#archiveButton").forEach(function (button) {
    button.onclick = async function () {
      var stringurl3 = `/emails/${button.dataset.id}`;
      await fetch(stringurl3, {
        method: "PUT",
        body: JSON.stringify({
          archived: true,
        }),
      });
      load_mailbox("inbox");
    };
  });
  document.querySelectorAll("#replyButton").forEach(function (button) {
    button.onclick = function () {
      document.getElementById("compose-recipients").value = "";
      document.getElementById("compose-body").value = "";
      document.getElementById("compose-subject").value = "";
      var stringurl4 = `/emails/${button.dataset.id}`;
      fetch(stringurl4)
        .then((response) => response.json())
        .then((email) => {
          // Print email
          console.log(email);
          document.getElementById("compose-recipients").value = email.sender;
          if (email.subject.substring(0, 3) != "Re:") {
            document.getElementById("compose-subject").value =
              "Re: " + email.subject;
          } else {
            document.getElementById("compose-subject").value = email.subject;
          }
          document.getElementById("compose-body").value +=
            "On " +
            email.timestamp +
            " " +
            email.sender +
            " wrote:" +
            "\n'" +
            email.body +
            "'" +
            "\n";
        });

      compose_email();
    };
  });
}
