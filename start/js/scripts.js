$(document).ready(function() {
  var leftBackground = true;

  //stop share icon links following through
  $( ".shareIcons a.popup").unbind( "click" );

  if ($(window).width() < 1225) {
    $('.inner.mobile').insertBefore($('.inner.desktop'));
  } else {
    $('.inner.desktop').insertBefore($('.inner.mobile'));
  }


  $('a.responseSelector').on('click touchend', function(e) {
    var el = $(this);
    var link = el.attr('href');
    window.location = link;
  });

  $('a.popup').on('click touchend', function(e) {
    var width  = 575,
        height = 400,
        left   = ($(window).width()  - width)  / 2,
        top    = ($(window).height() - height) / 2,
        url    = this.href,
        opts   = 'status=1' +
                 ',width='  + width  +
                 ',height=' + height +
                 ',top='    + top    +
                 ',left='   + left;

    window.open(url, 'twitter', opts);

    return false;
  });

  $('.scrollmore-holder').css('top', $(window).height() + $(window).scrollTop() - 50);
});

$( window ).resize(function() {
  if ($(window).width() < 1225) {
    $('.inner.mobile').insertBefore($('.inner.desktop'));
  } else {
    $('.inner.desktop').insertBefore($('.inner.mobile'));
  }
});

$( window ).scroll(function() {
  $('.scrollmore-holder').css('top', $(window).height() + $(window).scrollTop() - 50);

  if ($(window).scrollTop() > 100) {
    $('.scrollmore-holder').fadeOut();
  }
});


$(document).off('click', 'a.popup').on('click', 'a.popup', function(event) {
  var width  = 575,
      height = 400,
      left   = ($(window).width()  - width)  / 2,
      top    = ($(window).height() - height) / 2,
      url    = this.href,
      opts   = 'status=1' +
               ',width='  + width  +
               ',height=' + height +
               ',top='    + top    +
               ',left='   + left;

  window.open(url, 'twitter', opts);

  return false;
});
