const express = require("express")
const morgan = require("morgan")
const app = express()

app.use(express.json())

//created token post_data that returns the json that the client posts
morgan.token("post_data", (req, res) => {
    return (
        JSON.stringify(req.body)
    )
})

app.use(morgan((tokens, req, res) => {
    return ([
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms',
        (tokens.method(req, res) === "POST" ? tokens.post_data(req, res): "")
    ]).join(' ')
}))

let people = [
    { 
      id: "1",
      name: "Arto Hellas", 
      number: "040-123456"
    },
    { 
      id: "2",
      name: "Ada Lovelace", 
      number: "39-44-5323523"
    },
    { 
      id: "3",
      name: "Dan Abramov", 
      number: "12-43-234345"
    },
    { 
      id: "4",
      name: "Mary Poppendieck", 
      number: "39-23-6423122"
    }
]


app.get("/api/persons", (request, response) => {
    response.json(people)
})

app.get("/info", (request, response) => {
    const date = new Date()
    response.send(
        `<div>
        <p>Phonebook has info for ${people.length} ${(people.length == 1) ? 'person' :'people'}</p>
            <p>${date}</p>
        </div>`
    )
})

app.get("/api/persons/:id", (request, response) => {
    const id = request.params.id
    const person = people.find(person => person.id === id)
    
    if (person) {
        response.json(person)
    }
    else {
        response.status(404).end()
    }
})

app.delete("/api/persons/:id", (request, response) => {
    const id = request.params.id
    people = people.filter(person => person.id !== id)

    response.status(204).end()
})

app.post("/api/persons", (request, response) => {
    const {name , number} = request.body
    const exists = people.find(person => person.name === name)
    if (name === "" || number === ""){
        response.status(404).json({
            error: `no ${name === ""? "name":"number"} entered`
        })
    }
    else if (exists) {
        response.status(404).json({
            error: "name must be unique"
        })
    }
    else{
        const random_number = Math.floor(Math.random() *100000)
        people = people.concat({
            id: `${random_number}`,
            name: `${name}`,
            number: `${number}`
        })
        response.status(204).end()
    }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
})
