const express = require("express");
const mysql = require("mysql2");
const path = require("path");

const app = express();

// 创建与MySQL数据库的连接
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "flight",
});

// 解析POST请求的中间件
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 处理用户登录请求的路由
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  // 查询数据库
  connection.query(
    "SELECT * FROM user_data WHERE user_name = ? AND user_password = ?",
    [username, password],
    (error, results, fields) => {
      if (error) {
        console.error("Error executing query", error);
        res.status(500).send("Internal Server Error");
        return;
      }

      // 检查是否找到匹配的用户
      if (results.length > 0) {
        res.status(200).json({ username, password });
      } else {
        res.status(401).send("Login failed");
      }
    }
  );
});

// 处理用户注册请求的路由
app.post("/register", (req, res) => {
  const { username, password } = req.body;

  // 插入新用户到数据库
  connection.query(
    "INSERT INTO user_data (user_name, user_password) VALUES (?, ?)",
    [username, password],
    (error, results, fields) => {
      if (error) {
        console.error("Error executing query", error);
        res.status(500).send("Internal Server Error");
        return;
      }

      res.status(200).send("Registration successful");
    }
  );
});

// 处理根据用户名查询用户信息的路由
app.get("/user", (req, res) => {
  const { username } = req.query;

  // 查询用户详细信息
  connection.query(
    "SELECT user_name, user_real_name, user_sex, user_age, user_phone, user_email FROM user_data WHERE user_name = ?",
    [username],
    (error, results, fields) => {
      if (error) {
        console.error("Error executing query", error);
        res.status(500).send("Internal Server Error");
        return;
      }

      if (results.length > 0) {
        const user = results[0];
        user.ticket_count = 0; // 暂时固定值为0
        res.status(200).json(user);
      } else {
        res.status(404).send("User not found");
      }
    }
  );
});

// 设置静态文件目录
app.use(express.static(path.join(__dirname, "public")));

// 监听端口
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
