import http from 'http';
import dotenv from 'dotenv';
import SocketService from './services/socket';

dotenv.config();

async function init() {
    const socketService = new SocketService();
    const server = http.createServer();

    const PORT = process.env.PORT || 3000;

    socketService.io.attach(server);

    server.listen(PORT, () => console.log(`Server running on port ${PORT}`));


    socketService.initListeners();
}

init();
