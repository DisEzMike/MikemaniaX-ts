import axios from "axios";
import { API_URL } from "../config/constant";

const api = API_URL + "/api"

export const login = async (payload: any) => {
    return await axios.post(api+"/login", payload)
}

export const currentUser = async (token: string) => {
    return await axios.get(api+"/current-user", {
        headers: {
            "x-access-token": token
        }
    });
}