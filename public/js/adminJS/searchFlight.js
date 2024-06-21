let currentFlightPage = 1;

function searchFlights(page = 1) {
  const leave = document.getElementById("leave").value;
  const arrive = document.getElementById("arrive").value;

  fetch(
    `/search-flights-without-ticket?leave=${leave}&arrive=${arrive}&page=${page}`
  )
    .then((response) => response.json())
    .then((data) => {
      displayFlightsResults(data.flights);
      setupFlightPagination(data.total, data.page, data.limit);
    })
    .catch((error) => {
      alert("出错了，联系管理员OAO");
      console.error("Error:", error);
    });
}

function displayFlightsResults(data) {
  const resultsDiv = document.getElementById("search-results");

  resultsDiv.innerHTML = ""; // 清空以前的结果

  if (data.length > 0) {
    data.forEach((flight) => {
      const flightDiv = document.createElement("div");

      const departureTime = flight.scheduled_departure;
      const arrivalTime = flight.scheduled_arrival;
      const dateObj = new Date(departureTime);
      const arrivalDateObj = new Date(arrivalTime);

      const aYear = arrivalDateObj.getFullYear();
      const aMonth = String(arrivalDateObj.getMonth() + 1).padStart(2, "0");
      const aDay = String(arrivalDateObj.getDate()).padStart(2, "0");
      const aDatePart = `${aYear}-${aMonth}-${aDay}`;

      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, "0"); // 月份从 0 开始，所以需要 +1
      const day = String(dateObj.getDate()).padStart(2, "0");
      const datePart = `${year}-${month}-${day}`;

      const aHours = String(dateObj.getHours()).padStart(2, "0");
      const aMinutes = String(dateObj.getMinutes()).padStart(2, "0");
      const aTimePart = `${aHours}:${aMinutes}`;

      const hours = String(dateObj.getHours()).padStart(2, "0");
      const minutes = String(dateObj.getMinutes()).padStart(2, "0");
      const depTimePart = `${hours}:${minutes}`;

      flightDiv.className = "flight-info-box";
      flightDiv.innerHTML = `
          <div class="flight-info-header">
            <span>班次ID</span>
            <span>航班号</span>
            <span>出发地</span>
            <span>${flight.delay_time ? "预计延迟" : ""}</span>
            <span>目的地</span>
            <span>出发时间</span>
            <span>到达时间</span>
            <span>操作</span>
            <span>航班延迟</span>
          </div>

          <div class="flight-info">
            <span>${flight.schedule_id}</span>
            <span>${flight.flight_number}</span>
            <span>${flight.departure_city}</span>
            <span class="arrow"><p>→</p></span>
            <span>${flight.arrival_city}</span>
            <span>${aTimePart}</span>
            <span>${depTimePart}</span>
            <span><button class="delete-flight-button" flight-schedule-id="${
              flight.schedule_id
            }" >删除航班</button></span>
            <span><input type="text" class="delay-input" flight-schedule-id="${
              flight.schedule_id
            }" placeholder="延迟时间" /></span>
          </div>

          <div class="flight-detail">
            <span></span>
            <span>机型：${flight.aircraft}</span>
            <span>${flight.departure_airport}</span>
            <span>${
              flight.delay_time ? flight.delay_time.substring(0, 5) : ""
            }</span>
            <span>${flight.arrival_airport}</span>
            <span>${datePart}</span>
            <span>${aDatePart}</span>
            <span><button class="ticket-button" flight-schedule-id="${
              flight.schedule_id
            }" >管理航票</button></span>
            <span><button class="delay-button" flight-schedule-id="${
              flight.schedule_id
            }" >确认延迟</button></span>
          </div>
        `;

      const delete_flight_button = flightDiv.querySelector(
        ".delete-flight-button"
      );
      delete_flight_button.addEventListener("click", (e) => {
        e.preventDefault();
        const schedule_id = e.target.getAttribute("flight-schedule-id");
        deleteSchedule(schedule_id);
      });

      const button = flightDiv.querySelector(".ticket-button");
      button.addEventListener("click", (e) => {
        e.preventDefault();
        const schedule_id = e.target.getAttribute("flight-schedule-id");
        searchTickets(schedule_id);
      });

      const delay_button = flightDiv.querySelector(".delay-button");
      delay_button.addEventListener("click", (e) => {
        e.preventDefault();
        const schedule_id = e.target.getAttribute("flight-schedule-id");
        const delay_time = document.querySelector(
          `input[flight-schedule-id="${schedule_id}"]`
        ).value;
        if (delay_time && isValidTimeFormat(delay_time)) {
          delaySchedule(schedule_id, formatToMySQLTime(delay_time));
        } else {
          alert("输入的时间格式有问题或者没有输入！");
        }
      });

      resultsDiv.appendChild(flightDiv);
    });

    resultsDiv.classList.remove("hidden");
  } else {
    resultsDiv.innerHTML = "<a>没有满足要求的航班</a>";
    resultsDiv.classList.remove("hidden");
  }
}

