function loginUser() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  // 发送POST请求到服务器
  fetch("/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  })
    .then((response) => {
      if (response.ok) {
        alert("登录成功了(*^▽^*)");
        return response.json();
      } else {
        alert("Login failed");
      }
    })
    .then((data) => {
      // 重定向到用户页面并传递用户名
      window.location.href = `main.html?username=${data.username}`;
    })
    .catch((error) => console.error("Error:", error));
}
