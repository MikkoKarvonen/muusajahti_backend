let Parser = require('rss-parser');
let parser = new Parser();
var express = require('express');
var cors = require('cors');
var app = express();
app.use(cors());

let episodes = [];

(async () => {
    let feed = await parser.parseURL('http://feeds.soundcloud.com/users/soundcloud:users:644661399/sounds.rss');
    episodes = feed.items.reverse();

})();

app.get('/episodes', function (req, res) {
    res.json(episodes);
})

app.get('/episodes/:id', function (req, res) {
    const id = req.params.id - 1
    const episode = episodes[id]
    if (episode) {
        res.json(episode)
    } else {
        res.status(404).end()
    }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})