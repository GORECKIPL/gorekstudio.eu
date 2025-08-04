// js/snake.js
const canvas = document.getElementById("snakeCanvas");
const ctx = canvas.getContext("2d");
const scale = 20;
const rows = canvas.height / scale;
const columns = canvas.width / scale;

let snake;
let fruit;
let gameLoop;
let gameSpeed = 150; // Szybsze pożywienie może zwiększyć szybkość gry

(function setup() {
  snake = new Snake();
  fruit = randomPosition();

  // Sprawdź, czy można pobrać element score i ustaw mu wartość
  const scoreEl = document.getElementById("score");
  if (scoreEl) {
    scoreEl.textContent = 0;
  }

  sessionStorage.setItem("snakePlayed", "1");

  gameLoop = window.setInterval(() => {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    snake.update();
    snake.draw();

    ctx.fillStyle = "#f00";
    ctx.fillRect(fruit.x, fruit.y, scale, scale);

    if (snake.eat(fruit)) {
      fruit = randomPosition();
      // Opcjonalnie: zwiększaj prędkość gry z każdym zjedzonym owocem
      // if (gameSpeed > 50) {
      //   gameSpeed -= 1; // Zmniejszenie interwału przyspiesza grę
      //   window.clearInterval(gameLoop);
      //   gameLoop = window.setInterval(gameLoop, gameSpeed);
      // }
    }

    if (snake.checkCollision()) {
      window.clearInterval(gameLoop); // Zatrzymaj grę, żeby nie alertowało w pętli
      alert("Koniec gry! Przenoszę dalej...");
      window.location.href = "main.html";
    }
  }, gameSpeed);
})();

function randomPosition() {
  return {
    x: Math.floor(Math.random() * columns) * scale,
    y: Math.floor(Math.random() * rows) * scale
  };
}

function Snake() {
  this.x = 0;
  this.y = 0;
  this.xSpeed = scale;
  this.ySpeed = 0;
  this.total = 0;
  this.tail = [];
  this.pendingDirection = null;

  this.draw = function () {
    ctx.fillStyle = "#ccc";
    for (let i = 0; i < this.tail.length; i++) {
      ctx.fillRect(this.tail[i].x, this.tail[i].y, scale, scale);
    }
    ctx.fillRect(this.x, this.y, scale, scale);
  };

  this.update = function () {
    // Zastosuj oczekujący kierunek przed aktualizacją pozycji
    if (this.pendingDirection) {
      const dir = this.pendingDirection;
      if ((dir === "Up" && this.ySpeed === 0) || (dir === "Down" && this.ySpeed === 0)) {
        this.xSpeed = 0;
        this.ySpeed = dir === "Up" ? -scale : scale;
      } else if ((dir === "Left" && this.xSpeed === 0) || (dir === "Right" && this.xSpeed === 0)) {
        this.ySpeed = 0;
        this.xSpeed = dir === "Left" ? -scale : scale;
      }
      this.pendingDirection = null;
    }

    // Aktualizacja ogona
    for (let i = 0; i < this.tail.length - 1; i++) {
      this.tail[i] = this.tail[i + 1];
    }

    if (this.total >= 1) {
      this.tail[this.total - 1] = { x: this.x, y: this.y };
    }

    this.x += this.xSpeed;
    this.y += this.ySpeed;

    // Obsługa przechodzenia przez krawędzie
    this.x = (this.x + canvas.width) % canvas.width;
    this.y = (this.y + canvas.height) % canvas.height;
    if (this.x < 0) this.x += canvas.width;
    if (this.y < 0) this.y += canvas.height;
  };

  this.changeDirection = function (dir) {
    // Użyj pendingDirection, aby uniknąć natychmiastowego obrotu o 180 stopni
    // Nowy kierunek będzie zastosowany dopiero w następnej klatce (w funkcji update)
    this.pendingDirection = dir;
  };

  this.eat = function (pos) {
    if (this.x === pos.x && this.y === pos.y) {
      this.total++;
      const scoreEl = document.getElementById("score");
      if (scoreEl) scoreEl.textContent = this.total;
      sessionStorage.setItem("snakeScore", this.total);
      return true;
    }
    return false;
  };

  this.checkCollision = function () {
    for (let i = 0; i < this.tail.length; i++) {
      if (this.x === this.tail[i].x && this.y === this.tail[i].y) {
        return true;
      }
    }
    return false;
  };
}

window.addEventListener("keydown", (e) => {
  const dir = e.key.replace("Arrow", "");
  snake.changeDirection(dir);
});