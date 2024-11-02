let currentQuestionIndex = 0;
let questions = [];
let userAnswers = {}; // Lưu trữ lựa chọn đáp án của người dùng
let type0QuestionIndices = []; // Mảng để lưu index của câu hỏi type 0
let timerB2; // Biến lưu trữ timer
let timeRemainingB2; // Biến lưu trữ thời gian còn lại

// Lưu loại bài thi vào sessionStorage khi bắt đầu thi
sessionStorage.setItem("currentExam", "B2");
const currentExam = sessionStorage.getItem("currentExam");

// Hàm gọi API để lấy danh sách câu hỏi từ server
function loadQuestions() {
  const savedQuestions = sessionStorage.getItem(`questions_${currentExam}`);
  const savedUserAnswers = sessionStorage.getItem(`userAnswers_${currentExam}`);

  if (savedQuestions) {
    questions = JSON.parse(savedQuestions);
    if (savedUserAnswers) {
      userAnswers = JSON.parse(savedUserAnswers);
    }
    displayQuestion(currentQuestionIndex);
    populateQuestionList();
  } else {
    fetch(`https://query-api.vercel.app/${currentExam}_API`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        questions = data;
        sessionStorage.setItem(
          `questions_${currentExam}`,
          JSON.stringify(questions)
        );
        sessionStorage.setItem(
          `userAnswers_${currentExam}`,
          JSON.stringify(userAnswers)
        );

        displayQuestion(currentQuestionIndex);
        populateQuestionList();
      })
      .catch((error) => console.error("Lỗi khi lấy dữ liệu:", error));
  }
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
    questionImage.src = question.image_url;
    questionImage.style.display = "block";
  } else {
    questionImage.style.display = "none";
  }

  question.answers.forEach((answer) => {
    const li = document.createElement("li");
    const label = document.createElement("label");
    const input = document.createElement("input");

    input.type = "radio";
    input.name = "answer";
    input.value = answer.answer_id;

    if (userAnswers[question.id] === answer.answer_id) {
      input.checked = true;
    }

    label.appendChild(input);
    label.appendChild(document.createTextNode(answer.answer_text));
    li.appendChild(label);
    answerList.appendChild(li);
  });

  highlightSelectedQuestion(index);
}

// Lưu đáp án của người dùng
function saveUserAnswer(index) {
  const question = questions[index];
  const selectedOption = document.querySelector('input[name="answer"]:checked');

  if (selectedOption) {
    userAnswers[question.id] = parseInt(selectedOption.value);
  } else {
    delete userAnswers[question.id];
  }

  sessionStorage.setItem(
    `userAnswers_${currentExam}`,
    JSON.stringify(userAnswers)
  );

  markQuestionAsAnswered(index);
}

// Đánh dấu câu hỏi đã làm và đổi màu
function markQuestionAsAnswered(index) {
  const questionButtons = document.querySelectorAll("#question-list button");
  const button = questionButtons[index];

  if (userAnswers[questions[index].id]) {
    button.classList.add("answered");
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
      saveUserAnswer(currentQuestionIndex);
      currentQuestionIndex = index;
      displayQuestion(currentQuestionIndex);
    };

    questionList.appendChild(li);

    markQuestionAsAnswered(index);
  });

  highlightSelectedQuestion(currentQuestionIndex);
}

// Highlight ô câu hỏi hiện tại
function highlightSelectedQuestion(index) {
  const buttons = document.querySelectorAll("#question-list button");
  buttons.forEach((btn, idx) => {
    if (idx === index) {
      btn.style.backgroundColor = "#007bff";
      btn.style.color = "white";
    } else {
      btn.style.backgroundColor = "";
      btn.style.color = "";
    }
  });
}

// Hàm chấm điểm sau khi nộp bài
function gradeQuiz() {
  let score = 0;
  let wrongType0 = false;

  questions.forEach((question) => {
    const correctAnswer = question.answers.find((answer) => answer.is_correct);
    const userAnswer = userAnswers[question.id];

    if (userAnswer === correctAnswer.answer_id) {
      score++;
    }

    if (question.type === 0 && userAnswer !== correctAnswer.answer_id) {
      wrongType0 = true;
    }
  });

  return { score, wrongType0 };
}

function submitQuiz() {
  closeConfirmPopup();

  saveUserAnswer(currentQuestionIndex);
  sessionStorage.removeItem(`questions_${currentExam}`);
  sessionStorage.removeItem("timeRemainingB2"); // Xóa thời gian khi nộp bài

  const { score, wrongType0 } = gradeQuiz();
  const testResult = evaluateTestResult();

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
  sessionStorage.setItem("questionsData", JSON.stringify(questions));

  document.getElementById(
    "result-message"
  ).textContent = `Kết quả của bạn: ${score}/${questions.length} - ${testResult}`;

  const resultImage = document.getElementById("result-image");
  resultImage.src =
    testResult === "Đạt"
      ? "https://cdn-icons-png.flaticon.com/512/8832/8832119.png"
      : "https://freepngimg.com/thumb/red_cross_mark/5-2-red-cross-mark-download-png.png";

  resultImage.style.display = "block";
  setTimeout(() => resultImage.classList.add("show"), 10);

  document.getElementById("result-popup").style.display = "flex";

  // Reset lại thời gian về giá trị gốc sau khi nộp bài
  timeRemainingB2 = 22 * 60;
}

function goToResultPage() {
  window.location.href = "ketqua.html";
}

document.getElementById("pre-button").onclick = () => {
  saveUserAnswer(currentQuestionIndex);
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    displayQuestion(currentQuestionIndex);
  }
};

document.getElementById("next-button").onclick = () => {
  saveUserAnswer(currentQuestionIndex);
  if (currentQuestionIndex < questions.length - 1) {
    currentQuestionIndex++;
    displayQuestion(currentQuestionIndex);
  }
};

document.getElementById("submit-quiz").onclick = () => {
  showConfirmPopup();
};

function showConfirmPopup() {
  document.getElementById("confirm-popup").style.display = "flex";
}

function closeConfirmPopup() {
  document.getElementById("confirm-popup").style.display = "none";
}

// Đồng hồ đếm ngược
function startTimer() {
  const countdownElement = document.getElementById("countdown");

  const savedTime = sessionStorage.getItem("timeRemainingB2");
  timeRemainingB2 = savedTime ? parseInt(savedTime) : 22 * 60;

  timerB2 = setInterval(() => {
    if (timeRemainingB2 <= 0) {
      clearInterval(timerB2);
      submitQuiz();
      return;
    }

    const minutes = Math.floor(timeRemainingB2 / 60);
    const seconds = timeRemainingB2 % 60;
    countdownElement.textContent = `${minutes}:${
      seconds < 10 ? "0" + seconds : seconds
    }`;
    timeRemainingB2--;

    sessionStorage.setItem("timeRemainingB2", timeRemainingB2);
  }, 1000);
}

// Đánh giá kết quả bài thi
function evaluateTestResult() {
  const { score, wrongType0 } = gradeQuiz();
  const totalQuestions = questions.length;

  return score >= 32 && !wrongType0 ? "Đạt" : "Trượt";
}

window.onbeforeunload = () => {
  sessionStorage.setItem("timeRemainingB2", timeRemainingB2);
};

window.onload = () => {
  loadQuestions();
  startTimer();
  populateQuestionList();
};
