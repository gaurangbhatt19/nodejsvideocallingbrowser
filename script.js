const socket=io('/')
const videogrid=document.getElementById('video-grid')
const mypeer= new Peer(undefined, {
    host: 'https://peerjsserverapp.herokuapp.com/',
    port: '3003'
})
const myVideo=document.createElement('video')
myVideo.muted=true
const peers=[]
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream =>{
  addVideoStream(myVideo, stream)
  mypeer.on('call',call =>{
      call.answer(stream)
      const video= document.createElement('video')
    call.on('stream',userVideoStream=>{
        addVideoStream(video,userVideoStream)
  })
})
  socket.on('user-connected',userId=>{
    connectToNewUser(userId,stream)
})
})
socket.on('user-disconnected',userId=>{
    if(peers[userId]) peers[userId].close()
})


mypeer.on('open', id => {
    socket.emit('join-room', ROOM_ID, id)
})
socket.emit('join-room',ROOM_ID,10)

function addVideoStream(video,stream){
    video.srcObject = stream
    video.addEventListener('loadedmetadata',() =>{
        video.play()

    })
    videogrid.append(video)
}
function connectToNewUser(userId,stream){
    const call= mypeer.call(userId,stream)
    const video= document.createElement('video')
    call.on('stream',userVideoStream=>{
        addVideoStream(video,userVideoStream)
    })
    call.on('close',()=>{
        video.remove();
    })
    peers[userId]=call
}
