const express=require('express')
const db = require('./db');
const bodyParser=require('body-parser')
const cookieParser = require('cookie-parser');
const cors=require('cors');
const app=express()
const port = 5000

app.use(bodyParser.json())
app.use(cookieParser());
app.use(cors({
    allowedOrigins: [
        '*'
    ]
}));


app.get('/',(req,res )=>{
    res.send('Hello World')
})

const authRoutes=require('./routes/authRoutes')
app.use('/auth',authRoutes)

app.listen(port,()=>{
    console.log(`App started at port ${port}`)
})

