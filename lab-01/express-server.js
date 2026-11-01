const express = require('express');

const app = express();

app.get('/', (req, res) => {
    res.send('Welcome to Mahesh\'s server!');
});

app.get('/about', (req, res) => {
    res.send('Name: Mahesh | Branch: CSE Gen AI | Section: S-24');
});

app.get('/time', (req, res) => {
    res.send(`Current server time: ${new Date()}`);
});

app.use((req, res) => {
    res.status(404).send('404 - Page Not Found');
});

app.listen(3001, () => {
    console.log('Express server running at http://localhost:3001');
});