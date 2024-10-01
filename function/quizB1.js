let currentQuestionIndex = 0;
let questions = [];
let userAnswers = {}; // Lưu trữ lựa chọn đáp án của người dùng
let type0QuestionIndices = []; // Mảng để lưu index của câu hỏi type 0

// Hàm gọi API để lấy danh sách câu hỏi từ server
function loadQuestions() {
  fetch("https://query-api.vercel.app/B1_API")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      questions = data;

      // Lọc các câu hỏi type 0 và lưu index vào mảng
      questions.forEach((question, index) => {
        if (question.type === 0) {
          type0QuestionIndices.push(index);
        }
      });

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

  // Tạo các radio button cho đáp án
  question.answers.forEach((answer) => {
    const li = document.createElement("li");
    const label = document.createElement("label");
    const input = document.createElement("input");

    input.type = "radio";
    input.name = "answer";
    input.value = answer.answer_id;

    // Kiểm tra nếu người dùng đã chọn đáp án này trước đó
    if (userAnswers[question.id] === answer.answer_id) {
      input.checked = true;
    }

    label.appendChild(input);
    label.appendChild(document.createTextNode(answer.answer_text));
    li.appendChild(label);
    answerList.appendChild(li);
  });

  highlightSelectedQuestion(index); // Highlight câu hỏi hiện tại
  saveUserAnswer(index); // Lưu đáp án khi hiển thị câu hỏi và đánh dấu câu hỏi đã làm
}

// Lưu đáp án của người dùng
function saveUserAnswer(index) {
  const question = questions[index];
  const selectedOption = document.querySelector('input[name="answer"]:checked');

  if (selectedOption) {
    userAnswers[question.id] = parseInt(selectedOption.value);
    markQuestionAsAnswered(index); // Đánh dấu câu hỏi đã làm
  }
}

// Đánh dấu câu hỏi đã làm và đổi màu
function markQuestionAsAnswered(index) {
  const questionButtons = document.querySelectorAll("#question-list button");
  const button = questionButtons[index];

  // Kiểm tra xem người dùng đã trả lời câu hỏi hay chưa
  if (userAnswers[questions[index].id]) {
    button.classList.add("answered"); // Thêm class "answered" để đổi màu
  }
}

function populateQuestionList() {
  const questionList = document.getElementById("question-list");
  questionList.innerHTML = "";

  questions.forEach((q, index) => {
    const li = document.createElement("li");
    const button = document.createElement("button");
    button.textContent = `${index + 1}`;
    li.appendChild(button);

    button.onclick = () => {
      saveUserAnswer(currentQuestionIndex); // Lưu đáp án trước khi chuyển câu hỏi
      currentQuestionIndex = index;
      displayQuestion(currentQuestionIndex);
    };

    questionList.appendChild(li);

    // Kiểm tra và đánh dấu các câu hỏi đã trả lời
    markQuestionAsAnswered(index);
  });

  highlightSelectedQuestion(currentQuestionIndex); // Highlight câu hiện tại
}

// Highlight ô câu hỏi hiện tại
function highlightSelectedQuestion(index) {
  const buttons = document.querySelectorAll("#question-list button");
  buttons.forEach((btn, idx) => {
    if (idx === index) {
      btn.style.backgroundColor = "#007bff"; // Highlight màu xanh
      btn.style.color = "white";
    } else {
      btn.style.backgroundColor = ""; // Màu nền mặc định
      btn.style.color = "";
    }
  });
}

// Hàm chấm điểm sau khi nộp bài
function gradeQuiz() {
  let score = 0;
  let wrongType0 = false; // Biến đánh dấu nếu câu hỏi type 0 sai

  questions.forEach((question) => {
    const correctAnswer = question.answers.find((answer) => answer.is_correct); // Tìm đáp án đúng
    const userAnswer = userAnswers[question.id]; // Lấy đáp án mà người dùng chọn

    if (userAnswer === correctAnswer.answer_id) {
      score++; // Tăng điểm nếu đáp án đúng
    }

    // Kiểm tra nếu là câu hỏi type 0 và người dùng đã chọn sai
    if (question.type === 0 && userAnswer !== correctAnswer.answer_id) {
      wrongType0 = true; // Đánh dấu rằng có câu hỏi type 0 sai
    }
  });

  return { score, wrongType0 }; // Trả về đối tượng với điểm số và trạng thái câu hỏi type 0
}

