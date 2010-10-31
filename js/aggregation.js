/**
 * Dialog Display
 */
function setupImageDialog() {
  $(document.body).click(function(e) {
    var target = e.target;
    var dialogOverlay = $('#dialogOverlay'),
        container     = target.parentNode.parentNode;

    if (dialogOverlay.length == 0 && target.nodeName == 'IMG' && container.className == 'item') {
      $(document.body).append('<div id="dialogOverlay" class="enable dialogVisible"></div><div id="dialogWrapper" class="enable"><div id="dialogContent"></div></div>');
    }

    var dialogWrapper = $('#dialogWrapper'), 
        dialogContent = $('#dialogContent');

    if (target.nodeName == 'IMG' && container.className == 'item') {
      e.preventDefault();
      dialogOverlay.attr('class', 'enable dialogVisible');
      dialogWrapper.attr('class', 'enable');
      dialogContent.fadeIn();

      var links = $(container).find('a'),
          output = ['<a id="dialogClose" href="#close">X</a>'];

      for (var i = 0, linkLength = links.length; i < linkLength; i++) {
        output.push('<img class="', links[i].firstChild.className , '" src="', links[i].firstChild.src, '" />');
      }

      if (output) {
        dialogContent.html(output.join(''));
      }
    }
    else if (target.nodeName == 'A' && container.className == '' &&
              (target.firstChild.className == 'headerImage' || target.firstChild.className == 'defaultImage')) {
      e.preventDefault();
    }

    if (target.id == 'dialogClose' || target.id == 'dialogOverlay' || target.id == 'dialogWrapper') {
      e.preventDefault();
      dialogOverlay.attr('class', 'disable');
      dialogWrapper.attr('class', 'disable');
      dialogContent.css('display', 'none');
    }
  });
}

/**
 * Transform Switcher
 */
function setupTransformSwitcher() {
  var primaryNav             = $('#primary-nav'),
      defaultTransform       = primaryNav.find('li:first-child a'),
      defaultTransformHeader = defaultTransform.html(),
      content                = $('#content');

  $.ajax({
    url:defaultTransform.attr('href'),
    dataType:'html',
    success:function(response) {
      var buffer = ['<h2>' + defaultTransformHeader + '</h2>', response];
      content.html(buffer.join());
    }
  });

  primaryNav.click(function(e) {
    var target = e.target;

    if (target.nodeName == 'A') {
      e.preventDefault();

      $.ajax({
        url:target.href,
        dataType:'html',
        success:function(response) {
          var buffer = ['<h2>' + target.innerHTML + '</h2>', response];
          content.html(buffer.join());
        }
      });
    }

  });
}

