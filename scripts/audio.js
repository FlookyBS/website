const nowPlaying = document.getElementById("song-indicator");

const audio = new Audio();
audio.volume = 1.0;
audio.preload = "auto";

let started = false;
let tracks = [];
let lastTrackIndex = -1;

// pick a random track that's NOT the last one
function getNextTrack() {
  if (tracks.length === 0) return null;

  let index;
  do {
    index = Math.floor(Math.random() * tracks.length);
  } while (tracks.length > 1 && index === lastTrackIndex);

  lastTrackIndex = index;
  return tracks[index];
}

function playTrack(track) {
  audio.src = track.file;
  audio.muted = false;

  audio.play().then(() => {
    nowPlaying.innerHTML =
      `𝅘𝅥𝅮 "<a href="${track.url}" target="_blank">${track.title}</a>" by ${track.artist}`;
  }).catch(e => {
    console.error("Playback failed:", e);
  });
}

async function startAudio() {
  if (started) return;

  try {
    const res = await fetch("/assets/tracks.json", { cache: "no-store" });
    tracks = await res.json();

    const track = getNextTrack();
    playTrack(track);

    started = true;

    document.removeEventListener("touchstart", startAudio);
    document.removeEventListener("click", startAudio);

  } catch (e) {
    console.error("Audio start failed:", e);
  }
}

// when a song ends, play another
audio.addEventListener("ended", () => {
  const nextTrack = getNextTrack();
  if (nextTrack) {
    playTrack(nextTrack);
  }
});

// FIRST interaction starts audio
document.addEventListener("touchstart", startAudio);
document.addEventListener("click", startAudio);