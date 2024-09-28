const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());

// Kết nối tới MySQL
const db = mysql.createConnection({
  host: "bxeqgpqu1vzvjashgvw9-mysql.services.clever-cloud.com",
  user: "u423fbfqvaffxpmf",
  password: "MqYZYmbAv5MjhRhyynHZ",
  database: "bxeqgpqu1vzvjashgvw9",
  port: 3306,
});

db.connect((err) => {
  if (err) {
    console.error("Lỗi kết nối:", err);
    return;
  }
  console.log("Kết nối MySQL thành công");
});

// API để lấy câu hỏi từ database
app.get("/A1_API", (req, res) => {
  const sql = `
    SELECT q.*, ans.id as ans_id, ans.content as answer, ans.is_correct 
    FROM (
      (SELECT * FROM question_motos WHERE type = 0 ORDER BY RAND() LIMIT 1)
      UNION ALL
      (SELECT * FROM question_motos WHERE type = 1 ORDER BY RAND() LIMIT 8)
      UNION ALL
      (SELECT * FROM question_motos WHERE type = 2 ORDER BY RAND() LIMIT 1)
      UNION ALL
      (SELECT * FROM question_motos WHERE type = 3 ORDER BY RAND() LIMIT 1)
      UNION ALL
      (SELECT * FROM question_motos WHERE type = 4 ORDER BY RAND() LIMIT 7)
      UNION ALL
      (SELECT * FROM question_motos WHERE type = 5 ORDER BY RAND() LIMIT 7)
    ) as q
    LEFT JOIN answer_motos ans ON q.id = ans.id_que;
  `;

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err });
    }

    const questions = {};
    results.forEach((row) => {
      if (!questions[row.id]) {
        questions[row.id] = {
          id: row.id,
          question_text: row.content,
          image_url: row.url,
          answers: [],
        };
      }
      questions[row.id].answers.push({
        answer_id: row.ans_id,
        answer_text: row.answer,
        is_correct: row.is_correct,
      });
    });

    res.json(Object.values(questions));
  });
});

