/**
 * Dialog Display
 */
var ImageDialog = function(selector, imageContainer, imageClassNames, dialogOutputCallback) {
  var self = this;
  self.selector = $(selector);
  self.imageContainer = imageContainer;
  self.imageClassNames = imageClassNames;
  self.dialogOutputCallback = dialogOutputCallback;
  self.dialogOverlay = {};
  self.dialogWrapper = {};
  self.dialogContent = {};
  self.events();
};

ImageDialog.prototype = {
  events: function() {
    this.triggerDialogSelector();
    this.triggerEscapeCloseOut();
  },

  triggerDialogSelector: function() {
    var self = this;
    this.selector.click(function(e) {
      var target = e.target,
          container = target.parentNode.parentNode;

      if ($('#dialogOverlay').length == 0 && target.nodeName == 'IMG' && container.className == self.imageContainer) {
        self.selector.append('<div id="dialogOverlay" class="enable dialogVisible"></div><div id="dialogWrapper" class="enable"><div id="dialogContent"></div></div>');
      }

      self.dialogOverlay = $('#dialogOverlay');
      self.dialogWrapper = $('#dialogWrapper');
      self.dialogContent = $('#dialogContent');

      if (target.nodeName == 'IMG' && container.className == self.imageContainer) {
        var topPosition = $(window).scrollTop() + 80;
        self.dialogWrapper.css('top', topPosition + 'px');

        e.preventDefault();
        self.displayDialog();

        var links = $(container).find('a'),
            output = ['<a id="dialogClose" href="#close">X</a>'];

        for (var i = 0, linkLength = links.length; i < linkLength; i++) {
          output.push(self.dialogOutputCallback.call(self, links[i]));
        }

        if (output) {
          self.dialogContent.html(output.join(''));
        }
      }
      else if (target.nodeName == 'A' && container.className == '' && self.hasImagesByClassName(target)) {
        e.preventDefault();
      }

      if (target.id == 'dialogClose' || target.id == 'dialogOverlay' || target.id == 'dialogWrapper') {
        e.preventDefault();
        self.hideDialog();
      }
    });
  },

  triggerEscapeCloseOut: function() {
    var self = this;

    $(document).keyup(function(e) { 
      if (e.which == 27 && self.dialogOverlay && self.dialogOverlay.hasClass('enable')) {
        self.hideDialog();
      }
    });
  },

  displayDialog: function() {
    this.dialogOverlay.attr('class', 'enable dialogVisible');
    this.dialogWrapper.attr('class', 'enable');
    this.dialogContent.fadeIn();
  },

  hideDialog: function() {
    this.dialogOverlay.attr('class', 'disable');
    this.dialogWrapper.attr('class', 'disable');
    this.dialogContent.css('display', 'none');
  },

  hasImagesByClassName: function(target) {
    var hasClass = false;

    for (var i = 0, imageClassNamesLength = this.imageClassNames.length; i < imageClassNamesLength; i++) {
      if (target.firstChild.className == this.imageClassNames[i]) {
        hasClass = true;
        break;
      }
    }

    return hasClass;
  }
};

var ContentLoader = function(selector, content, defaultDisplay, titleCallback, contentCallback) {
  var self = this;
  self.selector = $(selector);
  self.content = $(content);
  self.defaultDisplay = defaultDisplay;
  self.titleCallback = titleCallback;
  self.contentCallback = contentCallback;

  self.init();
  self.events();
};

ContentLoader.prototype = {
  init: function() {
    this.defaultDisplay.call(this);
  },

  events: function() {
    this.triggerMenuSelection();
  },

  triggerMenuSelection: function() {
    var self = this;

    self.selector.click(function(e) {
      e.preventDefault();
      var target = e.target;
      if (target.nodeName == 'A') {
        self.displayContent(target.innerHTML, target.hash);
      }
    });
  },

  displayContent: function(title, hrefHash) {
    var buffer = [];
    if (hrefHash.match(/#/i)) {
      var section = hrefHash.replace(/#/i, '');
      buffer.push(this.titleCallback.call(this, title), this.contentCallback.call(this, data[section]));
      this.content.html(buffer.join(''));
    }
  }
};

