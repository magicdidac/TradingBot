import BotStrategie from './BotStrategie';

class FirstStrategie extends BotStrategie {
    constructor(name, currencie, investment) {
        super(name, 'BUY, one minute later SELL, one minute later repeat the cycle', currencie, investment)
        this.state = {
            ...this.state
        }
    }

    checkStatus(orders, bittrex, openOrder, closeOrder) {
        if (this.state.isIn) {
            this.closeOrder(closeOrder, this.state.lastOrder)
        } else {
            this.openOrder(openOrder, this.state.investment)
        }
    }
}

export default FirstStrategie