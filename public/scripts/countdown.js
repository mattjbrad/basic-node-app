
// Set the date we're counting down to
var countDownDate = new Date("Jun 24, 2017 11:26:00").getTime();

var traintime = new Date("Jun 24, 2017 14:00:00").getTime();

// Update the count down every 1 second
var x = setInterval(function() {

  // Get todays date and time
  var now = new Date().getTime();

  // Find the distance between now an the count down date
  var distance = countDownDate - now;

  // Time calculations for days, hours, minutes and seconds
  var days = Math.floor(distance / (1000 * 60 * 60 * 24));
  var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((distance % (1000 * 60)) / 1000);

  // Display the result in the element with id="demo"
  document.getElementById("countdown").innerHTML = "The trail is - " + days + "d " + hours + "h "
  + minutes + "m " + seconds + "s ";
  // If the count down is finished, write some text
  if (distance < 0) {
    clearInterval(x);
    document.getElementById("countdown").innerHTML = "The Trail has Started, hold onto your hats!";
  }
}, 1000);

$("#togglebutton").click(function(event){
     $("#stationselector").removeClass("hidden");
});

$("#stationselector").change(function(event){
     console.log($("#stationselector option:selected" ).text());
});

$("#submit").click(function(event){

    var station = $("#stationselector option:selected").val();
    console.log(station);
     $.post("/train", {station:station} , function(data, status){

       var nextService = data[0];
       var secondService = data[1];
       document.getElementById("firstTrain").innerHTML="The next service was due at " + nextService.std[0] + " it is running " + nextService.etd[0] + " on platform " +  nextService.platform[0] ;
       document.getElementById("secondTrain").innerHTML="The next service was due at " + secondService.std[0] + " it is running " + secondService.etd[0] + " on platform " +  secondService.platform[0] ;

    });



});
