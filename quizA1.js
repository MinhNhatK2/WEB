let currentQuestionIndex = 0;
let questions = [];

// Hàm gọi API để lấy danh sách câu hỏi từ server
function loadQuestions() {
  fetch("http://localhost:3000/questions")
    .then((response) => response.json())
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

  // Nếu có ảnh minh họa, hiển thị ảnh, nếu không thì ẩn ảnh
  if (question.image_url) {
    questionImage.src = question.image_url;
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

// Hiển thị danh sách câu hỏi
function populateQuestionList() {
  const questionList = document.getElementById("question-list");
  questionList.innerHTML = "";

  questions.forEach((q, index) => {
    const li = document.createElement("li");
    li.textContent = `${index + 1}`;
    li.onclick = () => {
      currentQuestionIndex = index;
      displayQuestion(currentQuestionIndex);
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
