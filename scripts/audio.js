const nowPlaying = document.getElementById("song-indicator");

const audio = new Audio();
audio.volume = 1.0;
audio.preload = "auto";
let started = false;

async function startAudio() {
  if (started) return;

  try {
    const res = await fetch("../assets/tracks.json", { cache: "no-store" });
    const tracks = await res.json();
    const track = tracks[Math.floor(Math.random() * tracks.length)];

    audio.src = track.file;
    audio.muted = false;

    await audio.play();

    started = true;

    nowPlaying.innerHTML =
  `𝅘𝅥𝅮 "<a href="${track.url}" target="_blank">${track.title}</a>" by ${track.artist}`;

    document.removeEventListener("touchstart", startAudio);
    document.removeEventListener("click", startAudio);

  } catch (e) {
    console.error("Audio start failed:", e);
    // DO NOT remove listeners → allow retry
  }
}

// FIRST interaction starts audio
document.addEventListener("touchstart", startAudio);
document.addEventListener("click", startAudio);