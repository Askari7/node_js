import http from 'http'
import me from './feature.js'
import fs from 'fs'
import express from "express";
import path from 'path';
import mongoose, { Schema } from 'mongoose';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken'
const app = express()

mongoose.connect('mongodb://localhost:27017',{
    dbName:'todos'
}).then(()=>{
  console.log('database connected');  
}).catch(e=>{
    console.log(e);
})

const todosSchema= new mongoose.Schema({
    todo:String,
})
const userSchema= new mongoose.Schema({
    name:String,
    email:String,
})
const todolist= mongoose.model('todolist',todosSchema)
const userlist= mongoose.model('userlist',userSchema)

app.use(express.static(path.join(path.resolve(),"public")));
app.use(express.urlencoded( { extended:true }))
app.use(cookieParser())
app.get('/',(req,res)=>{
    const pathloc = path.resolve()
    const fullpath = path.join(pathloc,'views/index.html')
    res.sendFile(fullpath)
})

app.get('/contact',(req,res)=>{
    res.render('index.ejs',{askari:'askari'})
    console.log('hello');
})

app.post('/contact',(req,res)=>{
    console.log(req.body);
})

app.get('/add',async (req,res)=>{
    await todolist.create({todo:"js"})
    res.send('data added')
    })

app.get('/about',(req,res)=>{
    const index=path.join(path.resolve(),'public/index.html')
    res.sendFile(index)
})

app.get('/login',async (req,res)=>{
    const {token} = req.cookies
    if(token){
        const decode = jwt.verify(token,'askari')
        console.log(decode);
        req.user = await userlist.findById(decode._id)  
        res.render('logout.ejs',{name:req.user.name})
    }else{
        res.render('login.ejs')
    }
})
app.post('/login',async (req,res)=>{
    const { username, email } = req.body
    const user = await userlist.create({name:username,email})

    const token = jwt.sign({_id:user._id},'askari')
    console.log(token);
    res.cookie('token', token ,{
        expires:new Date(Date.now()+60*1000),httpOnly:true
    })
    res.redirect('login')
})

app.get('/logout',(req,res)=>{
    res.cookie('token',null,{
        httpOnly:true,expires:new Date(Date.now())
    })
    res.redirect('login')
})

app.listen(5000,()=>{
    console.log('server is running');
})



// const server = http.createServer((req,res)=>{
//     if (req.url==='/'){
//         res.end('Home')
//     }
//     else if (req.url==='/about'){
//         res.end('About')
//     }
//     else if (req.url==='/contact'){
//         res.end('Contact')
//     }
//     else{
//         res.end('Page Not Found')
//     }
//     console.log(res.end);

// })