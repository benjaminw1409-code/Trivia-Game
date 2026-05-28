let currentSelectedCategory = ""; 
let currentType = "";
let currentCorrectAnswer = "";
let roundNumber = 1;
let qNumber = 0;
let currentPoints = 0;
let maxTime = 15;
let timeLeft = 15;
let timerInterval;
let pointsThreshold = [3000,5000,7000];
let roundTimes = [15,10,5];
let numQuestions = 10;

// Initialize screens
const titleScreen = document.getElementById('title-screen');
const wheelScreen = document.getElementById('wheel-screen');
const mcQuestionScreen = document.getElementById('mc-question-screen');
const tfQuestionScreen = document.getElementById('tf-question-screen');
const fitbQuestionScreen = document.getElementById('fitb-question-screen');
const cAnswerScreen = document.getElementById('correct-answer-screen');
const icAnswerScreen = document.getElementById('incorrect-answer-screen'); 
const judgementScreen = document.getElementById('judgement-screen');
const youWinScreen = document.getElementById('game-won-screen');
const rulesScreen = document.getElementById('rules-screen');


const spinButton = document.getElementById('spinButton');
const continueButton = document.getElementById('continueButton');
const wheelImage = document.querySelector('.wheel-image');
const mcButtons = document.querySelectorAll('#mc-question-screen .btn');
const tfButtons = document.querySelectorAll('#tf-question-screen .btn');
const nextButtons = document.querySelectorAll('.nextQButton');

const fitbForm = document.getElementById('fitb-form');
const fitbInput = document.getElementById('answer');

const gameTextContainer = document.getElementById('game-text-container');
const globalGameText = document.getElementById('global-game-text');


wheelScreen.style.display = 'none';

async function getRandomQuestion(categoryName) {
    try {
        //load json
        var response = await fetch('./questions (1).json');
        var data = await response.json();
        var categoryArray = data[categoryName];
        if (!categoryArray) {
            console.error(`Category "${categoryName}" not found in JSON!`);
            return null;
        }
        var numQuestions = categoryArray.length;
        //random index to select question
        var qId = Math.floor(Math.random() * numQuestions);
        //loads array of questions in a category
        var questionArray = categoryArray[qId];
        if (!questionArray) {
            console.error("Question ID not found!");
            return null;
        }

        //returns array with question, answers, type based on selected question type
        if (questionArray.type === "multiple_choice") {
            return [
                questionArray.question, 
                questionArray.options[0], 
                questionArray.options[1], 
                questionArray.options[2], 
                questionArray.options[3],
                questionArray.answer,
                questionArray.type
            ];
        } else if (questionArray.type === "true_false") {
            return [questionArray.question, questionArray.answer, questionArray.type];
        }
        if (questionArray.type === "fill_in_the_blank"){
            return [questionArray.question, questionArray.answer, questionArray.type];
        }
    } catch (error) {
        console.error("Error loading JSON:", error);
    }
}

async function displayQuestion(selectedCategory) {
    startQuestionTimer();
    
    var qTypeQuestion = await getRandomQuestion(selectedCategory);
    
    //obtains question type
    var qType = qTypeQuestion[qTypeQuestion.length - 1];
    currentType = qType;
    currentCorrectAnswer = qTypeQuestion[qTypeQuestion.length - 2];

    if (qType === "multiple_choice") {
        mcQuestionScreen.style.display = 'block';
        tfQuestionScreen.style.display = 'none'; 
        fitbQuestionScreen.style.display = 'none';
        
        var questionElement = document.getElementById('mcq-question-text');
        var a1Element = document.getElementById('a1OutputArea');
        var a2Element = document.getElementById('a2OutputArea');
        var a3Element = document.getElementById('a3OutputArea');
        var a4Element = document.getElementById('a4OutputArea');
        
        try {
            questionElement.innerText = qTypeQuestion[0];
            a1Element.innerText = qTypeQuestion[1];
            a2Element.innerText = qTypeQuestion[2];
            a3Element.innerText = qTypeQuestion[3];
            a4Element.innerText = qTypeQuestion[4];
        } catch (error) {
            questionElement.innerText = "Oops! Couldn't load a question. " + selectedCategory;
            console.error(error);
        }
    }
    
    if (qType === "true_false") {
        var questionElement = document.getElementById('tf-question-text');
        tfQuestionScreen.style.display = 'block';
        mcQuestionScreen.style.display = 'none';
        fitbQuestionScreen.style.display = 'none';
        
        questionElement.innerText = qTypeQuestion[0];
    }
    if (qType === "fill_in_the_blank") {
        var questionElement = document.getElementById('fitb-question-text');
        tfQuestionScreen.style.display = 'none';
        mcQuestionScreen.style.display = 'none';
        fitbQuestionScreen.style.display = 'block';
        
        questionElement.innerText = qTypeQuestion[0];
    }
}

