// Constants

const CANVAS_BORDER_COLOR = 'black';

const CANVAS_BACKGROUND_COLOR = "#ddd";

const SNAKE_COLOR = 'lightgreen';

const SNAKE_BORDER_COLOR = 'darkgreen';

// Game variables

let snake = [

  {x: 200, y: 200},

  {x: 190, y: 200},

  {x: 180, y: 200},

  {x: 170, y: 200},

  {x: 160, y: 200}

];

let foodX;

let foodY;

let dx = 10;

let dy = 0;

let score = 0;

let changingDirection = false;

// Define Grid class for A* algorithm

class Grid {

  constructor(width, height) {

    this.width = width;

    this.height = height;

    this.cells = new Array(height);

    for (let i = 0; i < height; i++) {

      this.cells[i] = new Array(width).fill(false);

    }

  }

  isBlocked(x, y) {

    return (x < 0 || x >= this.width || y < 0 || y >= this.height || this.cells[y][x]);

  }

  setBlocked(x, y) {

    this.cells[y][x] = true;

  }

}

// Initialize Grid object

const canvas = document.getElementById("canvas");

const grid = new Grid(canvas.width / 10, canvas.height / 10);

for (let i = 0; i < snake.length; i++) {

  const {x, y} = snake[i];

  grid.setBlocked(x / 10, y / 10);

}

grid.setBlocked(0, 0);

grid.setBlocked(canvas.width / 10 - 1, 0);

grid.setBlocked(0, canvas.height / 10 - 1);

grid.setBlocked(canvas.width / 10 - 1, canvas.height / 10 - 1);

// Get the score and steps-to-food elements

const scoreElement = document.getElementById('score');

const stepsToFoodElement = document.getElementById('steps-to-food');

// Return a two dimensional drawing context

const ctx = canvas.getContext("2d");

// Start game

main();

generateFood();

document.addEventListener("keydown", changeDirection);

function main() {

  if (didGameEnd()) return;

  setTimeout(function onTick() {

    changingDirection = false;

    clearCanvas();

    drawFood();

    moveSnake();

    drawSnake();

    main();

  }, 100)

}

function clearCanvas() {

  ctx.fillStyle = CANVAS_BACKGROUND_COLOR;

  ctx.strokestyle = CANVAS_BORDER_COLOR;

  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeRect(0, 0, canvas.width, canvas.height);

}

function drawFood() {

  ctx.fillStyle = 'red';

  ctx.strokestyle = 'darkred';

  ctx.fillRect(foodX, foodY, 10, 10);

  ctx.strokeRect(foodX, foodY, 10, 10);

}

function moveSnake() {

  const head = {x: snake[0].x + dx, y: snake[0].y + dy};

  snake.unshift(head);

  const didEatFood = snake[0].x === foodX && snake[0].y === foodY;

  if (didEatFood) {

    score += 10;

    scoreElement.innerHTML = score;

    generateFood();

  } else {

    snake.pop();

  }

  // Get minimum number of steps required to reach the food

  const stepsToFood = findPath(snake[0], {x: foodX, y: foodY}).length - 1;

  // Update steps-to-food element

  stepsToFoodElement.innerHTML = `Steps to food: ${stepsToFood}`;

  // Change snake direction towards food if not already moving in that direction

  if (dx == 0 && dy == -10 && head.y
