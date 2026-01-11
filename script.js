
let questions = [];
let index = 0;
let score = 0;
let timer;
let timeLeft = 10;

// Load questions from API
async function loadQuestions() {
    try {
        const res = await fetch("https://the-trivia-api.com/api/questions?limit=10");
        const data = await res.json();

        questions = data.map(q => ({
            question: q.question,
            correct_answer: q.correctAnswer,
            incorrect_answers: q.incorrectAnswers
        }));

        index = 0;
        score = 0;

        document.getElementById("scoreBox").innerHTML = "";
        document.getElementById("nextBtn").style.display = "block";

        showQuestion();
    } catch (err) {
        console.log("API ERROR:", err);
        document.getElementById("question").innerHTML = "Failed to load questions!";
    }
}

function startTimer() {
    timeLeft = 10;
    document.getElementById("time").innerText = timeLeft;

    timer = setInterval(() => {
        timeLeft--;
        document.getElementById("time").innerText = timeLeft;

        if (timeLeft === 0) {
            clearInterval(timer);
            lockOptions();
            showCorrect();
            document.getElementById("nextBtn").disabled = false;
        }
    }, 1000);
}

function showQuestion() {
    clearInterval(timer);

    const q = questions[index];

    document.getElementById("question").innerHTML = q.question;

    const options = [...q.incorrect_answers, q.correct_answer];
    shuffle(options);

    let optionHTML = "";
    options.forEach(opt => {
        optionHTML += `<button onclick="checkAnswer(this, '${q.correct_answer}')">${opt}</button>`;
    });

    document.getElementById("options").innerHTML = optionHTML;
    document.getElementById("nextBtn").disabled = true;

    startTimer();
}

function checkAnswer(button, correct) {
    clearInterval(timer);

    let allBtns = document.querySelectorAll("#options button");
    allBtns.forEach(btn => btn.disabled = true);

    if (button.innerHTML === correct) {
        button.classList.add("correct");
        score++;
    } else {
        button.classList.add("wrong");
        showCorrect();
    }

    document.getElementById("nextBtn").disabled = false;
}

function showCorrect() {
    let allBtns = document.querySelectorAll("#options button");
    allBtns.forEach(btn => {
        if (btn.innerHTML === questions[index].correct_answer) {
            btn.classList.add("correct");
        }
    });
}

function lockOptions() {
    document.querySelectorAll("#options button").forEach(btn => btn.disabled = true);
}

document.getElementById("nextBtn").addEventListener("click", () => {
    index++;
    if (index < questions.length) {
        showQuestion();
    } else {
        endQuiz();
    }
});

function endQuiz() {
    clearInterval(timer);

    // Update question text
    document.getElementById("question").innerHTML = `Quiz Completed!`;

    // Hide next button
    document.getElementById("nextBtn").style.display = "none";

    // Show score
    document.getElementById("scoreBox").innerHTML = `Your Score: ${score} / 10`;

    // Replace options area with new quiz button
    document.getElementById("options").innerHTML = `
        <button id="newQuizBtn" style="
            padding: 12px;
            width: 100%;
            background: #2e7d32;
            color: white;
            border: none;
            border-radius: 10px;
            font-size: 18px;
            cursor: pointer;
            margin-top: 15px;
        ">Start New Quiz</button>
    `;

    // Restart quiz
    document.getElementById("newQuizBtn").addEventListener("click", () => {
        document.getElementById("nextBtn").style.display = "block";
        document.getElementById("scoreBox").innerHTML = "";
        loadQuestions();
    });
}


function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
}

loadQuestions();
