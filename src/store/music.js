import { writable } from 'svelte/store';

let music = writable([]);
let messageStore = writable('');
let AlertMessageStore = writable('');
let playlistStore = writable([]);
let progressStore = writable('');
let progressFileStore = writable('');
let folderStore = writable([]);
let playerStore = writable(null);
let handleClickStore = writable(null);
let audioContext = writable(null);
let totalFileLengthStore = writable('');
let musicID = writable('');
let audioStatus = writable({
  playing: false,
  currentTime: '',
  duration: '',
  lastPlayed: [],
  shuffle: false,
  repeat: 0,
  counter: 0,
  nowPlaying: null,
  audio: null,
});
let toggleNav = writable(true);
let toggleSetting = writable(null);
let togglePlaylist = writable(true);

// Here we store only the song's ID
let favoriteStore = writable([]);

// current time for song playing with progress
let currentSongWidth = writable(null);

// Add to favorite function store
let addToFavoriteFunc = writable(null);

// context menu store funcrion
let contextMenuStore = writable(null);

let showAlbumDetail = writable(null);

let showArtistDetail = writable(null);

let audioStore = writable(null);

let toggleSearchFunc = writable(null);

export {
  music,
  playlistStore,
  messageStore,
  AlertMessageStore,
  progressStore,
  progressFileStore,
  folderStore,
  playerStore,
  handleClickStore,
  audioContext,
  totalFileLengthStore,
  musicID,
  audioStatus,
  toggleNav,
  togglePlaylist,
  currentSongWidth,
  favoriteStore,
  addToFavoriteFunc,
  toggleSetting,
  contextMenuStore,
  showAlbumDetail,
  showArtistDetail,
  audioStore,
  toggleSearchFunc,
};

// export default music;
