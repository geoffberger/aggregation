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
  self.init();
};

ImageDialog.prototype = {
  init:function() {
    var self = this;
    this.selector.click(function(e) {
      var target = e.target,
          container = target.parentNode.parentNode;
      self.dialogOverlay = $('#dialogOverlay');

      if (self.dialogOverlay.length == 0 && target.nodeName == 'IMG' && container.className == self.imageContainer) {
        self.selector.append('<div id="dialogOverlay" class="enable dialogVisible"></div><div id="dialogWrapper" class="enable"><div id="dialogContent"></div></div>');
      }

      self.dialogWrapper = $('#dialogWrapper');
      self.dialogContent = $('#dialogContent');

      if (target.nodeName == 'IMG' && container.className == self.imageContainer) {
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

/**
 * Transform Switcher
 */
var TransformSwitcher = function(selector, content, defaultUrlCallback, defaultTitleCallback, titleCallback) {
  var self = this;
  self.selector = $(selector);
  self.content = $(content);
  self.defaultUrlCallback = defaultUrlCallback;
  self.defaultTitleCallback = defaultTitleCallback;
  self.titleCallback = titleCallback;
  self.init();
  self.events();
}

TransformSwitcher.prototype = {
  init: function() {
    this.doAjaxRequest(this.defaultUrlCallback(this), this.defaultTitleCallback.call(this));
  },

  events:function() {
    var self = this;
    this.selector.click(function(e) {
      var target = e.target;

      if (target.nodeName == 'A') {
        e.preventDefault();
        self.doAjaxRequest(target.href, target.innerHTML);
      }
    });
  },

  doAjaxRequest: function(url, title) {
    var self = this;
    $.ajax({
      url:url,
      dataType:'html',
      success:function(response) {
        var buffer = [self.titleCallback.call(self, title), response];
        self.content.html(buffer.join(''));
      }
    });
  }
};

