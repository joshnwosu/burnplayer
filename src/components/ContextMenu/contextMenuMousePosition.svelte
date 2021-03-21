<script>
  let contextMenuContainer;
  function contextMenu(e) {
    let windowHeight = window.innerHeight / 2;
    let windowWidth = window.innerWidth / 2;
    let position = {};
    if (e.clientY > windowHeight && e.clientX <= windowWidth) {
      //When user click on bottom-left part of window
      position.left = e.clientX + "px";
      position.bottom = window.innerHeight - e.clientY + "px";
      position.right = "auto";
      position.top = "auto";

      let rectLeft =
        e.target.getBoundingClientRect().left + e.target.offsetWidth;
      let rectBottom =
        window.innerHeight - e.target.getBoundingClientRect().top;
      position.left = rectLeft + "px";
      position.bottom = rectBottom + "px";
    } else if (e.clientY > windowHeight && e.clientX > windowWidth) {
      //When user click on bottom-right part of window
      position.right = window.innerWidth - e.clientX + "px";
      position.bottom = window.innerHeight - e.clientY + "px";
      position.left = "auto";
      position.top = "auto";

      let rectRight = window.innerWidth - e.target.getBoundingClientRect().left;
      let rectBottom =
        window.innerHeight - e.target.getBoundingClientRect().top;
      position.right = rectRight + "px";
      position.bottom = rectBottom + "px";

      console.log(position);
    } else if (e.clientY <= windowHeight && e.clientX <= windowWidth) {
      //When user click on top-left part of window
      position.left = e.clientX + "px";
      position.top = e.clientY + "px";
      position.right = "auto";
      position.bottom = "auto";

      // Using rect
      let rectLeft =
        e.target.getBoundingClientRect().left + e.target.offsetWidth;
      let rectTop =
        e.target.getBoundingClientRect().top + e.target.offsetHeight;

      position.left = rectLeft + "px";
      position.top = rectTop + "px";

      console.log(rectLeft, rectTop);
    } else {
      //When user click on top-right part of window
      position.right = window.innerWidth - e.clientX + "px";
      position.top = e.clientY + "px";
      position.left = "auto";
      position.bottom = "auto";

      // Using rect
      let rectRight = window.innerWidth - e.target.getBoundingClientRect().left;
      let rectTop =
        e.target.getBoundingClientRect().top + e.target.offsetHeight;

      position.right = rectRight + "px";
      position.top = rectTop + "px";
    }

    contextMenuContainer.style.left = position.left;
    contextMenuContainer.style.bottom = position.bottom;
    contextMenuContainer.style.right = position.right;
    contextMenuContainer.style.top = position.top;
    contextMenuContainer.style.transform = "scale(1)";

    document.addEventListener("click", documentClickHandler);
  }

  const documentClickHandler = function (e) {
    const isClickedOutside = !contextMenuContainer.contains(e.target);
    console.log(isClickedOutside);
    if (isClickedOutside) {
      contextMenuContainer.style.transform = "scale(0)";
      //   document.removeEventListener("click", documentClickHandler);
    }
  };

  // document.addEventListener("click", function (e) {
  //   if (e.target.closest("#contextMenuContainer")) {
  //     contextMenuContainer.style.transform = "scale(0)";
  //     // document.removeEventListener("click", contextMenu);
  //   } else {
  //     contextMenu(e);
  //   }
  // });
</script>

<style>
  #contextMenuContainer {
    width: 200px;
    height: 200px;
    background-color: var(--primary);
    padding: 10px;
    position: fixed;
    transform: scale(0);
    /* transition: 300ms ease-in; */
    /* transform-origin: top left; */
  }

  button {
    border: 1px solid red;
    padding: 10px;
    color: white;
    margin: 20px;
    position: absolute;
  }
  button:nth-child(2) {
    top: 0;
    right: 0;
  }
  button:nth-child(3) {
    bottom: 0;
    left: 0;
  }
  button:nth-child(4) {
    bottom: 0;
    right: 0;
  }
</style>

<button on:contextmenu|preventDefault={contextMenu}>Menu</button>
<button on:contextmenu|preventDefault={contextMenu}>Menu</button>
<button on:contextmenu|preventDefault={contextMenu}>Menu</button>
<button on:contextmenu|preventDefault={contextMenu}>Menu</button>
<div id="contextMenuContainer" bind:this={contextMenuContainer}>
  <ul id="contextMenu">
    <li />
    <li>Option 1</li>
    <li>Option 2</li>
  </ul>
</div>
