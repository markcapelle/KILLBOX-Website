const audioBtn = document.getElementById('audioToggle');
let audioEnabled = false; // Control if music and sound effects are active

// Music
const bgMusic = new Audio("assets/audio/West One Music - Rage Racer.mp3");
bgMusic.loop = true;
bgMusic.volume = 1.0;

// Sound Effects
const Explosion = new Audio("assets/audio/Explosion.mp3");
const Laser = new Audio("assets/audio/Laser.mp3");
const Respawn = new Audio("assets/audio/Respawn.mp3");
const Pause = new Audio("assets/audio/Pause.mp3");
const GameOver = new Audio("assets/audio/GameOver.mp3");

// Autoplay on script load
if (audioEnabled) {
    bgMusic.play();
}

audioBtn.addEventListener('click', () => {
    audioEnabled = !audioEnabled; // Toggle state

    if (audioEnabled) {
        // Start music
        bgMusic.play();

        // Set audio controls button
        audioBtn.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
    } else {
        // Stop music
        bgMusic.pause();
        bgMusic.currentTime = 0;

        // Set audio controls button
        audioBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
    }
});


// Sound effects controller
// If audioEnabled is true, allow play of sound effects
function playLaser() {
    if (audioEnabled) {
        Laser.currentTime = 0;
        Laser.play();
    }
}

function playExplosion() {
    if (audioEnabled) {
        Explosion.currentTime = 0;
        Explosion.play();
    }
}

function playRespawn() {
    if (audioEnabled) {
        Respawn.currentTime = 0;
        Respawn.play();
    }
}

function playPause() {
    if (audioEnabled) {
        Pause.currentTime = 0;
        Pause.play();
    }
}

function playGameOver() {
    if (audioEnabled) {
        GameOver.currentTime = 0;
        GameOver.play();
    }
}