function updateUI() {
    globalGameText.innerText = "Current Points: " + currentPoints + " Points Threshold: " + pointsThreshold[roundNumber - 1] +  " Round Number: " + roundNumber + " Question Number: " + qNumber + "/" + numQuestions + " Time Left: " + timeLeft;
}

function startQuestionTimer() {
    if(roundNumber === 1){
        maxTime = 15;
    }
    else if(roundNumber === 2){
        maxTime = 10;
    }
    else if(roundNumber === 3){
        maxTime = 5;
    }
    timeLeft = maxTime;

    clearInterval(timerInterval);

    timerInterval = setInterval(() => {
        timeLeft--;
        updateUI();
        // If time runs out automatically mark it wrong
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            checkAnswer("");
        }
    }, 1000);
}

function checkAnswer(selectedAnswer) {
 
    clearInterval(timerInterval); 
    
    tfQuestionScreen.style.display = 'none';
    mcQuestionScreen.style.display = 'none';
    fitbQuestionScreen.style.display = 'none';
    //assigns points based on time left
    if (selectedAnswer.toLowerCase() === currentCorrectAnswer.toLowerCase()) {
        currentPoints = currentPoints + Math.floor((1000) * (timeLeft / maxTime));
        updateUI();
        cAnswerScreen.style.display = 'block';
    } 
    else {
        var ansElement = document.getElementById('correct-answer-text');
        icAnswerScreen.style.display = 'block';
        ansElement.innerText = "You said: " + selectedAnswer + "\n\nCorrect Answer:" + " " + currentCorrectAnswer;
    }
    
    timeLeft= maxTime;
    updateUI();
    //clears input
    fitbInput.value = "";
}

function issueJudgement(){
    //Judges whether player passes each round
    var judgementTextElement = document.getElementById('judgement-text');

    titleScreen.style.display = 'none';
    rulesScreen.style.display = 'none';
    wheelScreen.style.display = 'none';
    mcQuestionScreen.style.display = 'none'; 
    tfQuestionScreen.style.display = 'none';
    fitbQuestionScreen.style.display = 'none';
    cAnswerScreen.style.display = 'none';
    icAnswerScreen.style.display = 'none';
    judgementScreen.style.display = 'block';
    youWinScreen.style.display = 'none';
    gameTextContainer.style.display = 'none';
    var nextRoundButton = document.getElementById("nextRoundButton");

    if(roundNumber === 3){
        judgementTextElement.innerText = "You Won!";
        document.getElementById('nextRoundButton').addEventListener('click', newGame);
    }

    else if(currentPoints <= pointsThreshold[roundNumber - 1]){
        judgementTextElement.innerText = "You Lose";
        document.getElementById('nextRoundButton').addEventListener('click', newGame);
    }
    else{
        judgementTextElement.innerText = "Good Job!\n" + currentPoints + " >= " + pointsThreshold[roundNumber - 1];
        document.getElementById('nextRoundButton').addEventListener('click', nextRound);
    }
    
}

function nextRound() {
    //resets for each round
    roundNumber++;
    currentPoints = 0;
    maxTime = roundTimes[roundNumber - 1];
    qNumber = 0;
    updateUI();
    startGame();
}

