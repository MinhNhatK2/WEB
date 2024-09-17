const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());

// Kết nối tới MySQL
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "123456",
  database: "my_database",
});

db.connect((err) => {
  if (err) {
    console.error("Lỗi kết nối:", err);
    return;
  }
  console.log("Kết nối MySQL thành công");
});

// API để lấy câu hỏi từ database
app.get("/questions", (req, res) => {
  const sql = `
    select q.*, ans.id as ans_id, ans.content as answer, ans.is_correct from(
(
    SELECT * 
    FROM question_motos
    WHERE type = 0
    ORDER BY RAND()
    LIMIT 1
)
UNION ALL
(
    SELECT * 
    FROM question_motos
    WHERE type = 1
    ORDER BY RAND()
    LIMIT 8
)
UNION ALL
(
    SELECT * 
    FROM question_motos
    WHERE type = 2
    ORDER BY RAND()
    LIMIT 1
)
UNION ALL
(
    SELECT * 
    FROM question_motos
    WHERE type = 3
    ORDER BY RAND()
    LIMIT 1
)
UNION ALL
(
    SELECT * 
    FROM question_motos
    WHERE type = 4
    ORDER BY RAND()
    LIMIT 7
)
UNION ALL
(
    SELECT * 
    FROM question_motos
    WHERE type = 5
    ORDER BY RAND()
    LIMIT 7
)) as q
left join answer_motos ans on q.id = ans.id_que;
  `;

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err });
    }

    const questions = {};
    results.forEach((row) => {
      if (!questions[row.id]) {
        questions[row.id] = {
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
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server chạy trên cổng ${PORT}`);
});
