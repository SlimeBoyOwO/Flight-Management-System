let currentHistoryPage = 1;

//让页面加载的时候，显示第一页
document.addEventListener("DOMContentLoaded", () => {
  searchHistoryOrders(1);
});

//向后端发送请求，准备显示信息
function searchHistoryOrders(page = 1) {
  const params = getQueryParams();
  const user_name = params.username;

  fetch(`/search-history-order?user_name=${user_name}&page=${page}`)
    .then((response) => response.json())
    .then((data) => {
      displayHistoryResults(data.orders);
      setupHistoryOrderPagination(data.total, data.page, data.limit);
    })
    .catch((error) => {
      alert("出错了，联系管理员qwq");
      console.error("Error:", error);
      alert(error);
    });
}

function displayHistoryResults(orders) {
  const resultsDiv = document.getElementById("history-order-results");

  resultsDiv.innerHTML = ""; // 清空以前的结果

  if (orders.length > 0) {
    orders.forEach((order) => {
      const orderDiv = document.createElement("div");

      const departureTime = order.actual_departure;
      const arrivalTime = order.actual_arrival;
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

      orderDiv.className = "history-order-info-box";
      orderDiv.innerHTML = `
          <div class="history-order-info-header">
            <span>航空公司/航班号</span>
            <span>出发地</span>
            <span></span>
            <span>目的地</span>
            <span>实际出发时间</span>
            <span>实际到达时间</span>
            <span>座位号</span>
          </div>

          <div class="history-order-info">
            <span>${order.flight_number}</span>
            <span>${order.departure_city}</span>
            <span class="arrow"><p>→</p></span>
            <span>${order.arrival_city}</span>
            <span>${depTimePart}</span>
            <span>${aTimePart}</span>
            <span>${order.seat_number}</span>
          </div>

          <div class="history-order-detail">
            <span>机型：${order.aircraft}</span>
            <span>${order.departure_airport}</span>
            <span></span>
            <span>${order.arrival_airport}</span>
            <span>${datePart}</span>
            <span>${aDatePart}</span>
            <span>￥${order.actual_pay}</span>
          </div>

        `;
      resultsDiv.appendChild(orderDiv);
    });

    resultsDiv.classList.remove("hidden");
  } else {
    resultsDiv.innerHTML = "<a>No results found</a>";
    resultsDiv.classList.remove("hidden");
  }
}

function setupHistoryOrderPagination(total, page, limit) {
  const paginationDiv = document.getElementById("history-order-pagination");

  paginationDiv.innerHTML = ""; // 清空以前的分页

  const totalPages = Math.ceil(total / limit);

  if (totalPages >= 1) {
    for (let i = 1; i <= totalPages; i++) {
      const pageButton = document.createElement("button");
      pageButton.innerText = i;
      pageButton.className = i === page ? "active" : "";
      pageButton.addEventListener("click", (e) => {
        e.preventDefault(); // 防止按钮默认行为
        currentHistoryPage = i;
        searchHistoryOrders(i);
      });
      paginationDiv.appendChild(pageButton);
    }

    paginationDiv.classList.remove("hidden");
  } else {
    paginationDiv.classList.add("hidden");
  }
}
