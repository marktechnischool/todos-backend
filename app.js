require('dotenv').config()

const express = require('express')
const bodyparser = require('body-parser')
const mongoose = require('mongoose')
const cors = require('cors')

const connectToDatabase = () => {
    const mongoose = require('mongoose');
    mongoose.connect(process.env.MONGO_DB);
}

const app = express()

app.use(cors())

app.use(bodyparser.json())

connectToDatabase()

const Note = mongoose.model('todos', {
    title: {
        type: String
    },
    done: {
        type: Boolean,
        default: false
    }
});


app.get('/todos', async (req, resp) => {
    resp.json(await Note.find().exec())
})

app.get('/todos/:id', async (req, resp) => {
    resp.json(await Note.findById(req.params.id).exec())
})

app.post('/todos', async (req, resp) => {
    try {
        const note = new Note(req.body)
        await note.save()
        resp.status(201).json(note)
    } catch (error) {
        resp.status(400).json({ message: error.message })
    }
})

app.put('/todos/:id', async (req, resp) => {
    try {
        const student = await Note.findByIdAndUpdate(req.params.id, req.body, { new: true })
        resp.status(200).json(student)
    } catch (error) {
        resp.status(400).json({ message: error.message })
    }
})

app.delete('/todos/:id', async (req, resp) => {
    try {
        await Note.findByIdAndDelete(req.params.id)
        resp.status(204).send()
    } catch (error) {
        resp.status(400).json({ message: error.message })
    }
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})