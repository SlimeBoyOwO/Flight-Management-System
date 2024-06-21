function getQueryParams() {
  const params = {};
  const queryString = window.location.search.slice(1);
  queryString.split("&").forEach((param) => {
    const [key, value] = param.split("=");
    params[decodeURIComponent(key)] = decodeURIComponent(value);
  });
  return params;
}

function parseDateString(input) {
  // 使用正则表达式验证日期格式
  const regex = /^(\d{4})-(\d{2})-(\d{2})$/;
  if (!regex.test(input)) {
    console.error(
      'Invalid date format. Please enter date in format "yyyy-mm-dd".'
    );
    return null;
  }

  // 提取年、月、日
  const [, year, month, day] = input.match(regex);

  // 构造 Date 对象
  const dateObject = new Date(`${year}-${month}-${day}`);

  // 验证 Date 对象是否有效
  if (isNaN(dateObject.getTime())) {
    console.error("Invalid date.");
    return null;
  }

  return dateObject;
}

function formatDateToString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // 月份从0开始，需要加1，并确保两位数格式
  const day = String(date.getDate()).padStart(2, "0"); // 日需要确保两位数格式

  return `${year}-${month}-${day}`;
}

function isNullOrEmpty(input) {
  return input === null || input === undefined;
}

function isValidDateFormat(dateString) {
  // 使用正则表达式验证日期格式是否为 yyyy-mm-dd
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  return regex.test(dateString);
}

document.addEventListener("DOMContentLoaded", () => {
  refreshInformation();
});

function refreshInformation() {
  const params = getQueryParams();
  const username = params.username;

  // 发送GET请求到服务器获取用户详细信息
  fetch(`/user?username=${username}`)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        alert("无法读取用户数据xwx");
        throw new Error("Failed to fetch user details");
      }
    })
    .then((data) => {
      document.getElementById("username").textContent =
        data.user_name || "未知";
      document.getElementById("realName").textContent =
        data.user_real_name || "未知";
      document.getElementById("sex").textContent = data.user_sex || "未知";
      document.getElementById("age").textContent =
        formatDateToString(new Date(data.user_birth)) || "未知";
      document.getElementById("phone").textContent = data.user_phone || "未知";
      document.getElementById("email").textContent = data.user_email || "未知";
      document.getElementById("balance").textContent = data.balance || "未知";

      document.getElementById("iRealName").placeholder =
        data.user_real_name || "未知";
      document.getElementById("iSex").placeholder = data.user_sex || "未知";
      document.getElementById("iBirth").placeholder =
        formatDateToString(new Date(data.user_birth)) || "未知";
      document.getElementById("iPhone").placeholder = data.user_phone || "未知";
      document.getElementById("iEmail").placeholder = data.user_email || "未知";
    })
    .catch((error) => console.error("Error:", error));

  fetch(`/get-latest?username=${username}`)
    .then((response) => response.json())
    .then((data) => {
      displayLatestResults(data.flights);
    })
    .catch((error) => {
      alert("出错了，联系管理员OAO");
      console.error("Error:", error);
    });
}

function displayLatestResults(data) {
  const resultsDiv = document.getElementById("latest-results");

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
            <span>${flight.delay_time ? "预计延迟" : ""}</span>
            <span>目的地</span>
            <span>出发时间</span>
            <span>到达时间</span>
            <span>座位号</span>
          </div>

          <div class="flight-info">
            <span>${flight.flight_number}</span>
            <span>${flight.departure_city}</span>
            <span class="arrow"><p>→</p></span>
            <span>${flight.arrival_city}</span>
            <span>${aTimePart}</span>
            <span>${depTimePart}</span>
            <span>${flight.seat_number}</span>
          </div>

          <div class="flight-detail">
            <span>机型：${flight.aircraft}</span>
            <span>${flight.departure_airport}</span>
            <span>${
              flight.delay_time ? flight.delay_time.substring(0, 5) : ""
            }</span>
            <span>${flight.arrival_airport}</span>
            <span>${datePart}</span>
            <span>${aDatePart}</span>
            <span>${flight.ticket_class}</span>
          </div>
        `;

      resultsDiv.appendChild(flightDiv);
    });

    resultsDiv.classList.remove("hidden");
  } else {
    resultsDiv.innerHTML = "<a>没有即将出发的航程</a>";
    resultsDiv.classList.remove("hidden");
  }
}
