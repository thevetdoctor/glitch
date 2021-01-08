// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const app = express();
const parser = require('body-parser');

// our default array of dreams
const dreams = [
  "Find and count some sheep",
  "Climb a really tall mountain",
  "Wash the dishes"
];

app.use(parser.json());
// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

// send the default array of dreams to the webpage
app.get("/dreams", (request, response) => {
  // express helps us take JS objects and send them as JSON
  response.json(dreams);
});

// POST route for accessing CSV url object
app.post("/csvtojson", (request, response) => {
  // express helps us take JS objects and send them as JSON
  const { url, body } = request;
  if(body) {
    if(Object.keys(body).indexOf('csv')) {
        return response.json({message: 'csv key not passed'});
      if (Object.keys(body['csv']).indexOf('selected_fields')) {
        return response.json({message: 'selected_fields parameter not passed'});
      }
    }
  }
  if(body && body['csv']['url']) {
    console.log(body['csv'])
    response.json({message: body['csv']['selected_fields']});
    // response.json(body);
  }
    response.json({message: 'url is not supplied!'});
});

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
