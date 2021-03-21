<script>
    import "./styles/Explore.css";
    import { handleClickStore } from "../store/music";
    import Header from "../components/Header/Header.svelte";

    let exploreRoute = [
        {
            name: "My music",
            total: 1079,
            color: "#a801e0",
        },
        {
            name: "Favorite",
            total: 237,
            color: "#F775A1",
        },
        {
            name: "Most Played",
            total: 59,
            color: "#CFB453",
        },
        {
            name: "Recently Played",
            total: 783,
            color: "#70C4BF",
        },
    ];
</script>

<Header id="explore-component">
    <h3>Explore</h3>
</Header>
<div class="explore-wrapper">
    <div class="now-player-preview" />

    <div class="grid-container">
        {#each exploreRoute as route}
            <div
                class="grid"
                on:click={$handleClickStore(route.name.toLowerCase())}>
                <div class="grid-icon" style="background-color: {route.color}">
                    <span />
                </div>
                <div class="grid-info">
                    <h3>{route.name}</h3>
                    <h5>{route.total}</h5>
                </div>
            </div>
        {/each}
    </div>
</div>
