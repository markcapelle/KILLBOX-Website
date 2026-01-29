
const audioBtn = document.getElementById('audioToggle');
let audioEnabled = false; // Control if music and sound effects are active

// Music
const bgMusic = new Audio("assets/audio/West One Music - Rage Racer.mp3");
bgMusic.volume = 1.0;

// Sound Effects
const Explosion = new Audio("assets/audio/Explosion.mp3");
const Laser = new Audio("assets/audio/Laser.mp3");
const Respawn = new Audio("assets/audio/Respawn.mp3");

// Autoplay on script load
if (audioEnabled) {
    bgMusic.play();
}

audioBtn.addEventListener('click', () => {
    audioEnabled = !audioEnabled; // Toggle state

    if (audioEnabled) {
        // Start music
        bgMusic.play();

        // set sound effects boolean to true

        // Set audio controls button
        audioBtn.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
    } else {
        // Stop music
        bgMusic.pause();
        bgMusic.currentTime = 0;

        // set sound effects boolean to false

        // Set audio controls button
        audioBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
    }
});


// sound effects controller
function playLaser() {
    if (audioEnabled) {
        Laser.currentTime = 0;
        Laser.play();
    }
}
// if sound effects true, allow play of sound effect to be called.