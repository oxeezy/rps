let mode = '';
const normalBtn = document.getElementById('normal');
//normalmode in homepage
const hardBtn = document.getElementById('hard');
//hardmode in homepage
const startBtn = document.getElementById('start');
//start button
const link = document.getElementById('link');


normalBtn.addEventListener('click', function () {

  if (mode === 'normal') {
    mode = '';
  } else {
    mode = 'normal';
  }

  normalBtn.classList.toggle('active', mode === 'normal');
  hardBtn.classList.remove('active');
  updateButton();

});


hardBtn.addEventListener('click', function () {

  if (mode === 'hard') {
    mode = '';
  } else {
    mode = 'hard';
  }

  hardBtn.classList.toggle('active', mode === 'hard');
  normalBtn.classList.remove('active');

  updateButton();

});


startBtn.addEventListener('click', function (event) {

  if (mode === '') {
    event.preventDefault();
    return;
  }

  if (mode === 'normal') {
    link.href = 'normal.html';
  }

  if (mode === 'hard') {
    link.href = 'hard.html';
  }

});


function updateButton() {

  if (mode !== '') {
    startBtn.classList.add('active');
    startBtn.disabled = false;
  } else {
    startBtn.classList.remove('active');
    startBtn.disabled = true;
  }

}


updateButton();