import { DefaultEventsMap, Server, Socket } from "socket.io";
import { setServerConsole } from "./console";
import { Message } from "../models/chat";
import { pushMessage } from "./line";
import { Log } from "../models/log";
import moment from "moment";
import { Counter } from "../models/counter";

export const createSocketIO = (io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) => {
    io.on('connection', (socket) => {

        // LINE EVENT
        LINE_EVENT(socket);

        // LOG EVENT
        LOG_EVENT(socket);
        setServerConsole(socket);
    });
}

const LINE_EVENT = (socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) => {
    socket.on('join chat', async ({ room }) => {
        socket.join(room);
        console.info('User connected');
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
        socket.to(room).emit('chat message', msg);

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
}

const LOG_EVENT = (socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) => {
    socket.on("log", async ({from}) => {
        const index = await Counter.findById("log");
        const logs = await Log.find({seq: {$gte: index!.seq-from-100, $lte: index!.seq-from-1}}).sort({timestamp: -1});
        if (from == 0) socket.emit("log-history", logs);
        else socket.emit("log-history-range", logs)
    })
}