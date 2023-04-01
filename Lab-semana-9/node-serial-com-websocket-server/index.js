import { express, Server, cors, SerialPort, ReadlineParser } from './dependencies.js'
const PORT = 5050;


//HTTP COMMUNICATION SETUP _________________
const app = express();
app.use(cors({ origin: "*" }));
const STATIC_MUPI_DISPLAY = express.static('public-display');
app.use('/mupi-display', STATIC_MUPI_DISPLAY);
app.use(express.json());
//============================================

//SERIAL COMMUNICATION SETUP -------------------------------------------------
const protocolConfiguration = { 
    path: 'COM9', //COM#
    baudRate: 9600
};
const port = new SerialPort(protocolConfiguration);

const parser = port.pipe(new ReadlineParser);

parser.on('data', (arduinoData)=>{
        console.log(arduinoData);
        let dataArray = arduinoData.split(' ');
        console.log(dataArray);
    }
);

//============================================

//WEBSOCKET COMMUNICATION SETUP -------------------------------------------------
const httpServer = app.listen(PORT, () => {
    console.table(
        {
            'Mupi display:' : 'http://localhost:5050/mupi-display',
        }
    )
});
const ioServer = new Server(httpServer, { path: '/real-time' });
//============================================ END

/SERIAL COMMUNICATION WORKING_______________/

parser.on('data', (arduinoData) => {

    let dataArray = arduinoData.split(' ');

    let arduinoMessage = {
        actionA: dataArray[0],
        actionB: dataArray[1],
        signal: parseInt(dataArray[2])
    }
    ioServer.emit('arduinoMessage', arduinoMessage);
    console.log(arduinoMessage);
 
});

/WEBSOCKET COMMUNICATION ______________/

ioServer.on('connection', (socket) => {

    socket.on('orderForArduino', (orderForArduino) => {
        port.write(orderForArduino);
        console.log('orderForArduino: ' + orderForArduino);
    });

});