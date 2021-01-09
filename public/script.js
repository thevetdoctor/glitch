// client-side js, loaded by index.html
// run by the browser each time the page is loaded

console.log("Convert CSV files with ease!");

// define variables that reference elements on our page
const jsonList = document.getElementById("payload");
const jsonForm = document.querySelector("form");

// a helper function that creates a list item for a given dream
function displayObject(obj) {
  const newListItem = document.createElement("li");
  newListItem.innerText = JSON.stringify(obj);
  jsonList.appendChild(newListItem);
}

// fetch the initial list of dreams
const fetchCsv = async (url, fields) => {
  const body = JSON.stringify({
                csv: {
                  url, 
                  'select_fields': fields.length ? fields : null 
                }
              });
  console.log(body, fields.length);
await fetch("/csvtojson", 
            { method: 'POST', 
              body,
             headers: {
               'Content-Type': 'application/json'
             }
            })
  .then(response => response.json()) // parse the JSON from the server
  .then(json => {
  // let sampleJson = [{'url' : 'json'}, {'url': 'json'}];
  // parse json object and add it to our page
    console.log(json);
    displayObject(json);
  });
}

// listen for the form to be submitted and add a new object when it is
    jsonForm.addEventListener("submit", event => {
      // stop our form submission from refreshing the page
      event.preventDefault();
      
      // declare form values
      let url = jsonForm.elements['csv-url'].value;
      let fieldsValues = jsonForm.elements['fields'].value;
      let fields = !fieldsValues ? fieldsValues.split(',') : null;
      console.log(url, fieldsValues ? 'd' : 's', fields);
      
      // fetch json data
      fetchCsv(url, fields);
      
      // reset form
      jsonForm.reset();
    });