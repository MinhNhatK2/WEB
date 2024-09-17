let currentQuestionIndex = 0;
let questions = [];

// Hàm gọi API để lấy danh sách câu hỏi từ server
function loadQuestions() {
  fetch("http://localhost:3000/questions")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      questions = data;
      displayQuestion(currentQuestionIndex);
      populateQuestionList();
    })
    .catch((error) => console.error("Lỗi khi lấy dữ liệu:", error));
}

// Hiển thị câu hỏi và đáp án
function displayQuestion(index) {
  const questionText = document.getElementById("question-text");
  const answerList = document.getElementById("answer-list");
  const questionImage = document.getElementById("question-image");

  const question = questions[index];

  questionText.textContent = question.question_text;
  answerList.innerHTML = "";

  if (question.image_url) {
    questionImage.src = question.image_url; // Hiển thị ảnh minh họa nếu có
    questionImage.style.display = "block";
  } else {
    questionImage.style.display = "none";
  }

  question.answers.forEach((answer, i) => {
    const li = document.createElement("li");
    li.textContent = answer.answer_text;
    answerList.appendChild(li);
  });
}

// Khai báo biến global để lưu trạng thái của câu hỏi được chọn
let selectedQuestionIndex = -1;

// Hiển thị danh sách câu hỏi
function populateQuestionList() {
  const questionList = document.getElementById("question-list");
  questionList.innerHTML = "";

  questions.forEach((q, index) => {
    const li = document.createElement("li");
    const button = document.createElement("button");
    button.textContent = `${index + 1}`;
    li.appendChild(button);

    // Xác định câu hỏi được chọn
    if (index === selectedQuestionIndex) {
      li.classList.add("selected");
    }

    button.onclick = () => {
      selectedQuestionIndex = index;
      displayQuestion(selectedQuestionIndex);

      // Xóa lớp 'selected' của tất cả các nút câu hỏi khác
      questionList.querySelectorAll("button").forEach((item) => {
        item.classList.remove("selected");
        item.style.fontWeight = "normal"; // Đặt lại kiểu văn bản về bình thường
        item.style.color = ""; // Đặt lại màu chữ về mặc định
        item.style.backgroundColor = "";
      });

      // Thêm lớp 'selected' cho nút câu hỏi được chọn
      button.classList.add("selected");
      button.style.fontWeight = "bold"; // Đổi kiểu văn bản thành in đậm
      button.style.color = "black"; // Đổi màu chữ của nút khi được chọn
      button.style.backgroundColor = "#0c5485";
    };

    questionList.appendChild(li);
  });
}

// Hàm xử lý nút "Câu trước"
document.getElementById("pre-button").onclick = () => {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    displayQuestion(currentQuestionIndex);
  }
};

// Hàm xử lý nút "Câu sau"
document.getElementById("next-button").onclick = () => {
  if (currentQuestionIndex < questions.length - 1) {
    currentQuestionIndex++;
    displayQuestion(currentQuestionIndex);
  }
};

// Load câu hỏi khi trang được tải
loadQuestions();
