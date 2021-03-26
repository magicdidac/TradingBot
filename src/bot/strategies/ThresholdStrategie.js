import BotStrategie from './BotStrategie';

/*
DEFAULT VALUES

thresholdBuy: -0.01
thresholdBuyMax: 0.01
thresholdSell: 0.01
thresholdSellMax: -0.01

*/

class ThresholdStrategie extends BotStrategie{
    constructor(name, currencie, investment, thresholdBuy = -0.01, thresholdBuyMax = 0.01, thresholdSell = 0.01, thresholdSellMax = -0.01){
        const description = "BUY. Every minute check how much has gone up or down compared to the last order price. If it is in, if it rises more than "+thresholdSell*100+"%, SELL, if it falls more than "+thresholdSellMax*100+"%, SELL to haven't more losses. If it is out, if it falls more than "+thresholdBuy*100+"%, BUY, if it rises more than "+thresholdBuyMax*100+"%, BUY to don't miss the rise."
        super(name, description, currencie, investment)
        this.state = {
            ...this.state,
            isIn: false,
            thresholdBuy,
            thresholdBuyMax,
            thresholdSell,
            thresholdSellMax,
            lastOrder: undefined
        }
    }

    setOut(){this.state = { ...this.state, isIn: false }}
    setIn(){this.state = { ...this.state, isIn: true }}

    checkStatus(orders, bittrex, openOrder, closeOrder){

        // Get last order if exists
        if(orders[this.state.name]){
            let lastOrder = orders[this.state.name][orders[this.state.name].length-1]
            this.state = { ...this.state, lastOrder }
        }

        // The very first order
        if(!this.state.isIn && !this.state.lastOrder){
            this.openOrder(openOrder, this.state.investment)
            this.setIn()
            return
        }

        if(this.state.isIn){
            const percentage = this.getPercentage(this.state.lastOrder.opened.cryptoPrice, bittrex[this.state.currencie].currentPrice)
            console.log(this.state.name,'is trying to close in',this.state.currencie,'with percentage of',percentage)
            
            if(percentage > this.state.thresholdSell || percentage < this.state.thresholdSellMax){
                this.closeOrder(closeOrder, this.state.lastOrder)
                this.setOut()
            }
            
        }else{
            const percentage = this.getPercentage(this.state.lastOrder.closed.cryptoPrice, bittrex[this.state.currencie].currentPrice)
            console.log(this.state.name,'is trying to open in',this.state.currencie,'with percentage of',percentage)

            if(percentage < this.state.thresholdBuy || percentage > this.state.thresholdBuyMax){
                this.openOrder(openOrder, this.state.investment)
                this.setIn()
            }

        }
    }

    getPercentage(oldPrice, newPrice){
        return ((newPrice/oldPrice)-1).toFixed(5)
    }
}

export default ThresholdStrategie