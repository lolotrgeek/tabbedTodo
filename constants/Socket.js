import socketIO from 'socket.io-client';
//https://brentmarquez.com/uncategorized/how-to-get-socket-io-to-work-with-react-native/

// Initialize Socket IO:
const io = socketIO("http://127.0.0.1:5050", {
    transports: ['websocket'],
    jsonp: false,
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000
});

// export the function to connect and use socket IO:
export const startSocketIO = () => {
    io.connect();

    io.on('connection', () => {
        console.log('socket connected')

        io.on('disconnect', () => {
            console.log('connection to server lost.');
        });
    })
};

export const emitTickSocketIO = (message) => {
    io.emit('tick', message)
}

export const emitEntrySocketIO = (message) => {
    io.emit('entry', message)
}