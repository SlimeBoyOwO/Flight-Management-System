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

// 处理管理员登录请求的路由
app.post("/adminlogin", (req, res) => {
  const { username, password } = req.body;

  // 查询是否正确
  if (username === "NoiNoiQ" && password === "Terminal") {
    res.status(200).json({ username, password });
  } else {
    res.status(402).send("Login failed");
  }
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
    "SELECT * FROM user_data WHERE user_name = ?",
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

// 处理查询总信息的路由
app.get("/info", (req, res) => {
  // 查询总详细信息
  connection.query("CALL GetAirlineInfo();", [], (error, results, fields) => {
    if (error) {
      console.error("Error executing query", error);
      res.status(500).send("Internal Server Error");
      return;
    }

    if (results.length > 0) {
      const flight_count = results[0][0];
      res.status(200).json(flight_count);
    } else {
      res.status(404).send("Info not found");
    }
  });
});

app.post("/change-info", (req, res) => {
  const { username, userRealName, userSex, userBirth, userPhone, userEmail } =
    req.body;
  // 查询总详细信息
  connection.query(
    "CALL UpdateUserInfo(?,?,?,?,?,?);",
    [username, userRealName, userSex, userBirth, userPhone, userEmail],
    (error, results, fields) => {
      if (error) {
        console.error("Error executing query", error);
        res.status(500).send(error.message);
        return;
      }

      res.status(200).send("信息修改成功");
    }
  );
});

app.post("/change-password", (req, res) => {
  const { username, password } = req.body;
  // 查询总详细信息
  connection.query(
    "CALL ChangeUserPassword(?,?);",
    [username, password],
    (error, results, fields) => {
      if (error) {
        console.error("Error executing query", error);
        res.status(500).send(error.message);
        return;
      }

      res.status(200).send("密码修改成功");
    }
  );
});

app.post("/charge-balance", (req, res) => {
  const { username, addMoney } = req.body;
  // 查询总详细信息
  connection.query(
    "CALL AddUserBalance(?,?);",
    [username, addMoney],
    (error, results, fields) => {
      if (error) {
        console.error("Error executing query", error);
        res.status(500).send(error.message);
        return;
      }

      res.status(200).send("账户充值成功");
    }
  );
});

app.post("/pay-order", (req, res) => {
  const { username, order_id } = req.body;
  // 查询总详细信息
  connection.query(
    "CALL UserPayOrder(?,?);",
    [username, order_id],
    (error, results, fields) => {
      if (error) {
        console.error("Error executing query", error);
        res.status(500).send(error.message);
        return;
      }

      res.status(200).send("账户充值成功");
    }
  );
});

app.post("/cancel-order", (req, res) => {
  const { username, order_id } = req.body;
  // 查询总详细信息
  connection.query(
    "CALL CancelUserOrderID(?);",
    [order_id],
    (error, results, fields) => {
      if (error) {
        console.error("Error executing query", error);
        res.status(500).send(error.message);
        return;
      }

      res.status(200).send("订单取消成功");
    }
  );
});

app.post("/book-ticket", (req, res) => {
  const { username, ticket_id, seat_number } = req.body;
  // 查询总详细信息
  connection.query(
    "CALL UserBookTicket(?,?,?);",
    [username, ticket_id, seat_number],
    (error, results, fields) => {
      if (error) {
        console.error("Error executing query", error);
        res.status(500).send(error.message);
        return;
      }

      res.status(200).send("订单生成成功");
    }
  );
});

// 处理航班搜索请求的路由
app.get("/search-flights", (req, res) => {
  const { leave, arrive, page = 1, limit = 2 } = req.query;
  const offset = (page - 1) * limit;

  // 查询航班信息
  connection.query(
    "CALL GetFlightsInfo(?,?,?,?);",
    [leave, arrive, parseInt(limit), parseInt(offset)],
    (error, results, fields) => {
      if (error) {
        console.error("Error executing query", error);
        res.status(500).send("Internal Server Error");
        return;
      }

      connection.query(
        "CALL GetFlightsCount(?,?);",
        [leave, arrive],
        (error, t_results, fields) => {
          if (error) {
            console.error("Error executing count query", error);
            res.status(500).send("Internal Server Error");
            return;
          }

          const total = t_results[0][0].total;
          res.status(200).json({
            flights: results[0],
            total,
            page: parseInt(page),
            limit: parseInt(limit),
          });
        }
      );
    }
  );
});

// 处理航班搜索请求的路由
app.get("/search-flights-without-ticket", (req, res) => {
  const { leave, arrive, page = 1, limit = 2 } = req.query;
  const offset = (page - 1) * limit;
  total = 0;

  // 查询航班信息
  connection.query(
    "CALL GetFlightsInfoWithoutTickets(?,?,?,?);",
    [leave, arrive, parseInt(limit), parseInt(offset)],
    (error, results, fields) => {
      if (error) {
        console.error("Error executing query", error);
        res.status(500).send("Internal Server Error");
        return;
      }

      res.status(200).json({
        flights: results[0],
        total: results[1][0].total,
        page: parseInt(page),
        limit: parseInt(limit),
      });
    }
  );
});

// 处理最近一次订单搜索请求的路由
app.get("/get-latest", (req, res) => {
  const { username } = req.query;

  // 查询航班信息
  connection.query(
    "CALL GetUserLatestUncompletedOrders(?);",
    [username],
    (error, results, fields) => {
      if (error) {
        console.error("Error executing query", error);
        res.status(500).send("Internal Server Error");
        return;
      }

      res.status(200).json({
        flights: results[0],
      });
    }
  );
});

// 处理购买机票请求的路由
app.get("/search-tickets", (req, res) => {
  const { scheduleID } = req.query;

  // 查询航班信息
  connection.query(
    "CALL GetScheduleAllTickets(?);",
    [scheduleID],
    (error, results, fields) => {
      if (error) {
        console.error("Error executing query", error);
        res.status(500).send("Internal Server Error");
        return;
      }

      res.status(200).json({
        tickets: results[0],
      });
    }
  );
});

// 处理我的订单的路由
app.get("/search-order", (req, res) => {
  const { user_name, page = 1, limit = 3 } = req.query;
  const offset = (page - 1) * limit;

  // 查询订单信息
  connection.query(
    "CALL GetUserUncompletedOrders(?,?,?);",
    [user_name, parseInt(limit), parseInt(offset)],
    (error, results, fields) => {
      if (error) {
        console.error("Error executing query", error);
        alert("订单查询出错！");
        res.status(500).send("Internal Server Error");
        return;
      }

      const total = results[1][0].total;

      res.status(200).json({
        orders: results[0],
        total,
        page: parseInt(page),
        limit: parseInt(limit),
      });
    }
  );
});

// 处理历史订单的路由
app.get("/search-history-order", (req, res) => {
  const { user_name, page = 1, limit = 3 } = req.query;
  const offset = (page - 1) * limit;
  total = 0;

  // 查询订单信息
  connection.query(
    "CALL GetUserCompletedOrders(?,?,?);",
    [user_name, parseInt(limit), parseInt(offset)],
    (error, results, fields) => {
      if (error) {
        console.error("Error executing query", error);
        alert("订单查询出错！");
        res.status(500).send("Internal Server Error");
        return;
      }

      const total = results[1][0].total;

      res.status(200).json({
        orders: results[0],
        total,
        page: parseInt(page),
        limit: parseInt(limit),
      });
    }
  );
});

// 处理查询所有航班的路由
app.get("/search-all-flights", (req, res) => {
  const { page = 1, limit = 8 } = req.query;
  const offset = (page - 1) * limit;
  total = 0;

  // 查询订单信息
  connection.query(
    "CALL GetAllFlightsInfo(?,?);",
    [parseInt(limit), parseInt(offset)],
    (error, results, fields) => {
      if (error) {
        console.error("Error executing query", error);
        alert("订单查询出错！");
        res.status(500).send("Internal Server Error");
        return;
      }

      const total = results[1][0].total;

      res.status(200).json({
        airlines: results[0],
        total,
        page: parseInt(page),
        limit: parseInt(limit),
      });
    }
  );
});

// 处理查询机场的路由
app.get("/search-all-airports", (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;
  total = 0;

  // 查询订单信息
  connection.query(
    "CALL GetAllAirportsInfo(?,?);",
    [parseInt(limit), parseInt(offset)],
    (error, results, fields) => {
      if (error) {
        console.error("Error executing query", error);
        alert("订单查询出错！");
        res.status(500).send("Internal Server Error");
        return;
      }

      const total = results[1][0].total;

      res.status(200).json({
        airports: results[0],
        total,
        page: parseInt(page),
        limit: parseInt(limit),
      });
    }
  );
});

app.post("/add-flight", (req, res) => {
  const {
    airline,
    flight_number,
    aircraft,
    departure_airport,
    arrival_airport,
  } = req.body;
  // 查询总详细信息
  connection.query(
    "CALL AddNewFlight(?,?,?,?,?);",
    [flight_number, airline, aircraft, departure_airport, arrival_airport],
    (error, results, fields) => {
      if (error) {
        console.error("Error executing query", error);
        res.status(500).send(error.message);
        return;
      }

      res.status(200).send("信息修改成功");
    }
  );
});

app.post("/add-schedule", (req, res) => {
  const { flight_number, scheduled_departure, scheduled_arrival } = req.body;
  // 查询总详细信息
  connection.query(
    "CALL AddNewSchedule(?,?,?);",
    [flight_number, scheduled_departure, scheduled_arrival],
    (error, results, fields) => {
      if (error) {
        console.error("Error executing query", error);
        res.status(500).send(error.message);
        return;
      }

      res.status(200).send("信息修改成功");
    }
  );
});

app.post("/add-ticket", (req, res) => {
  const { schedule_id, ticket_class, price, total_seats } = req.body;
  // 查询总详细信息
  connection.query(
    "CALL AddNewTicket(?,?,?,?);",
    [schedule_id, ticket_class, price, total_seats],
    (error, results, fields) => {
      if (error) {
        console.error("Error executing query", error);
        res.status(500).send(error.message);
        return;
      }

      res.status(200).send("信息修改成功");
    }
  );
});

app.post("/delete-ticket", (req, res) => {
  const { ticket_id } = req.body;
  // 查询总详细信息
  connection.query(
    "CALL DeleteTicket(?);",
    [ticket_id],
    (error, results, fields) => {
      if (error) {
        console.error("Error executing query", error);
        res.status(500).send(error.message);
        return;
      }

      res.status(200).send("信息修改成功");
    }
  );
});

app.post("/delete-schedule", (req, res) => {
  const { schedule_id } = req.body;
  // 查询总详细信息
  connection.query(
    "CALL DeleteSchedule(?);",
    [schedule_id],
    (error, results, fields) => {
      if (error) {
        console.error("Error executing query", error);
        res.status(500).send(error.message);
        return;
      }

      res.status(200).send("信息修改成功");
    }
  );
});

app.post("/delete-flight", (req, res) => {
  const { flight_id } = req.body;
  // 查询总详细信息
  connection.query(
    "CALL DeleteFlight(?);",
    [flight_id],
    (error, results, fields) => {
      if (error) {
        console.error("Error executing query", error);
        res.status(500).send(error.message);
        return;
      }

      res.status(200).send("航班删除成功");
    }
  );
});

app.post("/delay-schedule", (req, res) => {
  const { schedule_id, delay_time } = req.body;
  // 查询总详细信息
  connection.query(
    "CALL DelaySchedule(?,?);",
    [schedule_id, delay_time],
    (error, results, fields) => {
      if (error) {
        console.error("Error executing query", error);
        res.status(500).send(error.message);
        return;
      }

      res.status(200).send("航班延迟成功");
    }
  );
});

// 处理用户余额是否充足的路由
app.get("/check-balance", (req, res) => {
  const { user_name, order_id } = req.query;

  // 查询订单信息
  connection.query(
    "CALL IsHavingEnoughMoney(?,?);",
    [user_name, order_id],
    (error, results, fields) => {
      if (error) {
        console.error("Error executing query", error);
        res.status(500).send("Internal Server Error");
        return;
      }

      res.status(200).json({
        isEnough: results[0][0].result,
      });
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
