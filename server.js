const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const multer = require('multer')
const path = require('path')
const chatRoutes = require("./routes/chatRoutes");
const chats = require('./data/data.js')
const connectDB = require("./config/db.js")
const colors = require("colors")
const userRoutes = require('./routes/userRoutes.js')
const messageRoutes = require('./routes/messageRouters')
const { notFound ,errorHandler} = require('./middleware/errorMiddleware.js')
const ImagesModel = require('./Models/imagesModel.js')

dotenv.config()

connectDB()
const app = express()
app.use(cors())
app.use(express.json())
app.use(express.static('public'))


//images video server
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/Images')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
})

const upload = multer({ storage: storage })

app.post('/upload', upload.array('files', 12), function (req, res, next) {

  ImagesModel.create({
    image: req.files[0].filename,
    original_name: req.files[0].originalname,
    mime_type: req.files[0].mimetype
  })
  .then(result => res.json(result))
  .catch(err => console.log(err)) 
  
})

app.get('/getImage', (req, res) => {
  ImagesModel.find()
  .then(users => res.json(users))
  .catch(err => res.json(err))
})

app.get('/', function (req, res) {
  res.send('API is running Successfully')
})

app.use('/api/user', userRoutes)
app.use('/api/chat',chatRoutes)
app.use('/api/message', messageRoutes)

// Error Handling middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5001

const server = app.listen(PORT, console.log(`Server Started on PORT ${PORT}`.yellow.bold))


const io = require('socket.io')(server, {
  pingTimeOut: 60000,
  cors: {
    origin: "http://localhost:3000",
  }
}) 

io.on("connection", (socket) => {
  console.log("connected to socket.io")
  
    socket.on('setup', (userData) => {
      socket.join(userData._id)
      socket.emit("connected")
    })

    socket.on("join chat", (room) => {
      socket.join(room)
      console.log("User Joined Room: " + room)
    })

    socket.on("typing", (room) => socket.in(room).emit("typing"));
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

    socket.on("new message", (newMessageRecieved) => {
      var chat = newMessageRecieved.chat;
  
      if (!chat.users) return console.log("chat.users not defined");
  
      chat.users.forEach((user) => {
        if (user._id == newMessageRecieved.sender._id) return;
  
        socket.in(user._id).emit("message recieved", newMessageRecieved);
      });
    });

    socket.off("setup", () => {
      console.log("USER DISCONNECTED");
      socket.leave(userData._id);
    });
})

