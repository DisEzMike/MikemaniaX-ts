import { DefaultEventsMap, Server, Socket } from "socket.io";
import { setServerConsole } from "./console";
import { Message } from "../models/chat";
import { pushMessage } from "./line";

export const createSocketIO = (io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) => {
    io.on('connection', (socket) => {
        setServerConsole(socket);
        socket.on('join chat', async ({ room }) => {
            socket.join(room);
            console.info('User connected');
            // Load and send previous messages for that room
            const messages = await Message.find({ room })
                .select('-room')
                .sort({ timestamp: 1 })
                .limit(50);
            socket.emit('chat history', messages);
        });

        socket.on('chat message', async ({ room, userId, message }) => {
            console.info('User message');
            const msg = new Message({ room, userId, message });
            await msg.save();
            io.to(room).emit('chat message', msg); // Only to users in the room

            await pushMessage({
                to: room,
                messages: [
                    {
                        type: 'text',
                        text: message,
                    },
                ],
            });
        });

        socket.on('disconnect', () => {
            console.info('User disconnected');
        });
    });
}