let currentFlightPage = 1;

function searchFlights(page = 1) {
  const leave = document.getElementById("leave").value;
  const arrive = document.getElementById("arrive").value;

  fetch(`/search-flights?leave=${leave}&arrive=${arrive}&page=${page}`)
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
            <span>航班号</span>
            <span>出发地</span>
            <span></span>
            <span>目的地</span>
            <span>出发时间</span>
            <span>到达时间</span>
            <span>最低票价</span>
          </div>

          <div class="flight-info">
            <span>${flight.flight_number}</span>
            <span>${flight.departure_city}</span>
            <span class="arrow"><p>→</p></span>
            <span>${flight.arrival_city}</span>
            <span>${aTimePart}</span>
            <span>${depTimePart}</span>
            <span>￥${flight.min_ticket_price}</span>
          </div>

          <div class="flight-detail">
            <span>机型：${flight.aircraft}</span>
            <span>${flight.departure_airport}</span>
            <span></span>
            <span>${flight.arrival_airport}</span>
            <span>${datePart}</span>
            <span>${aDatePart}</span>
            <span><button class="ticket-button" flight-schedule-id="${flight.schedule_id}" >点击购票</button></span>
          </div>
        `;

      const button = flightDiv.querySelector(".ticket-button");
      button.addEventListener("click", (e) => {
        e.preventDefault();
        const schedule_id = e.target.getAttribute("flight-schedule-id");
        searchTickets(schedule_id);
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
    .querySelector("#flight-search input[type='button']")
    .addEventListener("click", () => {
      currentFlightPage = 1;
      searchFlights(currentFlightPage);
    });
});

function searchTickets(scheduleID) {
  fetch(`/search-tickets?scheduleID=${scheduleID}`)
    .then((response) => response.json())
    .then((data) => {
      displayTicketsResults(data.tickets);
    })
    .catch((error) => {
      alert("出错了，联系管理员OAO");
      console.error("Error:", error);
    });
}

function displayTicketsResults(data) {
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
            <span><button class="buy-ticket-button" ticket-id="${ticket.ticket_id}" >点击购票</button></span>
          </div>
        `;

      const button = ticketDiv.querySelector(".buy-ticket-button");
      button.addEventListener("click", (e) => {
        e.preventDefault();
        const ticketID = e.target.getAttribute("ticket-id");
        bookTicket(ticketID);
      });

      resultsDiv.appendChild(ticketDiv);
    });

    resultsDiv.classList.remove("hidden");

    document.getElementById("flight-search").classList.add("hidden");
    document.getElementById("ticket-info").classList.remove("hidden");
  } else {
    resultsDiv.innerHTML = "<a>No results found</a>";
    resultsDiv.classList.remove("hidden");
  }
}

function bookTicket(ticketID) {
  const params = getQueryParams();
  const username = params.username;

  fetch("/book-ticket", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      ticket_id: ticketID,
      seat_number: generateSeatNumber(),
    }),
  })
    .then((response) => {
      if (response.ok) {
        alert("订单生成成功！(*^▽^*)");
        searchOrders(1);
        refreshInformation();
        document.getElementById("ticket-info").classList.add("hidden");
        document.getElementById("user-order").classList.remove("hidden");
      } else {
        alert("订单生成失败！o(╥﹏╥)o");
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
