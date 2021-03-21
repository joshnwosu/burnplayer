<script>
  import "./Artist.css";
  import { playerStore, showArtistDetail } from "../../store/music";
  import Detailview from "../Detailview/Detailview.svelte";

  export let data;
  export let componentName;

  $: artistArray = data
    ? data.reduce((r, a) => {
        r[a.artist] = r[a.artist] || [];
        r[a.artist].push(a);
        return r;
      }, Object.create(null))
    : {};

  let artistData = [];
  $: if (artistArray) {
    artistData = [];

    for (const [key, value] of Object.entries(artistArray)) {
      const getPicture = (d) => {
        if (d.picture) return d;
      };

      let { artist, picture } = value.find(getPicture);

      let data = {
        artist,
        picture,
      };

      // artistData = [...artistData, data];
      artistData.push(data);
    }
  }
  let displayData;
  let displayCover;
  let displayNavigationName;
  let showDetail = false;

  const displayDetail = (e, key, data) => {
    artistData.forEach((d) => {
      if (key == d.artist) displayCover = d.picture;
    });

    displayData = data;
    displayNavigationName = key;
    showArtist();
  };

  const showArtist = () => {
    showDetail = !showDetail;
  };

  $showArtistDetail = showArtist;

  // $: console.log(artistData);
</script>

<div class="artist-container">
  {#each Object.entries(artistArray) as [key, value], index}
    <div class="artist-card" on:click={(e) => displayDetail(e, key, value)}>
      <div class="artist-card-index">
        <h4>{index + 1 <= 9 ? '0' + (index + 1) : index + 1}</h4>
      </div>
      {#each artistData as data}
        {#if key == data.artist}
          <div class="artist-card-img"><img src={data.picture} alt="" /></div>
        {/if}
      {/each}
      <div class="artist-card-content">
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
  openDetail={$showArtistDetail} />
