let currentAirlinePage = 1;

//让页面加载的时候，显示第一页
document.addEventListener("DOMContentLoaded", () => {
  searchAirline(1);
});

//向后端发送请求，准备显示信息
function searchAirline(page = 1) {
  fetch(`/search-all-flights?&page=${page}`)
    .then((response) => response.json())
    .then((data) => {
      displayAirlineResults(data.airlines);
      setupAirlinePagination(data.total, data.page, data.limit);
    })
    .catch((error) => {
      alert("出错了，联系管理员qwq");
      console.error("Error:", error);
      alert(error);
    });
}

function displayAirlineResults(airlines) {
  const resultsDiv = document.getElementById("airline-results");

  resultsDiv.innerHTML = ""; // 清空以前的结果

  if (airlines.length > 0) {
    const boxDiv = document.createElement("div");
    boxDiv.className = "airline-info-box";
    boxDiv.innerHTML = `<div class="airline-info-header">
            <span>航班ID</span>
            <span>航班号</span>
            <span>出发地</span>
            <span>出发城市</span>
            <span></span>
            <span>目的地</span>
            <span>目的城市</span>
            <span>机型</span>
            <span>操作</span>
          </div>`;

    airlines.forEach((airline) => {
      const airlineDiv = document.createElement("div");

      airlineDiv.className = "airline-info";
      airlineDiv.innerHTML = `
            <span>${airline.flight_id}</span>
            <span>${airline.flight_number}</span>
            <span>${airline.departure_airport}</span>
            <span>${airline.departure_city}</span>
            <span class="arrow"><p>→</p></span>
            <span>${airline.arrival_airport}</span>
            <span>${airline.arrival_city}</span>
            <span>${airline.aircraft}</span>
            <span><button class="delete-flight-button" data-flight-id="${airline.flight_id}" >删除航班</button></span>
        `;
      boxDiv.appendChild(airlineDiv);

      const button = airlineDiv.querySelector(".delete-flight-button");
      button.addEventListener("click", (e) => {
        e.preventDefault();
        const flight_id = e.target.getAttribute("data-flight-id");
        deleteFlight(flight_id);
      });
    });

    resultsDiv.appendChild(boxDiv);

    resultsDiv.classList.remove("hidden");
  } else {
    resultsDiv.innerHTML = "<a>No results found</a>";
    resultsDiv.classList.remove("hidden");
  }
}

function setupAirlinePagination(total, page, limit) {
  const paginationDiv = document.getElementById("airline-pagination");

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
        searchAirline(i);
      });
      paginationDiv.appendChild(pageButton);
    }

    paginationDiv.classList.remove("hidden");
  } else {
    paginationDiv.classList.add("hidden");
  }
}

function deleteFlight(flightID) {
  fetch("/delete-flight", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      flight_id: flightID,
    }),
  })
    .then((response) => {
      if (response.ok) {
        alert("航班删除成功！(*^▽^*)");
        searchAirline(1);
      } else {
        alert("航班删除失败！o(╥﹏╥)o");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
