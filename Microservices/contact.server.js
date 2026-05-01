const express = require('express');
const app = express();

app.get('/contact', (req, res) => {
    for(let i = 0; i < 1000000000; i++) {
        res.send('Contact Page');
    }
});

app.listen(3002, () => {
    console.log('Contact server listening on port 3002');
});
