/*eslint-env node*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

// This application uses express as its web server
// for more info, see: http://expressjs.com
var express = require('express');
var http = require('http');
var parseString = require('xml2js').parseString;

var bodyParser = require('body-parser');

"use strict";
var url = 'https://lite.realtime.nationalrail.co.uk/OpenLDBWS/wsdl.aspx?ver=2016-02-16';

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');

// create a new express server
var app = express();

app.use(bodyParser.urlencoded());

// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

//Need token for acess
var token = "ADD TOKEN";

app.post("/train", function(req,response){

  var currentStation = req.body.station;
  var nextStationArray = ["BTL", "DEW", "MIR", "HUD", "SWT", "MSN", "GNF", "SYB", "MAN"];
  var nextStation = nextStationArray[nextStationArray.indexOf(currentStation)+1];
  //console.log("from:"+ currentStation+ " TO: " + nextStation);

  var body = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:typ="http://thalesgroup.com/RTTI/2013-11-28/Token/types" xmlns:ldb="http://thalesgroup.com/RTTI/2016-02-16/ldb/">'+
   '<soapenv:Header><typ:AccessToken><typ:TokenValue>'+ token + '</typ:TokenValue></typ:AccessToken></soapenv:Header>'+
   '<soapenv:Body><ldb:GetDepBoardWithDetailsRequest><ldb:numRows>2</ldb:numRows><ldb:crs>'+currentStation+'</ldb:crs><!--Optional:--><ldb:filterCrs>'+ nextStation +'</ldb:filterCrs><!--Optional:--><ldb:filterType>to</ldb:filterType><!--Optional:--><ldb:timeOffset>0</ldb:timeOffset><!--Optional:--><ldb:timeWindow>120</ldb:timeWindow></ldb:GetDepBoardWithDetailsRequest></soapenv:Body></soapenv:Envelope>';

  var postRequest = {
      host: "lite.realtime.nationalrail.co.uk",
      path: "/OpenLDBWS/ldb9.asmx",
      port: 80,
      method: "POST",
      headers: {
          'Cookie': "cookie",
          'Content-Type': 'text/xml',
          'Content-Length': Buffer.byteLength(body),
          'SOAPAction': 'http://thalesgroup.com/RTTI/2015-05-14/ldb/GetDepBoardWithDetails'
      }
  };

  var buffer = "";
  var req = http.request( postRequest, function( res )    {

     var buffer = "";
     var trainServices;
     res.on( "data", function( data ) { buffer = buffer + data; } );
     res.on( "end", function( data ) {

        parseString(buffer, function (err, result) {
          result = JSON.stringify(result);
          result = result.replace(/soap:/g,"");result = result.replace(/xmlns:/g,"");result = result.replace(/lt5:/g,"");result = result.replace(/lt4:/g,"");
          result = JSON.parse(result);
          //returns an array of the services
          trainServices = result.Envelope.Body[0].GetDepBoardWithDetailsResponse[0].GetStationBoardResult[0].trainServices[0].service;
        });

       response.send(trainServices);

     } );

  });

  req.on('error', function(e) {
      console.log('problem with request: ' + e.message);
  });
  req.write( body );
  req.end();

})

// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function() {
  // print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});
