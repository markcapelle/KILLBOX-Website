
const audioBtn = document.getElementById('audioToggle');
let audioEnabled = true; // Music is ON when game loads

const bgMusic = new Audio("assets/audio/West One Music - Rage Racer.mp3");

bgMusic.volume = 1.0;

// Autoplay on script load
bgMusic.play();


// sound effects parameters
// boolean as to wether or not to play sound effects


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
// if sound effects true, allow play of sound effect to be called.