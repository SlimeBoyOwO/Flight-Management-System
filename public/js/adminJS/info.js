document.addEventListener("DOMContentLoaded", () => {
  fetch(`/info`)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        alert("无法读取航班数据xwx");
        throw new Error("Failed to fetch user details");
      }
    })
    .then((data) => {
      document.getElementById("totalFlights").textContent =
        data.flight_num || "未知";
      document.getElementById("totalOrders").textContent =
        data.order_num || "未知";
      document.getElementById("totalDelays").textContent =
        data.delay_num || "未知";
    })
    .catch((error) => console.error("Error:", error));
});
