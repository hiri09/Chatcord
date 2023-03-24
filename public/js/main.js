const socket = io();
const chatfrom=document.getElementById('chat-form');
//message from server
const chatMessages=document.querySelector('.chat-messages');
const roomname=document.getElementById("room-name");
const userlist=document.getElementById("users");
//get username and room from url
const {username,room}=Qs.parse(location.search,{
    ignoreQueryPrefix : true
})

//join chatroom
socket.emit('joinroom',{username,room});

// get room and users
socket.on('roomusers',({room,users})=>{
    outputroomName(room);
    outputroomusers(users);
})
console.log(username,room);
socket.on('message',message=>{
    console.log(message);
    outputMessage(message);

    chatMessages.scrollTop =chatMessages.scrollHeight;
})

chatfrom.addEventListener('submit',(e)=>{
    e.preventDefault();

    const msg=e.target.elements.msg.value;
    //emmiting the messages to server
    socket.emit('chatMessage',msg);

    //clear input
    e.target.elements.msg.value="";
    e.target.elements.msg.focus();
})

function outputMessage(message){
    const div=document.createElement('div');
    div.classList.add('message');
    div.innerHTML=`<p class="meta">${message.username}<span>${message.time}</span></p>
    <p class="text"> ${message.text}</p>`
    ;

    document.querySelector('.chat-messages').appendChild(div);
}

// add roomname to dom
function outputroomName(room){
    roomname.innerText=room;
}
function outputroomusers(users){
    userlist.innerHTML = `
    ${users.map(user =>`<li>${user.username}</li>`).join('')}
    `;
}
const r=document.getElementById("leave-btn");
r.addEventListener('click',()=>{
    console.log(window.location.href);
    window.location.href="/";
    //alert("whatsapp");
})