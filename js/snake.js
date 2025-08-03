// js/snake.js
const snakeCanvas = document.getElementById("snakeCanvas");
const ctx = snakeCanvas.getContext("2d");
const rows = snakeCanvas.height / scale;
const columns = snakeCanvas.width / scale;

let snake;
let fruit;

(function setup() {
  snake = new Snake();
  fruit = randomPosition();

  window.setInterval(() => {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    snake.update();
    snake.draw();

    ctx.fillStyle = "#666";
    ctx.fillRect(fruit.x, fruit.y, scale, scale);

    if (snake.eat(fruit)) {
      fruit = randomPosition();
    }

    if (snake.checkCollision()) {
      alert("Game Over!");
      window.location.href = "main.html";
    }
  }, 150);
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

  this.draw = function () {
    ctx.fillStyle = "#AAA";

    for (let i = 0; i < this.tail.length; i++) {
      ctx.fillRect(this.tail[i].x, this.tail[i].y, scale, scale);
    }

    ctx.fillRect(this.x, this.y, scale, scale);
  };

  this.update = function () {
    for (let i = 0; i < this.tail.length - 1; i++) {
      this.tail[i] = this.tail[i + 1];
    }

    if (this.total >= 1) {
      this.tail[this.total - 1] = { x: this.x, y: this.y };
    }

    this.x += this.xSpeed;
    this.y += this.ySpeed;

    this.x = this.x >= canvas.width ? 0 : this.x < 0 ? canvas.width - scale : this.x;
    this.y = this.y >= canvas.height ? 0 : this.y < 0 ? canvas.height - scale : this.y;
  };

  this.changeDirection = function (direction) {
    switch (direction) {
      case "Up":
        if (this.ySpeed === 0) {
          this.xSpeed = 0;
          this.ySpeed = -scale;
        }
        break;
      case "Down":
        if (this.ySpeed === 0) {
          this.xSpeed = 0;
          this.ySpeed = scale;
        }
        break;
      case "Left":
        if (this.xSpeed === 0) {
          this.xSpeed = -scale;
          this.ySpeed = 0;
        }
        break;
      case "Right":
        if (this.xSpeed === 0) {
          this.xSpeed = scale;
          this.ySpeed = 0;
        }
        break;
    }
  };

  this.eat = function (pos) {
    if (this.x === pos.x && this.y === pos.y) {
      this.total++;
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
  const direction = e.key.replace("Arrow", "");
  snake.changeDirection(direction);
});