const express = require('express');
const app = express();

const port = process.env.PORT || 5000;
const http = require('http').createServer(app);
const io = require('socket.io')(http);
require('dotenv').config()

// Establishing mongo connection
const  MongoClient = require("mongodb").MongoClient;
const client = new MongoClient(process.env.MONGO_DB_CONNECTION_STRING);

client.connect().then(client => {
  db = client.db();
}).catch(err => {
  console.log(err);
});

app.use(express.json())
app.use(express.static('public'));

// using file system
var fs = require('fs');

//I listen for socket connection
io.on('connect', (socket) => {
  //Once a user is connected I wait for him to send me figure on the event 'send_figure' or line with the event 'send_line'
  console.log('New connection')
  socket.on('send_figure', (figure_specs) => {
    //Here I received the figure specs, all I do is send back the specs to all other client with the event share figure
    socket.broadcast.emit('share_figure', figure_specs)
  })

  socket.on('send_line', (line_specs) => {
    //Here I received the line specs, all I do is send back the specs to all other client with the event share line
    socket.broadcast.emit('share_line', line_specs)
  })
})

app.post('/save', (req, res) => {
  //console.log(req.body);
  var savePath = `public/images/${req.body.date}.png`;
  var base64URL = req.body.path.replace('data:image/png;base64,', '');
  fs.writeFile(savePath, base64URL, 'base64', (err) => {
    if (err) throw err;
  })
  req.body.image = `images/${req.body.date}.png`;

  // adding the image to our database
  db.collection('images').insertOne(req.body, function(err, res){
    if(err) throw err;
    console.log('OK');
  })
  res.status(200);
})

const queryImages = async() => {
  const result = []
  const cursor = await db.collection('images').find({}).toArray()

  for(const img of cursor){
      result.push(img);
  }
  return result
}

app.get('/images', async (req, res) => {
    res.send({images: await queryImages()})
})

http.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

