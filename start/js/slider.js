$(document).ready(function(){
    
    $(function() {
        $( "#slider1" ).slider({
          range: "min",
          value: 36,
          min: 18,
          max: 100,
          slide: function( event, ui ) {
            $( ".amount1" ).val( ui.value);
              writesum();
          }
        });
        $( ".amount1" ).val($( "#slider1" ).slider( "value" ));
      });
    
    $(function() {
        $( "#slider2" ).slider({
          range: "min",
          value: 50000,
          min: 1,
          max: 50000,
          slide: function( event, ui ) {
            $( ".amount2" ).val( ui.value );
              writesum();
          }
        });
        $( ".amount2" ).val( $( "#slider2" ).slider( "value" ));
      });
    
    
    function writesum() {
      var months = $('.amount1').val();
      var credits = $('.amount2').val();
      var payment = parseFloat(Number(credits) / Number(months))
      var rounded = payment.toFixed(2);
          $('.amount3').val(rounded);
    }
    
   

});
