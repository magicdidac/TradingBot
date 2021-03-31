import BotStrategie from "./BotStrategie";


class LuisStrategie extends BotStrategie {

    constructor(name, currencie, investment, thresholdToSell = 0.05, stopLossSell = -0.025, stopLossBuy = 0.025) {
        const description = ""
        super(name, description, currencie, investment)

        this.state = {
            ...this.state,
            stopLossBuy,
            thresholdToSell,
            stopLossSell,
            inStopLoss: false,
            lower: undefined,
            higher: undefined,

        }

    }

    checkStatus(orders, bittrex, openOrder, closeOrder) {
        // The very first order
        // if (!this.state.isIn && !this.state.lastOrder) {
        //     this.openOrder(openOrder, this.state.investment)
        //     return
        // }

        if (this.state.isIn) {

            const currentPrice = bittrex[this.state.currencie].buyCryptoPrice

            if (!this.state.inStopLoss && this.getPercentage(this.state.lastOrder.opened.cryptoPrice, currentPrice) > this.state.thresholdToSell) {
                this.setInStopLoss(true)
            }

            if (this.state.inStopLoss) {
                this.getHigher(currentPrice)
                if (this.getPercentage(this.state.higher, currentPrice) < this.state.stopLossSell) {
                    this.closeOrder(closeOrder, this.state.lastOrder)
                    this.setInStopLoss(false)
                    this.resetHigher()
                }
            }

        } else {
            const currentPrice = bittrex[this.state.currencie].sellCryptoPrice
            this.getLower(currentPrice)
            if (this.getPercentage(this.state.lower, currentPrice) > this.state.stopLossBuy) {
                this.openOrder(openOrder, this.state.investment)
                this.resetLower()
            }
        }
    }

    setInStopLoss(inStopLoss) {
        this.state = { ...this.state, inStopLoss }
    }

    resetLower() { this.state = { ...this.state, lower: undefined } }

    getLower(currentPrice) {
        if (!this.state.lower) {
            this.state = { ...this.state, lower: currentPrice }
            return;
        }

        if (currentPrice < this.state.lower) {
            this.state = { ...this.state, lower: currentPrice }
        }

    }

    resetHigher() { this.state = { ...this.state, higher: undefined } }

    getHigher(currentPrice) {
        if (!this.state.higher) {
            this.state = { ...this.state, higher: currentPrice }
        }

        if (currentPrice > this.state.higher) {
            this.state = { ...this.state, higher: currentPrice }
        }
    }

}

export default LuisStrategie