require('dotenv').config();

const express = require("express");

const https = require("https");

const bodyParser = require("body-parser");

const request = require("request");

const ejs = require("ejs");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));

app.set('view engine', 'ejs');

app.use(express.static("public"));

app.get("/", function(req,res) {
  res.sendFile(__dirname + "/index.html")
});

app.post("/", function(req, res) {
  const query = req.body.cityName;

  const apiKey = process.env.APIKEY;

  const unit = req.body.unit;

  var unitString;

  if (unit == "Imperial") {
    unitString = "F";
  }
  if (unit == "Metric") {
    unitString = "C";
  }
  if (unit == "Default") {
    unitString = "K";
  }

  const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apiKey + "&units=" + unit;

  https.get(url, function(response) {
    console.log(response.statusCode);

    response.on("data", function(data) {
      const weatherData = JSON.parse(data);

      const temp = weatherData.main.temp;

      const weatherDescription = weatherData.weather[0].description;

      const icon = weatherData.weather[0].icon;

      const imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";

      res.render("card", {
        imageURL: imageURL,
        temp: temp,
        unitString: unitString,
        weatherDescription: weatherDescription
      });
    });
  });
})


app.listen(process.env.PORT || 3000, function() {
  console.log("The server is running at port 3000");
});
