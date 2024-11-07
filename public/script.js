let score = 0;
let currentQuestion = "";
let correctAnswer = "";
let questionType = "";  // Store the question type

// Function to trigger confetti
function showConfetti() {
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ff0000', '#00ff00', '#0000ff', '#ff9900'],
    });
}

// Function to check the selected answer
function checkAnswer(selectedAnswer) {
    // Normalize the selected answer and correct answer for comparison
    const normalizedCorrectAnswer = correctAnswer.trim().toLowerCase();

    // Check if the selected answer matches the correct answer
    if (selectedAnswer.toLowerCase() === normalizedCorrectAnswer) {
        score++;
        document.getElementById("result").textContent = "Correct! 🎉";
        showConfetti(); // Show confetti on correct answer
    } else {
        document.getElementById("result").textContent = `Incorrect. The correct answer is: ${correctAnswer}`;
    }

    // Update the score
    document.getElementById("score").textContent = score;
}

// Function to get a new question from the server
async function newQuestion() {
    const level = localStorage.getItem("selectedLevel"); 
    const response = await fetch('/generate-question', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ level, type: questionType })
    });

    const data = await response.json();
    if (data.question) {
        currentQuestion = data.question;
        correctAnswer = data.correctAnswer;

        // Display the question
        document.getElementById("word-to-guess").textContent = currentQuestion;
        document.getElementById("result").textContent = '';

        // Generate options for the answer
        generateAnswerOptions(data.options);  // Assuming you have options in the response
    } else {
        document.getElementById("word-to-guess").textContent = "Error fetching question.";
    }

    document.getElementById("user-input").value = '';
}

// Function to generate answer options as buttons
function generateAnswerOptions(options) {
    const optionsContainer = document.getElementById("answer-options");
    optionsContainer.innerHTML = '';  // Clear existing options

    options.forEach(option => {
        const button = document.createElement("button");
        button.textContent = option;
        button.onclick = () => checkAnswer(option);  // Attach checkAnswer to each button
        optionsContainer.appendChild(button);
    });
}

// Function to select level
function selectLevel(level) {
    localStorage.setItem("selectedLevel", level);
    document.getElementById("level-selection").style.display = "none";
    document.getElementById("question-selection").style.display = "block";
}

// Function to start the game based on question type
function startGame(type) {
    questionType = type;
    document.getElementById("question-selection").style.display = "none";
    document.getElementById("game").style.display = "block";
    newQuestion();  // Fetch the first question
}

// Function to go back to level selection
function goBackToLevelSelection() {
    document.getElementById("question-selection").style.display = "none";
    document.getElementById("level-selection").style.display = "block";
}

// Function to go back to question selection
function goBackToQuestionSelection() {
    document.getElementById("game").style.display = "none";
    document.getElementById("question-selection").style.display = "block";
}
