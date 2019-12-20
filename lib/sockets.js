let socketsBySession = {} ;
let socketsById = {} ;


module.exports = {
  get : (socketId) => {
    return socketsById[socketId] || {} ;
  },
  set : (socketId, sessionId) => {
    socketsBySession[sessionId] = socketsById[socketId] || {} ;
  },
  send : (userId, event, datas) => {
    socketsBySession[userId].emit(event, datas) ;
  },
  sendAll : (userId, event, datas) => {
    let sessionIds = Object.keys(socketsBySession) ;
    for(var i in sessionIds) {
      if(sessionIds[i] !== userId) {
        socketsBySession[sessionIds[i]].emit(event, datas) ;
      }
    }
  },
  run : (io) => {
    io.sockets.on('connection', function (socket) {
      socketsById[socket.id] = socket ;
    });
  }
};
