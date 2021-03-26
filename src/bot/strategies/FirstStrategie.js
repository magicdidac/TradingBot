import BotStrategie from './BotStrategie';

class FirstStrategie extends BotStrategie{
    constructor(name, currencie, investment){
        super(name, 'BUY, one minute later SELL, one minute later repeat the cycle', currencie, investment)
        this.state = {
            ...this.state,
            isIn: false
        }
    }

    checkStatus(orders, bittrex, openOrder, closeOrder){
        if(this.state.isIn){
            let lastOrder = orders[this.state.name][orders[this.state.name].length-1]
            this.closeOrder(closeOrder, lastOrder)
        }else{
            this.openOrder(openOrder, this.state.investment)
        }

        this.state = { ...this.state, isIn: !this.state.isIn }
    }
}

export default FirstStrategie