function newGame(){
    //resets after each game
    titleScreen.style.display = 'block';
    rulesScreen.style.display = 'none';
    wheelScreen.style.display = 'none';
    mcQuestionScreen.style.display = 'none'; 
    tfQuestionScreen.style.display = 'none';
    fitbQuestionScreen.style.display = 'none';
    cAnswerScreen.style.display = 'none';
    icAnswerScreen.style.display = 'none';
    judgementScreen.style.display = 'none';
    youWinScreen.style.display = 'none';
    gameTextContainer.style.display = 'none';
    maxTime = roundTimes[roundNumber - 1];
    qNumber = 0;
    currentSelectedCategory = ""; 
    currentType = "";
    currentCorrectAnswer = "";
    roundNumber = 1;
    qNumber = 0;
    currentPoints = 0;
    gameTextContainer.style.display = 'none';
    document.getElementById('rulesButton').addEventListener('click', readRules);
    updateUI();
}

function readRules() {
    //displays rules
    titleScreen.style.display = 'none';
    rulesScreen.style.display = 'block';
    document.getElementById('doneButton').addEventListener('click', newGame);
}

function startGame() {
    //resets after each question, checks if round is over
    if(qNumber > numQuestions - 1){
        issueJudgement();
        return;
    }
    titleScreen.style.display = 'none';
    rulesScreen.style.display = 'none';
    wheelScreen.style.display = 'block';
    mcQuestionScreen.style.display = 'none'; 
    tfQuestionScreen.style.display = 'none';
    fitbQuestionScreen.style.display = 'none';
    cAnswerScreen.style.display = 'none';
    icAnswerScreen.style.display = 'none';
    judgementScreen.style.display = 'none';
    youWinScreen.style.display = 'none';
    gameTextContainer.style.display = 'block';
    qNumber++;
    updateUI();
}

function spinWheel(){
    //gameTextContainer.style.display = 'block';
    spinButton.addEventListener('click', () => {
        var randomDuration = Math.random() * (7 - 3) + 3;
        spinButton.disabled = true;
        wheelImage.style.setProperty('animation-duration', `${randomDuration}s`);

        /*
        const minRotations = 5; 
        const maxRotations = 10;
        */
        var baseRotations = randomDuration;

        const categories = ["Music", "????????", "History", "Geography", "Science", "Sports", "Movies/TV", "Games"];
        
        var selectedCategoryIndex = Math.random();
        var selectedCategory = Math.floor(selectedCategoryIndex * 8);
        var stopAngle = selectedCategoryIndex * 360; 
        
        var finalAngle = (Math.floor(baseRotations) * 360) + (360 - stopAngle);
        
        currentSelectedCategory = categories[selectedCategory];
        
        wheelImage.style.setProperty('--final-angle', `${finalAngle}deg`);
        
        void wheelImage.offsetWidth; 
    
        wheelImage.classList.add('spinning'); 
        spinButton.style.display = 'none';
        continueButton.style.display = 'block';
    });
}
titleScreen.style.display = 'block';
gameTextContainer.style.display = 'none';
newGame();
currentSelectedCategory = ""; 
currentType = "";
currentCorrectAnswer = "";
roundNumber = 1;
qNumber = 0;
currentPoints = 0;
gameTextContainer.style.display = 'none';
document.getElementById('startButton').addEventListener('click', startGame);
globalGameText.innerText = "Current Points: " + currentPoints + " Points Threshold: " + pointsThreshold[roundNumber - 1] +  " Round Number: " + roundNumber + " Question Number: " + qNumber + "/" + numQuestions + " Time Left: " + timeLeft;

spinWheel();

nextButtons.forEach(button => {
    button.addEventListener('click', () => {
        startGame();
    });
});






continueButton.addEventListener('click', () => {
    wheelScreen.style.display = 'none';
    
    continueButton.style.display = 'none';
    spinButton.style.display = 'inline-block';
    spinButton.disabled = false;
    wheelImage.classList.remove('spinning');

    displayQuestion(currentSelectedCategory); 
});


mcButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        const selectedAnswer = e.currentTarget.textContent.trim();
        checkAnswer(selectedAnswer);
    });
});

tfButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        const selectedAnswer = e.currentTarget.textContent.trim();
        checkAnswer(selectedAnswer);
    });
});

fitbForm.addEventListener('submit', (e) => {
    e.preventDefault(); 
    const selectedAnswer = fitbInput.value.trim();    
    checkAnswer(selectedAnswer);
});
