//Set environment variables with the dotenv package
require("dotenv").config();

// Include the request npm package (Don't forget to run "npm install request" in this folder first!)
var request = require("request");

//Grab data from keys.js
var keys = require("./keys.js");

//Required Twitter API & Keys
var Twitter = require("twitter");
var twitterKeys = keys.twitter;
var client = new Twitter({ twitterKeys });
var params = { screen_name: "alljones", count: 20 };

//Required Spotify API & Keys
var spotify = require("spotify");
var spotKeys = keys.spotify;

var fs = require("fs");

// Input Argument
var command = process.argv[2];
var input = process.argv[3]; //song or movie input

//Switch Case
switch (command) {
  case "my-tweets":
    showTweets();
    break;
  case "spotify-this-song":
    spotSong(input);
    break;
  case "movie-this":
    showMovie(input);
    break;
  case "do-what-it-says":
    read();
    break;
  default:
    console.log("Try again, wrong command has been enter.");
}

//1. my-tweets
function showTweets() {
  client.get("statuses/user_timeline", params, function(
    error,
    tweets,
    response
  ) {
    if (!error && response.statusCode == 200) {
      fs.appendFile(
        "terminal.log",
        "=============== LOG ENTRY BEGIN ===============\r\n" +
          Date() +
          "\r\n \r\nTERMINAL COMMANDS:\r\n$: " +
          process.argv +
          "\r\n \r\nDATA OUTPUT:\r\n",
        function(err) {
          if (err) throw err;
        }
      );
      console.log(" ");
      console.log("Last 20 Tweets:");
      for (i = 0; i < tweets.length; i++) {
        var number = i + 1;
        console.log(" ");
        console.log([i + 1] + ". " + tweets[i].text);
        console.log("Created on: " + tweets[i].created_at);
        console.log(" ");
        fs.appendFile(
          "terminal.log",
          number +
            ". Tweet: " +
            tweets[i].text +
            "\r\nCreated at: " +
            tweets[i].created_at +
            " \r\n",
          function(err) {
            if (err) throw err;
          }
        );
      }
      fs.appendFile(
        "terminal.log",
        "=============== LOG ENTRY END ===============\r\n \r\n",
        function(err) {
          if (err) throw err;
        }
      );
    }
  });
}

//2. spotify-this-song
function spotSong(song) {
  if (song == null) {
    song = "computer love";
  }
  request(`https://api.spotify.com/v1/search?q=${song}&type=track`, function(
    error,
    response,
    body
  ) {
    if (!error && response.statusCode == 200) {
      body = JSON.parse(body);
      console.log(" ");
      console.log(`Artist: ${body.tracks.items[0].artists[0].name}`);
      console.log(`Song: ${body.tracks.items[0].name}`);
      console.log(`Preview Link: ${body.tracks.items[0].preview_url}`);
      console.log(`Album: ${body.tracks.items[0].album.name}`);
      console.log(" ");
      fs.appendFile(
        "terminal.log",
        "=============== LOG ENTRY BEGIN ===============\r\n" +
          Date() +
          "\r\n \r\nTERMINAL COMMANDS:\r\n$: " +
          process.argv +
          "\r\n \r\nDATA OUTPUT:\r\n" +
          "Artist: " +
          jsonBody.tracks.items[0].artists[0].name +
          "\r\nSong: " +
          jsonBody.tracks.items[0].name +
          "\r\nPreview Link: " +
          jsonBody.tracks.items[0].preview_url +
          "\r\nAlbum: " +
          jsonBody.tracks.items[0].album.name +
          "\r\n=============== LOG ENTRY END ===============\r\n \r\n",
        function(err) {
          if (err) throw err;
        }
      );
    }
  });
}

//3. movie-this
function showMovie(movie) {
  if (movie == null) {
    movie = "rocky";
  }
  var omdbUrl = `http://www.omdbapi.com/?t=${movie}&plot=short&apikey=trilogy`;
  request(omdbUrl, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      jsonBody = JSON.parse(body);
      console.log(" ");
      console.log(`Title: ${body.Title}`);
      console.log(`Year Released: ${body.Year}`);
      console.log(`IMBD Rating: ${body.imdbRating}`);
      console.log(`Rotten Tomatoes Rating: ${body.Rating[1].Value}`);
      console.log(`Language: ${body.Language}`);
      console.log(`Movie Plot: ${body.Plot}`);
      console.log(`Actor(s): ${body.Actors}`);
      fs.appendFile(
        "log.txt",
        "=============== LOG ENTRY BEGIN ===============\r\n" +
          Date() +
          "\r\n \r\nTERMINAL COMMANDS: " +
          process.argv +
          "\r\nDATA OUTPUT:\r\n" +
          "Title: " +
          jsonBody.Title +
          "\r\nYear: " +
          jsonBody.Year +
          "\r\nIMDb Rating: " +
          jsonBody.imdbRating +
          "\r\nCountry: " +
          jsonBody.Country +
          "\r\nLanguage: " +
          jsonBody.Language +
          "\r\nPlot: " +
          jsonBody.Plot +
          "\r\nActors: " +
          jsonBody.Actors +
          "\r\nRotten Tomatoes Rating: " +
          jsonBody.tomatoRating +
          "\r\nRotten Tomatoes URL: " +
          jsonBody.tomatoURL +
          "\r\n =============== LOG ENTRY END ===============\r\n \r\n",
        function(err) {
          if (err) throw err;
        }
      );
    }
  });
}
//4. do-what-it-says
function read() {
  fs.readFile("random.txt", "utf8", function(error, data) {
    if (error) {
      console.log(error);
    } else {
      var dataArr = data.split(",");
      if (dataArr[0] === "spotify") {
        spotifyThis(dataArr[1]);
      }
      if (dataArr[0] === "omdb") {
        omdbThis(dataArr[1]);
      }
    }
  });
}
