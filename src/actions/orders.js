
export const OPEN_ORDER = 'OPEN_ORDER';
export const CLOSE_ORDER = 'CLOSE_ORDER';

export const openOrder = (name, quantity, cryptoPrice, currencie, comfirmOpen) => {
    return dispatch => {
        if (quantity <= 0) {
            return
        }
        dispatch({
            type: OPEN_ORDER,
            payload: {
                name,
                quantity,
                cryptoPrice,
                currencie,
                comfirmOpen,
                date: new Date().getTime()
            }
        })
    }
}

export const closeOrder = (name, openDate, cryptoPrice, sendQuantity) => {
    return dispatch => {

        dispatch({
            type: CLOSE_ORDER,
            payload: {
                name,
                openDate,
                cryptoPrice,
                sendQuantity,
                date: new Date().getTime()
            }
        })
    }
}