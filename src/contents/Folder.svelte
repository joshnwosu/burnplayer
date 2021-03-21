<script>
  const path = require("path");
  const { ipcRenderer, remote } = require("electron");
  const storage = require("electron-json-storage");
  storage.getDataPath();

  storage.has("paths", (error, haskey) => {
    if (error) throw error;
    if (haskey) {
      storage.get("paths", (error, data) => {
        if (error) throw error;
        if (data && data.paths) {
          console.log(data.paths);
        }
      });
    }
  });

  import Notification from "../utils/Notification";

  import "./styles/folder.css";

  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  import {
    messageStore,
    progressStore,
    progressFileStore,
    folderStore,
    totalFileLengthStore,
    musicID,
    AlertMessageStore,
    handleClickStore,
  } from "../store/music";
  import Menu from "../components/Menu/Menu.svelte";
  import convertDuration from "../utils/convertDuration";
  import Header from "../components/Header/Header.svelte";

  let message;
  let progress;
  let progressFile;
  let folder;
  let fileLength;
  let id;
  let alertMessage;

  messageStore.subscribe((ms) => (message = ms));
  progressStore.subscribe((ps) => (progress = ps));
  progressFileStore.subscribe((pfs) => (progressFile = pfs));
  folderStore.subscribe((fs) => (folder = fs));
  totalFileLengthStore.subscribe((tfls) => (fileLength = tfls));
  AlertMessageStore.subscribe((ems) => (alertMessage = ems));
  musicID.subscribe((mID) => (id = mID));

  $: musicId = id;

  $: paths = folder ? folder : [];

  const openDialog = () => {
    ipcRenderer.send("open-file-dialog");
  };

  // function totalAudioDuration(path) {
  //   let totalDuration = path.metadata.reduce((a, b) => ({
  //     duration: a.duration + b.duration,
  //   }));

  //   return totalDuration.duration;
  // }

  // let folderIndex;

  const showFolderSong = (value) => (event) => {
    if (event.target.closest(".folder-menu-more")) return;
    // folderIndex = value;
    console.log(value);
  };

  // const closeFolderSong = () => {
  //   folderIndex = null;
  //   document
  //     .querySelector(".folder-music-overlay")
  //     .classList.remove("overlay-show");
  // };

  $: alertM = alertMessage;

  $: if (alertM) {
    var notification = new Notification({
      message: `<p><h3>${alertM.msg}</h3> <h5>${alertM.path}</h5><p>`,
      layout: alertM.layout,
      effect: alertM.effect,
      type: alertM.type,
      ttl: 6000,
    });

    notification.show();
  }

  // storage.has("path", (error, haskey) => {
  //   if (error) throw error;
  //   if (haskey) {
  //     storage.get("path", (error, data) => {
  //       if (error) throw error;
  //       console.log(data);
  //     });
  //   }
  // });
</script>

<Header id="folder-component">
  <h3>Folders</h3>

  <button class="btn" on:click={openDialog}>
    <svg viewBox="0 0 64 58.67">
      <g id="Layer_2" data-name="Layer 2">
        <g id="Layer_1-2" data-name="Layer 1">
          <path
            class="cls-1"
            d="M45.33,50.67h5.34V56A2.67,2.67,0,1,0,56,56V50.67h5.33a2.67,2.67,0,0,0,0-5.34H56V40a2.67,2.67,0,1,0-5.33,0v5.33H45.33a2.67,2.67,0,0,0,0,5.34Z" />
          <path
            class="cls-1"
            d="M34.67,53.33H8a2.67,2.67,0,0,1-2.67-2.66v-32A2.67,2.67,0,0,1,8,16H58.67V29.33A2.66,2.66,0,0,0,61.33,32h0A2.66,2.66,0,0,0,64,29.33V8a8,8,0,0,0-8-8H45.33a8,8,0,0,0-6.4,3.2l-5.6,7.47H8a8,8,0,0,0-8,8v32a8,8,0,0,0,8,8H34.67A2.67,2.67,0,0,0,37.33,56h0A2.67,2.67,0,0,0,34.67,53.33ZM43.2,6.4a2.68,2.68,0,0,1,2.13-1.07H56A2.68,2.68,0,0,1,58.67,8v2.67H40Z" />
        </g>
      </g></svg>
    Add Music
  </button>
</Header>

