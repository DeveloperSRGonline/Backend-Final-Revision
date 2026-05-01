const express = require('express');
const app = express();

app.get('/', (req, res) => {
    for(let i = 0; i < 1000000; i++) {
        res.send('Hello World!');
    }
});

app.get('/about', (req, res) => {
    for(let i = 0; i < 1000000; i++) {
        res.send('About Page');
    }
});

app.get('/contact', (req, res) => {
    for(let i = 0; i < 1000000; i++) {
        res.send('Contact Page');
    }
});

app.listen(3000, () => {
  console.log('Example app listening on port 3000');
});