function submitQuiz() {
  closeConfirmPopup(); // Tắt popup xác nhận

  saveUserAnswer(currentQuestionIndex); // Lưu đáp án cuối cùng

  const { score, wrongType0 } = gradeQuiz(); // Chấm điểm
  const testResult = evaluateTestResult(); // Kiểm tra kết quả Đạt/Trượt

  // Lưu kết quả và danh sách câu hỏi vào sessionStorage để chuyển sang trang kết quả
  sessionStorage.setItem("quizScore", score);
  sessionStorage.setItem("quizTotalQuestions", questions.length);
  sessionStorage.setItem("quizResult", testResult);
  sessionStorage.setItem("userAnswers", JSON.stringify(userAnswers));
  sessionStorage.setItem(
    "correctAnswers",
    JSON.stringify(
      questions.map((q) => ({
        questionId: q.id,
        correctAnswer: q.answers.find((a) => a.is_correct).answer_id,
      }))
    )
  );
  sessionStorage.setItem("questionsData", JSON.stringify(questions)); // Lưu danh sách câu hỏi
  // Hiển thị hộp thoại thông báo kết quả
  document.getElementById(
    "result-message"
  ).textContent = `Kết quả của bạn: ${score}/${questions.length} - ${testResult}`;
  // Thay đổi hình ảnh dựa trên kết quả
  const resultImage = document.getElementById("result-image");
  if (testResult === "Đạt") {
    resultImage.src = "https://cdn-icons-png.flaticon.com/512/8832/8832119.png"; // Đường dẫn đến hình ảnh dấu tích xanh
  } else {
    resultImage.src =
      "https://freepngimg.com/thumb/red_cross_mark/5-2-red-cross-mark-download-png.png"; // Đường dẫn đến hình ảnh dấu "X" đỏ
  }
  resultImage.style.display = "block"; // Hiển thị hình ảnh

  // Thêm lớp show để kích hoạt hiệu ứng
  setTimeout(() => {
    resultImage.classList.add("show");
  }, 10); // Thêm độ trễ nhỏ để đảm bảo hiệu ứng chuyển đổi hoạt động
  document.getElementById("result-popup").style.display = "flex"; // Hiển thị hộp thoại

  // Ngăn chặn chuyển hướng ngay lập tức
}

// Chuyển hướng sang trang kết quả
function goToResultPage() {
  window.location.href = "ketqua.html";
}

// Gắn sự kiện cho nút "Câu trước"
document.getElementById("pre-button").onclick = () => {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    displayQuestion(currentQuestionIndex);
  }
};

// Gắn sự kiện cho nút "Câu sau"
document.getElementById("next-button").onclick = () => {
  if (currentQuestionIndex < questions.length - 1) {
    currentQuestionIndex++;
    displayQuestion(currentQuestionIndex);
  }
};

// Gắn sự kiện vào nút "Nộp bài"
document.getElementById("submit-quiz").onclick = () => {
  showConfirmPopup(); // Hiển thị popup xác nhận
};

// Hiển thị popup xác nhận nộp bài
function showConfirmPopup() {
  document.getElementById("confirm-popup").style.display = "flex"; // Hiển thị popup
}

// Đóng popup xác nhận
function closeConfirmPopup() {
  document.getElementById("confirm-popup").style.display = "none"; // Ẩn popup
}

// Đồng hồ đếm ngược
function startTimer() {
  const countdownElement = document.getElementById("countdown");
  let timeRemaining = 20 * 60; // 19 phút

  const timer = setInterval(() => {
    if (timeRemaining <= 0) {
      clearInterval(timer);
      alert("Hết giờ! Nộp bài ngay!");
      submitQuiz();
      return;
    }

    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    countdownElement.textContent = `${minutes}:${
      seconds < 10 ? "0" + seconds : seconds
    }`;
    timeRemaining--;
  }, 1000);
}

function evaluateTestResult() {
  const { score, wrongType0 } = gradeQuiz(); // Lấy điểm và trạng thái câu hỏi type 0
  const totalQuestions = questions.length;

  if (score >= 27 && !wrongType0) {
    return "Đạt"; // Thi đạt nếu đúng trên 21 câu và không sai câu type 0
  } else {
    return "Trượt"; // Thi trượt trong các trường hợp còn lại
  }
}

window.onload = () => {
  loadQuestions(); // Tải câu hỏi từ API
  startTimer(); // Bắt đầu đếm ngược thời gian

  // Sau khi tải câu hỏi, kiểm tra và đánh dấu các câu hỏi đã trả lời
  populateQuestionList();
};
