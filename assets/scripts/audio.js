
const audioBtn = document.getElementById('audioToggle');
let audioEnabled = true; // Music is ON when game loads

const bgMusic = new Audio("assets/audio/West One Music - Rage Racer.mp3");

bgMusic.volume = 1.0;

// Autoplay on script load
bgMusic.play();

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
