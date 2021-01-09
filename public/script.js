// client-side js, loaded by index.html
// run by the browser each time the page is loaded

console.log("Convert CSV files with ease!");

// define variables that reference elements on our page
const jsonList = document.getElementById("payload");
const jsonForm = document.querySelector("form");

// a helper function that creates a list item for a given dream
function displayObject(obj) {
  const newListItem = document.createElement("li");
  newListItem.innerText = obj.toString();
  jsonList.appendChild(newListItem);
}

// fetch the initial list of dreams
fetch("/csvtojson", { method: 'POST' })
  .then(response => response.json()) // parse the JSON from the server
  .then(json => {
    // remove the loading text
    jsonList.firstElementChild.remove();
  
    // iterate through every object and add it to our page
    json.forEach(displayObject);
  
    // listen for the form to be submitted and add a new object when it is
    jsonForm.addEventListener("submit", event => {
      // stop our form submission from refreshing the page
      event.preventDefault();

      // get object string value and add it to the list
      let newDream = jsonForm.elements.dream.value;
      dreams.push(newDream);
      appendNewDream(newDream);

      // reset form
      jsonForm.reset();
      jsonForm.elements.dream.focus();
    });
  });
