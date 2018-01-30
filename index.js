//get the required modules
var express = require('express');
var socket = require('socket.io');
var codes = [];
var numcodes = 0;
//initialise the required things
app = express();
app.use(express.static('public'));

var server = app.listen( process.env.PORT || 3000,function(){
    console.log("listening to port 3000");
});

var io = socket(server);

io.on("connection",function(socket){
    //console.log("socket connection made");
    
    socket.emit("codes",{codes:codes,num:numcodes});
    
    socket.on('change',function(data){
        codes.push(data);
        numcodes++;
        socket.broadcast.emit('change',{change:data,id:socket.id})
    });
    socket.on('selectlanguage',function(data){
        socket.broadcast.emit('selectlanguage',data);
    });
 });
