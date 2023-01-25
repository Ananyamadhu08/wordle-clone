const wordGrid = document.querySelector("[word-grid]");
const alertContainer = document.querySelector("[alert-container]");
const keyboard = document.querySelector("[keyboard]");

const words = [
  "space",
  "magic",
  "count",
  "royal",
  "earth",
  "clock",
  "prime",
  "lucky",
  "super",
  "quick",
];

const dictionary = [
  "space",
  "magic",
  "count",
  "royal",
  "earth",
  "clock",
  "prime",
  "lucky",
  "super",
  "quick",
  "study",
  "trust",
  "flame",
  "raise",
  "watch",
  "brave",
  "chief",
  "happy",
  "rapid",
  "solid",
  "urban",
  "bound",
  "tower",
  "train",
  "voice",
  "theme",
  "stick",
  "range",
  "money",
  "table",
  "grant",
  "mount",
];

const WORD_LENGTH = 5;
const FLIP_ANIMATION_DURATION = 500;
const DANCE_ANIMATION_DURATION = 500;

// const offsetFromDate = new Date(2022, 0, 1);
// const msOffset = Date.now() - offsetFromDate;
// const dayOffset = msOffset / 1000 / 60 / 60 / 24;
// const targetWord = words[Math.floor(dayOffset)];
const targetWord = "count";

function showAlert(message, duration = 1000) {
  const alert = document.createElement("div");
  alert.textContent = message;
  alert.classList.add("alert");
  alertContainer.prepend(alert);
  if (duration == null) return;

  setTimeout(() => {
    alert.classList.add("hide");
    alert.addEventListener("transitionend", () => {
      alert.remove();
    });
  }, duration);
}

function danceTiles(tiles) {
  tiles.forEach((tile, index) => {
    setTimeout(() => {
      tile.classList.add("dance");
      tile.addEventListener(
        "animationend",
        () => {
          tile.classList.remove("dance");
        },
        { once: true }
      );
    }, (index * DANCE_ANIMATION_DURATION) / 5);
  });
}

function checkWord(guessWord, tiles) {
  if (guessWord === targetWord) {
    showAlert("You Win", 5000);
    danceTiles(tiles);
    stopInteraction();
    return;
  }

  const remainingTiles = wordGrid.querySelectorAll(":not([data-letter])");

  if (remainingTiles.length === 0) {
    showAlert(targetWord.toUpperCase(), null);
    stopInteraction();
  }
}

function shakeTiles(tiles) {
  tiles.forEach((tile) => {
    tile.classList.add("shake");
    tile.addEventListener(
      "animationend",
      () => {
        tile.classList.remove("shake");
      },
      { once: true }
    );
  });
}

function flipTiles(tile, index, array, guessWord) {
  const letter = tile.dataset.letter;

  const key = keyboard.querySelector(`[data-key="${letter.toUpperCase()}"]`);
  setTimeout(() => {
    tile.classList.add("flip");
  }, (index * FLIP_ANIMATION_DURATION) / 2);

  tile.addEventListener("transitionend", () => {
    tile.classList.remove("flip");
    if (targetWord[index] === letter) {
      tile.dataset.status = "correct";
      key.classList.add("correct");
    } else if (targetWord.includes(letter)) {
      tile.dataset.status = "misplaced";
      key.classList.add("misplaced");
    } else {
      tile.dataset.status = "wrong";
      key.classList.add("wrong");
    }

    if (index === array.length - 1) {
      tile.addEventListener(
        "transitionend",
        () => {
          startInteraction();
          checkWord(guessWord, array);
        },
        { once: true }
      );
    }
  });
}

function getActiveTiles() {
  return wordGrid.querySelectorAll('[data-status="active"]');
}

function pressKey(key) {
  const activeTiles = getActiveTiles();
  if (activeTiles.length >= WORD_LENGTH) return;
  const nextTile = wordGrid.querySelector(":not([data-letter])");
  nextTile.dataset.letter = key.toLowerCase();
  nextTile.textContent = key;
  nextTile.dataset.status = "active";
}

function deleteKey() {
  const activeTiles = getActiveTiles();
  const lastTile = activeTiles[activeTiles.length - 1];
  if (lastTile == null) return;
  lastTile.textContent = "";
  delete lastTile.dataset.status;
  delete lastTile.dataset.letter;
}

function submitWord() {
  const activeTiles = [...getActiveTiles()];
  if (activeTiles.length !== WORD_LENGTH) {
    showAlert("Not enough letters");
    shakeTiles(activeTiles);
    return;
  }

  const guessWord = activeTiles.reduce((word, tile) => {
    return word + tile.dataset.letter;
  }, "");

  if (!dictionary.includes(guessWord)) {
    showAlert("Not in word list");
    shakeTiles(activeTiles);
    return;
  }

  stopInteraction();
  activeTiles.forEach((...args) => flipTiles(...args, guessWord));
}

function mouseClickHandler(e) {
  if (e.target.matches("[data-key]")) {
    pressKey(e.target.dataset.key);
    return;
  }

  if (e.target.matches("[data-enter]")) {
    submitWord();
    return;
  }

  if (e.target.matches("[data-delete]")) {
    deleteKey();
    return;
  }
}

function keyPressHandler(e) {
  if (e.key === "Enter") {
    submitWord();
    return;
  }

  if (e.key === "Backspace" || e.key === "Delete") {
    deleteKey();
    return;
  }

  if (e.key.match(/^[a-z]$/)) {
    pressKey(e.key);
    return;
  }
}

function startInteraction() {
  document.addEventListener("click", mouseClickHandler);
  document.addEventListener("keydown", keyPressHandler);
}

function stopInteraction() {
  document.removeEventListener("click", mouseClickHandler);
  document.removeEventListener("keydown", keyPressHandler);
}

startInteraction();
