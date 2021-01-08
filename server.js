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
          if (body) {
            if (Object.keys(body).indexOf('csv') >= 0) {
                if (!Object.keys(body['csv']).indexOf('select_fields') >= 0) {
                    return response.json({message: 'select_fields parameter not passed'});
                }
                if (Object.keys(body['csv']).indexOf('url') >= 0) {
                    return response.json({message: body['csv']['url']});
                } else {
                    return response.json({message: 'url is not supplied'});
                }
            } else {
                return response.json({message: 'csv key not passed'});
            }
        } else {
            return response.json({message: 'Required fields are not found'});
        }
});

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
