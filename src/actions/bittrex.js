import axios from 'axios'
import { BASE_URL_BITTREX, BASE_URL_PHP } from '../config'

export const UPDATE_CRYPTO = 'UPDATE_CRYPTO'
export const GET_CRYPTO_PRICES = 'GET_CRYPTO_PRICES'
export const GET_CURRENT_CRYPTO_PRICE = 'GET_CURRENT_CRYPTO_PRICE'

export const getCryptoPrices = (currencie) => {
    return async dispatch => {
        try {
            let result = await axios.get(`${BASE_URL_PHP}${BASE_URL_BITTREX}${currencie}/candles/MIDPOINT/MINUTE_1/recent`, {
                header: {
                    'Accept': 'application/json',
                    'Content-type': 'application/json'
                }
            })
            dispatch({
                type: GET_CRYPTO_PRICES,
                payload: {
                    currencie,
                    result
                }
            })
        }catch (error){
            console.log('Error on ',GET_CRYPTO_PRICES)
            throw error
        }
    }
}

export const updateCrypto = (currencie) => {
    return async dispatch => {
        try {
            let result = await axios.get(`${BASE_URL_PHP}${BASE_URL_BITTREX}${currencie}/candles/TRADE/MINUTE_1/recent`,{
                header: {
                    'Accept': 'application/json',
                    'Content-type': 'application/json'
                }
            })
            dispatch({
                type: UPDATE_CRYPTO,
                payload: {
                    currencie,
                    result: result.data[result.data.length-2]
                }
            })
        }catch (error){
            console.log('Error on ',UPDATE_CRYPTO)
            throw error
        }
    }
}

export const getCurrentCryptoPrice = (currencie) => {
    return async dispatch => {
        try {
            let res = await axios.get(`${BASE_URL_PHP}${BASE_URL_BITTREX}${currencie}/ticker`,{
                header: {
                    'Accept': 'application/json',
                    'Content-type': 'application/json'
                }
            })
            dispatch({
                type: GET_CURRENT_CRYPTO_PRICE,
                payload:{
                    currencie,
                    cryptoPrice: res.data.lastTradeRate
                }
            })
        } catch (error) {
            console.log('Error on getCurrentCryptoPrice')
            throw error
        }
    }
}