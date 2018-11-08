const fs = require('fs')
const express = require('express');
const bodyParser = require('body-parser')
const fortunes = require('./data/fortunes')


const port = 8000

const app = express()

app.use(bodyParser.json())

app.get('/fortunes', (req, res) => {
    res.json(fortunes)
}
);


app.get('/fortunes/random', (req, res) => {
    console.log('requesting random fortune')
    const randomIndex = Math.floor(Math.random() * fortunes.length)
    const randomFortune = fortunes[randomIndex]
    res.json(randomFortune)
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

// app.use(function (err, req, res, next){
//     console.error(err.stack)
//     res.status(404).send("This is an error")
// } )





app.listen(port, () => console.log(`Listening on port ${port}`));

//app.listen makes the server live

app.post('/fortunes', (req, res) => {
    console.log(req.body);
    const fortuneIds = fortunes.map(fortune => fortune.id);
    const {message, lucky_number, spirit_animal} = req.body
    const fortune = {id: (fortuneIds.length > 0 ? Math.max(...fortuneIds) : 0) + 1, 
                    message ,
                    lucky_number ,
                    spirit_animal ,
                    }

const newFortunes = fortunes.concat(fortune);

 fs.writeFile('./data/fortunes.json', JSON.stringify(newFortunes), err => console.log(err))

res.json(newFortunes)

})

app.put('/fortunes/:id', (req, res) => {
    const {id} = req.params;
    // const {message, lucky_number, spirit_animal} = req.body;
    const oldFortune = fortunes.find(fortune => fortune.id == id);
    // if (message) oldFortune.message = message
    // if (lucky_number) oldFortune.lucky_number = lucky_number
    // if (spirit_animal) oldFortune.spirit_animal = spirit_animal

    ["message", "lucky_number", "spirit_animal"].forEach(key => {
        if (req.body[key]) oldFortune[key] = req.body[key]
    })

    fs.writeFile('./data/fortunes.json', JSON.stringify(fortunes), err => console.log(err))

    res.json(fortunes)
})