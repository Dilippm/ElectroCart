const mongoose =require('mongoose')
mongoose.connect('mongodb://127.0.0.1:27017/ecart')

const express=require('express')
const app=express()


const path=require('path')
app.use(express.static(path.join(__dirname,'public')))

const adminRoute=require ('./routes/adminRoute')


app.use('/admin',adminRoute)

app.listen(3000,()=>{
    console.log("server started")
})