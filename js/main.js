// === clk.js === ⏰ Zegar i dzień tygodnia
const clockElem = document.getElementById('clock');
let showClock = true;

const dniTygodnia = ['Niedziela', 'Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota'];

function pad(n) {
  return n.toString().padStart(2, '0');
}

function tick() {
  if (!showClock) return;
  const now = new Date();
  clockElem.innerHTML = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
}

function showDate() {
  const now = new Date();
  const date = `${pad(now.getDate())}.${pad(now.getMonth() + 1)}.${now.getFullYear()}`;
  const day = dniTygodnia[now.getDay()];
  clockElem.innerHTML = `${date}<br><span class="weekday">${day}</span>`;
}

setInterval(tick, 1000);
tick();

clockElem.addEventListener('mouseover', () => {
  showClock = false;
  showDate();
});

clockElem.addEventListener('mouseout', () => {
  showClock = true;
  tick();
});


// === menu.js === 🍔 Hamburger menu
function toggleMenu() {
  document.getElementById('mainNav').classList.toggle('active');
}


// === social.js === 🔊 YouTube BG + ochrona
let ytPlayer;
const INIT_VOL = 20;

function onYouTubeIframeAPIReady() {
  ytPlayer = new YT.Player('yt-player', {
    height: '0',
    width: '0',
    playerVars: {
      listType: 'playlist',
      list: 'PLn6cILWLw7kbgZvMx_9NoDVb9ED9JBQvZ',
      autoplay: 1,
      loop: 1,
      controls: 0,
      modestbranding: 1,
      mute: 1
    },
    events: { onReady: onYTReady }
  });
}

function onYTReady() {
  const enableAudio = () => {
    ytPlayer.unMute();
    ytPlayer.setVolume(INIT_VOL);
    window.removeEventListener('click', enableAudio);
  };
  window.addEventListener('click', enableAudio, { once: true });
}

// === security.js === 🛡️ Anti-F12 & right-click
//window.addEventListener('contextmenu', e => e.preventDefault());
//window.addEventListener('keydown', e => {
// if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I')) {
// e.preventDefault();
//}
//});