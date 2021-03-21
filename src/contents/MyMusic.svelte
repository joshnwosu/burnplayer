<script>
  import "./styles/MyMusic.css";
  import Header from "../components/Header/Header.svelte";
  import Artist from "../components/Artist/Artist.svelte";
  import Album from "../components/Album/Album.svelte";
  import Song from "../components/Song/Song.svelte";
  import { icons } from "../utils/icons";
  import { playerStore } from "../store/music";

  let songTabs = [
    {
      name: "Songs",
      icon: icons.musicWave,
      component: Song,
    },
    {
      name: "Artists",
      icon: icons.artist,
      component: Artist,
    },
    {
      name: "Albums",
      icon: icons.album,
      component: Album,
    },
  ];

  let activeTab = "songs";
  const toggleSongTab = (value) => (activeTab = value);
</script>

<Header id="mymusic-component">
  <h3>My music</h3>
</Header>
<div class="song-tab">
  {#each songTabs as { name, icon }}
    <div
      class="song-tab-item"
      class:active-tab={activeTab.toLowerCase() === name.toLowerCase()}
      on:click={() => toggleSongTab(name.toLowerCase())}>
      <svg viewBox="0 0 24 24">
        <path d={icon} />
      </svg>

      <h4>{name}</h4>

      <!-- {#if activeTab.toLowerCase() === name.toLowerCase()} -->
      <button
        class="context-menu-btn"
        context-btn-id={name}
        style={activeTab.toLowerCase() !== name.toLowerCase() ? 'opacity: 0; visibility: hidden' : 'opacity: 1; visibility: visible'}>
        <svg viewBox="0 0 64 64" class="more-icon">
          <path
            d="M47.58,26.08c-7.83.25-7.83,11.6,0,11.84C55.41,37.67,55.4,26.32,47.58,26.08Z" />
          <path
            d="M32,26.08c-7.83.25-7.83,11.6,0,11.84C39.83,37.67,39.83,26.32,32,26.08Z" />
          <path
            d="M16.42,26.08c-7.83.25-7.82,11.6,0,11.84C24.25,37.67,24.25,26.32,16.42,26.08Z" />
        </svg>
      </button>

      <div class="context-menu" context-menu-id={name}>
        <ul>
          <li class="context-menu-list">
            <span class="context-menu-text">{name}</span>
          </li>
          <li class="context-menu-list">
            <span class="context-menu-text">Shuffle and play</span>
          </li>
          <li class="context-menu-list">
            <span class="context-menu-text">Add folder to playlist</span>
          </li>
          <li class="context-menu-list">
            <span class="context-menu-text">Play after current song</span>
          </li>
          <li class="context-menu-list">
            <span class="context-menu-text">Add to favorite</span>
          </li>
          <div class="context-menu-seperator" />
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
      <!-- {/if} -->
    </div>
  {/each}
</div>

<!-- song component -->
<div class="music-wrapper">
  {#each songTabs as { component, name }}
    <div
      class={'music-wrapper-context music-wrapper-' + name.toLowerCase()}
      hidden={activeTab.toLowerCase() !== name.toLowerCase()}>
      <svelte:component
        this={component}
        data={$playerStore}
        componentName={name.toLowerCase()} />
    </div>
  {/each}
</div>
