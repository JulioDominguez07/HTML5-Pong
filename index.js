// Canvas and Context
const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

// Set canvas dimensions
canvas.width = innerWidth;
canvas.height = innerHeight;

// Sound Effect
const paddleTapSound = new Audio('tap.mp3');

// Scoring system
let playerScore = 0;
let cpuScore = 0;

function drawScore() {
    c.fillStyle = 'white';
    c.font = '24px Arial';
    c.fillText(`Player: ${playerScore}`, 40, 30);
    c.fillText(`CPU: ${cpuScore}`, canvas.width - 120, 30);
}

// Player class
class Paddle {
    constructor(x, y, width, height, color) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.speed = 10;
    }

    draw() {
        c.fillStyle = this.color;
        c.fillRect(this.x, this.y, this.width, this.height);
    }

    move(dy) {
        this.y += dy;
        this.y = Math.max(0, Math.min(canvas.height - this.height, this.y)); // Keep within bounds
    }
}

// Ball class
class Ball {
    constructor(x, y, width, height, color) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.dx = 5; // Horizontal speed
        this.dy = 5; // Vertical speed
    }

    draw() {
        c.fillStyle = this.color;
        c.fillRect(this.x, this.y, this.width, this.height);
    }

    update(player, cpu) {
        this.x += this.dx;
        this.y += this.dy;

        // Bounce off top and bottom walls
        if (this.y <= 0 || this.y + this.height >= canvas.height) {
            this.dy = -this.dy;
            paddleTapSound.play();
        }
        
        // Bounce off paddles
        if (
            this.x <= player.x + player.width &&
            this.y + this.height >= player.y &&
            this.y <= player.y + player.height
        ) {
            this.dx = -this.dx;
            this.x = player.x + player.width; // Avoid sticking
            paddleTapSound.play();
        }

        if (
            this.x + this.width >= cpu.x &&
            this.y + this.height >= cpu.y &&
            this.y <= cpu.y + cpu.height
        ) {
            this.dx = -this.dx;
            this.x = cpu.x - this.width; // Avoid sticking
            paddleTapSound.play();
        }

        // Check if ball goes out of bounds and update score
        if (this.x < 0) {
            cpuScore++;
            this.reset();
        }

        if (this.x + this.width > canvas.width) {
            playerScore++;
            this.reset();
        }
    }

    reset() {
        this.x = canvas.width / 2 - this.width / 2;
        this.y = canvas.height / 2 - this.height / 2;
        this.dx = 5 * (Math.random() < 0.5 ? 1 : -1); // Randomize direction
        this.dy = 5 * (Math.random() < 0.5 ? 1 : -1);
    }
}

// Initialize game objects
const player = new Paddle(20, canvas.height / 2 - 50, 20, 100, 'white');
const cpu = new Paddle(canvas.width - 40, canvas.height / 2 - 50, 20, 100, 'white');
const ball = new Ball(canvas.width / 2 - 10, canvas.height / 2 - 10, 20, 20, 'white');

// Handle player input
let keys = {};
window.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});

window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

// Game loop
function animate() {
    c.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Scores
    drawScore();

    // Player movement
    if (keys['ArrowUp']) player.move(-player.speed);
    if (keys['ArrowDown']) player.move(player.speed);

    // CPU movement (simple AI)
    if (ball.y < cpu.y + cpu.height / 2) cpu.move(-cpu.speed / 1.5);
    else if (ball.y > cpu.y + cpu.height / 2) cpu.move(cpu.speed / 1.5);

    // Update and draw objects
    ball.update(player, cpu);
    player.draw();
    cpu.draw();
    ball.draw();

    requestAnimationFrame(animate);
}

animate();
