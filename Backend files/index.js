const express = require("express");
const bodyParser = require('body-parser');
var cors = require('cors');
const connectToMongo = require("./startup/db");
const config = require("config");
const sio = require("./startup/socketModule");
const {saveSocketInformation, rideSocketInformation} = require("./utils/saveSocketInformation");
const port = config.get("server_port") | 5000;

connectToMongo();

const app = express()
// app.use(cors());
app.options('*', cors())
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json());


app.use('/public',express.static('public'));

require("./startup/logging")();
require("./startup/config")();

const server = app.listen(port, () => {
  console.log(`Backend listening at http://localhost:${port}`)
})

sio.init(server);

// initialized socket
let io = sio.getIO();

io.on("connection",(socket)=>{
  // save socket information for chat
  socket.on("userId",(id)=>{
    saveSocketInformation(id.id,socket.id);
  });

  // save socket information for ride
  socket.on("userIdRide",(id)=>{
    rideSocketInformation(id.id,socket.id);
  });

});


require("./startup/routes")(app);
