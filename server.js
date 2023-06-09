const express = require('express');
const path = require('path');
const { clog } = require('./middleware/clog');
const uuid = require('uuid');
const { readFromFile, readAndAppend } = require('./helpers/fsutils');
const PORT = process.env.PORT || 3001;

const app = express();

app.use(clog);
app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));


app.get('/notes', (req, res) =>{ 
  res.sendFile(path.join(__dirname, './public/notes.html'))
});


app.get('/api/notes', (req, res) => {
 readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});

app.post('/api/notes', (req, res) => {
const { title, text, id } = req.body;

if(title && text) {
  const newNote = {
    title,
    text,
    id: uuid(),
  };

  readAndAppend(newNote, './db/db.json');

  const response = {
    status: 'success',
    body: newNote,
  };

  res.json(response)
}
});

app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, './public/index.html'))
);

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);