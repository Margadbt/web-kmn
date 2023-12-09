import express, { json } from "express";
import { readFileSync } from "fs";


const jsonData = readFileSync("./public/data.json", "utf-8");
const data = JSON.parse(jsonData);

const app = express();
const port = 4000;


app.use('/public', express.static('public'));

app.get('/', (req, res)=>{
    res.send("hi")
})

app.get('/posts', (req, res)=>{
    res.send(data)
})

app.get('/posts/1', (req, res)=>{
    let datas = data.filter((post) => post.id == 1)
    res.send(datas)
})

app.listen(port, () => {
    console.log("server listening on ", port);
})