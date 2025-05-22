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
    origin: [
        'https://aadhara-frontend.vercel.app',
        'https://aadhara-frontend-khaz4n7uj-aswanths-projects-d5a5a20b.vercel.app',
        'https://aadhara-frontend-git-main-aswanths-projects-d5a5a20b.vercel.app'
    ],
    credentials: true,
    methods: ['GET', 'POST','OPTIONS'],
    allowedHeaders: ['Content-Type'],
}))

app.options("*",cors())
app.use(morgan('dev'))
app.use(express.json())
app.use(fileUpload())
app.use('/api/upload',uploadRoutes)
app.listen(PORT,()=>console.log("server running "))  