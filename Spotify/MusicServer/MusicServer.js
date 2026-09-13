const express = require('express');
const { exec } = require('child_process');
const fs = require('node:fs');

const app = express();

app.use(express.raw({type: '*/*', limit: '5gb' }));

app.post('/wav', (req, res) => {
    try {
        let songId = req.headers["song_id"]

        if (!songId){
            console.log('Received POST request without song id');
            res.status(400).end()
        }
        else {
            const fileContents = req.body;
            console.log(`Received POST request with song id: ${songId} and size ${fileContents.length}`);

            fs.writeFile(`./Music/${songId}.wav`, fileContents, err => {
                if (err) {
                    console.error(err);
                } else {
                    console.log('File written successfully');
            }});

            res.status(200).end();
        }
    }
    catch (error) {
        console.error(`Error: ${error.message}`);
        res.status(500).json({ message: "Something went wrong" });
    }
});

app.get('/wav/:songId', (req, res) => {
    let songId = req.params.songId;
    console.log('Received GET request for music ID:', songId);
    
    fs.readFile(`./Music/${songId}.wav`, (err, data) => {
        if (err) {
            console.log(`Couldn't read file with song id ${songId}`)
            res.status(404).end(`Could not find song with song id ${songId}`);
        } else {
            console.log('File read');
            res.status(200).end(data);
    }});
});

app.listen(8080, () => {
  console.log('REST API server running on port 8080');
});