const express = require('express');
const dotenv = require('dotenv')
const app = express();

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

dotenv.config()
app.listen(process.env.PORT, () => {
  console.log('App is listening on port',process.env.PORT);
});