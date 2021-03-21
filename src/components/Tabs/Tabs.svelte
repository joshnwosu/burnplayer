<script>
  import "./Tabs.css";
  import {
    ExplorePage,
    FolderPage,
    RecentlyAdded,
    MostPlayed,
    Favorite,
    MyMusicPage,
  } from "../../contents";
  import { Explore, Folder, Heart, Song, Time, Wave } from "../../icons";
  import { handleClickStore, toggleNav } from "../../store/music";

  let browse = [
    {
      name: "Explore",
      icon: Explore,
      component: ExplorePage,
    },
    {
      name: "My music",
      icon: Song,
      component: MyMusicPage,
    },
    {
      name: "Folder",
      icon: Folder,
      component: FolderPage,
    },
    // {
    //   name: "Recently Played",
    //   icon: Time,
    //   component: RecentlyAdded,
    // },
    // {
    //   name: "Most Played",
    //   icon: Wave,
    //   component: MostPlayed,
    // },
    {
      name: "Favorite",
      icon: Heart,
      component: Favorite,
    },
  ];

  let activeTabValue = "my music";

  $: $toggleNav;

  const handleClick = (tabValue) => {
    activeTabValue = tabValue;
  };

  $handleClickStore = handleClick;
</script>

<div class="navbar" class:toggle-navbar={$toggleNav}>
  <div class="nav-item-header">Browse Files</div>
  {#each browse as b}
    <div
      class={activeTabValue.toLowerCase() === b.name.toLowerCase() ? 'nav-item active-nav-item' : 'nav-item'}
      on:click={() => handleClick(b.name.toLowerCase())}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d={b.icon} />
      </svg>

      <span>{b.name}</span>
    </div>
  {/each}
</div>

{#each browse as b}
  <div
    hidden={activeTabValue.toLowerCase() !== b.name.toLowerCase()}
    class="content">
    <svelte:component this={b.component} />
  </div>
{/each}
