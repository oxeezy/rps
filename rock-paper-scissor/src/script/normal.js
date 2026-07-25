const CHOICES = ['rock', 'paper', 'scissors'];

const BEATS = {
  rock: 'scissors',
  paper: 'rock',
  scissors: 'paper'
};

const pickScreen = document.getElementById('pickScreen');
const resultScreen = document.getElementById('resultScreen');
const playerIconWrap = document.getElementById('playerIconWrap');
const houseWheel = document.getElementById('houseWheel');
const resultMessage = document.getElementById('resultMessage');
const resultTextBox = document.getElementById('resultText');
const playAgainBtn = document.getElementById('playAgain');
const scoreEl = document.getElementById('score');

const rulesButton = document.getElementById('rulesButton');
const rulesModal = document.getElementById('rulesModal');
const closeRules = document.getElementById('closeRules');
const rulesList = document.getElementById('rulesList');

let score = Number(localStorage.getItem('rps-score')) || 0;
let spinning = false;
let wheelRotation = 0;

scoreEl.textContent = score;

buildWheel();

/* PLAYER CHOICE BUTTONS */
CHOICES.forEach(choice => {
  const choiceButton = document.getElementById(choice);

  choiceButton.addEventListener('click', () => {
    if (!spinning) {
      startRound(choice);
    }
  });
});

/* CREATE PLAYER ICON */
function iconHTML(choice) {
  return `
    <img
      src="/public/icon-${choice}.svg"
      alt="${choice}"
    >
  `;
}

/* CREATE THE AI WHEEL */
function buildWheel() {
  const radius = 70;
  const segment = 360 / CHOICES.length;

  houseWheel.innerHTML = CHOICES.map((choice, index) => {
    const angle = index * segment - 90;

    return `
      <div
        class="wheel-seg"
        style="
          transform:
            rotate(${angle}deg)
            translate(${radius}px)
            rotate(${-angle}deg);
        "
      >
        <img
          src="/public/icon-${choice}.svg"
          alt="${choice}"
        >
      </div>
    `;
  }).join('');
}

/* START THE ROUND */
function startRound(playerChoice) {
  spinning = true;

  CHOICES.forEach(choice => {
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

    playerIconWrap.classList.remove(
      'rock-pick',
      'paper-pick',
      'scissors-pick',
      'pop-in'
    );

    playerIconWrap.innerHTML = iconHTML(playerChoice);
    playerIconWrap.classList.add(`${playerChoice}-pick`);

    void playerIconWrap.offsetWidth;

    playerIconWrap.classList.add('pop-in');
    resultTextBox.classList.add('pending');

    const randomIndex = Math.floor(
      Math.random() * CHOICES.length
    );

    const houseChoice = CHOICES[randomIndex];

    spinWheel(houseChoice, () => {
      finishRound(playerChoice, houseChoice);
    });
  }, 450);
}

/* SPIN THE AI WHEEL */
function spinWheel(finalChoice, onDone) {
  const selectedIndex = CHOICES.indexOf(finalChoice);
  const segment = 360 / CHOICES.length;
  const extraSpins = 5;

  /*
    The icons already begin at:

    Rock: -90 degrees
    Paper: 30 degrees
    Scissors: 150 degrees

    The selected icon must finish at -90 degrees,
    directly underneath the pointer.
  */
  const desiredPosition = -selectedIndex * segment;

  const currentPosition =
    ((wheelRotation % 360) + 360) % 360;

  const normalizedDesiredPosition =
    ((desiredPosition % 360) + 360) % 360;

  const rotationDifference =
    (
      normalizedDesiredPosition -
      currentPosition +
      360
    ) % 360;

  const targetRotation =
    wheelRotation +
    extraSpins * 360 +
    rotationDifference;

  const wheelWrap = houseWheel.parentElement;

  wheelWrap.classList.add('spinning');

  houseWheel.style.transition = 'none';
  houseWheel.style.transform =
    `rotate(${wheelRotation}deg)`;

  void houseWheel.offsetWidth;

  let spinFinished = false;

  function completeSpin() {
    if (spinFinished) return;

    spinFinished = true;
    wheelRotation = targetRotation;

    wheelWrap.classList.remove('spinning');
    houseWheel.removeEventListener(
      'transitionend',
      handleTransitionEnd
    );

    onDone();
  }

  function handleTransitionEnd(event) {
    if (
      event.target === houseWheel &&
      event.propertyName === 'transform'
    ) {
      completeSpin();
    }
  }

  houseWheel.addEventListener(
    'transitionend',
    handleTransitionEnd
  );

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      houseWheel.style.transition =
        'transform 2.5s cubic-bezier(0.13, 0.78, 0.18, 1)';

      houseWheel.style.transform =
        `rotate(${targetRotation}deg)`;
    });
  });

  /*
    Backup in case transitionend does not fire
    in a particular browser.
  */
  setTimeout(completeSpin, 2800);
}

/* CALCULATE THE WINNER */
function finishRound(playerChoice, houseChoice) {
  let outcome;

  if (playerChoice === houseChoice) {
    outcome = 'draw';
  } else if (BEATS[playerChoice] === houseChoice) {
    outcome = 'win';
  } else {
    outcome = 'lose';
  }

  if (outcome === 'win') {
    score++;
  }

  if (outcome === 'lose') {
    score = Math.max(0, score - 1);
  }

  scoreEl.textContent = score;

  localStorage.setItem(
    'rps-score',
    score
  );

  if (outcome === 'win') {
    resultMessage.textContent = 'YOU WIN';
  } else if (outcome === 'lose') {
    resultMessage.textContent = 'YOU LOSE';
  } else {
    resultMessage.textContent = 'TIE';
  }

  resultTextBox.classList.remove('pending');
  spinning = false;
}

/* PLAY AGAIN */
playAgainBtn.addEventListener('click', () => {
  resultScreen.classList.add('hidden');
  pickScreen.classList.remove('hidden');

  resultTextBox.classList.remove('pending');

  playerIconWrap.classList.remove(
    'rock-pick',
    'paper-pick',
    'scissors-pick',
    'pop-in'
  );

  playerIconWrap.innerHTML = '';

  CHOICES.forEach(choice => {
    document
      .getElementById(choice)
      .classList.remove(
        'fade-out',
        'chosen'
      );
  });
});

/* GAME RULES */
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
});

