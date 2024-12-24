const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 400;

let player = { x: 50, y: 300, width: 50, height: 50, speed: 5, jumpHeight: 12, dy: 0, jumping: false };
let obstacles = [];
let coins = [];
let score = 0;
let gameSpeed = 3;
let gravity = 0.5;

// Utility Functions
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// Create obstacles
function spawnObstacle() {
  const height = randomInt(20, 80);
  obstacles.push({ x: canvas.width, y: canvas.height - height, width: randomInt(30, 60), height });
}

// Create coins
function spawnCoin() {
  coins.push({ x: canvas.width, y: randomInt(150, 300), radius: 10 });
}

// Update game state
function update() {
  // Player physics
  player.dy += gravity;
  player.y += player.dy;

  // Prevent falling through the floor
  if (player.y > canvas.height - player.height) {
    player.y = canvas.height - player.height;
    player.dy = 0;
    player.jumping = false;
  }

  // Move obstacles and coins
  obstacles.forEach((obs, index) => {
    obs.x -= gameSpeed;
    if (obs.x + obs.width < 0) obstacles.splice(index, 1); // Remove off-screen obstacles
  });

  coins.forEach((coin, index) => {
    coin.x -= gameSpeed;
    if (coin.x + coin.radius < 0) coins.splice(index, 1); // Remove off-screen coins

    // Check collision with player
    const dist = Math.hypot(player.x + player.width / 2 - coin.x, player.y + player.height / 2 - coin.y);
    if (dist < player.width / 2 + coin.radius) {
      coins.splice(index, 1); // Remove collected coin
      score += 10; // Increment score
    }
  });

  // Check collisions with obstacles
  obstacles.forEach(obs => {
    if (
      player.x < obs.x + obs.width &&
      player.x + player.width > obs.x &&
      player.y < obs.y + obs.height &&
      player.y + player.height > obs.y
    ) {
      alert(`Game Over! Final Score: ${score}`);
      document.location.reload();
    }
  });

  // Increase difficulty
  gameSpeed += 0.001;
}

// Draw game objects
function draw() {
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw player
  ctx.fillStyle = "red";
  ctx.fillRect(player.x, player.y, player.width, player.height);

  // Draw obstacles
  ctx.fillStyle = "brown";
  obstacles.forEach(obs => ctx.fillRect(obs.x, obs.y, obs.width, obs.height));

  // Draw coins
  ctx.fillStyle = "gold";
  coins.forEach(coin => {
    ctx.beginPath();
    ctx.arc(coin.x, coin.y, coin.radius, 0, Math.PI * 2);
    ctx.fill();
  });

  // Draw score
  document.getElementById("score").textContent = score;
}

// Game loop
let frame = 0;
function loop() {
  frame++;
  if (frame % 150 === 0) spawnObstacle();
  if (frame % 300 === 0) spawnCoin();

  update();
  draw();
  requestAnimationFrame(loop);
}

// Player controls
window.addEventListener("keydown", e => {
  if (e.code === "Space" && !player.jumping) {
    player.dy = -player.jumpHeight;
    player.jumping = true;
  }
});

// Start the game
loop();
