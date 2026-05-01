const express = require('express');
const app = express();

app.get('/', (req, res) => {
    for(let i = 0; i < 1000000000; i++) {
        res.send('Hello World!');
    }
});

app.listen(3000, () => {
  console.log('Example app listening on port 3000');
});