function registerUser() {
  const username = document.getElementById("regUsername").value;
  const password = document.getElementById("regPassword").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  // 检查密码是否匹配
  if (password !== confirmPassword) {
    alert("你输入的密码有错误");
    return;
  }

  // 发送POST请求到服务器
  fetch("/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  })
    .then((response) => {
      if (response.ok) {
        alert("注册成功(*^▽^*)");
      } else {
        alert("注册失败o(╥﹏╥)o");
      }
    })
    .catch((error) => console.error("Error:", error));
}
