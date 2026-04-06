import express from 'express';
import { randomUUID } from 'crypto';

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json())

app.use(express.static("public"))
app.set("view engine", "ejs")

const quotes = [
    "how are you doing?",
    "what's up?",
    "is something wrong?",
    "i'll listen.",
    "it's all going to be okay.",
    "i'm here!"
]

let loadedPosts = []
let userLoaded = false

// HELPERS

function randomNumber(MIN, MAX) {
    return Math.floor(Math.random() * (MAX - MIN + 1)) + MIN;
}

app.get("/", (req, res) => {
    let _randomQuote = quotes[0, randomNumber(0, quotes.length - 1)]
    userLoaded = true
    res.render("index.ejs", { randomQuote: _randomQuote, posts: loadedPosts, loaded: userLoaded })
})

app.post("/post", (req, res) => {
    let _randomQuote = quotes[0, randomNumber(0, quotes.length - 1)]
    console.log("CREATED")

    let newID = randomUUID()

    loadedPosts.push({
        id: newID,
        title: req.body.TITLE, 
        body: req.body.BODY 
    })

    res.json({ success: true, randomQuote: _randomQuote, id: newID})
})

app.post("/delete", (req, res) => {
    console.log(req.body)
    console.log(req.body.id)

    console.log("wyo")

    loadedPosts = loadedPosts.filter(post => post.id !== req.body.id)
    res.json({ success: true })
})

app.post("/edit", (req, res) => {
    let post = loadedPosts.find(post => post.id === req.body.id)
    if (post) {
        post.title = req.body.newTitle
        post.body = req.body.newBody
    }
    res.json({ success: true })
})

app.listen(port, () => {
    console.log(`listening to ${port}`)
})