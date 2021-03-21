<script>
  import { toggleNav } from "../../store/music";
  import "./Burger.css";
  // export let open = false;
</script>

<!-- Burger Menu -->
<button
  class="burger-menu"
  aria-label="Main Menu"
  on:click={() => ($toggleNav = !$toggleNav)}>
  <span />
  <span />
  <span />
</button>
