const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;


app.get('/', (req, res) => {
 res.sendFile(__dirname+'/index.html');
});

var users ={};

var array=[];

io.on('connection', (socket) => {
   socket.on('new-user-joined',name=>{
       users[socket.id]=name;
      // console.log(users);
      array.push(name);

       io.emit('user-joined',{name:name,members:array});
   });

   socket.on('send',msg=>{
     socket.broadcast.emit('recieve',{msg:msg,user:users[socket.id]});
   });

   socket.on('disconnect',user=>{
    let i; 
    for( i=0;i<array.length;i++)
     if(array[i]==users[socket.id])
     break;
     array.splice(i,1);
     io.emit('update',array);
     socket.broadcast.emit('left',users[socket.id]);
     delete users[socket.id];
   })
});

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});