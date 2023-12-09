const express = require('express');
const fs = require('fs');
const router = express.Router();


const gData = fs.readFileSync("./public/groups.json", "utf-8");
const groupsData = JSON.parse(gData);
const pData = fs.readFileSync("./public/posts.json", "utf-8");
const postsData = JSON.parse(pData);

const app = express();
const port = 4000;


app.use('/public', express.static('public'));

app.get('/', (req, res)=>{
    res.sendFile('public/index.html', {root: __dirname });
})

app.get('/test', (req, res)=>{
    res.sendFile('public/pages/test.html', {root: __dirname });
})

app.get('/community', (req, res)=>{
    res.sendFile('public/pages/community.html', {root: __dirname });
})

app.get('/plan', (req, res)=>{
    res.sendFile('public/pages/plan.html', {root: __dirname });
})

app.get('/profile', (req, res)=>{
    res.sendFile('public/pages/profile.html', {root: __dirname });
})

app.get('/login', (req, res)=>{
    res.sendFile('public/pages/login.html', {root: __dirname });
})

app.get('/register', (req, res)=>{
    res.sendFile('public/pages/register.html', {root: __dirname });
})

//api

app.get('/api/posts', (req, res)=>{
    res.send(postsData)
})

app.get('/api/groups', (req, res)=>{
    res.send(gData)
})

app.get('/api/posts/:id', (req, res)=>{
    let singlePost = postsData.posts;
    let datas = singlePost.filter((post) => post.id == req.params.id)
    res.send(datas)
})

app.listen(port, () => {
    console.log("server listening on ", port);
})