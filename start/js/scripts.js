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

});
