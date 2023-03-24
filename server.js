const express=require("express");
const path=require("path");
const http= require("http");
const app=express();
const server=http.createServer(app);
const socketio=require('socket.io');
const formatMessage=require('./public/utils/messages');
const {userJoin,getcurrentuser,userleave,getroomusers}=require('./public/utils/users');

const port=3000 || process.env.PORT;
const io=socketio(server);
// set satic folder
app.use(express.static(path.join(__dirname , 'public')));
const botname = 'Admin';

// reun when client connects
io.on('connection',(socket)=>{
   socket.on('joinroom',({username,room})=>{
      const user=userJoin(socket.id,username,room)

      socket.join(user.room);
      socket.emit('message',formatMessage(botname,"welcome to the chat"));

      //broacast when new user join
      socket.broadcast.to(user.room).emit('message',formatMessage(botname,`${user.username} has join the room`));
      //send users  and room info
      io.to(user.room).emit('roomusers',{
         room:user.room,
         users:getroomusers(user.room)
      })
   })
   
   //runs when client leaves the chat
   socket.on('disconnect',()=>{
      const user=userleave(socket.id);
      if(user){
         io.to(user.room).emit('message',formatMessage(botname,`${user.username} has leave the chat`));
         io.to(user.room).emit('roomusers',{
            room:user.room,
            users:getroomusers(user.room)
         })
      }
      
   })

   //listen for chat message
   socket.on('chatMessage',(message)=>{
      const user=getcurrentuser(socket.id);
      io.to(user.room).emit('message',formatMessage(user.username,message));
   })

})
server.listen(port,()=>{
    console.log(`server running on ${port}`);
})