const fs = require('fs');
const express = require('express');
const path = require('path');
const { json, request } = require('express');
const dbFileName = path.join(__dirname, '/db/db.json');

const app = express();
const PORT = process.env.PORT || 3001;

// sets up data parsing with express
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// get files
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/notes.html'));
});

// read database
app.get('/api/notes', (req, res) => {
  fs.readFile(dbFileName, 'utf-8', function (err, data) {
    if (err) {
      return err;
    } else {
      let parsedData = JSON.parse(data);
      return res.json(parsedData);
    }
  });
});

// post everything to file on submit
app.post('/api/notes', (req, res) => {
  let bodyRequest = req.body;
  let array = JSON.parse(fs.readFileSync(dbFileName, 'utf-8'));
  array.push(bodyRequest);
  fs.writeFile(dbFileName, JSON.stringify(array), function (err) {
    if (err) {
      return res.json(false);
    } else {
      return res.json(true);
    }
  });
});

// give notes an id which deletes specific notes
app.delete('/api/notes/:id', function (req, res) {
  const noteId = JSON.parse(req.params.id);
  fs.readFile(__dirname + '/db/db.json', 'utf8', function (error, notes) {
    if (error) {
      return console.log(error);
    }
    notes = JSON.parse(notes);

    notes = notes.filter((val) => val.id !== noteId);

    fs.writeFile(
      __dirname + '/db/db.json',
      JSON.stringify(notes),
      function (error, data) {
        if (error) {
          return error;
        }
        res.json(notes);
      }
    );
  });
});

// start server
app.listen(PORT, () => {
  console.log(`app listening at http://localhost:${PORT}/`);
});
