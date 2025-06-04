export const API_URL = "http://localhost:8080";
// export const API_URL = "https://sandniax.mikenatcavon.com";

export type Message = {
    userId: string,
    message: string,
    timestamp: string,
    sender?: boolean
}