$(document).ready(function() {
  var leftBackground = true;

  $( "body" ).mousemove(function( event ) {

    if ($('body').hasClass('profilePage')) {
      var windowWidth = $(window).width();
      if (event.pageX > windowWidth/2) {
        if (leftBackground) {
          $('body').css("background-image","url('images/Questionnaire Cheddar_Blue.jpg')");
        }
        leftBackground = false;
      } else {
        if (!leftBackground) {
          $('body').css("background-image","url('images/Questionnaire Rock_Electronic.jpg')");
        }
        leftBackground = true;
      }
    }

  });

  $('.popup').click(function(event) {
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

});
