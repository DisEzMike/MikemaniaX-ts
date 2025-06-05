import axios from "axios"
import { API_URL } from "../config/constant"

const api = API_URL + "/api"

export const getAllUser = (token: string) => {
    return axios.get(api+"/user", {
        headers: {
            "x-access-token": token
        }
    })
}

export const getUser = (token: string, userId: string) => {
    return axios.get(`${api}/user/${userId}`, {
        headers: {
            "x-access-token": token
        }
    })
}