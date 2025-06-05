export const API_URL = import.meta.env.MODE == "production" ? process.env.PROD_HOST : `http://localhost:${process.env.PORT}`;

export type Message = {
    userId: string,
    message: string,
    timestamp: string,
    sender?: boolean
}