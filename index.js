const express = require('express');
const fortunes = require('./data/fortunes')

const port = 8000

const app = express()

app.get('/fortunes', (req, res) => {
    res.json(fortunes)
}
);


app.get('/fortunes/random', (req, res) => {
    console.log('requesting random fortune')
})

app.get('/fortunes/:id', (req, res, next) => {
    let id = req.params.id
    var matchingFortune = fortunes.filter(fortune => {
        return fortune.id == id
    })
    if(!matchingFortune.length) {
        console.log('error')
        res.status(404).send({message: "hey this doesn't exist"})
    } else {
        res.send({fortune: matchingFortune[0]})
    }
}) 

app.listen(port, () => console.log(`Listening on port ${port}`));

//app.listen makes the server live


