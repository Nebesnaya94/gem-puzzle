const btnContainer = document.createElement("div");
btnContainer.className = "container button-container";
document.body.append(btnContainer);

const btnText = ["Shuffle and start", "Stop", "Save", "Results"];
let btn;
for (let i = 0; i < 4; i++) {
  btn = document.createElement("button");
  btn.textContent = btnText[i];
  btnContainer.append(btn);
  if (i > 0 && i < 3) {
    btn.setAttribute("disabled", true);
  }
}

const saveButton = btnContainer.lastChild;

const savedResults = document.createElement("div");
savedResults.className = "saved-results";
document.body.append(savedResults);
const resultsTitle = document.createElement("div");
resultsTitle.textContent = "Game results:";
const resultsList = document.createElement("ol");
savedResults.append(resultsTitle, resultsList);
saveButton.addEventListener("click", () => {
  savedResults.classList.add("active");
  document.body.style.overflow = "hidden";
});
savedResults.addEventListener("click", () => {
  savedResults.classList.remove("active");
  document.body.style.overflow = "visible";
});

function saveResult(time, move) {
  let result = document.createElement("li");
  result.textContent = `The puzzle is solved in ${time} and ${move} moves`;
  document.querySelector(".saved-results ol").append(result);
}

const countContainer = document.createElement("div");
countContainer.className = "container count-container";
btnContainer.after(countContainer);

const movesBlock = document.createElement("div");
movesBlock.id = "moves-block";
movesBlock.textContent = "Moves: ";
const moves = document.createElement("span");
movesBlock.append(moves);

const timeBlock = document.createElement("div");
timeBlock.id = "time-block";
timeBlock.textContent = "Time: ";
const clock = document.createElement("span");

let min = 0;
let sec = -1;
clock.textContent = "00:00";

function isSingle(num) {
  if (num < 10) {
    num = "0" + num;
  }
  return num;
}

function timer() {
  sec++;
  min = Math.floor(sec / 60);

  clock.textContent = `${isSingle(min)}:${isSingle(sec - min * 60)}`;
  setTimeout(timer, 1000);
}

timeBlock.append(clock);

const soundBlock = document.createElement("div");
soundBlock.className = "sound-block active";
soundBlock.textContent = "Sound";
const audio = new Audio("./sound/sound_whoosh.mp3");
function hasSound() {
  soundBlock.classList.toggle("active");
}
soundBlock.addEventListener("click", hasSound);

countContainer.prepend(soundBlock, movesBlock, timeBlock);

const gameContainer = document.createElement("div");
gameContainer.className = "container game-container";
countContainer.after(gameContainer);
const gameBlock = document.createElement("div");
gameBlock.className = "game-block";

gameContainer.prepend(gameBlock);

const choiceContainer = document.createElement("div");
choiceContainer.className = "container choice-container";
gameContainer.after(choiceContainer);
const selectedFrame = document.createElement("div");
selectedFrame.className = "container selected-frame";
selectedFrame.textContent = "Frame size:";
choiceContainer.append(selectedFrame);
const frameSize = document.createElement("span");
frameSize.textContent = "4x4";
selectedFrame.append(frameSize);
const choiceFrame = document.createElement("div");
choiceFrame.className = "container choice-frame";
choiceFrame.textContent = "Other sizes:  ";
choiceContainer.append(choiceFrame);

let gameSize = 4;

let sizeCount = 3;
let otherSizes;
for (let i = 0; i <= 5; i++) {
  otherSizes = document.createElement("span");
  otherSizes.textContent = `${sizeCount + i}x${sizeCount + i}`;
  otherSizes.addEventListener("click", () => {
    frameSize.textContent = `${sizeCount + i}x${sizeCount + i}`;
    gameSize = sizeCount + i;
    changeGame();
  });
  choiceFrame.append(otherSizes);
}

btnContainer.firstChild.addEventListener("click", changeGame);

let gameArr;

function getArr() {
  gameArr = [];
  for (let i = 0; i < gameSize ** 2 - 1; i++) {
    gameArr.push(i + 1);
  }
  gameArr.push("");
}

function getMatrix(arr) {
  let matrix = [];
  for (let i = 0; i < gameSize; i++) {
    matrix.push([]);
  }

  let n = 0;
  let m = 0;

  for (let i = 0; i < arr.length; i++) {
    if (m >= gameSize) {
      n++;
      m = 0;
    }
    matrix[n][m] = arr[i];
    m++;
  }
  return matrix;
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

function checkArr(array) {
  let count = 0;
  let str;

  for (let i = 0; i < array.length; i++) {
    if (!array[i]) {
      str = Math.ceil((i + 1) / gameSize);
      continue;
    }
    for (let l = i + 1; l < array.length; l++) {
      if (!array[l]) {
        continue;
      }
      if (array[i] > array[l]) {
        count++;
      }
    }
  }

  if (gameSize % 2) {
    if (count % 2) {
      return false;
    } else {
      return true;
    }
  } else {
    if ((count + str) % 2) {
      return false;
    } else {
      return true;
    }
  }
}

function saveResultsList() {
  localStorage.setItem("result", savedResults.innerHTML);
}

function getResultsList() {
  if (localStorage.getItem("result")) {
    savedResults.innerHTML = localStorage.getItem("result");
  } else {
    saveResultsList();
  }
}

window.addEventListener("load", () => {
  getResultsList();
  timer();
  newGame();
});

let en;
let em;

function newGame() {
  moves.textContent = 0;

  getArr();
  shuffle(gameArr);

  while (checkArr(gameArr) == false) {
    shuffle(gameArr);
  }

  let gameMatrix = getMatrix(gameArr);

  let table = document.createElement("table"),
    tbody = document.createElement("tbody");
  table.append(tbody);
  for (n = 0; n < gameSize; n++) {
    let row = document.createElement("tr");
    for (m = 0; m < gameSize; m++) {
      let cell = document.createElement("td");
      cell.id = n + " " + m;
      cell.addEventListener("click", cellClick);
      cell.innerHTML = gameMatrix[n][m];
      if (cell.textContent) {
        cell.style.background = "white";
      } else {
        en = n;
        em = m;
      }
      cell.style.width = `${100 / gameSize}%`;
      row.append(cell);
    }
    tbody.append(row);
  }
  if (gameBlock.childNodes.length === 1) gameBlock.firstChild.remove();
  gameBlock.append(table);
}

function cellClick(event) {
  if (soundBlock.classList.contains("active")) {
    audio.play();
  }
  (el = event.target), (n = el.id[0]), (m = el.id[2]);
  if (
    (n == en && Math.abs(m - em) == 1) ||
    (m == em && Math.abs(n - en) == 1)
  ) {
    moves.textContent++;
    document.getElementById(en + " " + em).innerHTML = el.innerHTML;
    el.innerHTML = "";
    el.style.background = "none";
    document.getElementById(en + " " + em).style.background = "white";
    en = n;
    em = m;
    let q = true;
    for (n = 0; n < gameSize; n++)
      for (m = 0; m < gameSize; m++)
        if (
          n + m != (gameSize - 1) * 2 &&
          document.getElementById(n + " " + m).innerHTML != n * gameSize + m + 1
        ) {
          q = false;
          break;
        }
    if (q) {
      alert(
        `Hooray! You solved the puzzle in ${clock.textContent} and ${moves.textContent} moves!`
      );
      saveResult(clock.textContent, moves.textContent);
      saveResultsList();
    }
  }
}

function changeGame() {
  min = 0;
  sec = 0;
  clock.textContent = "00:00";
  newGame();
}
