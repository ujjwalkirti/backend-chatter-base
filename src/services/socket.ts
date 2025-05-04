import { Server } from 'socket.io';
import RedisService from './redis';

class SocketService{
    private _io: Server;

    private redisService = new RedisService();

    sub = this.redisService.sub;
    pub = this.redisService.pub;

    constructor(){
        console.log('init socket server');
        this._io = new Server({
            cors: {
                origin: '*',
                allowedHeaders: ['*']
            }
        });

        this.sub.subscribe("MESSAGES");
    }

    public initListeners() {
        const io = this.io;
        console.log("Init Socket Listeners...");

        io.on("connect", (socket) => {
            console.log(`New Socket Connected`, socket.id);
            socket.on("message", async ({ message }: { message: string }) => {
                // publish this message to redis
                await this.pub.publish("MESSAGES", JSON.stringify({ message }));
            });
        });

        this.sub.on("message", async (channel, message) => {
            if (channel === "MESSAGES") {
                console.log("new message from redis", message);
                io.emit("message", message);
            }
        });
    }


    get io(){
        return this._io;
    }
}

export default SocketService;
