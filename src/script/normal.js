const choices = ['rock', 'paper', 'scissors'];

const beats = {
  rock: 'scissors',
  paper: 'rock',
  scissors: 'paper'
};

const pickScreen = document.getElementById('pickScreen');
const resultScreen = document.getElementById('resultScreen');
const playerIconWrap = document.getElementById('playerIconWrap');
const houseWheel = document.getElementById('houseWheel');
const resultMessage = document.getElementById('resultMessage');
const resultText = document.getElementById('resultText');
const playAgainBtn = document.getElementById('playAgain');
const scoreElement = document.getElementById('score');
const rulesButton = document.getElementById('rulesButton');
const rulesModal = document.getElementById('rulesModal');
const closeRules = document.getElementById('closeRules');
const rulesList = document.getElementById('rulesList');

let score = Number(localStorage.getItem('rps-score')) || 0;
let spinning = false;
let wheelRotation = 0;
scoreElement.textContent = score;
buildWheel();

choices.forEach(choice => {
  const choiceButton = document.getElementById(choice);

  choiceButton.addEventListener('click', () => {
    if (!spinning) {
      startRound(choice);
    }
  });

});


function iconHTML(choice) {
  return `<img src="../../public/icon-${choice}.svg" alt="${choice}">`;
}


function buildWheel() {

  const radius = 70;
  const segment = 360 / choices.length;

  houseWheel.innerHTML = choices.map((choice, index) => {
  const angle = index * segment - 90;

    return `
      <div class="wheel-seg" style="transform: rotate(${angle}deg) translate(${radius}px) rotate(${-angle}deg);">
        <img src="../../public/icon-${choice}.svg" alt="${choice}">
      </div>`;
  }).join('');

}


function startRound(playerChoice) {
                 
  spinning = true;

  choices.forEach(choice => {
 

    const choiceElement = document.getElementById(choice);
                        
              
    if (choice === playerChoice) {
      choiceElement.classList.add('chosen');
    } else {
      choiceElement.classList.add('fade-out');
    }

  });


  setTimeout(() => {

    pickScreen.classList.add('hidden');
    resultScreen.classList.remove('hidden');
    playerIconWrap.innerHTML = iconHTML(playerChoice);
    playerIconWrap.classList.add(`${playerChoice}-pick`);
    playerIconWrap.classList.add('pop-in');
    resultText.classList.add('pending');
    playAgainBtn.classList.add('pending')


    const randomIndex = Math.floor(Math.random() * choices.length);
    const houseChoice = choices[randomIndex];
    
    spinWheel(houseChoice, () => {
      finishRound(
        playerChoice,
        houseChoice
      );

    });

  }, 450);

}


function spinWheel(finalChoice, onDone) {

  const selectedIndex = choices.indexOf(finalChoice);
  const segment = 360 / choices.length;
  const extraSpins = 5;
  const desiredRotation = -selectedIndex * segment;
  const currentPosition = ((wheelRotation % 360) + 360) % 360;
  const desiredPosition = ((desiredRotation % 360) + 360) % 360;
  const rotationDifference = (desiredPosition - currentPosition +  360) % 360;
  const targetRotation = wheelRotation + extraSpins * 360 + rotationDifference;


  houseWheel.style.transition = 'none';

// wheelRotation = 0°
// selectedIndex = 1
// segment = 120°
// desiredRotation = -120°
// currentPosition = 0°

  houseWheel.style.transform = `rotate(${wheelRotation}deg)`;


  void houseWheel.offsetWidth;


  requestAnimationFrame(() => {
    houseWheel.style.transition = 'transform 2.5s cubic-bezier(0.13, 0.78, 0.18, 1)';
    houseWheel.style.transform = `rotate(${targetRotation}deg)`;
  });


  setTimeout(() => {
    wheelRotation = targetRotation;
    onDone();
  }, 2600);

}


function finishRound(playerChoice, houseChoice) {

  let outcome;
  if (playerChoice === houseChoice) {
    outcome = 'draw';
  } else if (beats[playerChoice] === houseChoice) {
    outcome = 'win';
  } else {
    outcome = 'lose';
  }

  if (outcome === 'win') {
    score++;
    resultMessage.textContent = 'YOU WIN';
  } else if (outcome === 'lose') {
    score--;
    resultMessage.textContent = 'YOU LOSE';
    if (score < 0) {
      score = 0;
    }
  } else {
    resultMessage.textContent = 'TIE';
  }
  scoreElement.textContent = score;
  localStorage.setItem('rps-score', score);
  resultText.classList.remove('pending');
  playAgainBtn.classList.remove('pending')
  spinning = false;

}


  playAgainBtn.addEventListener('click', () => {
  resultScreen.classList.add('hidden');
  pickScreen.classList.remove('hidden');
  resultText.classList.remove('pending');
  playAgainBtn.classList.remove('pending');
  
  choices.forEach(choice => {

    document
      .getElementById(choice)
      .classList.remove(
        'fade-out',
        'chosen'
      );

  });

});


rulesList.innerHTML = `

  <div class="rule-item">
    Rock beats Scissors
  </div>

  <div class="rule-item">
    Scissors beats Paper
  </div>

  <div class="rule-item">
    Paper beats Rock
  </div>

`;


rulesButton.addEventListener('click', () => {
  rulesModal.classList.remove('hidden');
});


closeRules.addEventListener('click', () => {
  rulesModal.classList.add('hidden');
});


rulesModal.addEventListener('click', event => {
  if (event.target === rulesModal) {
    rulesModal.classList.add('hidden');
  }
});


document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    rulesModal.classList.add('hidden');
  }
});s