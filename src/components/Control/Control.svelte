<script>
  import {
    addToFavoriteFunc,
    audioContext,
    audioStatus,
    currentSongWidth,
    favoriteStore,
    music,
    musicID,
    playerStore,
    playlistStore,
    togglePlaylist,
  } from "../../store/music";

  import Analyser from "../Analyser/Analyser.svelte";
  import convertDuration from "../../utils/convertDuration";
  import "./Control.css";

  const path = require("path");

  let audio;
  let ref_shuffle;
  let ref_repeat;
  let ref_bar;
  let ref_currentTime;
  let ref_durationTime;
  let ref_volume;
  let sliders;

  $: if ($musicID) {
    sliders = document.querySelectorAll(".slider");

    initPlayer();
  }

  function initPlayer() {
    let index = getMusicIndex();
    let playlist = $playlistStore[index];
    let encodedFile = encodeURIComponent(path.parse(playlist.file).base);
    let readyToPlayFile = "file://" + path.join(playlist.path, encodedFile);

    audio.src = readyToPlayFile;

    // audioContext.set(audio);
    // $audioContext = audio;

    audio.onloadeddata = () => {
      audio.play();
    };

    $audioStatus.nowPlaying = getMusic();

    audio.onloadedmetadata = () => {
      ref_durationTime.textContent = convertDuration(audio.duration);
    };

    audio.ontimeupdate = () => {
      $audioStatus.currentTime = audio.currentTime;

      $currentSongWidth = {
        width: $audioStatus.currentTime
          ? ($audioStatus.currentTime / $audioStatus.duration) * 100 + "%"
          : 0,
      };

      document.title =
        // $playlistStore.findIndex((song) => song.id === $musicID) +
        "No. " +
        (getMusicIndex() + 1) +
        " | " +
        $audioStatus.nowPlaying.title +
        " | " +
        $audioStatus.nowPlaying.artist +
        " | " +
        convertDuration(audio.currentTime);

      updateProgress();
    };

    audio.onvolumechange = () => {
      updateVolume();
    };

    audio.oncanplay = () => {
      $audioStatus.duration = audio.duration;
      $audioStatus.audio = audio;
    };

    audio.onplaying = () => {
      $audioStatus.playing = true;

      $playlistStore.forEach((song) => (song.isPlaying = false));

      $playlistStore[index].isPlaying = true;
    };

    audio.onpause = () => {
      $audioStatus.playing = false;

      $playlistStore.forEach((song) => (song.isPlaying = false));
    };

    audio.onended = () => {
      if ($audioStatus.shuffle) {
        if ($playlistStore.length > 1) {
          let temp = index;
          while (index == temp) {
            index = Math.floor(Math.random() * $playlistStore.length);
          }
          if ($playlistStore[index]) {
            playTrack(index);
          }
        }
      } else {
        if (!$audioStatus.repeat) {
          if (index >= $playlistStore.length - 1) {
            console.log("All music played");
          } else {
            index++;
            playTrack(index);
          }
        } else if ($audioStatus.repeat == 1) {
          if (index >= $playlistStore.length - 1) {
            index = 0;
          } else {
            index++;
          }
          playTrack(index);
        } else if ($audioStatus.repeat == 2) {
          if ($playlistStore[index]) {
            audio.play();
          }
        }
      }
    };
  }

  function getMusicIndex() {
    return $playlistStore.findIndex((song) => song.id === $musicID);
  }

  function getMusic() {
    return $playlistStore.find((song) => song.id === $musicID);
  }

  function selectMusicArt(id) {
    $musicID = id;
  }

  function playTrack(index) {
    if (!$playlistStore) return;
    else {
      if ($playlistStore[index]) {
        $audioStatus.lastPlayed.push(index);
      }

      selectMusicArt(
        $playlistStore[index >= $playlistStore.length ? 0 : index].id
      );
    }
  }

  function playPause() {
    if (!audio.src) return next();

    if (audio.paused) audio.play();
    else audio.pause();
  }

  function next() {
    if (!$playlistStore.length) $playlistStore = $playerStore;
    let index = getMusicIndex();
    if (!$audioStatus.shuffle) {
      index++;
      if (index > $playlistStore.length - 1) index = 0;
    } else {
      if ($playlistStore.length > 1) {
        let temp = index;
        while (index == temp) {
          index = Math.floor(Math.random() * $playlistStore.length);
        }
      }
    }

    if ($playlistStore[index]) {
      playTrack(index);
    }
  }

  function previous() {
    if (!audio.src) return;
    let index = getMusicIndex();
    if (!$audioStatus.shuffle) {
      if (index == 0) index = $playlistStore.length - 1;
      else index--;
    } else {
      $audioStatus.lastPlayed.pop();
      index = $audioStatus.lastPlayed.pop();
    }

    if (index == undefined || index < 0) index = 0;
    playTrack(index);
  }

  function stepforward() {
    audio.currentTime += 10;
  }

  function stepbackward() {
    audio.currentTime -= 10;
  }

  function shuffle() {
    // if (!src) return;
    let that = ref_shuffle;
    if (that.classList.contains("active-shuffle")) {
      that.classList.remove("active-shuffle");
      that.setAttribute("title", "shuffle off");
      that.textContent = "shuffle off";
      $audioStatus.shuffle = false;
    } else {
      that.classList.add("active-shuffle");
      that.setAttribute("title", "shuffle on");
      that.textContent = "shuffle on";
      $audioStatus.shuffle = true;

      if ($audioStatus.repeat == 2) {
        let repeat = ref_repeat;
        let that = repeat;

        that.setAttribute("title", "repeat all");
        $audioStatus.repeat = 1;
      }
    }

    // console.log(that);
  }

  function repeat() {
    let that = ref_repeat;
    if ($audioStatus.repeat == 0) {
      that.classList.add("active-shuffle");
      that.setAttribute("title", "repeat all");
      // that.textContent = "repeat all";
      $audioStatus.repeat = 1;
    } else if ($audioStatus.repeat == 1) {
      that.setAttribute("title", "repeat current");
      // that.textContent = "repeat current";
      $audioStatus.repeat = 2;

      if ($audioStatus.shuffle) {
        let shuffle = ref_shuffle;
        let that = shuffle;

        if (that.classList.contains("active-shuffle")) {
          that.classList.remove("active-shuffle");
          that.setAttribute("title", "shuffle off");
          that.textContent = "shuffle off";
          $audioStatus.shuffle = false;
        } else {
          that.classList.add("active-shuffle");
          that.setAttribute("title", "shuffle on");
          that.textContent = "shuffle on";
          $audioStatus.shuffle = true;
        }
      }
    } else if ($audioStatus.repeat == 2) {
      that.classList.remove("active-shuffle");
      that.setAttribute("title", "repeat off");
      // that.textContent = "repeat off";
      $audioStatus.repeat = 0;
    }

    // console.log(that);
    // that.textContent = "fuck you";
  }

  function updateProgress() {
    var current = audio.currentTime;
    var percent = (current / audio.duration) * 100;
    ref_bar.style.width = percent + "%";

    ref_currentTime.textContent = convertDuration(current);
  }

  var draggabbleClasses = ["pin"];
  var currentlyDragged = null;

  $: if ($musicID) {
    window.addEventListener("mousedown", function (event) {
      if (!isDraggable(event.target)) return false;

      currentlyDragged = event.target;
      var handleMethod = currentlyDragged.dataset.method;

      this.addEventListener("mousemove", window[handleMethod], false);

      window.addEventListener(
        "mouseup",
        function () {
          currentlyDragged = false;
          window.removeEventListener("mousemove", window[handleMethod], false);
        },
        false
      );
    });

    sliders.forEach(function (slider) {
      var pin = slider.querySelector(".pin");
      slider.addEventListener("click", window[pin.dataset.method]);
    });
  }

  function isDraggable(el) {
    var canDrag = false;
    var clases = Array.from(el.classList);
    draggabbleClasses.forEach(function (draggable) {
      if (clases.indexOf(draggable) !== -1) canDrag = true;
    });
    return canDrag;
  }

  function inRange(event) {
    var rangeBox = getRangeBox(event);
    var rect = rangeBox.getBoundingClientRect();
    var direction = rangeBox.dataset.direction;
    if (direction == "horizontal") {
      var min = rangeBox.offsetLeft;
      var max = min + rangeBox.offsetWidth;
      if (event.clientX < min || event.clientX > max) return false;
    } else {
      var min = rect.top;
      var max = min + rangeBox.offsetHeight;
      if (event.clientY < min || event.clientY > max) return false;
    }

    return true;
  }

  function updateVolume() {
    ref_volume.style.height = audio.volume * 100 + "%";
    if (audio.volume >= 0.5) {
      speaker.attributes.d.value =
        "M13 6.00001C13 5.17597 12.0592 4.70559 11.4 5.20001L7.13333 8.40001C6.61404 8.78948 5.98244 9.00001 5.33333 9.00001H3C2.44772 9.00001 2 9.44773 2 10V14C2 14.5523 2.44772 15 3 15H5.33333C5.98244 15 6.61405 15.2105 7.13333 15.6L11.4 18.8C12.0592 19.2944 13 18.8241 13 18V6.00001ZM10.2 3.60001C12.1777 2.11673 15 3.52788 15 6.00001V18C15 20.4722 12.1777 21.8833 10.2 20.4L5.93333 17.2C5.76024 17.0702 5.5497 17 5.33333 17H3C1.34315 17 0 15.6569 0 14V10C0 8.34316 1.34315 7.00001 3 7.00001H5.33333C5.5497 7.00001 5.76024 6.92984 5.93333 6.80001L10.2 3.60001ZM19.6569 4.92895C20.0474 4.53842 20.6805 4.53842 21.0711 4.92895C22.8796 6.7375 24 9.23887 24 12C24 14.7612 22.8796 17.2625 21.0711 19.0711C20.6805 19.4616 20.0474 19.4616 19.6569 19.0711C19.2663 18.6806 19.2663 18.0474 19.6569 17.6569C21.1057 16.2081 22 14.2094 22 12C22 9.7906 21.1057 7.79197 19.6569 6.34316C19.2663 5.95264 19.2663 5.31947 19.6569 4.92895ZM16.8284 7.75737C17.219 7.36685 17.8521 7.36685 18.2426 7.75737C19.3273 8.84206 20 10.3434 20 12C20 13.6566 19.3273 15.158 18.2426 16.2427C17.8521 16.6332 17.219 16.6332 16.8284 16.2427C16.4379 15.8521 16.4379 15.219 16.8284 14.8284C17.5534 14.1035 18 13.1049 18 12C18 10.8952 17.5534 9.89654 16.8284 9.17159C16.4379 8.78106 16.4379 8.1479 16.8284 7.75737Z";
    } else if (audio.volume < 0.5 && audio.volume > 0.05) {
      speaker.attributes.d.value =
        "M15 5.99998C15 5.17594 14.0592 4.70556 13.4 5.19998L9.13333 8.39998C8.61404 8.78945 7.98244 8.99998 7.33333 8.99998H5C4.44772 8.99998 4 9.4477 4 9.99998V14C4 14.5523 4.44772 15 5 15H7.33333C7.98244 15 8.61405 15.2105 9.13333 15.6L13.4 18.8C14.0592 19.2944 15 18.824 15 18V5.99998ZM12.2 3.59998C14.1777 2.1167 17 3.52785 17 5.99998V18C17 20.4721 14.1777 21.8833 12.2 20.4L7.93333 17.2C7.76024 17.0702 7.5497 17 7.33333 17H5C3.34315 17 2 15.6568 2 14V9.99998C2 8.34313 3.34315 6.99998 5 6.99998H7.33333C7.5497 6.99998 7.76024 6.92981 7.93333 6.79998L12.2 3.59998ZM18.8284 7.75734C19.219 7.36682 19.8521 7.36682 20.2426 7.75734C21.3273 8.84204 22 10.3434 22 12C22 13.6566 21.3273 15.1579 20.2426 16.2426C19.8521 16.6332 19.219 16.6332 18.8284 16.2426C18.4379 15.8521 18.4379 15.2189 18.8284 14.8284C19.5534 14.1035 20 13.1048 20 12C20 10.8951 19.5534 9.89651 18.8284 9.17156C18.4379 8.78103 18.4379 8.14787 18.8284 7.75734Z";
    } else if (audio.volume <= 0.05) {
      speaker.attributes.d.value =
        "M13 5.99998C13 5.17594 12.0592 4.70556 11.4 5.19998L7.13333 8.39998C6.61404 8.78945 5.98244 8.99998 5.33333 8.99998H3C2.44772 8.99998 2 9.4477 2 9.99998V14C2 14.5523 2.44772 15 3 15H5.33333C5.98244 15 6.61405 15.2105 7.13333 15.6L11.4 18.8C12.0592 19.2944 13 18.824 13 18V5.99998ZM10.2 3.59998C12.1777 2.1167 15 3.52785 15 5.99998V18C15 20.4721 12.1777 21.8833 10.2 20.4L5.93333 17.2C5.76024 17.0702 5.5497 17 5.33333 17H3C1.34315 17 0 15.6568 0 14V9.99998C0 8.34313 1.34315 6.99998 3 6.99998H5.33333C5.5497 6.99998 5.76024 6.92981 5.93333 6.79998L10.2 3.59998ZM18.2929 9.29291C18.6834 8.90238 19.3166 8.90238 19.7071 9.29291L21 10.5858L22.2929 9.29291C22.6834 8.90238 23.3166 8.90238 23.7071 9.29291C24.0976 9.68343 24.0976 10.3166 23.7071 10.7071L22.4142 12L23.7071 13.2929C24.0976 13.6834 24.0976 14.3166 23.7071 14.7071C23.3166 15.0976 22.6834 15.0976 22.2929 14.7071L21 13.4142L19.7071 14.7071C19.3166 15.0976 18.6834 15.0976 18.2929 14.7071C17.9024 14.3166 17.9024 13.6834 18.2929 13.2929L19.5858 12L18.2929 10.7071C17.9024 10.3166 17.9024 9.68343 18.2929 9.29291Z";
    }
  }

  function getRangeBox(event) {
    var rangeBox = event.target;
    var el = currentlyDragged;
    if (event.type == "click" && isDraggable(event.target)) {
      rangeBox = event.target.parentElement.parentElement;
    }
    if (event.type == "mousemove") {
      rangeBox = el.parentElement.parentElement;
    }

    return rangeBox;
  }

  function getCoefficient(event) {
    var slider = getRangeBox(event);
    var rect = slider.getBoundingClientRect();
    var K = 0;
    if (slider.dataset.direction == "horizontal") {
      var offsetX = event.clientX - slider.offsetLeft;
      var width = slider.clientWidth;
      K = offsetX / width;
    } else if (slider.dataset.direction == "vertical") {
      var offsetY = event.clientY - rect.top;
      var height = slider.clientHeight;
      K = 1 - offsetY / height;
    }
    return K;
  }

  window.rewind = function (event) {
    if (inRange(event)) {
      audio.currentTime = audio.duration * getCoefficient(event);
    }
    // console.log("Event form rewind:", event);
  };

  window.changeVolume = function (event) {
    if (inRange(event)) {
      audio.volume = getCoefficient(event);
    }
  };

  let hideVolume = true;

  const toggleVolume = () => (hideVolume = !hideVolume);

  document.addEventListener("click", (e) => {
    !e.target.closest(".volume") ? (hideVolume = true) : "";
  });

  let timeOut;

  const volumeKey = function (dir) {
    hideVolume = false;

    timeOut = setTimeout(function () {
      hideVolume = true;
    }, 2000);

    if ($audioStatus.playing) {
      if (dir === "ArrowUp") {
        if (audio.volume === 1) return;
        audio.volume += 0.1;
      } else {
        if (audio.volume < 0.1) return;
        audio.volume -= 0.1;
      }
    }
  };

  var handleKeyboardPress = function (e) {
    if (e.target.tagName === "INPUT") return;
    let keycode = e.key;
    switch (keycode) {
      case "MediaPlayPause":
      case " ":
        playPause();
        break;
      case "ArrowRight":
      case "MediaTrackNext":
        next();
        break;
      case "ArrowLeft":
      case "MediaTrackPrevious":
        previous();
        break;
      case "ArrowUp":
        volumeKey("ArrowUp");
        break;
      case "ArrowDown":
        volumeKey("ArrowDown");
        break;
      default:
        break;
    }
  };
