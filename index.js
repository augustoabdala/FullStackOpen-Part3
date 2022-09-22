const express = require('express')
const app = express()

app.use(express.json())
// In order to access the data easily, we need the help of the
// express json-parser that is taken to use with this command.
// See POST in the code.

const morgan = require('morgan')

morgan.token('body', (request) => JSON.stringify(request.body))


app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


// app.use(morgan())

let persons = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]


app.get('/', (request, response) => {
    response.send('<h1>Phonebook Backend</h1>')
})


app.get('/api/persons', (request, response) => {
    response.json(persons)
})


app.get('/info', (request, response) => {
    response.send(
        `<p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date()}</p>`
    )
})


app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(p => p.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})


app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    console.log('ID ' + id + ' requested for deletion')

    persons = persons.filter(p => p.id !== id)

    console.log('Remaining persons: ' + persons.length)

    response.status(204).end()
})


app.post('/api/persons', (request, response) => {

    const person = {
        name: request.body.name,
        number: request.body.number,
        id: Math.floor(Math.random() * 1000000)
    }

    if (!request.body.name) {
        return response.status(400).json({
            error: 'name missing'
        })
    }

    if (!request.body.number) {
        return response.status(400).json({
            error: 'number missing'
        })
    }

    if (persons.map(p => p.name).includes(person.name)) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }

    if (persons.map(p => p.number).includes(person.number)) {
        return response.status(400).json({
            error: 'number must be unique'
        })
    }

    persons = persons.concat(person)
    response.json(person)
})


const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})