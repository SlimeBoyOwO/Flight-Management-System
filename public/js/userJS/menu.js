let personalInfo = document.querySelector("#personalinfo");
let teamTask = document.querySelector("#teamtask");
let flightSearch = document.querySelector("#flightsearching");
let user_order = document.querySelector("#userorder");
let user_history_order = document.querySelector("#userhistoryorder");
let change_info = document.querySelector("#changeinfo");
let body = document.querySelector("#window");

personalInfo.onclick = function () {
  body.classList.remove("teamtask");
  body.classList.remove("flightsearch");
  body.classList.add("personalinfo");
  document.getElementById("personal-info").classList.remove("hidden");
  document.getElementById("team-work").classList.add("hidden");
  document.getElementById("flight-search").classList.add("hidden");
  document.getElementById("user-order").classList.add("hidden");
  document.getElementById("user-history-order").classList.add("hidden");
  document.getElementById("change-info").classList.add("hidden");
  document.getElementById("ticket-info").classList.add("hidden");
};

teamTask.onclick = function () {
  body.classList.remove("personalinfo");
  body.classList.remove("flightsearch");
  body.classList.add("teamtask");
  document.getElementById("team-work").classList.remove("hidden");
  document.getElementById("personal-info").classList.add("hidden");
  document.getElementById("flight-search").classList.add("hidden");
  document.getElementById("user-order").classList.add("hidden");
  document.getElementById("user-history-order").classList.add("hidden");
  document.getElementById("change-info").classList.add("hidden");
  document.getElementById("ticket-info").classList.add("hidden");
};

flightSearch.onclick = function () {
  body.classList.remove("personalinfo");
  body.classList.remove("teamtask");
  body.classList.add("flightsearch");
  document.getElementById("flight-search").classList.remove("hidden");
  document.getElementById("team-work").classList.add("hidden");
  document.getElementById("personal-info").classList.add("hidden");
  document.getElementById("user-order").classList.add("hidden");
  document.getElementById("user-history-order").classList.add("hidden");
  document.getElementById("change-info").classList.add("hidden");
  document.getElementById("ticket-info").classList.add("hidden");
};

user_order.onclick = function () {
  body.classList.remove("personalinfo");
  body.classList.remove("teamtask");
  body.classList.add("flightsearch");
  document.getElementById("flight-search").classList.add("hidden");
  document.getElementById("team-work").classList.add("hidden");
  document.getElementById("personal-info").classList.add("hidden");
  document.getElementById("user-order").classList.remove("hidden");
  document.getElementById("user-history-order").classList.add("hidden");
  document.getElementById("change-info").classList.add("hidden");
  document.getElementById("ticket-info").classList.add("hidden");
};

user_history_order.onclick = function () {
  body.classList.remove("personalinfo");
  body.classList.remove("teamtask");
  body.classList.add("flightsearch");
  document.getElementById("flight-search").classList.add("hidden");
  document.getElementById("team-work").classList.add("hidden");
  document.getElementById("personal-info").classList.add("hidden");
  document.getElementById("user-order").classList.add("hidden");
  document.getElementById("user-history-order").classList.remove("hidden");
  document.getElementById("change-info").classList.add("hidden");
  document.getElementById("ticket-info").classList.add("hidden");
};

change_info.onclick = function () {
  document.getElementById("flight-search").classList.add("hidden");
  document.getElementById("team-work").classList.add("hidden");
  document.getElementById("personal-info").classList.add("hidden");
  document.getElementById("user-order").classList.add("hidden");
  document.getElementById("user-history-order").classList.add("hidden");
  document.getElementById("change-info").classList.remove("hidden");
  document.getElementById("ticket-info").classList.add("hidden");
};

document.addEventListener("DOMContentLoaded", () => {
  const nav = document.querySelector(".nav");
  const popup = document.querySelector(".popup-content");

  nav.addEventListener("mouseover", () => {
    popup.classList.add("hovered");
  });

  nav.addEventListener("mouseout", () => {
    popup.classList.remove("hovered");
  });
});
