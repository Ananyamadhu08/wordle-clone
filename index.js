const wordGrid = document.querySelector("[word-grid]");
const alertContainer = document.querySelector("[alert-container]");
const keyboard = document.querySelector("[keyboard]");

const words = [
  "ripen",
  "snowy",
  "attic",
  "sleek",
  "organ",
  "feral",
  "knock",
  "extra",
  "piece",
  "blame",
  "haute",
  "spied",
  "undid",
  "intro",
  "basal",
  "shine",
  "gecko",
  "rodeo",
  "guard",
  "steer",
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
  "crisp",
  "bound",
  "befit",
  "drawn",
  "suite",
  "itchy",
  "quest",
  "mauve",
  "froze",
  "pygmy",
  "ranch",
  "wring",
  "lemon",
  "shore",
  "moose",
  "antic",
  "drown",
  "vegan",
  "chess",
  "guppy",
  "union",
  "lever",
  "lorry",
  "image",
  "cabby",
  "druid",
  "exact",
  "truth",
  "dopey",
  "spear",
  "cried",
  "chime",
  "crony",
  "stunk",
  "timid",
  "batch",
  "gauge",
  "rotor",
  "crack",
  "curve",
  "latte",
  "witch",
  "bunch",
  "repel",
  "anvil",
  "soapy",
  "meter",
  "broth",
  "madly",
  "dried",
  "scene",
  "known",
  "magma",
  "roost",
  "woman",
  "relic",
  "guava",
];

const dictionary = [
  "ripen",
  "snowy",
  "watch",
  "loyal",
  "range",
  "faith",
  "torso",
  "match",
  "mercy",
  "tepid",
  "sleek",
  "attic",
  "sleek",
  "organ",
  "feral",
  "knock",
  "extra",
  "piece",
  "blame",
  "haute",
  "spied",
  "undid",
  "intro",
  "basal",
  "shine",
  "gecko",
  "rodeo",
  "guard",
  "steer",
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
  "crisp",
  "bound",
  "befit",
  "drawn",
  "suite",
  "itchy",
  "quest",
  "mauve",
  "froze",
  "pygmy",
  "ranch",
  "wring",
  "lemon",
  "shore",
  "moose",
  "antic",
  "drown",
  "vegan",
  "chess",
  "guppy",
  "union",
  "lever",
  "lorry",
  "image",
  "cabby",
  "druid",
  "exact",
  "truth",
  "dopey",
  "spear",
  "cried",
  "chime",
  "crony",
  "stunk",
  "timid",
  "batch",
  "gauge",
  "rotor",
  "crack",
  "curve",
  "latte",
  "witch",
  "bunch",
  "repel",
  "anvil",
  "soapy",
  "meter",
  "broth",
  "madly",
  "dried",
  "scene",
  "known",
  "magma",
  "roost",
  "woman",
  "relic",
  "guava",
  "fudge",
  "femur",
  "chirp",
  "forte",
  "alibi",
  "whine",
  "petty",
  "golly",
  "plait",
  "fleck",
  "felon",
  "gourd",
  "brown",
  "thrum",
  "ficus",
  "stash",
  "decry",
  "wiser",
  "login",
  "eject",
  "roger",
  "rival",
  "untie",
  "refit",
  "aorta",
  "adult",
  "judge",
  "rower",
  "artsy",
  "rural",
  "shave",
];

const WORD_LENGTH = 5;
const FLIP_ANIMATION_DURATION = 500;
const DANCE_ANIMATION_DURATION = 500;

function getRandomValue(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

const targetWord = getRandomValue(words);

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
