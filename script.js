'use strict';



const area = document.querySelector('.area');
const totaMessage = document.querySelector('.total');
const totalResult = document.querySelector('.totalResult');
const modalWrapper = document.querySelector('#modal-wrapper');
const btnStart = document.querySelector('.btn-start');
const btnReload = document.querySelector('.reload');

let sound = new Audio('sound/miui_bubble.mp3');
let soundWin = new Audio('sound/win.mp3');
let soundStart = new Audio('sound/click.mp3');



btnStart.addEventListener('click', () => {
  soundStart.play();
  modalWrapper.classList.add('fade-out');
  setTimeout(() => {
    modalWrapper.style.display = 'none';
  }, 1500);
});

btnReload.addEventListener('click', startFunc);

function startFunc() {

  let arrCollectionOfCards = [];
  let arrCollectionOfCardsMixed = [];
  let objOfCard = {};
  let countOfObj = 0;
  let arrOfSvgNumbers = [];
  let arrOfSvgNumbersMixed = [];

  let counter = 0;
  let counterOfClick = 0;
  let hasFlippedCard = false;
  let firstCard = null;
  let secondCard = null;
  let boardLocked = false;

  area.innerHTML = '';

  // Заполняю массив числами от 1 до 52 (номера файлов svg)
  for (let i = 1; i <= 52; i++) {
    arrOfSvgNumbers.push(i);
  }

  // Копирую элементы в новый массив в случайном порядке, удаляю эти элементы из старого массива
  while (arrOfSvgNumbers.length) {
    let randomIndexOfNumber = Math.floor(Math.random() * arrOfSvgNumbers.length);
    arrOfSvgNumbersMixed.push(arrOfSvgNumbers[randomIndexOfNumber]);
    arrOfSvgNumbers.splice(randomIndexOfNumber, 1);
  }

  //Генерирую html для каждой карточки и добавляю его в массив дважды
  for (let i = 1; i <= 5; i++) {

    objOfCard = {
      dataNumValue: i,
      pathOfImg: `svg/${arrOfSvgNumbersMixed[i - 1]}.svg`,
    };

    arrCollectionOfCards.push(objOfCard);
    arrCollectionOfCards.push(Object.assign({}, objOfCard));
  }

  console.log('arrCollectionOfCards', arrCollectionOfCards);

  // Перемешиваю массив с данными для карточек
  arrCollectionOfCardsMixed = arrCollectionOfCards.sort(
    () => Math.random() - 0.5
  );

  // Рендер карточек на странице
  arrCollectionOfCardsMixed.forEach((item) => {
    item.id = countOfObj++;
    area.innerHTML += `
    <div class="card" id="${item.id}" data-num-value="${item.dataNumValue}">
        <img src="img/another-side.jpg" alt="another-side" class="front-face">
        <img src="${item.pathOfImg}" class="back-face" >
    </div>
`;
  });

  console.log('arrCollectionOfCardsMixed', arrCollectionOfCardsMixed);

  const cards = document.querySelectorAll('.card');

  const handleMouseClick = (e) => {
    if (boardLocked) return;

    let currentCard = e.target.closest('.card');

    if (currentCard === firstCard) return;

    open(currentCard);
    counterOfClick++;

    if (!hasFlippedCard) {
      //First click

      hasFlippedCard = true;
      firstCard = currentCard;
    } else {
      //Second click

      hasFlippedCard = false;
      secondCard = currentCard;

      checkForMatches();
    }
  };

  const checkForMatches = () => {
    if (firstCard.dataset.numValue === secondCard.dataset.numValue) {
      boardLocked = true;

      setTimeout(() => {
        boardLocked = false;

        firstCard.tada(500);
        secondCard.tada(500);
        sound.play();
      }, 1000);
      firstCard.removeEventListener('click', handleMouseClick);
      secondCard.removeEventListener('click', handleMouseClick);

      counter++;

      if (counter === 5) {
        setTimeout(() => {
          confettiStart();
          soundWin.play();
          totaMessage.style.display = 'block';
          totalResult.innerText = counterOfClick;
        }, 2000);
      }
    } else {
      boardLocked = true;
      setTimeout(() => {
        close(firstCard, secondCard);
        boardLocked = false;

        hasFlippedCard = false;
        firstCard = null;
        secondCard = null;
      }, 1000);
    }
  };

  cards.forEach((card) => {
    card.addEventListener('click', handleMouseClick);
  });

  totaMessage.style.display = 'none';
  
  
}

function open(cardNode) {
  cardNode.classList.add('flip');
}

function close(cardNode, cardNodeSecond) {
  cardNode.classList.remove('flip');
  cardNodeSecond.classList.remove('flip');
}

function confettiStart() {
  const duration = 15 * 1000,
    animationEnd = Date.now() + duration,
    defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

  function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  const interval = setInterval(function () {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);

    // since particles fall down, start a bit higher than random
    confetti(
      Object.assign({}, defaults, {
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      })
    );
    confetti(
      Object.assign({}, defaults, {
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      })
    );
  }, 250);
}


startFunc();