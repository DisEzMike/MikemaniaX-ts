import axios from "axios";

export const fetchCurrency = () => {
    const URL = "https://latest.currency-api.pages.dev/v1/currencies/usd.json"
    return axios.get(URL, {
        headers : {
            "Content-Type": "application/json"
        }
    })
}