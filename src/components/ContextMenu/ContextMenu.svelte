<script>
  import { contextMenuStore } from "../../store/music";

  let contextMenuContainer;
  let targetId;
  let contextMenu;

  export let id;

  function calcPosition(e) {
    let windowWidth = window.innerWidth / 2;
    let windowHeight = window.innerHeight / 2;
    let rect = e.target.getBoundingClientRect();
    let offsetWidth = e.target.offsetWidth;
    let offsetHeight = e.target.offsetHeight;
    let clientX = e.clientX;
    let clientY = e.clientY;
    let position = {};

    if (clientY > windowHeight && clientX <= windowWidth) {
      //When user click on bottom-left part of window
      position = {
        right: "auto",
        top: "auto",
        left: rect.left + "px",
        bottom: window.innerHeight - rect.top + "px",
        transformOrigin: "bottom left",
      };
    } else if (clientY > windowHeight && clientX > windowWidth) {
      //When user click on bottom-right part of window
      position = {
        top: "auto",
        right: window.innerWidth - rect.left - offsetWidth + "px",
        bottom: window.innerHeight - rect.top + "px",
        left: "auto",
        transformOrigin: "bottom right",
      };
    } else if (clientY <= windowHeight && clientX <= windowWidth) {
      // When user click on top-left part of window
      position = {
        top: rect.top + offsetHeight + "px",
        right: "auto",
        bottom: "auto",
        left: rect.left + "px",
        transformOrigin: "top left",
      };
    } else {
      //When user click on top-right part of window
      position = {
        left: "auto",
        bottom: "auto",
        right: window.innerWidth - rect.left - offsetWidth + "px",
        top: rect.top + offsetHeight + "px",
        transformOrigin: "top right",
      };
    }

    return position;
  }

  function toggleContextMenu(e) {
    if (e.target.closest(".context-menu-btn")) {
      let position = calcPosition(e);
      // console.log(e.target);

      targetId = e.target.attributes.id.value;
      let getAllContextMenu = document.querySelectorAll(
        ".contextMenuContainer"
      );

      getAllContextMenu.forEach((menu) => {
        if (menu.attributes["data-menu-id"].value === targetId)
          contextMenu = menu;
      });

      ["left", "bottom", "right", "top", "transformOrigin"].forEach((pos) => {
        contextMenu.style[pos] = position[pos];
      });

      getAllContextMenu.forEach((menu) => {
        if (menu.attributes["data-menu-id"].value == targetId) return;
        menu.classList.remove("isVisible");
        menu.style.transform = "scale(0)";
      });

      if (contextMenu.classList.contains("isVisible")) {
        contextMenu.style.transform = "scale(0)";
        contextMenu.classList.remove("isVisible");
      } else {
        contextMenu.style.transform = "scale(1)";
        contextMenu.classList.add("isVisible");
      }
    } else if (!e.target.closest(".contextMenuContainer")) {
      contextMenu.classList.remove("isVisible");
      contextMenu.style.transform = "scale(0)";
    }
  }

  // ["click", "contextmenu"].forEach((ev) => {
  //   window.addEventListener(ev, (e) => toggleContextMenu(e));
  // });

  // add function to store so we could use in other components
  $contextMenuStore = toggleContextMenu;
</script>

<style>
  .contextMenuContainer {
    width: 200px;
    height: 200px;
    background-color: var(--primary);
    padding: 10px;
    position: fixed;
    transform: scale(0);
    transition: transform 0.2s;
  }
</style>

<div
  class="contextMenuContainer"
  data-menu-id={id}
  bind:this={contextMenuContainer}>
  <slot />
</div>
