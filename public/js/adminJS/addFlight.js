document.addEventListener("DOMContentLoaded", () => {
  document
    .querySelector("#confirm-flight-add")
    .addEventListener("click", () => {
      flightAdd();
    });
});

document.addEventListener("DOMContentLoaded", () => {
  document
    .querySelector("#confirm-schedule-add")
    .addEventListener("click", () => {
      scheduleAdd();
    });
});

document.addEventListener("DOMContentLoaded", () => {
  document
    .querySelector("#confirm-ticket-add")
    .addEventListener("click", () => {
      ticketAdd();
    });
});

function flightAdd() {
  const airline = document.getElementById("iAirline").value;
  const flight_number = document.getElementById("iFlightNumber").value;
  const aircraft = document.getElementById("iAircraft").value;
  const departure_airport = document.getElementById("iDepartureAirport").value;
  const arrival_airport = document.getElementById("iArrivalAirport").value;

  fetch("/add-flight", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      airline,
      flight_number,
      aircraft,
      departure_airport,
      arrival_airport,
    }),
  })
    .then((response) => {
      if (response.ok) {
        alert("航班添加成功(*^▽^*)");
      } else {
        alert("航班添加失败o(╥﹏╥)o");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function scheduleAdd() {
  const flight_number = document.getElementById("isFlightNumber").value;
  const scheduled_departure = formatToMySQLDateTime(
    document.getElementById("isScheduledDeparture").value
  );
  const scheduled_arrival = formatToMySQLDateTime(
    document.getElementById("isScheduledArrvial").value
  );

  fetch("/add-schedule", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      flight_number,
      scheduled_departure,
      scheduled_arrival,
    }),
  })
    .then((response) => {
      if (response.ok) {
        alert("班次添加成功(*^▽^*)");
      } else {
        alert("班次添加失败o(╥﹏╥)o");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function ticketAdd() {
  const schedule_id = document.getElementById("itScheduledID").value;
  const ticket_class = document.getElementById("itTicketClass").value;
  const price = document.getElementById("itTicketPrice").value;
  const total_seats = document.getElementById("itTotalSeats").value;

  fetch("/add-ticket", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      schedule_id,
      ticket_class,
      price,
      total_seats,
    }),
  })
    .then((response) => {
      if (response.ok) {
        alert("航票添加成功(*^▽^*)");
      } else {
        alert("航票添加失败o(╥﹏╥)o");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function formatToMySQLDateTime(input) {
  // 解析输入字符串
  let date = new Date(input + ":00"); // 补全秒数部分为 "00"

  // 格式化成 MySQL DATETIME 类型需要的字符串
  let year = date.getFullYear();
  let month = String(date.getMonth() + 1).padStart(2, "0");
  let day = String(date.getDate()).padStart(2, "0");
  let hours = String(date.getHours()).padStart(2, "0");
  let minutes = String(date.getMinutes()).padStart(2, "0");
  let seconds = String(date.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
