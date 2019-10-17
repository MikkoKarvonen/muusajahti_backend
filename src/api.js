const Parser = require('rss-parser');
const parser = new Parser();
const express = require('express');
const cors = require('cors');
const serverless = require('serverless-http')
const app = express();
app.use(cors());
const router = express.Router();

let episodes = [];

module.exports.handler = serverless(app);

(async () => {
    let feed = await parser.parseURL('http://feeds.soundcloud.com/users/soundcloud:users:644661399/sounds.rss');
    episodes = feed.items.reverse();
})();

router.get('/episodes', (req, res) => {
    res.json(episodes);
})

router.get('/episodes/:id', (req, res) => {
    const id = req.params.id - 1
    const episode = episodes[id]
    if (episode) {
        res.json(episode)
    } else {
        res.status(404).end()
    }
})

router.get("/", (req, res) => {
    res.send('<p>Use <i>/episodes</i> to list all episodes.</p>');
});

app.use('/.netlify/functions/api', router);

module.exports = app;
module.exports.handler = serverless(app);