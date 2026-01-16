
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
// enemy sprite box.png
// Music


// Game Variables
let gameState = "playing"; 
// States: 
// welcome - Initial load
// playing
// respawning - state has no overlays, just prevents player input during spawning process.
// paused - pause
// gameover


const playBtn = document.getElementById("play-btn");
// pause button
// quit button

// On play button click switch game state
playBtn.addEventListener("click", () => {
    gameState = "playing"; // need a safety so can't be pressed twice, doubling newgame instance

    // call new game function
});

// On pause button click...
// set gamestate "paused"

// On quit button click...
//set player.lives to 0 and call killPlayer()

// ========================= Objects =========================
// Player Object
const player = {
    x: canvas.width / 2 - 8, // Initial position center horizontal - sprite width
    y: canvas.height - 40, // Initial position near bottom
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
        let dx = 0, dy = 0;
        if (keys['ArrowLeft']) dx -= player.speed;
        if (keys['ArrowRight']) dx += player.speed;
        if (keys['ArrowUp']) dy -= player.speed;
        if (keys['ArrowDown']) dy += player.speed;
    
        if (keys[" "]) {
            //fire bullet
        }

        player.move(dx, dy);
        player.draw();

    }


    requestAnimationFrame(update);
}

update();
