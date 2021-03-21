<script>
  import "./Album.css";
  export let data;
  export let componentName;

  import {
    musicID,
    playerStore,
    playlistStore,
    showAlbumDetail,
  } from "../../store/music";
  import Detailview from "../Detailview/Detailview.svelte";

  $: albumArray = data
    ? data.reduce((r, a) => {
        r[a.album] = r[a.album] || [];
        r[a.album].push(a);
        return r;
      }, Object.create(null))
    : {};

  let albumData = [];
  $: if (albumArray) {
    albumData = [];

    for (const [key, value] of Object.entries(albumArray)) {
      const getPicture = (d) => {
        if (d.picture) return d;
      };

      let { album, picture } = value.find(getPicture);

      let data = {
        album,
        picture,
      };
      albumData.push(data);
    }
  }
  let displayData;
  let displayCover;
  let displayNavigationName;
  let showDetail = false;

  const displayDetail = (e, key, data) => {
    if (e.target.closest(".album-play-all")) playAlbum(data);
    else {
      albumData.forEach((d) => {
        if (key == d.album) displayCover = d.picture;
      });

      displayData = data;
      displayNavigationName = key;
      showAlbum();
    }
  };

  const showAlbum = () => {
    showDetail = !showDetail;
  };

  $showAlbumDetail = showAlbum;

  const playAlbum = (songs) => {
    $playlistStore = songs;

    $musicID = songs[0].id;
  };
</script>

<div class="album-container">
  {#each Object.entries(albumArray) as [key, value], index}
    <div class="album-card" on:click={(e) => displayDetail(e, key, value)}>
      {#each albumData as data}
        {#if key == data.album}<img src={data.picture} alt="" />{/if}
      {/each}
      <div class="album-play-all" on:clikc={() => playAlbum(value)}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"><path d="M2 24v-24l20 12-20 12z" /></svg>
      </div>
      <div class="album-card-content">
        <h4>{key}</h4>
        <h5>
          {value.length == 1 ? value.length + ' song' : value.length + ' songs'}
        </h5>
      </div>
    </div>
  {/each}
</div>

<Detailview
  data={displayData}
  cover={displayCover}
  navigationName={displayNavigationName}
  {componentName}
  {showDetail}
  openDetail={$showAlbumDetail} />
