const express = require('express');
const app = express();
const PORT = 3001;
const mysql = require('mysql');
const cors = require('cors');

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  user: 'root',
  host: 'localhost',
  password: '',
  database: 'RiverBank',
})

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.post('/createuser', (req, res) => {
  const {username, password} = req.body;

  db.query(
    'INSERT INTO users (username, password) VALUES (?, ?)',
    [username, password],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send('Success');
      }
    }
  )
});

app.listen(PORT, () => {
  console.log('server is running')
});