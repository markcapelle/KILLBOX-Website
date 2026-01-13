
// Canvas setup
const viewport = document.getElementById('game-viewport');
const canvas = document.createElement('canvas');
canvas.width = 375;
canvas.height = 540; // leave room for controls
viewport.appendChild(canvas);
const ctx = canvas.getContext('2d');

// Load Assets
const playerSprite = new Image();
playerSprite.src = "assets/images/Triangle.png";
// enemy sprite box.png

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

// Input handling
const keys = {};
window.addEventListener('keydown', e => keys[e.key] = true);
window.addEventListener('keyup', e => keys[e.key] = false);

// Game loop
function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

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

    requestAnimationFrame(update);
}

update();
