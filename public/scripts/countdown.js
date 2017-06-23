// Set the date we're counting down to
var countDownDate = new Date("Jun 24, 2017 11:26:00").getTime();

var stationMap = {
  "BTL": "Batley",
  "DEW": "Dewsbury",
  "MIR": "Mirfield",
  "HUD": "Huddersfield",
  "SWT": "Slaithwaite",
  "MSN": "Marsden",
  "GNF": "Greenfield",
  "SYB": "Stalybridge"
};

var month = new Array();
month[0] = "Jan";
month[1] = "Feb";
month[2] = "Mar";
month[3] = "Apr";
month[4] = "May";
month[5] = "Jun";
month[6] = "Jul";
month[7] = "Aug";
month[8] = "Sep";
month[9] = "Oct";
month[10] = "Nov";
month[11] = "Dec";

var firstDateTime;
var firstDateTimeString;
var secondDateTime;

// Update the count down every 1 second
var x = setInterval(function() {

  var startCountdown = getCountdown(countDownDate);

  if (firstDateTime != null) {

    var firstCountdown = getCountdown(firstDateTime);

    document.getElementById("firstCountdown").innerHTML = "The next train is<br>" + firstCountdown.countdown.hours + "h " +
      firstCountdown.countdown.minutes + "m " + firstCountdown.countdown.seconds + "s away!";

    if (firstCountdown.distance < 0) {
      document.getElementById("firstCountdown").innerHTML = "You missed the bloody train!!!!";
    }
  }

  // Display the result in the element with id="demo"
  document.getElementById("countdown").innerHTML = "Ale Trail Countdown<br>" + startCountdown.countdown.days + "d " + startCountdown.countdown.hours + "h " +
    startCountdown.countdown.minutes + "m " + startCountdown.countdown.seconds + "s";
  // If the count down is finished, write some text
  if (startCountdown.distance < 0) {
    document.getElementById("countdown").innerHTML = "The Trail has Started, hold onto your hats!";
  }
}, 1000);

function updateTrainInformation(station) {
    $.post("/train", {
      station: station
    }, function(data, status) {

      var nextService = data[0];
      var secondService = data[1];
      var firstTime;
      var secondTime;
      var todaysDate = new Date();

      var monthText = month[todaysDate.getMonth()];

      var countdownBase = monthText + " " + todaysDate.getDate() + ", " + todaysDate.getUTCFullYear() + " ";

      if (typeof nextService != 'undefined') {
        if (nextService.etd[0] != "On time") {
          firstTime = nextService.etd[0];
        } else {
          firstTime = nextService.std[0];
        }
      }

      if (typeof secondService != 'undefined') {
        if (secondService.etd[0] != "On time") {
          secondTime = secondService.etd[0];
        } else {
          secondTime = secondService.std[0];
        }
      }

      firstDateTimeString = countdownBase + firstTime + ":00";
      firstDateTime = new Date(firstDateTimeString).getTime();
      secondDateTime = countdownBase + secondTime + ":00";

      document.getElementById("firstTrain").innerHTML = "The next service is the " + nextService.std[0] + ".<br>It is running " + nextService.etd[0] + ".<br>On platform " + nextService.platform[0];
      document.getElementById("secondTrain").innerHTML = "The second service is the " + secondService.std[0] + ".<br>It is running " + secondService.etd[0] + ".<br>On platform " + secondService.platform[0];
      document.getElementById("current-station").innerHTML = stationMap[station];
      $('#youarein').show();
    });
}

$("#submit").click(function(event) {
  updateTrainInformation($("#stationselector option:selected").val());
});

function getCountdown(date) {

  // Get todays date and time
  var now = new Date().getTime();

  // Find the distance between now an the count down date
  var distance = date - now;

  // Time calculations for days, hours, minutes and seconds
  var days = Math.floor(distance / (1000 * 60 * 60 * 24));
  var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((distance % (1000 * 60)) / 1000);

  var countdown = {
    countdown: {
      days: days,
      hours: hours,
      minutes: minutes,
      seconds: seconds
    },
    distance: distance
  };

  return countdown;
}

function showStationSelector() {
  $('#stationselector').show();
  clearInterval(checkLocationInterval);
}

function hideStationSelector() {
  $('#stationselector').hide();
  checkLocationInterval = setInterval(checkLocation, gpsCheckTime);
  checkLocation();
}
