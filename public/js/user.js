function getQueryParams() {
  const params = {};
  const queryString = window.location.search.slice(1);
  queryString.split("&").forEach((param) => {
    const [key, value] = param.split("=");
    params[decodeURIComponent(key)] = decodeURIComponent(value);
  });
  return params;
}

document.addEventListener("DOMContentLoaded", () => {
  const params = getQueryParams();
  const username = params.username;

  // 发送GET请求到服务器获取用户详细信息
  fetch(`/user?username=${username}`)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        alert("Failed to fetch user details");
        throw new Error("Failed to fetch user details");
      }
    })
    .then((data) => {
      document.getElementById("username").textContent =
        data.user_name || "未知";
      document.getElementById("realName").textContent =
        data.user_real_name || "未知";
      document.getElementById("sex").textContent = data.user_sex || "未知";
      document.getElementById("age").textContent = data.user_age || "未知";
      document.getElementById("phone").textContent = data.user_phone || "未知";
      document.getElementById("email").textContent = data.user_email || "未知";
      document.getElementById("ticketCount").textContent =
        data.ticket_count || "未知";
    })
    .catch((error) => console.error("Error:", error));
});
