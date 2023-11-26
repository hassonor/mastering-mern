import { Server, Socket } from 'socket.io';
import { ISenderReceiver } from '@chat/interfaces/chat.interface';
import { connectedUserMap } from '@socket/user.socket';


export let socketIOChatObject: Server;

export class SocketIOChatHandler {
    private io: Server;

    constructor(io: Server) {
        this.io = io;
        socketIOChatObject = io;
    }

    public listen(): void {
        this.io.on('connection', (socket: Socket) => {
            socket.on('join room', (data: ISenderReceiver) => {
                const {senderName, receiverName} = data;
                const senderSocketId: string = connectedUserMap.get(senderName) as string;
                const receiverSocketId: string = connectedUserMap.get(receiverName) as string;
                socket.join(senderSocketId);
                socket.join(receiverSocketId);
            });
        });
    }
}