</script>

<svelte:window
  on:keyup={(e) => {
    clearTimeout(timeOut);
    if ($playerStore) handleKeyboardPress(e);
  }} />
<div class="control-panel">
  <Analyser />
  <audio bind:this={audio}>
    <track kind="captions" />
  </audio>
  <div class="player-control">
    <div class="left-control">
      {#if $audioStatus.nowPlaying}
        <div class="control-info">
          <div class="control-photo">
            <div class="blur-img">
              <img src={$audioStatus.nowPlaying.picture} alt="" />
            </div>
            <div class="normal-img">
              <img src={$audioStatus.nowPlaying.picture} alt="" />
            </div>
          </div>
          <div class="control-text">
            <h4>{$audioStatus.nowPlaying.title}</h4>
            <h5>{$audioStatus.nowPlaying.artist}</h5>
          </div>
          <div class="control-like">
            <button
              on:click={() => $addToFavoriteFunc($audioStatus.nowPlaying.id)}>
              {#if $favoriteStore.includes($audioStatus.nowPlaying.id)}
                <svg viewBox="0 0 16 16" class="liked">
                  <path
                    d="M8.612,2.347L8,2.997l-0.612-0.65c-1.69-1.795-4.43-1.795-6.12,0c-1.69,1.795-1.69,4.706,0,6.502l0.612,0.65L8,16l6.12-6.502l0.612-0.65c1.69-1.795,1.69-4.706,0-6.502C13.042,0.551,10.302,0.551,8.612,2.347z" />
                </svg>
              {:else}
                <svg
                  role="img"
                  height="16"
                  width="16"
                  viewBox="0 0 16 16"
                  class="like-icon">
                  <path
                    d="M13.764 2.727a4.057 4.057 0 00-5.488-.253.558.558 0 01-.31.112.531.531 0 01-.311-.112 4.054 4.054 0 00-5.487.253A4.05 4.05 0 00.974 5.61c0 1.089.424 2.113 1.168 2.855l4.462 5.223a1.791 1.791 0 002.726 0l4.435-5.195A4.052 4.052 0 0014.96 5.61a4.057 4.057 0 00-1.196-2.883zm-.722 5.098L8.58 13.048c-.307.36-.921.36-1.228 0L2.864 7.797a3.072 3.072 0 01-.905-2.187c0-.826.321-1.603.905-2.187a3.091 3.091 0 012.191-.913 3.05 3.05 0 011.957.709c.041.036.408.351.954.351.531 0 .906-.31.94-.34a3.075 3.075 0 014.161.192 3.1 3.1 0 01-.025 4.403z" />
                </svg>
              {/if}
            </button>
            <button>
              <svg viewBox="0 0 64 64"><g id="Layer_51" data-name="Layer 51">
                  <path
                    d="M32,22.35c7.83-.25,7.83-11.6,0-11.85C24.17,10.75,24.17,22.1,32,22.35Z" />
                  <path
                    d="M32,26.08c-7.83.24-7.83,11.6,0,11.84C39.83,37.68,39.83,26.32,32,26.08Z" />
                  <path
                    d="M32,41.65c-7.83.25-7.83,11.6,0,11.85C39.83,53.25,39.83,41.9,32,41.65Z" />
                </g></svg>
            </button>
          </div>
        </div>
      {/if}
    </div>
    <div class="middle-control">
      <div class="control-btn">
        <button
          class="shuffle"
          type="button"
          bind:this={ref_shuffle}
          on:click={shuffle}>
          <svg width="24" height="24" viewBox="0 0 24 24">
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M19.2929 2.29289C19.6834 1.90237 20.3166 1.90237 20.7071 2.29289L23.7071 5.29289C24.0976 5.68342 24.0976 6.31658 23.7071 6.70711L20.7071 9.70711C20.3166 10.0976 19.6834 10.0976 19.2929 9.70711C18.9024 9.31658 18.9024 8.68342 19.2929 8.29289L20.5858 7H18.6759C17.3385 7 16.0896 7.6684 15.3477 8.7812L13.2018 12L15.3477 15.2188C16.0896 16.3316 17.3385 17 18.6759 17H20.5858L19.2929 15.7071C18.9024 15.3166 18.9024 14.6834 19.2929 14.2929C19.6834 13.9024 20.3166 13.9024 20.7071 14.2929L23.7071 17.2929C24.0976 17.6834 24.0976 18.3166 23.7071 18.7071L20.7071 21.7071C20.3166 22.0976 19.6834 22.0976 19.2929 21.7071C18.9024 21.3166 18.9024 20.6834 19.2929 20.2929L20.5858 19H18.6759C16.6698 19 14.7964 17.9974 13.6836 16.3282L12 13.8028L10.3164 16.3282C9.20359 17.9974 7.3302 19 5.32408 19H1C0.447715 19 0 18.5523 0 18C0 17.4477 0.447715 17 1 17H5.32408C6.66149 17 7.91042 16.3316 8.65228 15.2188L10.7982 12L8.65228 8.7812C7.91042 7.6684 6.66149 7 5.32408 7H1C0.447715 7 0 6.55228 0 6C0 5.44772 0.447715 5 1 5H5.32408C7.3302 5 9.20359 6.00261 10.3164 7.6718L12 10.1972L13.6836 7.6718C14.7964 6.00261 16.6698 5 18.6759 5H20.5858L19.2929 3.70711C18.9024 3.31658 18.9024 2.68342 19.2929 2.29289Z" />
          </svg>
        </button>

        <button class="previous" type="button" on:click={previous}>
          <svg viewBox="0 0 24 24">
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M5 1C5.55228 1 6 1.44772 6 2V8.94254L15.1465 1.75597C17.1149 0.209384 20 1.61163 20 4.11493V19.8851C20 22.3884 17.1149 23.7906 15.1465 22.244L6 15.0575V22C6 22.5523 5.55228 23 5 23C4.44772 23 4 22.5523 4 22V2C4 1.44772 4.44772 1 5 1ZM6 12.0279C6 12.3348 6.14089 12.6247 6.38218 12.8142L16.3822 20.6714C17.0383 21.1869 18 20.7195 18 19.8851V4.11493C18 3.2805 17.0383 2.81308 16.3822 3.32861L6.38218 11.1858C6.14089 11.3753 6 11.6652 6 11.9721V12.0279Z" />
          </svg>
        </button>
        <button class="stepbackward" type="button" on:click={stepbackward}>
          <svg viewBox="0 0 24 24">
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M8.20004 4.60001C10.1777 3.11673 13 4.52788 13 7.00001V9.25001L19.2 4.60001C21.1777 3.11673 24 4.52788 24 7.00001V17C24 19.4722 21.1777 20.8833 19.2 19.4L13 14.75V17C13 19.4722 10.1777 20.8833 8.20004 19.4L1.53337 14.4C-0.0666234 13.2 -0.0666285 10.8 1.53337 9.60001L8.20004 4.60001ZM11 7.00001C11 6.17597 10.0593 5.70559 9.40004 6.20001L2.73337 11.2C2.20004 11.6 2.20004 12.4 2.73338 12.8L9.40004 17.8C10.0593 18.2944 11 17.8241 11 17V7.00001ZM22 7.00001C22 6.17597 21.0593 5.70559 20.4 6.20001L13.7334 11.2C13.2 11.6 13.2 12.4 13.7334 12.8L20.4 17.8C21.0593 18.2944 22 17.8241 22 17V7.00001Z" />
          </svg>
        </button>
        <button class="playpause" type="button" on:click={playPause}>
          <!-- {$audioStatus.playing ? 'Pause' : 'Play'} -->
          {#if $audioStatus.playing}
            <svg viewBox="0 0 24 24">
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M3 3C3 1.34314 4.34315 0 6 0H8C9.65685 0 11 1.34315 11 3V21C11 22.6569 9.65685 24 8 24H6C4.34315 24 3 22.6569 3 21V3ZM6 2C5.44771 2 5 2.44772 5 3V21C5 21.5523 5.44772 22 6 22H8C8.55228 22 9 21.5523 9 21V3C9 2.44772 8.55228 2 8 2H6ZM13 3C13 1.34314 14.3431 0 16 0H18C19.6569 0 21 1.34315 21 3V21C21 22.6569 19.6569 24 18 24H16C14.3431 24 13 22.6569 13 21V3ZM16 2C15.4477 2 15 2.44772 15 3V21C15 21.5523 15.4477 22 16 22H18C18.5523 22 19 21.5523 19 21V3C19 2.44772 18.5523 2 18 2H16Z" />
            </svg>
          {:else}
            <svg viewBox="0 0 24 24">
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M4 4.11493C4 1.61163 6.88508 0.209383 8.85346 1.75597L18.8535 9.61312C19.5773 10.1819 20 11.0515 20 11.9721V12.0279C20 12.9485 19.5773 13.8181 18.8535 14.3869L8.85346 22.244C6.88507 23.7906 4 22.3884 4 19.8851V4.11493ZM7.61782 3.32861C6.96169 2.81308 6 3.2805 6 4.11493V19.8851C6 20.7195 6.96169 21.1869 7.61782 20.6714L17.6178 12.8142C17.8591 12.6247 18 12.3348 18 12.0279V11.9721C18 11.6652 17.8591 11.3753 17.6178 11.1858L7.61782 3.32861Z" />
            </svg>
          {/if}
        </button>
        <button class="stepforward" type="button" on:click={stepforward}>
          <svg viewBox="0 0 24 24">
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M3.6 6.20001C2.94076 5.70559 2 6.17597 2 7.00001V17C2 17.8241 2.94076 18.2944 3.6 17.8L10.2667 12.8C10.8 12.4 10.8 11.6 10.2667 11.2L3.6 6.20001ZM0 7.00001C0 4.52788 2.82229 3.11673 4.8 4.60001L11 9.25001V7.00001C11 4.52788 13.8223 3.11673 15.8 4.60001L22.4667 9.60001C24.0667 10.8 24.0667 13.2 22.4667 14.4L15.8 19.4C13.8223 20.8833 11 19.4722 11 17V14.75L4.8 19.4C2.82229 20.8833 0 19.4722 0 17V7.00001ZM14.6 6.20001C13.9408 5.70559 13 6.17597 13 7.00001V17C13 17.8241 13.9408 18.2944 14.6 17.8L21.2667 12.8C21.8 12.4 21.8 11.6 21.2667 11.2L14.6 6.20001Z" />
          </svg>
        </button>
        <button class="next" type="button" on:click={next}>
          <svg viewBox="0 0 24 24">
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M19 1C19.5523 1 20 1.44772 20 2V22C20 22.5523 19.5523 23 19 23C18.4477 23 18 22.5523 18 22V15.0575L8.85346 22.244C6.88507 23.7906 4 22.3884 4 19.8851V4.11493C4 1.61163 6.88508 0.209383 8.85346 1.75597L18 8.94254V2C18 1.44772 18.4477 1 19 1ZM18 11.9721C18 11.6652 17.8591 11.3753 17.6178 11.1858L7.61782 3.32861C6.96169 2.81308 6 3.2805 6 4.11493V19.8851C6 20.7195 6.96169 21.1869 7.61782 20.6714L17.6178 12.8142C17.8591 12.6247 18 12.3348 18 12.0279V11.9721Z" />
          </svg>
        </button>

        <button
          class="repeat"
          type="button"
          bind:this={ref_repeat}
          on:click={repeat}>
          <svg width="24" height="24" viewBox="0 0 24 24">
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M11.7071 2.29289C12.0976 2.68342 12.0976 3.31658 11.7071 3.70711L10.4142 5H21C22.6569 5 24 6.34315 24 8V16C24 17.6569 22.6569 19 21 19H20C19.4477 19 19 18.5523 19 18C19 17.4477 19.4477 17 20 17H21C21.5523 17 22 16.5523 22 16V8C22 7.44772 21.5523 7 21 7H10.4142L11.7071 8.29289C12.0976 8.68342 12.0976 9.31658 11.7071 9.70711C11.3166 10.0976 10.6834 10.0976 10.2929 9.70711L7.29289 6.70711C6.90237 6.31658 6.90237 5.68342 7.29289 5.29289L10.2929 2.29289C10.6834 1.90237 11.3166 1.90237 11.7071 2.29289ZM3 7C2.44772 7 2 7.44772 2 8V16C2 16.5523 2.44772 17 3 17H13.5858L12.2929 15.7071C11.9024 15.3166 11.9024 14.6834 12.2929 14.2929C12.6834 13.9024 13.3166 13.9024 13.7071 14.2929L16.7071 17.2929C17.0976 17.6834 17.0976 18.3166 16.7071 18.7071L13.7071 21.7071C13.3166 22.0976 12.6834 22.0976 12.2929 21.7071C11.9024 21.3166 11.9024 20.6834 12.2929 20.2929L13.5858 19H3C1.34315 19 0 17.6569 0 16V8C0 6.34315 1.34315 5 3 5H4C4.55228 5 5 5.44772 5 6C5 6.55228 4.55228 7 4 7H3Z" />
          </svg>
          {#if $audioStatus.repeat == 2}<span>1</span>{/if}
        </button>
      </div>

      <div class="progress">
        <span class="current-time" bind:this={ref_currentTime}>00:00</span>
        <div class="slider" data-direction="horizontal">
          <div class="bar" bind:this={ref_bar}>
            <div class="pin" id="bar-pin" data-method="rewind" />
          </div>
        </div>
        <span class="duration-time" bind:this={ref_durationTime}>00:00</span>
      </div>
    </div>
    <div class="right-control">
      <button
        style={!$playlistStore.length ? 'visibility: hidden' : 'visibility: visible'}
        on:click={() => {
          if ($playlistStore.length) $togglePlaylist = !$togglePlaylist;
        }}>
        <svg viewBox="0 0 24 24">
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M23.9806 3.80389C24.0889 4.34545 23.7377 4.87228 23.1961 4.98059L19.8039 5.65904C19.3365 5.75252 19 6.16294 19 6.63962V17.4505C19 19.1189 17.8224 20.5553 16.1864 20.8825L16.1283 20.8941C13.9926 21.3213 12 19.6877 12 17.5097C12 15.8645 13.1613 14.448 14.7746 14.1253L17 13.6802V6.63962C17 5.20958 18.0094 3.97833 19.4117 3.69788L22.8039 3.01943C23.3454 2.91112 23.8723 3.26233 23.9806 3.80389ZM17 15.7198L15.1668 16.0865C14.4884 16.2221 14 16.8178 14 17.5097C14 18.4257 14.838 19.1126 15.7361 18.933L15.7942 18.9214C16.4953 18.7811 17 18.1655 17 17.4505V15.7198ZM0 5.00001C0 4.44773 0.447715 4.00001 1 4.00001H14C14.5523 4.00001 15 4.44773 15 5.00001C15 5.55229 14.5523 6.00001 14 6.00001H1C0.447715 6.00001 0 5.55229 0 5.00001ZM0 10C0 9.44772 0.447715 9.00001 1 9.00001H14C14.5523 9.00001 15 9.44772 15 10C15 10.5523 14.5523 11 14 11H1C0.447715 11 0 10.5523 0 10ZM0 15C0 14.4477 0.447715 14 1 14H9C9.55229 14 10 14.4477 10 15C10 15.5523 9.55229 16 9 16H1C0.447715 16 0 15.5523 0 15Z" />
        </svg>
      </button>

      <div>
        <div class="volume">
          <button class="volume-btn" on:click={toggleVolume}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M13 6.00001C13 5.17597 12.0592 4.70559 11.4 5.20001L7.13333 8.40001C6.61404 8.78948 5.98244 9.00001 5.33333 9.00001H3C2.44772 9.00001 2 9.44773 2 10V14C2 14.5523 2.44772 15 3 15H5.33333C5.98244 15 6.61405 15.2105 7.13333 15.6L11.4 18.8C12.0592 19.2944 13 18.8241 13 18V6.00001ZM10.2 3.60001C12.1777 2.11673 15 3.52788 15 6.00001V18C15 20.4722 12.1777 21.8833 10.2 20.4L5.93333 17.2C5.76024 17.0702 5.5497 17 5.33333 17H3C1.34315 17 0 15.6569 0 14V10C0 8.34316 1.34315 7.00001 3 7.00001H5.33333C5.5497 7.00001 5.76024 6.92984 5.93333 6.80001L10.2 3.60001ZM19.6569 4.92895C20.0474 4.53842 20.6805 4.53842 21.0711 4.92895C22.8796 6.7375 24 9.23887 24 12C24 14.7612 22.8796 17.2625 21.0711 19.0711C20.6805 19.4616 20.0474 19.4616 19.6569 19.0711C19.2663 18.6806 19.2663 18.0474 19.6569 17.6569C21.1057 16.2081 22 14.2094 22 12C22 9.7906 21.1057 7.79197 19.6569 6.34316C19.2663 5.95264 19.2663 5.31947 19.6569 4.92895ZM16.8284 7.75737C17.219 7.36685 17.8521 7.36685 18.2426 7.75737C19.3273 8.84206 20 10.3434 20 12C20 13.6566 19.3273 15.158 18.2426 16.2427C17.8521 16.6332 17.219 16.6332 16.8284 16.2427C16.4379 15.8521 16.4379 15.219 16.8284 14.8284C17.5534 14.1035 18 13.1049 18 12C18 10.8952 17.5534 9.89654 16.8284 9.17159C16.4379 8.78106 16.4379 8.1479 16.8284 7.75737Z"
                id="speaker" />
            </svg>
          </button>

          <div class="volume-controls" class:hidden={hideVolume}>
            <div class="slider" data-direction="vertical">
              <div class="bar" bind:this={ref_volume}>
                <div class="pin" id="volume-pin" data-method="changeVolume" />
              </div>
            </div>
          </div>
        </div>

        <button>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M1 2C1 1.44772 1.44772 1 2 1H7C7.55228 1 8 1.44772 8 2C8 2.55228 7.55228 3 7 3H4.41421L9.70711 8.29289C10.0976 8.68342 10.0976 9.31658 9.70711 9.70711C9.31658 10.0976 8.68342 10.0976 8.29289 9.70711L3 4.41421V7C3 7.55228 2.55228 8 2 8C1.44772 8 1 7.55228 1 7V2ZM17 1H22C22.5523 1 23 1.44772 23 2V7C23 7.55228 22.5523 8 22 8C21.4477 8 21 7.55228 21 7V4.41421L15.7071 9.70711C15.3166 10.0976 14.6834 10.0976 14.2929 9.70711C13.9024 9.31658 13.9024 8.68342 14.2929 8.29289L19.5858 3H17C16.4477 3 16 2.55228 16 2C16 1.44772 16.4477 1 17 1ZM9.70711 14.2929C10.0976 14.6834 10.0976 15.3166 9.70711 15.7071L4.41421 21H7C7.55228 21 8 21.4477 8 22C8 22.5523 7.55228 23 7 23H2C1.44772 23 1 22.5523 1 22V17C1 16.4477 1.44772 16 2 16C2.55228 16 3 16.4477 3 17V19.5858L8.29289 14.2929C8.68342 13.9024 9.31658 13.9024 9.70711 14.2929ZM14.2929 14.2929C14.6834 13.9024 15.3166 13.9024 15.7071 14.2929L21 19.5858V17C21 16.4477 21.4477 16 22 16C22.5523 16 23 16.4477 23 17V22C23 22.5523 22.5523 23 22 23H17C16.4477 23 16 22.5523 16 22C16 21.4477 16.4477 21 17 21H19.5858L14.2929 15.7071C13.9024 15.3166 13.9024 14.6834 14.2929 14.2929Z" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</div>
