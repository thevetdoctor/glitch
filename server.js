// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const app = express();
const parser = require('body-parser');
const path = require('path');
const fs = require('fs');
const csvToJson = require('csvtojson');
const UUID = require('uuid').v4;

// varaiables delaration
let fileExt = '';
let sampleCsvUrl = 'http://winterolympicsmedals.com/medalscsv';
let driveCSV = 'https://drive.google.com/file/d/1eOfx3Qtihslx7TwJstS962OoK9vsf72F/view?usp=sharing';

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
  response.json({dreams: []});
});

// POST route for accessing CSV url object
app.post("/csvtojson", async (request, response) => {
  // express helps us take JS objects and send them as JSON
  const { url, body } = request;
          if (body) {
            if (Object.keys(body).indexOf('csv') >= 0) {
                if (Object.keys(body['csv']).indexOf('url') >= 0) {
                  // fileExt = path.extname(body['csv']['url']);
                      const selectFields = body['csv']['select_fields'];
                      // const fieldlength = selectFields.length;
                      fileExt = path.extname(body['csv']['url']);
                          let parsedData;
                      if (fileExt !== '.csv') {
                                     try {
                                      // const fetchStream = fs.createWriteStream();
                                      const fetchStream = fs.createWriteStream(path.join(__dirname, '/public/csvFile.html'));
                                      const fetched = await fetch(driveCSV);
                                      console.log(fetched);
                                      await new Promise((resolve, reject) => {
                                        fetched.body.pipe(fetchStream);
                                        fetched.body.on('error', reject);
                                        fetchStream.on('finish', resolve);
                                      });
                                    } catch (err) {
                                      console.error(err);
                                    }
                                    const publicCSV = path.join(__dirname, '/public/csvFile.csv');
                                    const csvData = await csvToJson().fromFile(publicCSV);
                                return response.json({message: 'URL is invalid (.csv extension not found)', fetched: csvData ? csvData : 'File not available'});
                            }
                            // const publicCSV = path.join(__dirname, '/public/csvFile.csv');
                            // const csvData = await csvToJson().fromFile(publicCSV);

                            // fs.createReadStream(publicCSV)
                            //   .pipe(csv())
                            //   .on('data', (row) => {
                            //     console.log(row);
                            //   })
                            //   .on('end', () => {
                            //     console.log('CSV file successfully processed');
                            //   });

                            const csvData = await csvToJson()
                                                  // .fromStream(fetch(driveCSV, {method: 'GET', mode: 'no-cors'}))
                                                  .fromStream(request.get(driveCSV))
                                                  .subscribe(data => {
                                                    console.log(data);
                                                    return data;
                                                  });
                            const conversionKey = UUID();
                            let finalJson;
                             if (Object.keys(body['csv']).indexOf('select_fields') >= 0) {
                                finalJson = csvData.map(obj => {
                                                                  let newObj= {};
                                                                  for(let i = 0; i < selectFields.length; i++) {
                                                                  // Object.keys(obj) === Object.values(selectFields)
                                                                    newObj[selectFields[i]] = obj[selectFields[i]];
                                                                   }
                                                                  return newObj;
                                                              });
                            // return response.json({message: 'select_fields parameter not passed'});
                            } else {
                              finalJson = csvData;
                            }

                            // return response.json({message: { url: sampleCsvUrl, select_fields: body['csv']['select_fields'], fileExt, data: conversionKey, publicCSV, csvData}});
                            return response.json({ conversion_key: conversionKey, json: finalJson });                   

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
