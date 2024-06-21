let currentAirportPage = 1;

//让页面加载的时候，显示第一页
document.addEventListener("DOMContentLoaded", () => {
  searchAirports(1);
});

//向后端发送请求，准备显示信息
function searchAirports(page = 1) {
  fetch(`/search-all-airports?&page=${page}`)
    .then((response) => response.json())
    .then((data) => {
      displayAirportsResults(data.airports);
      setupAirportsPagination(data.total, data.page, data.limit);
    })
    .catch((error) => {
      alert("出错了，联系管理员qwq");
      console.error("Error:", error);
      alert(error);
    });
}

function displayAirportsResults(airports) {
  const resultsDiv = document.getElementById("airports-results");

  resultsDiv.innerHTML = ""; // 清空以前的结果

  if (airports.length > 0) {
    const boxDiv = document.createElement("div");
    boxDiv.className = "airport-info-box";
    boxDiv.innerHTML = `<div class="airport-info-header">
            <span>机场ID</span>
            <span>机场名</span>
            <span>所在地</span>
            <span>IATA码</span>
          </div>`;

    airports.forEach((airport) => {
      const airportDiv = document.createElement("div");

      airportDiv.className = "airport-info";
      airportDiv.innerHTML = `
            <span>${airport.airport_id}</span>
            <span>${airport.airport_name}</span>
            <span>${airport.city}</span>
            <span>${airport.iata_code}</span>
        `;
      boxDiv.appendChild(airportDiv);
    });

    resultsDiv.appendChild(boxDiv);

    resultsDiv.classList.remove("hidden");
  } else {
    resultsDiv.innerHTML = "<a>No results found</a>";
    resultsDiv.classList.remove("hidden");
  }
}

function setupAirportsPagination(total, page, limit) {
  const paginationDiv = document.getElementById("airports-pagination");

  paginationDiv.innerHTML = ""; // 清空以前的分页

  const totalPages = Math.ceil(total / limit);

  if (totalPages >= 1) {
    for (let i = 1; i <= totalPages; i++) {
      const pageButton = document.createElement("button");
      pageButton.innerText = i;
      pageButton.className = i === page ? "active" : "";
      pageButton.addEventListener("click", (e) => {
        e.preventDefault(); // 防止按钮默认行为
        currentAirportPage = i;
        searchAirports(i);
      });
      paginationDiv.appendChild(pageButton);
    }

    paginationDiv.classList.remove("hidden");
  } else {
    paginationDiv.classList.add("hidden");
  }
}
