import { Server, Socket } from 'socket.io';
import { ILogin, ISocketData } from '@user/interfaces/user.interface';

export let socketIOUserObject: Server;
export const connectedUserMap: Map<string, string> = new Map();

let users: string[] = [];

export class SocketIOUserHandler {
    private io: Server;

    constructor(io: Server) {
        this.io = io;
        socketIOUserObject = io;
    }

    public listen(): void {
        this.io.on('connection', (socket: Socket) => {
            socket.on('setup', (data: ILogin) => {
                this.addClientToMap(data.userId, socket.id);
                this.addUser(data.userId);
                this.io.emit('user online', users);
            });
            socket.on('block user', (data: ISocketData) => {
                this.io.emit('blocked user id', data);
            });
            socket.on('unblock user', (data: ISocketData) => {
                this.io.emit('unblocked user id', data);
            });
            socket.on('disconnect', () => {
                this.removeClientFromMap(socket.id);
            });
        });
    }

    private addClientToMap(username: string, sockedId: string): void {
        if (!connectedUserMap.has(username)) {
            connectedUserMap.set(username, sockedId);
        }
    }

    private removeClientFromMap(socketId: string): void {
        if (Array.from(connectedUserMap.values()).includes(socketId)) {
            const disconnectedUser: [string, string] = [...connectedUserMap].find((user: [string, string]) => {
                return user[1] === socketId; // search for the socketId in the array of the map [[userId, socketId], [userId, socketId]...]
            }) as [string, string];

            connectedUserMap.delete(disconnectedUser[0]);
            this.removeUser(disconnectedUser[0]);
            this.io.emit('user online', users);
        }
    }

    private addUser(username: string): void {
        users.push(username);
        users = [...new Set(users)]; // remove duplicates
    }

    private removeUser(username: string): void {
        users = users.filter((name: string) => name !== username);
    }
}