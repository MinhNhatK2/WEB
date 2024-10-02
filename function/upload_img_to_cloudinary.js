const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const path = require("path");

// Cấu hình Cloudinary với thông tin tài khoản của bạn
cloudinary.config({
  cloud_name: "dm2nj7sub",
  api_key: "242687247938237",
  api_secret: "SW0tpczdAsLS7vWwaJoEWnb-KrI",
});

// Hàm để upload từng file
const uploadFile = (filePath) => {
  cloudinary.uploader.upload(
    filePath,
    {
      folder: "img_oto",
      use_filename: true, // Giữ nguyên tên file
      unique_filename: false, // Không thêm mã định danh ngẫu nhiên vào tên file
      overwrite: false, // Không ghi đè file đã có cùng tên
    },
    (error, result) => {
      if (error) {
        console.error("Lỗi upload:", error);
      } else {
        console.log("Upload thành công:", result.url);
      }
    }
  );
};

// Hàm upload tất cả file trong thư mục
const uploadFolder = (folderPath) => {
  fs.readdir(folderPath, (err, files) => {
    if (err) {
      console.error("Lỗi đọc thư mục:", err);
      return;
    }

    files.forEach((file) => {
      const filePath = path.join(folderPath, file);

      // Kiểm tra xem file có phải là ảnh không
      if (/\.(jpg|jpeg|png|gif)$/i.test(file)) {
        uploadFile(filePath);
      }
    });
  });
};

// Gọi hàm uploadFolder với đường dẫn tới thư mục của bạn
const folderPath = path.join(__dirname, "../data_img"); // Thay 'path_to_your_folder' bằng đường dẫn thực tế
uploadFolder(folderPath);
