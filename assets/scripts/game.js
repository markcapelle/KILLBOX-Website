// Canvas setup
// Setup derived from a mixture of an MDN_ tutorial with suggestions from Copilot
// https://developer.mozilla.org/en-US/docs/Games/Tutorials/2D_Breakout_game_pure_JavaScript/Create_the_Canvas_and_draw_on_it
const viewport = document.getElementById('game-viewport');
const canvas = document.createElement('canvas');
canvas.width = 375;
canvas.height = 540; // leave room for controls
viewport.appendChild(canvas);
const ctx = canvas.getContext('2d');

// Load Assets
// Player Assets
const playerSprite = new Image();
playerSprite.src = "assets/images/Triangle.png";

// Enemy Assets
const enemySprite = new Image();
enemySprite.src = "assets/images/RedSquare.png";
const enemies = []; // Array of enemy objects

// Bullet Assets
const bullets = [];

// Starfield background
const starfield = createStarfield(200, canvas.width, canvas.height);

// Game Variables
let gameState = "welcome"; 
// States: 
// welcome - Initial load
// playing - game in progress
// respawning - state has no overlays, just prevents player input during spawning process, gives time for enemies to clear the field
// paused - pause spawning, prevent input, halt updates
// gameover - clear all projectile and enemy objects, display gameover overlay

// Player respawn co-ordinates
const playerSpawn = { // Not technically a variable, but making it an object allows cleaner storage of x and y co-ords
    x: canvas.width / 2,
    y: canvas.height - 40
}

let spawnRate = 100; // Time between enemy spawns in ms. higher = slower, lower = faster

// ========================= Buttons =========================
const playBtn = document.getElementById("play-btn"); // Play button
const pauseBtn = document.getElementById("pause-btn"); // Pause button
const quitBtn = document.getElementById ("quit-btn"); // Quit button

// On play button click switch game state
playBtn.addEventListener("click", () => {
    if(gameState === "respawning") {
        return; // Ignore clicks if player is in the middle of respawn countdown
    }
    
    if (gameState === "gameover") { // If in a gameover state, then player.lives will be zero. in this case, reset them to 3 to reset game.
        player.lives = 3;
        player.score = 0;
        gameState = "playing";
        enemySpawn(true);
    }

    // Normal case start/resume
    gameState = "playing"; 
    enemySpawn(true); // enemyspawn function prevents duplication, so the play button can be multi-clicked to no ill effect
}); // Could send all this to a startGame function - for readability against other button functions, leaving it in the eventlistener function is better

// On pause button click pause game
pauseBtn.addEventListener("click", () => {
    if (gameState === "playing") { // Only able to pause if the gamestate is playing
        gameState = "paused";
        enemySpawn(false);
        playPause();
    }
});

// On quit button click (will) trigger gameover
quitBtn.addEventListener("click", () => {
    if (gameState === "playing" || gameState === "paused") {
        player.lives = 1;
        killPlayer();
    }
});

// ========================= Objects / Classes =========================
// Player Object
const player = {
    x: playerSpawn.x, // Initial position center horizontal - sprite width
    y: playerSpawn.y, // Initial position near bottom
    width: 16,
    height: 16,
    speed: 4,
    lives: 3,
    score: 0,

    canFire: true,
    fireCooldown: 200, // Milliseconds between shots

    // Draw player sprite
    draw() {
        if (playerSprite.complete) {
            ctx.drawImage(playerSprite, this.x, this.y, this.width, this.height);
        }
    },
    
    // Move player
    move(dx, dy) {
        this.x += dx;
        this.y += dy;
        // Clamp to canvas bounds
        this.x = Math.max(0, Math.min(canvas.width - this.width, this.x));
        this.y = Math.max(0, Math.min(canvas.height - this.height, this.y));
    }
};

// Enemy class 
class Enemy {
    constructor(canvasWidth, canvasHeight, enemySprite) { // Constructor function sets variables on a per object basis, giving each spawned object their own values
        this.sprite = enemySprite;
        this.x = Math.random() * canvasWidth; //random spawn position above top of canvas
        this.y = -16;
        this.speed = 3 + Math.random() * 3; // Random downward speed between 3 and 6
        this.width = 16;
        this.height = 16;
        this.despawnY = canvasHeight;
        this.dead = false;
    }
    
    update() {
        this.y += this.speed; // Move the enemy downward

        if (this.y > this.despawnY) {
            this.dead = true; // Once the despawn threshold is reached, flag the object for destruction
        }
    }

    draw(ctx) {
        ctx.drawImage(this.sprite, this.x, this.y, this.width, this.height)
    }
}

