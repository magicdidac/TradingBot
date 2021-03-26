import { CLOSE_ORDER, OPEN_ORDER } from '../actions'

export const ordersReducer = (state = {}, action) => {
    switch(action.type){
        case OPEN_ORDER:
            if(action.payload){
                const { name, quantity, cryptoPrice, date, currencie } = action.payload
                let newState = { ...state }

                if(!newState[name]){
                    newState[name] = []
                }

                newState[name].push({
                    cryptoQuantity: quantity/cryptoPrice,
                    currencie,
                    opened: { date, quantity, cryptoPrice}
                })

                return newState;
            } else {
                return state;
            }
        case CLOSE_ORDER:
            if(action.payload){
                const { name, openDate, cryptoPrice, sendQuantity, date } = action.payload
                let newState = { ...state }
                const orderIndex = newState[name].findIndex((order) => order.opened.date === openDate)
                if(orderIndex >= 0){
                    const currentOrder = newState[name][orderIndex]
                    const newQuantity = currentOrder.cryptoQuantity*cryptoPrice
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