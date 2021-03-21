import convertDuration from './utils/convertDuration.js';

let playing = false;
let duration;
let currentTime;

const Player = function () {
  this.audio = new Audio();
  this.songList = '2018-08-21_-_Tears_Wont_Stop_-_David_Fesliyan.mp3';
  this.audio.src = this.songList;

  this.init();

  return {
    togglePlayPause: () => this.togglePlayPause(),
  };
};

Player.prototype = {
  init() {
    this.audio.ontimeupdate = () => {
      duration = convertDuration(this.audio.duration);
      currentTime = convertDuration(this.audio.currentTime);
    };
    this.audio.oncanplay = () => {};
    this.audio.onplaying = () => {};
    this.audio.onpause = () => {};
    this.audio.onended = () => {};
  },
  play() {
    if (!playing) {
      playing = true;
      this.audio.play();
    }
  },
  pause() {
    if (playing) {
      this.audio.pause();
      playing = false;
    }
  },
  togglePlayPause() {
    if (playing) this.pause();
    else this.play();
  },
  next() {},
  previous() {},
  shuffle() {},
  repeat() {},
  volume() {},
};

const initPlayer = new Player();

const { togglePlayPause } = initPlayer;
