// Screens
const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");

// Buttons
const startBtn = document.getElementById("start-btn");
const nextBtn = document.getElementById("next-btn");
const restartBtn = document.getElementById("restart-btn");

// Quiz elements
const questionText = document.getElementById("question-text");
const answersEl = document.getElementById("answers");
const questionNumberEl = document.getElementById("question-number");
const scoreEl = document.getElementById("score");
const finalScoreEl = document.getElementById("final-score");

// App state
let state = {
  questions: [],
  currentIndex: 0,
  score: 0,
};

// Utility: switch visible screen
function showScreen(screen) {
  [startScreen, quizScreen, resultScreen].forEach((s) =>
    s.classList.remove("active")
  );
  screen.classList.add("active");
}

// Decode HTML entities
function decodeHTMLEntities(text) {
  const textarea = document.createElement("textarea");
  textarea.innerHTML = text;
  return textarea.value;
}

// Fetch questions
async function fetchQuestions() {
  const res = await fetch(
    "https://opentdb.com/api.php?amount=10&type=multiple"
  );
  const data = await res.json();
  return data.results;
}

// Start quiz
startBtn.addEventListener("click", async () => {
  state.questions = await fetchQuestions();
  state.currentIndex = 0;
  state.score = 0;
  scoreEl.textContent = "Score: 0";
  showScreen(quizScreen);
  renderQuestion();
});

// Render question
function renderQuestion() {
  nextBtn.disabled = true;
  answersEl.innerHTML = "";

  const question = state.questions[state.currentIndex];

  questionNumberEl.textContent = `Question ${state.currentIndex + 1}/${
    state.questions.length
  }`;

  questionText.textContent = decodeHTMLEntities(question.question);

  const answers = [...question.incorrect_answers, question.correct_answer].map(
    decodeHTMLEntities
  );

  answers.sort(() => Math.random() - 0.5);

  answers.forEach((answer) => {
    const btn = document.createElement("button");
    btn.className = "answer-btn";
    btn.textContent = answer;

    btn.addEventListener("click", () =>
      selectAnswer(btn, answer, decodeHTMLEntities(question.correct_answer))
    );

    answersEl.appendChild(btn);
  });
}

// Handle answer selection
function selectAnswer(button, selected, correct) {
  nextBtn.disabled = false;

  document.querySelectorAll(".answer-btn").forEach((btn) => {
    btn.disabled = true;
    if (btn.textContent === correct) btn.classList.add("correct");
  });

  if (selected === correct) {
    state.score++;
    scoreEl.textContent = `Score: ${state.score}`;
  } else {
    button.classList.add("wrong");
  }
}

// Next question
nextBtn.addEventListener("click", () => {
  state.currentIndex++;
  if (state.currentIndex < state.questions.length) {
    renderQuestion();
  } else {
    finalScoreEl.textContent = `You scored ${state.score} / ${state.questions.length}`;
    showScreen(resultScreen);
  }
});

// Restart quiz
restartBtn.addEventListener("click", () => {
  showScreen(startScreen);
});
