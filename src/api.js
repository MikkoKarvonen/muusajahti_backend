const Parser = require('rss-parser');
const parser = new Parser();
const express = require('express');
const cors = require('cors');
const serverless = require('serverless-http')
const fs = require('fs');

const app = express();
app.use(cors());
const router = express.Router();

let episodes = [];
let date = new Date();

module.exports.handler = serverless(app);

function updateEpisodes (){
    (async () => {
        let feed = await parser.parseURL('http://feeds.soundcloud.com/users/soundcloud:users:644661399/sounds.rss');
        episodes = feed.items.reverse();
        if (episodes.length){
            fs.writeFile("./data.json", JSON.stringify(episodes), function(err) {
                if(err) return console.log(err);
                console.log("Data saved to file: " + date);
            }); 
        }
    })();
}

router.get('/episodes', (req, res) => {
    const episodes = fs.readFileSync('data.json');
    res.json(JSON.parse(episodes));
})

router.get('/episodes/:id', (req, res) => {
    const id = req.params.id - 1
    const episodes = fs.readFileSync('data.json');
    const episodesParsed = JSON.parse(episodes);
    const episode = episodesParsed[id]
    if (episode) {
        res.json(episode)
    } else {
        res.status(404).end()
    }
})

router.get('/update', (req, res) => {
    const now = new Date();
    now.setMinutes ( now.getMinutes() - 10 );
    if (date < now){
        updateEpisodes()
        date = new Date();
    }
    res.json('Last update was: ' + date);
})

router.get("/", (req, res) => {
    res.send('<p>Use <i>/episodes</i> to list all episodes.</p>');
});

app.use('/.netlify/functions/api', router);

module.exports = app;
module.exports.handler = serverless(app);