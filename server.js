const express = require('express');
const app = express();
const path = require('path');
const fetch = require('node-fetch');
const convert = require('xml-js');

const port = process.env.PORT || 3030;

app.use('/static', express.static(path.join(__dirname, 'public')))
app.use(express.json())

// const indexRouter = require(path.join(__dirname, '/routes/index'));
app.disable("x-powered-by");

app.get('/', (req, res) => {
    res.sendFile('index.html', { root: __dirname + '/public' })
});
app.get('/ogloszenia', (req, res) => {

    const postsCount = 4;

    const sendResponse = () => {
        const url = 'URL TO XML';
        fetch(url)
            .then(response => response.text())
            .then(str => convert.xml2json(str))
            .then(data => JSON.parse(data))
            .then(data => data.elements[0].elements[0].elements.filter(el => el.name === 'item').splice(0, postsCount))
            .then(arr => arr.map(el => el.elements))
            .then(arr => {
                const data = [];
                arr.forEach(arr2 => data.push(
                    arr2.filter(el => {
                        if (el.name === 'title' || el.name === 'content:encoded' || el.name === 'pubDate') { return el }
                    })))
                return { ...data };
            })
            .then(dataObject => {
                const posts = [];
                for (const key in dataObject) {
                    const title = dataObject[key].find(el => el.name === 'title').elements[0].text;
                    const content = dataObject[key].find(el => el.name === 'content:encoded').elements[0].cdata;
                    const pubDate = dataObject[key].find(el => el.name === 'pubDate').elements[0].text;
                    posts.push({
                        title,
                        content,
                        pubDate
                    })
                }
                return posts
            })
            .then(json => res.json(json))
    }
    sendResponse()
});
// app.get('*', (req, res) => {
//     res.redirect('/')
// });

// app.use('/', indexRouter);



app.listen(port, () => console.log(`Server is listening on http://localhost:${port}`))