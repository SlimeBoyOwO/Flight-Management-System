let personalInfo = document.querySelector("#personalinfo");
let add_flight = document.querySelector("#addflight");
let manage_flight = document.querySelector("#manageflight");
let manage_airline = document.querySelector("#manageairline");
let airports_info = document.querySelector("#airportsinfo");
let body = document.querySelector("#window");

personalInfo.onclick = function () {
  document.getElementById("personal-info").classList.remove("hidden");
  document.getElementById("airports-info").classList.add("hidden");
  document.getElementById("flight-add").classList.add("hidden");
  document.getElementById("manage-flight").classList.add("hidden");
  document.getElementById("manage-airline").classList.add("hidden");
  document.getElementById("ticket-info").classList.add("hidden");
};

add_flight.onclick = function () {
  document.getElementById("flight-add").classList.remove("hidden");
  document.getElementById("airports-info").classList.add("hidden");
  document.getElementById("personal-info").classList.add("hidden");
  document.getElementById("manage-flight").classList.add("hidden");
  document.getElementById("manage-airline").classList.add("hidden");
  document.getElementById("ticket-info").classList.add("hidden");
};

manage_flight.onclick = function () {
  document.getElementById("flight-add").classList.add("hidden");
  document.getElementById("airports-info").classList.add("hidden");
  document.getElementById("personal-info").classList.add("hidden");
  document.getElementById("manage-flight").classList.remove("hidden");
  document.getElementById("manage-airline").classList.add("hidden");
  document.getElementById("ticket-info").classList.add("hidden");
};

manage_airline.onclick = function () {
  document.getElementById("flight-add").classList.add("hidden");
  document.getElementById("airports-info").classList.add("hidden");
  document.getElementById("personal-info").classList.add("hidden");
  document.getElementById("manage-flight").classList.add("hidden");
  document.getElementById("manage-airline").classList.remove("hidden");
  document.getElementById("ticket-info").classList.add("hidden");
};

airports_info.onclick = function () {
  document.getElementById("flight-add").classList.add("hidden");
  document.getElementById("airports-info").classList.remove("hidden");
  document.getElementById("personal-info").classList.add("hidden");
  document.getElementById("manage-flight").classList.add("hidden");
  document.getElementById("manage-airline").classList.add("hidden");
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
