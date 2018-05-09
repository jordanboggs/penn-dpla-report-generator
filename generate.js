const fs       = require('fs');
const axios    = require('axios');

// Read search term from a line in input.txt
let searchArray = [];

fs.readFile('input.txt', 'utf8', (err, data) => {
  if (err) {
    return console.error(err);
  }

  searchArray = (data.split('\r\n'));
  searchArray.forEach((searchTerm) => search(searchTerm));
});

// Search this term using DPLA API
// Note: I would absolutely never store my API key in plaintext under
// normal circumstances
function search(searchTerm) {
  const apiKey = 'fb54ac8eb570d42d9ab28264a01fc4ba';
  axios
    .get('https://api.dp.la/v2/items?q=' + searchTerm + '&api_key=' + apiKey)
    .then((res) => {
      formatResponse(searchTerm, res);
    })
    .catch((err) => {
      console.error(err);
    })
}

// Output the following fields: search term, id, ingest date, data provider
function formatResponse(searchTerm, res) {
  let docs = res.data.docs;
  docs.forEach((doc) => {
    let id = doc.id;
    let ingestDate = doc.ingestDate;
    let dataProvider = doc.provider.name;
    
    // Write line to file
    let writeData = `${searchTerm} ${id} ${ingestDate} ${dataProvider}\r\n`
    fs.appendFileSync('output.txt', writeData, (err) => {
      console.error(err);
    });
  })
}