function setupFlightPagination(total, page, limit) {
  const paginationDiv = document.getElementById("pagination");

  paginationDiv.innerHTML = ""; // 清空以前的分页

  const totalPages = Math.ceil(total / limit);

  if (totalPages > 1) {
    for (let i = 1; i <= totalPages; i++) {
      const pageButton = document.createElement("button");
      pageButton.innerText = i;
      pageButton.className = i === page ? "active" : "";
      pageButton.addEventListener("click", (e) => {
        e.preventDefault(); // 防止按钮默认行为
        currentFlightPage = i;
        searchFlights(i);
      });
      paginationDiv.appendChild(pageButton);
    }

    paginationDiv.classList.remove("hidden");
  } else {
    paginationDiv.classList.add("hidden");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document
    .querySelector("#manage-flight input[type='button']")
    .addEventListener("click", () => {
      currentFlightPage = 1;
      searchFlights(currentFlightPage);
    });
});

function searchTickets(scheduleID) {
  fetch(`/search-tickets?scheduleID=${scheduleID}`)
    .then((response) => response.json())
    .then((data) => {
      displayTicketsResults(data.tickets, scheduleID);
    })
    .catch((error) => {
      alert("出错了，联系管理员OAO");
      console.error("Error:", error);
    });
}

function displayTicketsResults(data, scheduleID) {
  const resultsDiv = document.getElementById("ticket-results");

  resultsDiv.innerHTML = ""; // 清空以前的结果

  if (data.length > 0) {
    const flight = data[0];
    const flightDiv = document.createElement("div");

    const departureTime = flight.scheduled_departure;
    const arrivalTime = flight.scheduled_arrival;
    const dateObj = new Date(departureTime);
    const arrivalDateObj = new Date(arrivalTime);

    const aYear = arrivalDateObj.getFullYear();
    const aMonth = String(arrivalDateObj.getMonth() + 1).padStart(2, "0");
    const aDay = String(arrivalDateObj.getDate()).padStart(2, "0");
    const aDatePart = `${aYear}-${aMonth}-${aDay}`;

    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0"); // 月份从 0 开始，所以需要 +1
    const day = String(dateObj.getDate()).padStart(2, "0");
    const datePart = `${year}-${month}-${day}`;

    const aHours = String(dateObj.getHours()).padStart(2, "0");
    const aMinutes = String(dateObj.getMinutes()).padStart(2, "0");
    const aTimePart = `${aHours}:${aMinutes}`;

    const hours = String(dateObj.getHours()).padStart(2, "0");
    const minutes = String(dateObj.getMinutes()).padStart(2, "0");
    const depTimePart = `${hours}:${minutes}`;

    flightDiv.className = "flight-info-box";
    flightDiv.innerHTML = `
          <div class="flight-info-header">
            <span>航空公司/航班号</span>
            <span>出发地</span>
            <span></span>
            <span>目的地</span>
            <span>出发时间</span>
            <span>到达时间</span>
          </div>

          <div class="flight-info">
            <span>${flight.flight_number}</span>
            <span>${flight.departure_city}</span>
            <span class="arrow"><p>→</p></span>
            <span>${flight.arrival_city}</span>
            <span>${aTimePart}</span>
            <span>${depTimePart}</span>
          </div>

          <div class="flight-detail">
            <span>机型：${flight.aircraft}</span>
            <span>${flight.departure_airport}</span>
            <span></span>
            <span>${flight.arrival_airport}</span>
            <span>${datePart}</span>
            <span>${aDatePart}</span>
          </div>
        `;

    resultsDiv.appendChild(flightDiv);
    const lineDiv = document.createElement("div");
    lineDiv.className = "line";
    lineDiv.innerHTML = ``;
    resultsDiv.appendChild(lineDiv);

    data.forEach((ticket) => {
      const ticketDiv = document.createElement("div");

      ticketDiv.className = "ticket-info-box";
      ticketDiv.innerHTML = `
          <div class="ticket-info-header">
            <span>航票类型</span>
            <span>价格</span>
            <span>座位共计</span>
            <span>剩余座位</span>
            <span></span>
          </div>

          <div class="ticket-info">
            <span>${ticket.ticket_class}</span>
            <span>￥${ticket.price}</span>
            <span>${ticket.total_seats}</span>
            <span>${ticket.rest_seats}</span>
            <span><button class="buy-ticket-button" ticket-id="${ticket.ticket_id}" >删除航票</button></span>
          </div>
        `;

      const button = ticketDiv.querySelector(".buy-ticket-button");
      button.addEventListener("click", (e) => {
        e.preventDefault();
        const ticketID = e.target.getAttribute("ticket-id");
        deleteTicket(ticketID, scheduleID);
      });

      resultsDiv.appendChild(ticketDiv);
    });

    resultsDiv.classList.remove("hidden");

    document.getElementById("manage-flight").classList.add("hidden");
    document.getElementById("ticket-info").classList.remove("hidden");
  } else {
    alert("该班次没有航票，请添加！");
    document.getElementById("manage-flight").classList.add("hidden");
    document.getElementById("flight-add").classList.remove("hidden");
    resultsDiv.innerHTML = "<a>No results found</a>";
    resultsDiv.classList.remove("hidden");
  }
}