// API để lấy câu hỏi từ database
app.get("/B1_API", (req, res) => {
  const sql = `
    SELECT q.*, ans.id as ans_id, ans.content as answer, ans.is_correct 
    FROM ((
    SELECT * 
    FROM question_otos
    WHERE type = 0
    ORDER BY RAND()
    LIMIT 1
)
UNION ALL
(
    SELECT * 
    FROM question_otos
    WHERE type = 1
    ORDER BY RAND()
    LIMIT 1
)
UNION ALL
(
    SELECT * 
    FROM question_otos
    WHERE type = 2
    ORDER BY RAND()
    LIMIT 6
)
UNION ALL
(
    SELECT * 
    FROM question_otos
    WHERE type = 3
    ORDER BY RAND()
    LIMIT 1
)
UNION ALL
(
    SELECT * 
    FROM question_otos
    WHERE type = 4
    ORDER BY RAND()
    LIMIT 1
)
UNION ALL
(
    SELECT * 
    FROM question_otos
    WHERE type = 6
    ORDER BY RAND()
    LIMIT 1
)
UNION ALL
(
    SELECT * 
    FROM question_otos
    WHERE type = 7
    ORDER BY RAND()
    LIMIT 1
)
UNION ALL
(
    SELECT * 
    FROM question_otos
    WHERE type = 8
    ORDER BY RAND()
    LIMIT 9
)
UNION ALL
(
    SELECT * 
    FROM question_otos
    WHERE type = 9
    ORDER BY RAND()
    LIMIT 9
)) as q LEFT JOIN answer_otos ans ON q.id = ans.id_que;
  `;

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err });
    }

    const questions = {};
    results.forEach((row) => {
      if (!questions[row.id]) {
        questions[row.id] = {
          id: row.id,
          question_text: row.content,
          image_url: row.url,
          answers: [],
        };
      }
      questions[row.id].answers.push({
        answer_id: row.ans_id,
        answer_text: row.answer,
        is_correct: row.is_correct,
      });
    });

    res.json(Object.values(questions));
  });
});
// API để lấy câu hỏi từ database
app.get("/B2_API", (req, res) => {
  const sql = `SELECT q.*, ans.id as ans_id, ans.content as answer, ans.is_correct 
    FROM (
    (
    SELECT * 
    FROM question_otos
    WHERE type = 0
    ORDER BY RAND()
    LIMIT 1
)
UNION ALL
(
    SELECT * 
    FROM question_otos
    WHERE type = 1
    ORDER BY RAND()
    LIMIT 1
)
UNION ALL
(
    SELECT * 
    FROM question_otos
    WHERE type = 2
    ORDER BY RAND()
    LIMIT 7
)
UNION ALL
(
    SELECT * 
    FROM question_otos
    WHERE type = 3
    ORDER BY RAND()
    LIMIT 1
)
UNION ALL
(
    SELECT * 
    FROM question_otos
    WHERE type = 4
    ORDER BY RAND()
    LIMIT 1
)
UNION ALL
(
    SELECT * 
    FROM question_otos
    WHERE type = 5
    ORDER BY RAND()
    LIMIT 1
)
UNION ALL
(
    SELECT * 
    FROM question_otos
    WHERE type = 6
    ORDER BY RAND()
    LIMIT 2
)
UNION ALL
(
    SELECT * 
    FROM question_otos
    WHERE type = 7
    ORDER BY RAND()
    LIMIT 1
)
UNION ALL
(
    SELECT * 
    FROM question_otos
    WHERE type = 8
    ORDER BY RAND()
    LIMIT 10
)
UNION ALL
(
    SELECT * 
    FROM question_otos
    WHERE type = 9
    ORDER BY RAND()
    LIMIT 10
)) as q LEFT JOIN answer_otos ans ON q.id = ans.id_que;
  `;

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err });
    }

    const questions = {};
    results.forEach((row) => {
      if (!questions[row.id]) {
        questions[row.id] = {
          id: row.id,
          question_text: row.content,
          image_url: row.url,
          answers: [],
        };
      }
      questions[row.id].answers.push({
        answer_id: row.ans_id,
        answer_text: row.answer,
        is_correct: row.is_correct,
      });
    });

    res.json(Object.values(questions));
  });
});
// API để lấy câu hỏi từ database
app.get("/C_API", (req, res) => {
  const sql = `SELECT q.*, ans.id as ans_id, ans.content as answer, ans.is_correct 
    FROM (
    (
    SELECT * 
    FROM question_otos
    WHERE type = 0
    ORDER BY RAND()
    LIMIT 1
)
UNION ALL
(
    SELECT * 
    FROM question_otos
    WHERE type = 1
    ORDER BY RAND()
    LIMIT 1
)
UNION ALL
(
    SELECT * 
    FROM question_otos
    WHERE type = 2
    ORDER BY RAND()
    LIMIT 7
)
UNION ALL
(
    SELECT * 
    FROM question_otos
    WHERE type = 3
    ORDER BY RAND()
    LIMIT 1
)
UNION ALL
(
    SELECT * 
    FROM question_otos
    WHERE type = 4
    ORDER BY RAND()
    LIMIT 1
)
UNION ALL
(
    SELECT * 
    FROM question_otos
    WHERE type = 5
    ORDER BY RAND()
    LIMIT 1
)
UNION ALL
(
    SELECT * 
    FROM question_otos
    WHERE type = 6
    ORDER BY RAND()
    LIMIT 2
)
UNION ALL
(
    SELECT * 
    FROM question_otos
    WHERE type = 7
    ORDER BY RAND()
    LIMIT 1
)
UNION ALL
(
    SELECT * 
    FROM question_otos
    WHERE type = 8
    ORDER BY RAND()
    LIMIT 14
)
UNION ALL
(
    SELECT * 
    FROM question_otos
    WHERE type = 9
    ORDER BY RAND()
    LIMIT 11
)) as q LEFT JOIN answer_otos ans ON q.id = ans.id_que;
  `;

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err });
    }

    const questions = {};
    results.forEach((row) => {
      if (!questions[row.id]) {
        questions[row.id] = {
          id: row.id,
          question_text: row.content,
          image_url: row.url,
          answers: [],
        };
      }
      questions[row.id].answers.push({
        answer_id: row.ans_id,
        answer_text: row.answer,
        is_correct: row.is_correct,
      });
    });

    res.json(Object.values(questions));
  });
});
// Chạy server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server chạy trên cổng ${PORT}`);
});
