import moment from "moment";
import { DefaultEventsMap, Server, Socket } from "socket.io";
import { v4 } from "uuid";

const originalConsole = {
  log: console.log,
  error: console.error,
  warn: console.warn,
  info: console.info,
} as any;

export const setServerConsole = (socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) => {
    Object.keys(originalConsole).forEach((method) => {
        (console as any)[method] = (...arg: string[]) => {
            let type = method;
            if (method == 'log') {
                type = `\u001b[32m${method.toLocaleUpperCase()}\u001b[0m`
            } else if (method == 'warn') {
                type = `\u001b[33m${method.toLocaleUpperCase()}\u001b[0m`
            } else if (method == 'error') {
                type = `\u001b[31m${method.toLocaleUpperCase()}\u001b[0m`
            } else {
                type = `\u001b[36m${method.toLocaleUpperCase()}\u001b[0m`
            }
            const message = `[${type}] ${arg.map(log => typeof log === 'object' ? JSON.stringify(log) : log).join(" ")}`;
            const output = {id:v4(), message, timestamp: moment()};
            originalConsole[method](message);
            socket.emit("log", output);
        };
    });
    
    process.on('uncaughtException', (err) => {
      console.error('Uncaught Exception:', err);
    });
    
    process.on('unhandledRejection', (reason, promise) => {
      console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    });
}