function deleteTicket(ticketID, scheduleID) {
  fetch("/delete-ticket", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ticket_id: ticketID,
    }),
  })
    .then((response) => {
      if (response.ok) {
        alert("航票删除成功！(*^▽^*)");
        searchTickets(scheduleID);
      } else {
        alert("航票删除失败！o(╥﹏╥)o");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function deleteSchedule(scheduleID) {
  fetch("/delete-schedule", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      schedule_id: scheduleID,
    }),
  })
    .then((response) => {
      if (response.ok) {
        alert("班次删除成功！(*^▽^*)");
        searchFlights(1);
      } else {
        alert("班次删除失败！o(╥﹏╥)o");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function delaySchedule(schedule_id, delay_time) {
  alert(delay_time);
  fetch("/delay-schedule", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      schedule_id,
      delay_time,
    }),
  })
    .then((response) => {
      if (response.ok) {
        alert("班次延迟成功！(*^▽^*)");
        searchFlights(1);
      } else {
        alert("班次延迟失败！o(╥﹏╥)o");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function generateSeatNumber() {
  // 生成01到99之间的随机数字，格式化成两位数
  let number = Math.floor(Math.random() * 99) + 1;
  let formattedNumber = number.toString().padStart(2, "0");

  // 生成A到K之间的随机字母
  let letters = "ABCDEFGHIJK";
  let letter = letters[Math.floor(Math.random() * letters.length)];

  // 拼接数字和字母形成座位号
  let seatNumber = formattedNumber + letter;

  return seatNumber;
}

function isValidTimeFormat(timeString) {
  // 检查时间格式是否为 hh:mm
  const timePattern = /^([01]\d|2[0-3]):([0-5]\d)$/;
  return timePattern.test(timeString);
}

function formatToMySQLTime(timeString) {
  if (!isValidTimeFormat(timeString)) {
    throw new Error("Invalid time format. Expected hh:mm.");
  }

  // 确保时间格式正确后返回
  return timeString + ":00";
}
