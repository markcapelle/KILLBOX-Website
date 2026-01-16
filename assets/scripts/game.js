
// Canvas setup
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
enemySprite.src = "assets/images/Box.jpg";
const enemies = []; // Array of enemy object

// Music


// Game Variables
let gameState = "welcome"; 
// States: 
// welcome - Initial load
// playing
// respawning - state has no overlays, just prevents player input during spawning process
// paused - pause
// gameover

// Player respawn co-ordinates
const playerSpawn = { // Not technically a variable, but making it an object allows cleaner storage of x and y co-ords
    x: canvas.width / 2,
    y: canvas.height - 40
}

let spawnRate = 1000; // Time between enemy spawns in ms. higher = slower, lower = faster

const playBtn = document.getElementById("play-btn"); // Play button
const pauseBtn = document.getElementById("pause-btn"); // Pause button
const quitBtn = document.getElementById ("quit-btn"); // Quit button

// On play button click switch game state
playBtn.addEventListener("click", () => {
    gameState = "playing"; 
    enemySpawn(true); // enemyspawn function prevents duplication, so the play button can be multi-clicked to no ill effect
});

// On pause button click pause game
pauseBtn.addEventListener("click", () => {
    if (gameState === "playing") { // Only able to pause if the gamestate is playing
        gameState = "paused";
        enemySpawn(false);
    }    
});

// On quit button click (will) trigger gameover
quitBtn.addEventListener("click", () => {
    return; // do nothign for the moment
    //will set player.lives to 0 and call killPlayer()
});

// ========================= Objects =========================
// Player Object
const player = {
    x: playerSpawn.x, // Initial position center horizontal - sprite width
    y: playerSpawn.y, // Initial position near bottom
    width: 16,
    height: 16,
    speed: 4,
    lives: 3,

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

// Enemy Object
class Enemy {
    constructor(canvasWidth, canvasHeight, enemySprite) { // Constructor function sets variables on a per object basis, giving each spawned object their own values
        this.sprite = enemySprite;
        this.x = Math.random() * canvasWidth; //random spawn position above top of canvas
        this.y = -16;
        this.speed = 3 + Math.random() * 3; // Random downward speed between 3 and 6
        this.width = 16;
        this.height = 16;
        this.despawnY = canvasHeight / 2; // Despawn threshold (currently set to half the canvas height to test it's working - enemies should despawn halfway down)
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
            ctx.fillText("Press Play to Begin", canvas.width / 2, 260);
            break;

        case "paused":
            ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
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
            ctx.fillText("Press Play to Restart", canvas.width / 2, 280);
            break;

        default:
            // no overlay
            break;
    }

    ctx.restore();

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

// Kill player
// set gamestate to spawning
// -1 life
// set player.visible to false
// set player x and y to spawnpoint
// pause enemy spawn, wait for all enemy objects to clear
// check if lives less or equal to 0 and if so call gameover()
// else call respawn()

// respawn
// set player to visible
// set gaemstate to playing
// resume enemy spawn

// Game over
// set gamestate to gameover

// new game
// player.lives = 3
// begin spawning enemies



// ========================= Collision =========================
// only possible if player.visible = true


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
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (gameState === "welcome") {
        drawOverlay("welcome");
        requestAnimationFrame(update);
        return;
    }

    if (gameState === "paused") {
        player.draw();
        enemies.forEach(e => e.draw(ctx));
        drawOverlay("paused");
        requestAnimationFrame(update);
        return;
    }

    if (gameState === "gameover") {
        drawOverlay("gameover");
        requestAnimationFrame(update);
        return;
    }

    if (gameState === "playing") {
        // Player movement
        let dx = 0, dy = 0;
        if (keys['ArrowLeft']) dx -= player.speed;
        if (keys['ArrowRight']) dx += player.speed;
        if (keys['ArrowUp']) dy -= player.speed;
        if (keys['ArrowDown']) dy += player.speed;
    
        if (keys[" "]) {
            //fire bullet
        }
        // Player updates
        player.move(dx, dy);
        player.draw();

        // Enemy updates
        enemies.forEach(e => e.update());
        enemies.forEach(e => e.draw(ctx));

        // Remove dead enemies
        for (let i = enemies.length - 1; i >= 0; i--) {
            if (enemies[i].dead) { // If dead is true
                enemies.splice(i, 1); // Remove enemy from the array, deleting the object
            }
        }
    }


    requestAnimationFrame(update);
}

update();
