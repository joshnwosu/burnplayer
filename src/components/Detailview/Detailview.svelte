<script>
    import convertDuration from "../../utils/convertDuration";

    // import { showAlbumDetail } from "../../store/music";
    export let componentName;
    export let openDetail;

    import { icons } from "../../utils/icons";
    import Song from "../Song/Song.svelte";

    let { play, shuffle, time } = icons;

    import "./Detailview.css";

    export let data;
    export let cover;
    export let showDetail;
    export let navigationName;

    $: songData = data || [];

    function totalAudioDuration(song) {
        let totalDuration = song.reduce((a, b) => ({
            duration: a.duration + b.duration,
        }));

        return totalDuration.duration;
    }
</script>

<div class="detail-view" class:showDetail>
    <div class="detail-view-header">
        <div class="header-cover-img"><img src={cover} alt="" /></div>
        <div class="header-profile-img"><img src={cover} alt="" /></div>

        <div class="header-navigation">
            <button on:click={() => openDetail()}>
                <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M16.2929 5.29289C15.9024 5.68342 15.9024 6.31658 16.2929 6.70711L20.5858 11H1C0.447716 11 0 11.4477 0 12C0 12.5523 0.447716 13 1 13H20.5858L16.2929 17.2929C15.9024 17.6834 15.9024 18.3166 16.2929 18.7071C16.6834 19.0976 17.3166 19.0976 17.7071 18.7071L23.7071 12.7071C24.0976 12.3166 24.0976 11.6834 23.7071 11.2929L17.7071 5.29289C17.3166 4.90237 16.6834 4.90237 16.2929 5.29289Z" />
                </svg>
            </button>
            <h4>{navigationName}</h4>
        </div>

        <div class="header-content">
            <div class="header-buttons">
                <button>
                    <svg viewBox="0 0 24 24">
                        <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d={play} />
                    </svg>
                    <h4>Play all</h4>
                </button>

                <button>
                    <svg viewBox="0 0 24 24">
                        <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d={shuffle} />
                    </svg>
                    <h4>Shuffle</h4>
                </button>
            </div>

            <div class="header-time">
                <h4>
                    {songData.length == 1 ? songData.length + ' song' : songData.length + ' songs'}
                </h4>
                <div class="header-duration">
                    <svg viewBox="0 0 24 24">
                        <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d={time} />
                    </svg>
                    <h4>
                        {songData.length ? convertDuration(totalAudioDuration(songData)) : ''}
                    </h4>
                </div>
            </div>
        </div>
    </div>
    <div class="detail-song">
        <Song data={songData} {componentName} />
    </div>
</div>

<!-- <div class="detail" class:showDetail>
    <div style="height: 60px" />

    <div class="music-wrapper">
        <Song data={songData} componentName="album" />
    </div>
</div> -->
