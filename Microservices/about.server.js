
const express = require('express');
const app = express();

app.get('/about', (req, res) => {
    for(let i = 0; i < 1000000000; i++) {
        res.send('About Page');
    }
});

app.listen(3001, () => {
    console.log('About server listening on port 3001');
});