// Bullet class
class Bullet {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 3;
        this.height = 8;
        this.speed = 8;
        this.despawnY = -this.height // Top of the canvas
        this.dead = false;
    }

    update() {
        this.y -= this.speed;

        if (this.y <= this.despawnY) { // Mark bullet for destruction when it goes beyond the canvas
            this.dead = true;
        }
    }

    draw(ctx) { // Javascript will procedurally draw each bullet on object creation
        ctx.fillStyle = "white";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

// ========================= Functions =========================
function drawOverlay(type) {
    ctx.save(); // Keeps canvas state clean
    
    switch (type) {
        case "welcome":
            ctx.fillStyle = "white";
            ctx.font = "28px Arial";
            ctx.textAlign = "center";
            ctx.fillText("KILLBOX", canvas.width / 2, 200);
            ctx.font = "18px Arial";
            ctx.fillText("Use the arrow keys to move.", canvas.width / 2, 260);
            ctx.fillText("Use spacebar to shoot.", canvas.width / 2, 280);
            ctx.fillText("Press Play to Begin", canvas.width / 2, 310);
            break;

        case "paused":
            ctx.fillStyle = "rgba(0, 0, 0, 0.5)"; // Blur the background
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "white";
            ctx.font = "24px Arial";
            ctx.textAlign = "center";
            ctx.fillText("PAUSED", canvas.width / 2, canvas.height / 2);
            break;
        
        case "gameover":
            ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "red";
            ctx.font = "26px Arial";
            ctx.textAlign = "center";
            ctx.fillText("GAME OVER", canvas.width / 2, 240);
            ctx.font = "18px Arial";
            ctx.fillStyle = "white";
            ctx.fillText("Total Score:", canvas.width / 2, 280)
            ctx.fillText(player.score, canvas.width / 2, 310)
            ctx.fillText("Press Play to Restart", canvas.width / 2, 340);
            break;

        case "respawning":
            ctx.fillStyle = "white";
            ctx.font = "24px Arial";
            ctx.textAlign = "center";
            ctx.fillText("Respawning in 3...", canvas.width / 2, canvas.height / 2);

        default:
            // no overlay
            break;
    }

    ctx.restore();
}

function drawHUD() {
    ctx.fillStyle = "white";
    ctx.font = "14px Arial";

    // Lives top left
    ctx.textAlign = "left";
    ctx.fillText(`Lives: ${player.lives}`, 10, 20);

    // Score top right
    ctx.textAlign = "right"
    ctx.fillText(`Score: ${player.score}`, canvas.width - 25, 20)
}

// Spawn enemies
function enemySpawn(active) {
    if (active) { // On true turn spawning on
        // Prevent stacking
        if (enemySpawn.active) {
            return; 
        }
        else {
            enemySpawn.active = true;
        }

        enemySpawn.interval = setInterval(() => {
            if (gameState === "playing") {
                enemies.push(new Enemy(canvas.width, canvas.height, enemySprite));
            }
        }, spawnRate);
    }
    else{ // Turn spawning off
        clearInterval(enemySpawn.interval);
        enemySpawn.active = false;
    }
}

function killPlayer() {
    player.lives -= 1;
    enemySpawn(false);
    bullets.length = 0;
    
    if (player.lives > 0) {
        playerRespawn();
    }
    else {
        gameOver();
    }
}

function playerRespawn() {
    gameState = "respawning"; // Prevents input, stops drawing player so they become hidden
    
    // Set player to their spawn point
    player.x = playerSpawn.x;
    player.y = playerSpawn.y;

    playRespawn(); // Play respawn sound in audio.js
        
    setTimeout(() => { // Few seconds timeout, then change back to a playing gamestate
        gameState = "playing";
        enemySpawn(true);
    }, 3100); // Custom timeout to synch up with the respawn sound.
}

function gameOver() {
    gameState = "gameover";
    enemies.length = 0;
    bullets.length = 0;
    player.x = playerSpawn.x;
    player.y = playerSpawn.y;
    playGameOver(); // Play gameover sound in audio.js
}

function fireBullet() {
    if (!player.canFire) {
        return;
    }

    bullets.push(new Bullet(
        player.x + player.width / 2 - 1,
        player.y
    ));

    player.canFire = false;
    playLaser(); // Play laser sound in audio.js

    setTimeout(() => { // Timeout to control rate of fire
        player.canFire = true;
    }, player.fireCooldown);
}

// ========================= Collision =========================
// A pretty generic axis-aligned bounding box collision algorithm. Simply checks A overlap with B
// Will work player vs enemy, bullet vs enemy, etc
// Used example from MDN_
// https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection#collision_performance
function isColliding(a, b) { 
    return (
        a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y
    );
}

// Generate starfield background
function createStarfield(count, width, height) {
    const stars = [];

    for (let i = 0; i < count; i++) {
        stars.push({
            x: Math.random() * width,
            y: Math.random() * height,
            speed: 2 + Math.random() * 6,
            size: 1 + Math.random() * 2,
            alpha: 0.3 + Math.random() * 0.7, // Opacity
        });
    }

    return {
        update() {
            for (const s of stars) {
                s.y += s.speed;
                if (s.y > height) { // Recycle stars, as they move off the bottom of the canvas restore them back up the top at a random x coordinate
                    s.y = 0;
                    s.x = Math.random() * width;
                }
            }
        },

        draw(ctx) {
            for (const s of stars) {
                ctx.fillStyle = `rgba(255, 255, 255, ${s.alpha})`; // Color white with random alpha
                ctx.fillRect(s.x, s.y, s.size, s.size);
            }
        }
    };
}


// ========================= Input =========================
// Input listener
const keys = {};
window.addEventListener('keydown', e => {
    // Prevent browser scrolling when game controls are used
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)) {
        e.preventDefault();
    }
    keys[e.key] = true;
}, { passive:false });

