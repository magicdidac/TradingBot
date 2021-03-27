import { GET_CRYPTO_PRICES, GET_CURRENT_CRYPTO_PRICE, UPDATE_CRYPTO } from "../actions";


export const bittrexReducer = (state = {}, action) => {
    switch (action.type) {
        case GET_CRYPTO_PRICES:
            if (action.payload) {
                const { currencie, result } = action.payload
                result.data.pop()
                let newState = { ...state }
                newState[currencie] = { prices: result.data }
                return newState
            }
            return state
        case UPDATE_CRYPTO:
            if (action.payload) {
                const { currencie, result } = action.payload
                let newState = { ...state }
                if (newState[currencie]) {
                    newState[currencie].prices.push(result)
                    return newState
                }
            }

            return state
        case GET_CURRENT_CRYPTO_PRICE:
            if (action.payload) {
                const { currencie, cryptoPrice } = action.payload
                let newState = { ...state }
                if (newState[currencie]) {
                    newState[currencie].currentPrice = cryptoPrice
                    return newState
                }
            }

            return state
        default:
            return state
    }
}