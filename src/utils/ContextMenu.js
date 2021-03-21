class ContextMenu {
  constructor() {
    this.initEvent();
  }

  initEvent() {
    ['click', 'contextmenu'].forEach((ev) => {
      document.addEventListener(ev, (e) => {
        this.createMenu(e);
      });
    });

    ['resize', 'scroll'].forEach((ev) => {
      window.addEventListener(ev, () => {
        this.hideMenu();
      });
    });
  }

  createMenu(e) {
    let allContextMenu = document.querySelectorAll('.context-menu');
    this.target = e.target.closest('.context-menu-btn');
    if (this.target) {
      let position = this.calcPosition(e, this.target);
      this.btnID = this.target.attributes['context-btn-id'].value;

      allContextMenu.forEach((menu) => {
        if (menu.attributes['context-menu-id'].value === this.btnID) {
          this.contextMenu = menu;
        }
      });

      ['top', 'right', 'bottom', 'left', 'transformOrigin'].forEach((data) => {
        this.contextMenu.style[data] = position[data];
      });

      allContextMenu.forEach((menu) => {
        if (menu.attributes['context-menu-id'].value === this.btnID) return;
        this.hideMenu(menu);
      });

      if (this.contextMenu.classList.contains('isVisible')) this.hideMenu();
      else this.showMenu();
    } else if (!e.target.closest('.context-menu') && this.contextMenu)
      this.hideMenu();
  }

  calcPosition(e, target) {
    let windowWidth = window.innerWidth / 2;
    let windowHeight = window.innerHeight / 2;
    let rect = target.getBoundingClientRect();
    let offsetWidth = target.offsetWidth;
    let offsetHeight = target.offsetHeight;
    let clientX = e.clientX;
    let clientY = e.clientY;
    let position = {};

    if (clientY > windowHeight && clientX <= windowWidth) {
      //When user click on bottom-left part of window
      position = {
        right: 'auto',
        top: 'auto',
        left: rect.left + 'px',
        bottom: window.innerHeight - rect.top + 'px',
        transformOrigin: 'bottom left',
      };
    } else if (clientY > windowHeight && clientX > windowWidth) {
      //When user click on bottom-right part of window
      position = {
        top: 'auto',
        right: window.innerWidth - rect.left - offsetWidth + 'px',
        bottom: window.innerHeight - rect.top + 'px',
        left: 'auto',
        transformOrigin: 'bottom right',
      };
    } else if (clientY <= windowHeight && clientX <= windowWidth) {
      // When user click on top-left part of window
      position = {
        top: rect.top + offsetHeight + 'px',
        right: 'auto',
        bottom: 'auto',
        left: rect.left + 'px',
        transformOrigin: 'top left',
      };
    } else {
      //When user click on top-right part of window
      position = {
        left: 'auto',
        bottom: 'auto',
        right: window.innerWidth - rect.left - offsetWidth + 'px',
        top: rect.top + offsetHeight + 'px',
        transformOrigin: 'top right',
      };
    }

    return position;
  }

  showMenu(menu) {
    let contextMenu = menu || this.contextMenu;
    if (contextMenu) {
      contextMenu.style.transform = 'scale(1)';
      contextMenu.classList.add('isVisible');

      // Add active class to clicked btn
      this.target.classList.add('active');
    }
  }

  hideMenu(menu) {
    let contextMenu = menu || this.contextMenu;

    if (contextMenu) {
      contextMenu.style.transform = 'scale(0)';
      contextMenu.classList.remove('isVisible');

      // remove active class from all btn
      document.querySelectorAll('.context-menu-btn').forEach((btn) => {
        if (btn.classList.contains('active')) {
          btn.classList.remove('active');
        }
      });
    }
  }
}

export default ContextMenu;
