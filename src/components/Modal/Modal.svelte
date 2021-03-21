<script>
  import "./Modal.css";
  import Interface from "./tabs/Interface.svelte";
  import Settings from "./tabs/Settings.svelte";

  import { toggleSetting } from "../../store/music";

  let tabItem = [
    {
      title: "Language",
      subtitle: "coming soon",
      component: Interface,
    },
    {
      title: "Interface",
      subtitle: "change theme and accent.",
      component: Interface,
    },

    {
      title: "Settings",
      subtitle: "more settings options",
      component: Settings,
    },
    {
      title: "Headphones",
      // subtitle: "headphone settings",
      component: Settings,
    },
  ];

  let activeTab = tabItem[1].title;

  function toggleTab(value) {
    activeTab = value;
  }

  let isOpen = false;

  function toggleModal() {
    isOpen = !isOpen;
  }

  $toggleSetting = toggleModal;
</script>

<div class="settings" class:isOpen>
  <div class="tab-items">
    {#each tabItem as item}
      <li
        on:click={() => toggleTab(item.title.toLocaleLowerCase())}
        class:activeTab={activeTab.toLowerCase() === item.title.toLowerCase()}>
        <p class="title">{item.title}</p>
        {#if item.subtitle}
          <p class="sub-title">{item.subtitle}</p>
        {/if}
      </li>
    {/each}
  </div>

  {#each tabItem as item}
    <div
      class="tab-content"
      class:showContent={activeTab.toLowerCase() === item.title.toLowerCase()}>
      <div class="tab-content-header">
        <h4>{item.title}</h4>
        <button on:click={toggleModal}>
          <svg viewBox="0 0 24 24">
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M1.29289 1.29289C1.68342 0.902369 2.31658 0.902369 2.70711 1.29289L12 10.5858L21.2929 1.29289C21.6834 0.902369 22.3166 0.902369 22.7071 1.29289C23.0976 1.68342 23.0976 2.31658 22.7071 2.70711L13.4142 12L22.7071 21.2929C23.0976 21.6834 23.0976 22.3166 22.7071 22.7071C22.3166 23.0976 21.6834 23.0976 21.2929 22.7071L12 13.4142L2.70711 22.7071C2.31658 23.0976 1.68342 23.0976 1.29289 22.7071C0.902369 22.3166 0.902369 21.6834 1.29289 21.2929L10.5858 12L1.29289 2.70711C0.902369 2.31658 0.902369 1.68342 1.29289 1.29289Z" />
          </svg>
        </button>
      </div>
      <svelte:component this={item.component} />
    </div>
  {/each}
</div>
