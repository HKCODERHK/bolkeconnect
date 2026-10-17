import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { connectDB } from './db.js'

const app = express()
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }))
app.use(express.json())

app.get('/health', (req, res) => {
  res.json({ ok: true, service: 'bolkeconnect-server' })
})

const port = process.env.PORT || 8000

connectDB()
  .then(() => app.listen(port, () => console.log(`BolkeConnect server on port ${port}`)))
  .catch((err) => {
    console.error('Could not start server:', err.message)
    process.exit(1)
  })
