import http from 'http';
import dotenv from 'dotenv';
import SocketService from './services/socket';
import express from 'express';
import router from './controllers';
import { connectToMongodb } from './config/mongoConfig';

const app = express();

dotenv.config();

async function init() {
    const socketService = new SocketService();

    const PORT = process.env.PORT || 3000;

    app.use(express.json());

    // configure cors
    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });

    app.use('/api', router);

    const server = http.createServer(app);

    socketService.io.attach(server);

    // connect to database
    await connectToMongodb();
    server.listen(PORT, () => console.log(`Server running on port ${PORT}`));


    socketService.initListeners();
}

init();
