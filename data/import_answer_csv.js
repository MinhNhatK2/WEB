const fs = require("fs");
const csv = require("csv-parser");
const { answer_oto } = require("../models"); // Đảm bảo rằng bạn đã cấu hình đúng mô hình Sequelize

// Đường dẫn tới file CSV
const csvFilePath = "./answers_oto.csv";

// Đọc file CSV và thêm dữ liệu vào cơ sở dữ liệu
fs.createReadStream(csvFilePath)
  .pipe(csv())
  .on("data", async (row) => {
    try {
      // Chèn từng dòng CSV vào CSDL thông qua Sequelize
      await answer_oto.create({
        id_que: row.id_que,
        content: row.content,
        is_correct: row.is_correct,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      console.log(`Thêm thành công: ${row.id_que}`);
    } catch (error) {
      console.error(`Lỗi khi thêm ${row.id_que}: ${error.message}`);
    }
  })
  .on("end", () => {
    console.log("Đã đọc file CSV thành công và thêm vào cơ sở dữ liệu.");
  });
