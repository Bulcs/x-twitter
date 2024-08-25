const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080;
const db = require("./data/db.json");
const users = require("./data/users.json");
const crypto = require("crypto");
const bodyParser = require("body-parser");
const writeToFile = require("./util/write-to-file");

app.use(express.urlencoded({ extended: true }));

app.use(express.json());
app.listen(PORT, () => console.log("Server started"));

app.use(express.static("build"));

//Tweets
app.get("/api/tweets", (req, res) => {
  res.send(db);
});

app.post("/api/tweets/", (req, res) => {
  try {
    req.tweets = db;

    req.body.id = crypto.randomUUID();
    req.tweets.push(req.body);

    writeToFile(req.tweets);
    res.writeHead(201, { "Content-Type": "application/json" });
    res.end();
  } catch (error) {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        title: `Validation Failed ${error.message} `,
        message: "Request body is not valid",
      })
    );
  }
});

app.delete("/api/tweets/", (req, res) => {
  try {
    req.tweets = db;

    const tweetIndex = req.tweets.findIndex(
      (tweet) => tweet.id === req.body.id
    );

    if (tweetIndex === -1) {
      throw new Error("Tweet not found");
    }

    req.tweets.splice(tweetIndex, 1);
    writeToFile(req.tweets);
    res.writeHead(204);
    res.end();
  } catch (error) {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Tweet not found" }));
  }
});

//liked Tweets API
app.put("/api/tweets/:id/:email/like", (req, res) => {
  try {
    req.tweets = db;

    const tweet = req.tweets.find((tweet) => tweet.id === req.params.id);

    if (tweet === -1) {
      throw new Error("Tweet not found");
    }

    //AJUSTAR LIKED TWEETS

    const likedWhoTweets = tweet.likedWhos;

    likedWhoTweets.find((element) => {
      console.log("entrou 1");
      if (element === req.params.email)
        throw new Error("User has already liked this tweet");
      else {
        console.log("entrou");
        //req.tweets[tweet].upVotes++;
        req.tweets[tweet].likedWhos.push(req.params.email);
        writeToFile(req.tweets);
        res.writeHead(200, { "Content-Type": "application/json" });

        res.end(JSON.stringify(req.tweets[tweet]));
      }
    });
  } catch (error) {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Tweet not found" }));
  }
});

//Users
app.get("/api/users", (req, res) => {
  res.send(users);
});