<div class="folder-wrapper">
  {#each paths as p, index}
    <div class="folder-item" on:click={showFolderSong(index)}>
      <div class="folder-item-left">
        <span
          class="index">{index + 1 <= 9 ? '0' + (index + 1) : index + 1}</span>
        <span class="icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 36">
            <path
              class="a"
              d="M43,36H5a5,5,0,0,1-5-5V5A5,5,0,0,1,5,0h8.56A3,3,0,0,1,15.9,1.13l2.2,2.74A3,3,0,0,0,20.44,5H43a5,5,0,0,1,5,5V31A5,5,0,0,1,43,36Z" />
          </svg>
        </span>

        <div class="text">
          <h4>{path.parse(p.path).name}</h4>
          <h5>{p.path}</h5>
        </div>
      </div>

      <div class="folder-item-right">
        <!-- <p>
          {p.metadata.length > 1 ? p.metadata.length + ' Songs' : p.metadata.length + ' Song'}
        </p>
        <p>{convertDuration(totalAudioDuration(p))}</p> -->
        <div
          data-index={index}
          class="folder-menu-more context-menu-btn"
          context-btn-id={index + '-folder-menu-more'}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
            <path
              d="M47.58,26.08c-7.83.25-7.83,11.6,0,11.84C55.41,37.67,55.4,26.32,47.58,26.08Z" />
            <path
              d="M32,26.08c-7.83.25-7.83,11.6,0,11.84C39.83,37.67,39.83,26.32,32,26.08Z" />
            <path
              d="M16.42,26.08c-7.83.25-7.82,11.6,0,11.84C24.25,37.67,24.25,26.32,16.42,26.08Z" />
          </svg>
        </div>

        <div class="context-menu" context-menu-id={index + '-folder-menu-more'}>
          <ul>
            <li class="context-menu-list">
              <span class="context-menu-text">Open folder</span>
            </li>
            <li class="context-menu-list">
              <span class="context-menu-text">Remove folder</span>
            </li>
            <div class="context-menu-seperator" />
            <li class="context-menu-list">
              <span class="context-menu-text">Properties</span>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- <div
      class="display-folder-music {folderIndex !== index ? ' slideOut' : ' slideIn'}">
      <div class="display-folder-header" on:click={closeFolderSong}>
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M1.29289 1.29289C1.68342 0.902369 2.31658 0.902369 2.70711 1.29289L12 10.5858L21.2929 1.29289C21.6834 0.902369 22.3166 0.902369 22.7071 1.29289C23.0976 1.68342 23.0976 2.31658 22.7071 2.70711L13.4142 12L22.7071 21.2929C23.0976 21.6834 23.0976 22.3166 22.7071 22.7071C22.3166 23.0976 21.6834 23.0976 21.2929 22.7071L12 13.4142L2.70711 22.7071C2.31658 23.0976 1.68342 23.0976 1.29289 22.7071C0.902369 22.3166 0.902369 21.6834 1.29289 21.2929L10.5858 12L1.29289 2.70711C0.902369 2.31658 0.902369 1.68342 1.29289 1.29289Z" />
        </svg>
        <p>{path.parse(p.path).name}</p>
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M1 2C1 1.44772 1.44772 1 2 1H7C7.55228 1 8 1.44772 8 2C8 2.55228 7.55228 3 7 3H4.41421L9.70711 8.29289C10.0976 8.68342 10.0976 9.31658 9.70711 9.70711C9.31658 10.0976 8.68342 10.0976 8.29289 9.70711L3 4.41421V7C3 7.55228 2.55228 8 2 8C1.44772 8 1 7.55228 1 7V2ZM17 1H22C22.5523 1 23 1.44772 23 2V7C23 7.55228 22.5523 8 22 8C21.4477 8 21 7.55228 21 7V4.41421L15.7071 9.70711C15.3166 10.0976 14.6834 10.0976 14.2929 9.70711C13.9024 9.31658 13.9024 8.68342 14.2929 8.29289L19.5858 3H17C16.4477 3 16 2.55228 16 2C16 1.44772 16.4477 1 17 1ZM9.70711 14.2929C10.0976 14.6834 10.0976 15.3166 9.70711 15.7071L4.41421 21H7C7.55228 21 8 21.4477 8 22C8 22.5523 7.55228 23 7 23H2C1.44772 23 1 22.5523 1 22V17C1 16.4477 1.44772 16 2 16C2.55228 16 3 16.4477 3 17V19.5858L8.29289 14.2929C8.68342 13.9024 9.31658 13.9024 9.70711 14.2929ZM14.2929 14.2929C14.6834 13.9024 15.3166 13.9024 15.7071 14.2929L21 19.5858V17C21 16.4477 21.4477 16 22 16C22.5523 16 23 16.4477 23 17V22C23 22.5523 22.5523 23 22 23H17C16.4477 23 16 22.5523 16 22C16 21.4477 16.4477 21 17 21H19.5858L14.2929 15.7071C13.9024 15.3166 13.9024 14.6834 14.2929 14.2929Z" />
        </svg>
      </div>
      <div class="display-folder-scroll">
        {#each p.metadata as slct, index}
          <li
            style="background-color:{musicId === slct.id ? 'red' : 'transparent'}">
            <div class="display-info">
              <h6>{index + 1 <= 9 ? '0' + (index + 1) : index + 1}</h6>
              <div>
                <h3 class="title">{slct.title}</h3>
                <h5 class="artist">{slct.artist}</h5>
              </div>
            </div>

            <h5>{slct.convertDuration}</h5>
          </li>
        {/each}
      </div>
    </div> -->
  {/each}
</div>

<div
  class="folder-progress {progress < 100 && progress > 0 ? 'show-progress' : 'hide-progress'}">
  <div class="progress-message">
    <!-- <span class="progress-icon">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 36">
        <path
          class="a"
          d="M43,36H5a5,5,0,0,1-5-5V5A5,5,0,0,1,5,0h8.56A3,3,0,0,1,15.9,1.13l2.2,2.74A3,3,0,0,0,20.44,5H43a5,5,0,0,1,5,5V31A5,5,0,0,1,43,36Z" />
      </svg>
    </span>
    {message} -->
  </div>
  <div class="progress-content">
    <div class="progress-loader">
      <div class="progress">
        <div class="progress-fill" style="width: {progress}%" />
      </div>
      <div class="progress-percentage">
        {progress > 0 ? Math.floor(progress) + '%' : ''}
      </div>
    </div>
    <div class="progress-files">{progressFile || ''}</div>
  </div>
</div>
