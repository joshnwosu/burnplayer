<script>
  import "./Analyser.css";
  import { audioContext, audioStatus, musicID } from "../../store/music";

  $: if ($audioContext) {
    initAnalyser($audioContext);
  }

  let canvas,
    ctx,
    source,
    analyser,
    fbc_array,
    bars,
    bar_x,
    bar_width,
    bar_height,
    context = new (AudioContext || webkitAudioContext)();

  function initAnalyser(audio) {
    analyser = context.createAnalyser();
    canvas = document.getElementById("analyser_render");
    ctx = canvas.getContext("2d");
    source = source || context.createMediaElementSource(audio);
    source.connect(analyser);
    analyser.connect(context.destination);
    frameLooper();
  }
  function frameLooper() {
    requestAnimationFrame(frameLooper);
    fbc_array = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(fbc_array);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#a801e0";

    bars = canvas.width;
    for (var i = 0; i < bars; i++) {
      bar_x = i * 1;
      bar_width = 1;
      bar_height = -(fbc_array[i] / 2);
      ctx.fillRect(bar_x, canvas.height, bar_width, bar_height);
    }
  }
</script>

<div class="analyser">
  <canvas class="analyser_render" id="analyser_render" />
  <div class="analyser-overlay" />
</div>
