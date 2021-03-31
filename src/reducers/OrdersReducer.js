import { CLOSE_ORDER, OPEN_ORDER } from '../actions'
import { FEE_MULTIPLIER } from '../config'

export const ordersReducer = (state = {}, action) => {
    switch (action.type) {
        case OPEN_ORDER:
            if (action.payload) {
                const { name, quantity, cryptoPrice, date, currencie, comfirmOpen } = action.payload
                let newState = { ...state }

                if (!newState[name]) {
                    newState[name] = []
                }

                const newQuantity = quantity * FEE_MULTIPLIER
                const currentOrder = {
                    cryptoQuantity: newQuantity / cryptoPrice,
                    currencie,
                    opened: { date, quantity: newQuantity, quantityWithoutFees: quantity, cryptoPrice }
                }

                newState[name].push(currentOrder)

                comfirmOpen(newQuantity, currentOrder)

                return newState;
            } else {
                return state;
            }
        case CLOSE_ORDER:
            if (action.payload) {
                const { name, openDate, cryptoPrice, sendQuantity, date } = action.payload
                let newState = { ...state }
                const orderIndex = newState[name].findIndex((order) => order.opened.date === openDate)
                if (orderIndex >= 0) {
                    const currentOrder = newState[name][orderIndex]
                    const newQuantity = currentOrder.cryptoQuantity * (cryptoPrice * FEE_MULTIPLIER)
                    currentOrder.closed = { date, quantity: newQuantity, cryptoPrice }
                    sendQuantity(newQuantity, currentOrder)
                }


                return newState
            }
            return state;
        default:
            return state;
    }
}