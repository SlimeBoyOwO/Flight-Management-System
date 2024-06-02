let personalInfo = document.querySelector("#personalinfo");
let teamTask = document.querySelector("#teamtask");
let body = document.querySelector("#window");

personalInfo.onclick = function () {
  body.classList.remove("teamtask");
  body.classList.add("personalinfo");
  document.getElementById("personal-info").classList.remove("hidden");
  document.getElementById("team-work").classList.add("hidden");
};

teamTask.onclick = function () {
  body.classList.remove("personalinfo");
  body.classList.add("teamtask");
  document.getElementById("team-work").classList.remove("hidden");
  document.getElementById("personal-info").classList.add("hidden");
};
