import express from 'express'
import { pool } from './config/db.js'
import { errorMiddleware } from './middlewares/error.middleware.js'
import authRoutes from './routes/auth.route.js'
import postRoutes from './routes/post.route.js'

const app = express()

app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/posts', postRoutes)

app.get('/health', (req, res) => {
  res.json({ status: 'OK' })
})

app.get('/db-test', async (req, res, next) => {
  try {
    const result = await pool.query('SELECT NOW()')
    res.json(result.rows[0])
  } catch (err) {
    next(err)
  }
})

app.use(errorMiddleware)

export default app
