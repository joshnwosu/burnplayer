<script>
  import {
    audioStatus,
    musicID,
    playlistStore,
    togglePlaylist,
  } from "../../store/music";
  import { icons } from "../../utils/icons";

  import "./Playlist.css";

  const updatePlaylistPosition = (isMiddle, rightNow) => {
    const index = $playlistStore.findIndex((item) => item.id === $musicID);

    if (index < 0) return;
    else {
      let rect = document.querySelectorAll(".playlist-list")[index];
      if (rect) {
        rect = rect.getBoundingClientRect();
        const scroller = document.querySelector(".playlist-container");
        const srect = scroller.getBoundingClientRect();
        const sheight = scroller.clientHeight - srect.top;
        const topDis = rect.top - srect.top;
        let scrollTo = null;

        if (isMiddle) {
          scrollTo = scroller.scrollTop + topDis - (sheight - rect.height) / 2;
        } else {
          // auto calculate visible position
          const min = rect.height * 2;
          const max = sheight - rect.height * 2;
          if (topDis < min) {
            scrollTo = scroller.scrollTop + topDis - min;
          } else if (topDis > max) {
            scrollTo = scroller.scrollTop + topDis - max;
          }
        }

        if (scrollTo === null) {
          return;
        }

        if (rightNow) {
          scroller.scrollTop = scrollTo;
        } else {
          scrollTo = scrollTo;
        }
      }
    }
  };

  $: if ($musicID) {
    updatePlaylistPosition(false, true);
  }

  $: if (!$togglePlaylist) {
    updatePlaylistPosition(false, true);
  }
</script>

<div class="playlist-container" class:toggle-playlist={$togglePlaylist}>
  <!--  -->
  <div class="playlist-header">
    <div class="playlist-header-length">
      <h4>Playing Queue</h4>
      <h5>
        {$playlistStore.findIndex((song) => song.id === $musicID) + 1}
        /
        {$playlistStore.length}
      </h5>
    </div>
    <button>
      <span>Shuffle</span>
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d={icons.shuffle} />
      </svg>
    </button>
  </div>
  {#if $playlistStore.length < 1}
    <div class="playlist-empty">
      <h1>No music in playlist</h1>
    </div>
  {:else}
    {#each $playlistStore as playlist, index}
      <div
        class="playlist-list"
        class:activesong={$musicID == playlist.id}
        on:dblclick={() => ($musicID = playlist.id)}>
        <div class="playlist-index">
          {#if $musicID == playlist.id}
            <!-- <span>🔥</span> -->
            <div
              class="loader-container {!$audioStatus.playing ? 'pauseAnim' : 'playAnim'}">
              <div class="rectangle-1" />
              <div class="rectangle-2" />
              <div class="rectangle-3" />
            </div>
          {:else}
            <h5>{index + 1 <= 9 ? '0' + (index + 1) : index + 1}</h5>
          {/if}
        </div>
        <div class="playlist-title">
          <h4>{playlist.title}</h4>
          <h5>{playlist.artist}</h5>
        </div>
        <button
          class="playlist-more context-menu-btn"
          context-btn-id={'playlist-' + playlist.id}>
          <svg viewBox="0 0 64 64">
            <path
              d="M47.58,26.08c-7.83.25-7.83,11.6,0,11.84C55.41,37.67,55.4,26.32,47.58,26.08Z" />
            <path
              d="M32,26.08c-7.83.25-7.83,11.6,0,11.84C39.83,37.67,39.83,26.32,32,26.08Z" />
            <path
              d="M16.42,26.08c-7.83.25-7.82,11.6,0,11.84C24.25,37.67,24.25,26.32,16.42,26.08Z" />
          </svg>
        </button>

        <div class="context-menu" context-menu-id={'playlist-' + playlist.id}>
          <ul>
            <li class="context-menu-list" on:click={() => alert('playlist')}>
              <span class="context-menu-text">Play</span>
            </li>
            <li class="context-menu-list">
              <span class="context-menu-text">Remove from playlist</span>
            </li>
            <li class="context-menu-list">
              <span class="context-menu-text">Add to favorite</span>
            </li>
            <div class="context-menu-seperator" />
            <li class="context-menu-list">
              <span class="context-menu-text">Properties</span>
            </li>
          </ul>
        </div>
      </div>
    {/each}
  {/if}
</div>