window.addEventListener('keyup', e => {
    keys[e.key] = false;
});
 
// ========================= Game Loop =========================
function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Always draw the canvas

    // Using if statements to determine what to do or display depending on the game state
    // An alternative to using if statements is to use a switch. The performance difference appears to be zero, only difference is readability.
    if (gameState === "welcome") {
        drawOverlay("welcome");
        requestAnimationFrame(update);
        return;
    }

    if (gameState === "paused") {
        // Draw the background player, enemies and bullets so they stay visible on screen
        starfield.draw(ctx);
        player.draw();
        enemies.forEach(e => e.draw(ctx));
        bullets.forEach(b => b.draw(ctx));

        drawOverlay("paused");
        requestAnimationFrame(update);
        return;
    }

    if (gameState === "gameover") {
        drawOverlay("gameover");
        requestAnimationFrame(update);
        return;
    }

    if (gameState === "respawning") {
        drawOverlay("respawning");

        starfield.draw(ctx);
        starfield.update();

        enemies.forEach(e => e.update());
        enemies.forEach(e => e.draw(ctx));
    }

    if (gameState === "playing") {
        // Player movement
        let dx = 0, dy = 0;
        if (keys['ArrowLeft']) dx -= player.speed;
        if (keys['ArrowRight']) dx += player.speed;
        if (keys['ArrowUp']) dy -= player.speed;
        if (keys['ArrowDown']) dy += player.speed;
    
        if (keys[" "]) {
            fireBullet();
        }
        // Draw the background - draw it early to make sure it's drawn first with everything else on top
        starfield.draw(ctx);
        starfield.update();

        // Player updates
        player.move(dx, dy);
        player.draw();

        // Enemy updates
        enemies.forEach(e => e.update());
        enemies.forEach(e => e.draw(ctx));

        // Update bullets
        for (let i = bullets.length - 1; i >= 0; i--) {
            bullets[i].update();
            if (bullets[i].dead) {
                bullets.splice(i, 1);
                continue;
            }
            bullets[i].draw(ctx);
        }

        // Player vs enemy collision
        for (let i = 0; i < enemies.length; i++) {
            if (isColliding(player, enemies[i])) { // Check player vs enemy
            killPlayer();
            break; // stop checking after death
            }
        }
        // Bullet vs enemy collision - seperate loop because the array sizes will be different
        for (let i = bullets.length - 1; i >= 0; i--) {
            for (let j = enemies.length - 1; j >= 0; j--) {
                if (isColliding(bullets[i], enemies[j])) { // If a bullet vs enemy is true, destroy both objects
                    const scoreMult = enemies[j].speed >= 5; // Check if enemy spead is 5 or greater to apply score multiplier

                    // Destroy both objects
                    bullets.splice(i, 1);
                    enemies.splice(j, 1);

                    player.score += scoreMult ? 2 : 1; // double score if fast enemy

                    playExplosion(); // Play explosion sound in audio.js
                    break;
                }
            }
        }

    }

    drawHUD(); // Always draw the hud last to paint on top of everything else.

    // Always remove dead enemies
    for (let i = enemies.length - 1; i >= 0; i--) {
        if (enemies[i].dead) { // If dead is true
            enemies.splice(i, 1); // Remove enemy from the array, deleting the object
        }
    }

    // https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame
    requestAnimationFrame(update); // Call the function on the next screen repaint (approx 60 frames per second)
}

update(); // Run the main gameloop
