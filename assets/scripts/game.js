
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

    draw() {
        // Draw player sprite
        if (playerSprite.complete) {
            ctx.drawImage(playerSprite, this.x, this.y, this.width, this.height);
        }
    }
};


// game loop
function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  
  player.draw();

  requestAnimationFrame(update);
}

update();
