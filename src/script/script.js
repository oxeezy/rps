let mode = '';

const normalBtn = document.getElementById('normal');
const hardBtn = document.getElementById('hard');
const startBtn = document.getElementById('start');
const link = document.querySelector('#link');

normalBtn.onclick = function () {
  mode = (mode === 'normal') ? '' : 'normal';
  normalBtn.classList.toggle('active', mode === 'normal');
  hardBtn.classList.remove('active');
  updateButton();
};

hardBtn.onclick = function () {
  mode = (mode === 'hard') ? '' : 'hard';
  hardBtn.classList.toggle('active', mode === 'hard');
  normalBtn.classList.remove('active');
  updateButton();
};

startBtn.parentElement.onclick = function (e) {
  if (!mode) {
    e.preventDefault();
    return;
  }
  link.href = (mode === 'normal') ? 'normal.html' : 'hard.html';
};

function updateButton() {
  if (mode) {
    startBtn.classList.add('active');
    startBtn.disabled = false;
  } else {
    startBtn.classList.remove('active');
    startBtn.disabled = true;
  }
}

updateButton();
