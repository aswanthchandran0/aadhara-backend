import express from 'express'
import dotenv from 'dotenv'
import fileUpload from 'express-fileupload'
import uploadRoutes from './routes/uploadRoutes'
import morgan from 'morgan'
import cors from 'cors'
dotenv.config()

const app = express()
const PORT = process.env.PORT ||5000

// middleware

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
}))

app.use(morgan('dev'))
app.use(express.json())
app.use(fileUpload())
app.use('/api/upload',uploadRoutes)
app.listen(PORT,()=>console.log("server running "))  