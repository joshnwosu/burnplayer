function Notification(options) {
  this.options = { ...this.options, ...options };
  this._init();
}

Notification.prototype.options = {
  wrapper: document.body,
  message: 'yo!',
  layout: 'growl',
  effect: 'slide',
  type: 'error',
  ttl: 6000,
  onClose: function () {
    return false;
  },
  onOpen: function () {
    return false;
  },
};

Notification.prototype._init = function () {
  this.ntf = document.createElement('div');
  this.ntf.className =
    'ns-box ns-' +
    this.options.layout +
    ' ns-effect-' +
    this.options.effect +
    ' ns-type-' +
    this.options.type;
  var strInner = '<div class="ns-box-inner">';
  strInner += this.options.message;
  strInner += '</div>';
  strInner += '<span class="ns-close"></span></div>';
  this.ntf.innerHTML = strInner;

  this.options.wrapper.insertBefore(this.ntf, this.options.wrapper.nextSibling);

  // dismiss after [options.ttl]ms
  var self = this;
  this.dismissttl = setTimeout(function () {
    if (self.active) {
      self.dismiss();
    }
  }, this.options.ttl);

  // init events
  this._initEvents();
};

Notification.prototype._initEvents = function () {
  var self = this;
  // dismiss notification
  this.ntf.querySelector('.ns-close').addEventListener('click', function () {
    self.dismiss();
  });
};

Notification.prototype.show = function () {
  this.active = true;
  this.ntf.classList.remove('ns-hide');
  this.ntf.classList.add('ns-show');
  this.options.onOpen();
};

Notification.prototype.dismiss = function () {
  //   console.log('Dismissing...');
  var self = this;
  this.active = false;
  clearTimeout(this.dismissttl);
  this.ntf.classList.remove('ns-show');
  setTimeout(function () {
    self.ntf.classList.add('ns-hide');

    self.options.onClose();
  }, 25);

  var onEndAnimation = function (ev) {
    if (ev.target !== self.ntf) return false;
    this.removeEventListener('animationend', onEndAnimation);

    self.options.wrapper.removeChild(this);
  };
  //   onEnd();
  //   this.ntf.addEventListener('webkitAnimationEnd', onEnd);

  this.ntf.addEventListener('animationend', onEndAnimation);

  //   this.options.wrapper.removeChild(this);
};

export default Notification;
