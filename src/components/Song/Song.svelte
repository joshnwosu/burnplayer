<script>
  export let data;
  export let componentName;
  import "./Song.css";
  import {
    addToFavoriteFunc,
    audioContext,
    audioStatus,
    currentSongWidth,
    favoriteStore,
    musicID,
    playerStore,
    playlistStore,
  } from "../../store/music";
  import { icons } from "../../utils/icons";

  $: player = data ? data : [];

  // $: setTimeout(() => console.log("Song Data: ", data), 1000);

  const selectSong = (song) => {
    $musicID = "";
    if (song.id != undefined) {
      $musicID = song.id;

      if (player.length) $playlistStore = player;
    }
  };

  let liked = $favoriteStore;

  const toggleAddToFavorite = (id) => {
    $favoriteStore.indexOf(id) == -1
      ? $favoriteStore.push(id)
      : $favoriteStore.splice($favoriteStore.indexOf(id), 1);

    liked = $favoriteStore;

    $favoriteStore = $favoriteStore;
  };

  $: $addToFavoriteFunc = toggleAddToFavorite;

  const playSong = () => {
    $audioStatus.audio.play();
  };

  const pauseSong = () => {
    $audioStatus.audio.pause();
  };

  const getMusicIndex = (id) => {
    return $playerStore.findIndex((song) => song.id === id);
  };

  const playAfterCurrent = (song) => {
    let newIndex = getMusicIndex($musicID);
    let oldIndex = getMusicIndex(song.id);

    console.log(oldIndex, newIndex);
    $playlistStore = array_move($playlistStore, oldIndex, newIndex + 1);
  };

  // Add to playlist after current song
  function array_move(arr, old_index, new_index) {
    if (new_index >= arr.length) {
      var k = new_index - arr.length + 1;
      while (k--) {
        arr.push(undefined);
      }
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    return arr;
  }

  // console.log(array_move([1, 2, 3], 0, 1));
</script>

<div class="grid music-header">
  <div class="header-index"><span>#</span></div>
  <div class="header-title"><span>Title</span></div>
  <div class="header-album"><span>Album</span></div>
  <div class="header-genre"><span>Genre</span></div>
  <div class="header-year"><span>Year</span></div>
  <div class="header-duration">
    <span>
      <svg viewBox="0 0 24 24">
        <path fill-rule="evenodd" clip-rule="evenodd" d={icons.time} />
      </svg>
    </span>
  </div>
</div>
<div class="music-container">
  <!-- <div style="height: 50px;" /> -->
  {#each player as song, index}
    <div
      class="grid music-list {$musicID == song.id ? 'playing' : ''}"
      on:dblclick|preventDefault={() => selectSong(song)}>
      {#if $musicID == song.id}
        <div
          class="current-song-width"
          style="width: {$currentSongWidth ? $currentSongWidth.width : '0'}" />
      {/if}

      <div class="music-index">
        {#if $musicID != song.id}
          <button
            class="play-btn"
            type="button"
            on:click={() => selectSong(song)}>
            <svg viewBox="0 0 24 24" class="play-icon">
              <path fill-rule="evenodd" clip-rule="evenodd" d={icons.play} />
            </svg>
          </button>
        {/if}

        {#if $musicID == song.id}
          <div
            class="loader-container {!$audioStatus.playing ? 'pauseAnim' : 'playAnim'}">
            <div class="rectangle-1" />
            <div class="rectangle-2" />
            <div class="rectangle-3" />
          </div>
          {#if $audioStatus.playing}
            <button class="pause-btn" type="button" on:click={pauseSong}>
              <svg viewBox="0 0 24 24" class="pause-icon">
                <path fill-rule="evenodd" clip-rule="evenodd" d={icons.pause} />
              </svg>
            </button>
          {:else}
            <button class="play-btn" type="button" on:click={playSong}>
              <svg viewBox="0 0 24 24" class="play-icon">
                <path fill-rule="evenodd" clip-rule="evenodd" d={icons.play} />
              </svg>
            </button>
          {/if}
        {:else}
          <h4>{index + 1 <= 9 ? '0' + (index + 1) : index + 1}</h4>
        {/if}
      </div>
      <div class="music-title">
        <img src={song.picture} alt="" />
        <div class="music-title-wrapper">
          <h4>{song.title}</h4>
          <h5>{song.artist}</h5>
        </div>
      </div>
      <div class="music-album">
        <h4>{song.album}</h4>
      </div>
      <div class="music-genre">
        <h4>{song.genre}</h4>
      </div>
      <div class="music-year">
        <h4>{song.year}</h4>
      </div>
      <div class="music-duration">
        <button type="button" on:click={() => toggleAddToFavorite(song.id)}>
          {#if liked.includes(song.id)}
            <svg viewBox="0 0 16 16" class="liked">
              <path d={icons.likeFilled} />
            </svg>
          {:else}
            <svg
              role="img"
              height="16"
              width="16"
              viewBox="0 0 16 16"
              class="like-icon">
              <path d={icons.like} />
            </svg>
          {/if}
        </button>
        <h4>{song.convertDuration}</h4>
        <button
          class="context-menu-btn"
          context-btn-id={componentName + song.id}>
          <svg viewBox="0 0 64 64">
            <path
              d="M47.58,26.08c-7.83.25-7.83,11.6,0,11.84C55.41,37.67,55.4,26.32,47.58,26.08Z" />
            <path
              d="M32,26.08c-7.83.25-7.83,11.6,0,11.84C39.83,37.67,39.83,26.32,32,26.08Z" />
            <path
              d="M16.42,26.08c-7.83.25-7.82,11.6,0,11.84C24.25,37.67,24.25,26.32,16.42,26.08Z" />
          </svg>
        </button>
      </div>
    </div>
    <div class="context-menu" context-menu-id={componentName + song.id}>
      <div class="context-menu-header">
        <div class="context-menu-photo"><img src={song.picture} alt="" /></div>
        <div class="context-menu-title">
          <h4>{song.title}</h4>
          <h5>{song.artist}</h5>
        </div>
      </div>
      <div class="context-menu-seperator" />
      <ul>
        {#if $musicID === song.id}
          {#if $audioStatus.playing}
            <li class="context-menu-list" on:click={pauseSong}>
              <span class="context-menu-icon">
                <svg viewBox="0 0 24 24">
                  <path d={icons.pause} />
                </svg>
              </span>
              <span class="context-menu-text">Pause</span>
            </li>
          {:else}
            <li class="context-menu-list" on:click={playSong}>
              <span class="context-menu-icon">
                <svg viewBox="0 0 24 24">
                  <path d={icons.play} />
                </svg>
              </span>
              <span class="context-menu-text">Play</span>
            </li>
          {/if}
        {:else}
          <li class="context-menu-list" on:click={() => selectSong(song)}>
            <span class="context-menu-icon">
              <svg viewBox="0 0 24 24">
                <path d={icons.play} />
              </svg>
            </span>
            <span class="context-menu-text">Play</span>
          </li>
        {/if}
        <!-- <li class="context-menu-list" on:click={() => playAfterCurrent(song)}>
          <span class="context-menu-icon">
            <svg viewBox="0 0 24 24">
              <path d={icons.next} />
            </svg>
          </span>
          <span class="context-menu-text">Play after current song</span>
        </li> -->
        {#if liked.includes(song.id)}
          <li
            class="context-menu-list"
            on:click={() => toggleAddToFavorite(song.id)}>
            <span class="context-menu-icon">
              <svg viewBox="0 0 16 16">
                <path d={icons.likeFilled} />
              </svg>
            </span>
            <span class="context-menu-text">Unlike</span>
          </li>
        {:else}
          <li
            class="context-menu-list"
            on:click={() => toggleAddToFavorite(song.id)}>
            <span class="context-menu-icon">
              <svg viewBox="0 0 16 16">
                <path d={icons.like} />
              </svg>
            </span>
            <span class="context-menu-text">Like</span>
          </li>
        {/if}

        <!-- <li class="context-menu-list">
          <span class="context-menu-icon">
            <svg viewBox="0 0 24 24">
              <path d={icons.playlist} />
            </svg>
          </span>
          <span class="context-menu-text">Add to playlist</span>
        </li> -->
        <div class="context-menu-seperator" />

        <!-- <li class="context-menu-list">
          <span class="context-menu-icon">
            <svg viewBox="0 0 24 24">
              <path fill-rule="evenodd" clip-rule="evenodd" d={icons.delete} />
            </svg>
          </span>
          <span class="context-menu-text">Delete permanently</span>
        </li> -->

        <li class="context-menu-list" onclick={() => alert(componentName)}>
          <span class="context-menu-icon">
            <svg viewBox="0 0 24 24">
              <path d={icons.info} />
            </svg>
          </span>
          <span class="context-menu-text">Properties</span>
        </li>
      </ul>
    </div>
  {/each}
</div>
