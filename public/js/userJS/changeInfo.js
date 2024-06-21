document.addEventListener("DOMContentLoaded", () => {
  document
    .querySelector("#confirm-change-info")
    .addEventListener("click", () => {
      changeInfo();
    });
});

document.addEventListener("DOMContentLoaded", () => {
  document
    .querySelector("#confirm-change-password")
    .addEventListener("click", () => {
      changePassword();
    });
});

document.addEventListener("DOMContentLoaded", () => {
  document
    .querySelector("#confirm-charge-balance")
    .addEventListener("click", () => {
      chargeBalance();
    });
});

function chargeBalance() {
  const params = getQueryParams();
  const username = params.username;
  const originalMoney = document.getElementById("balance").textContent;
  const addMoney = document.getElementById("iCharge").value;

  if (isNaN(parseFloat(addMoney))) {
    alert("输入的不是数字！重新输入！");
  } else {
    fetch("/charge-balance", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, addMoney }),
    })
      .then((response) => {
        if (response.ok) {
          alert("账户充值成功(*^▽^*)");
          refreshInformation();
        } else {
          alert("账户充值失败o(╥﹏╥)o");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
}

function changePassword() {
  const params = getQueryParams();
  const username = params.username;
  const password = document.getElementById("iPassword").value;
  const confirmPassword = document.getElementById("iConfirmPassword").value;

  if (password != confirmPassword) {
    alert("输入的密码和确认密码不一致！");
  } else {
    fetch("/change-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    })
      .then((response) => {
        if (response.ok) {
          alert("修改密码成功(*^▽^*)");
        } else {
          alert("修改密码失败o(╥﹏╥)o");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
}

function changeInfo() {
  const params = getQueryParams();
  const username = params.username;
  const userRealName = document.getElementById("iRealName").value;
  const userSex = document.getElementById("iSex").value;
  const userBirth = document.getElementById("iBirth").value;
  const userPhone = document.getElementById("iPhone").value;
  const userEmail = document.getElementById("iEmail").value;

  const date = new Date(userBirth);

  if (!isValidDateFormat(userBirth) && !isNullOrEmpty(userBirth)) {
    alert("输入的日期格式有误！");
  } else {
    const stringDate = new Date(userBirth).toISOString().slice(0, 10);
    alert(stringDate);
    fetch("/change-info", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        userRealName,
        userSex,
        userBirth: stringDate,
        userPhone,
        userEmail,
      }),
    })
      .then((response) => {
        if (response.ok) {
          alert("修改信息成功(*^▽^*)");
        } else {
          alert("修改信息失败o(╥﹏╥)o");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
}
