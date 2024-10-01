const fs = require("fs");
const csv = require("csv-parser");
const { question_oto } = require("../models");
// Đường dẫn tới file CSV
const csvFilePath = "./question_oto_final.csv";

// Đọc file CSV và thêm dữ liệu vào cơ sở dữ liệu
fs.createReadStream(csvFilePath)
  .pipe(csv())
  .on("data", async (row) => {
    try {
      // Chèn từng dòng CSV vào CSDL thông qua Sequelize
      await question_oto.create({
        id: row.id,
        type: row.type,
        content: row.content,
        url: row.URL,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      console.log(`Thêm thành công: ${row.id}`);
    } catch (error) {
      console.error(`Lỗi khi thêm ${row.id}: , ${error.message}`);
    }
  })
  .on("end", () => {
    console.log("Đã đọc file CSV thành công và thêm vào cơ sở dữ liệu.");
  });
