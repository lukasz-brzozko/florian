const express = require('express');
const app = express();
const path = require('path');
const fetch = require('node-fetch');
const convert = require('xml-js');

const port = process.env.PORT || 3000;

app.use('/static', express.static(path.join(__dirname, 'public')))
app.use(express.json())

// const indexRouter = require(path.join(__dirname, '/routes/index'));

app.get('/', (req, res) => {
    res.sendFile('public/index.html', { root: __dirname })
});
app.get('/classfields', (req, res) => {

    const sendResponse = () => {
        const url = 'https://florianbialystok.wordpress.com/ogloszenia-parafialne/feed/';
        fetch(url)
            .then(response => response.text())
            .then(str => convert.xml2json(str))
            .then(data => res.json(data))
    }
    sendResponse()
});


// app.use('/', indexRouter);



app.listen(port, () => console.log(`Server is listening on http://localhost:${port}`))