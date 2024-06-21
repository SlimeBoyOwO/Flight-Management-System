let currentOrderPage = 1;

//让页面加载的时候，显示第一页
document.addEventListener("DOMContentLoaded", () => {
  searchOrders(1);
});

//向后端发送请求，准备显示信息
function searchOrders(page = 1) {
  const params = getQueryParams();
  const user_name = params.username;

  fetch(`/search-order?user_name=${user_name}&page=${page}`)
    .then((response) => response.json())
    .then((data) => {
      displayResults(data.orders);
      setupOrderPagination(data.total, data.page, data.limit);
    })
    .catch((error) => {
      alert("出错了，联系管理员qwq");
      console.error("Error:", error);
      alert(error);
    });
}

function displayResults(orders) {
  const resultsDiv = document.getElementById("order-results");

  resultsDiv.innerHTML = ""; // 清空以前的结果

  if (orders.length > 0) {
    orders.forEach((order) => {
      const orderDiv = document.createElement("div");

      const departureTime = order.scheduled_departure;
      const arrivalTime = order.scheduled_arrival;
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

      orderDiv.className = "order-info-box";
      orderDiv.innerHTML = `
          <div class="order-info-header">
            <span>航班号</span>
            <span>出发地</span>
            <span>${order.delay_time ? "预计延迟" : ""}</span>
            <span>目的地</span>
            <span>预计出发时间</span>
            <span>预计到达时间</span>
            <span>座位号</span>
            <span>价格</span>
            <span>操作</span>
          </div>

          <div class="order-info">
            <span>${order.flight_number}</span>
            <span>${order.departure_city}</span>
            <span class="arrow"><p>→</p></span>
            <span>${order.arrival_city}</span>
            <span>${depTimePart}</span>
            <span>${aTimePart}</span>
            <span>${order.seat_number}</span>
            <span>￥${order.actual_pay}</span>
            <span><button class="cancel-order-button" data-order-id="${
              order.order_id
            }" >取消订单</button></span>
          </div>

          <div class="order-detail">
            <span>机型：${order.aircraft}</span>
            <span>${order.departure_airport}</span>
            <span>${
              order.delay_time ? order.delay_time.substring(0, 5) : ""
            }</span>
            <span>${order.arrival_airport}</span>
            <span>${datePart}</span>
            <span>${aDatePart}</span>
            <span>${order.ticket_class}</span>
            <span>${order.payment_status ? "已支付" : "未支付"}</span>
            <span><button class="pay-button ${
              order.payment_status ? "hidden" : ""
            }" data-order-id="${order.order_id}" >点击支付</button></span>
          </div>

        `;
      resultsDiv.appendChild(orderDiv);
    });

    document.querySelectorAll(".pay-button").forEach((button) => {
      button.addEventListener("click", (e) => {
        e.preventDefault();
        const orderId = e.target.getAttribute("data-order-id");
        payOrder(orderId);
      });
    });

    document.querySelectorAll(".cancel-order-button").forEach((button) => {
      button.addEventListener("click", (e) => {
        e.preventDefault();
        const orderId = e.target.getAttribute("data-order-id");
        cancelOrder(orderId);
      });
    });

    resultsDiv.classList.remove("hidden");
  } else {
    resultsDiv.innerHTML = "<a>您还没有任何订单</a>";
    resultsDiv.classList.remove("hidden");
  }
}

function setupOrderPagination(total, page, limit) {
  const paginationDiv = document.getElementById("order-pagination");

  paginationDiv.innerHTML = ""; // 清空以前的分页

  const totalPages = Math.ceil(total / limit);

  if (totalPages >= 1) {
    for (let i = 1; i <= totalPages; i++) {
      const pageButton = document.createElement("button");
      pageButton.innerText = i;
      pageButton.className = i === page ? "active" : "";
      pageButton.addEventListener("click", (e) => {
        e.preventDefault(); // 防止按钮默认行为
        currentOrderPage = i;
        searchOrders(i);
      });
      paginationDiv.appendChild(pageButton);
    }

    paginationDiv.classList.remove("hidden");
  } else {
    paginationDiv.classList.add("hidden");
  }
}

function payOrder(orderId) {
  const params = getQueryParams();
  const username = params.username;

  fetch(`/check-balance?user_name=${username}&order_id=${orderId}`)
    .then((response) => response.json())
    .then((data) => {
      if (data.isEnough) {
        fetch(`/pay-order`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, order_id: orderId }),
        })
          .then((response) => {
            if (response.ok) {
              alert("账单支付成功！(*^▽^*)");
              searchOrders(currentOrderPage);
              refreshInformation();
            } else {
              alert("账单支付失败！o(╥﹏╥)o");
            }
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      } else {
        alert("您的账户余额不足，请充值!");
        return;
      }
    })
    .catch((error) => {
      alert("出错了，联系管理员OAO");
      console.error("Error:", error);
    });
}

function cancelOrder(orderId) {
  const params = getQueryParams();
  const username = params.username;
  fetch(`/cancel-order`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, order_id: orderId }),
  })
    .then((response) => {
      if (response.ok) {
        alert("账单取消成功！(*^▽^*)");
        searchOrders(currentOrderPage);
        refreshInformation();
      } else {
        alert("账单取消失败！o(╥﹏╥)o");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
