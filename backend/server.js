const express = require('express');
const cors = require('cors');
const app = express();
const db = require('./db');

app.use(cors());
app.use(express.json());

// CREATE
app.post('/notes', (req, res) => {
  const { title, content, pinned, archived } = req.body;
  db.query(
    'INSERT INTO notes (title, content, pinned, archived) VALUES (?, ?, ?, ?)',
    [title, content, pinned, archived],
    (err) => {
      if (err) return res.status(500).send(err);
      res.send('Note created');
    }
  );
});

// READ
app.get('/notes', (req, res) => {
  db.query(
    'SELECT * FROM notes WHERE archived = 0 ORDER BY pinned DESC, id DESC',
    (err, results) => {
      if (err) return res.status(500).send(err);
      res.json(results);
    }
  );
});

// UPDATE
app.put('/notes/:id', (req, res) => {
  const { title, content, pinned } = req.body;
  db.query(
    'UPDATE notes SET title = ?, content = ?, pinned = ? WHERE id = ?',
    [title, content, pinned, req.params.id],
    (err) => {
      if (err) return res.status(500).send(err);
      res.send('Note updated');
    }
  );
});

// DELETE
app.delete('/notes/:id', (req, res) => {
  db.query('DELETE FROM notes WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).send(err);
    res.send('Note deleted');
  });
});

// ARCHIVE
app.put('/notes/archive/:id', (req, res) => {
  db.query(
    'UPDATE notes SET archived = 1 WHERE id = ?',
    [req.params.id],
    (err) => {
      if (err) return res.status(500).send(err);
      res.send('Note archived');
    }
  );
});

// GET ARCHIVED
app.get('/notes/archived', (req, res) => {
  db.query('SELECT * FROM notes WHERE archived = 1', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

app.listen(3000, () => console.log('Server running on port 3000'));
