import React from 'react'
import { Card, CardContent, CardHeader, Typography } from '@material-ui/core'

class BotStrategie {
    constructor(name, description, currencie, investment) {
        this.state = {
            name,
            description,
            currencie,
            investment,
            inInvestment: 0,
            initialInvestment: investment,
            lastOrder: undefined,
            isIn: false
        }
    }

    setOut() { this.state = { ...this.state, isIn: false } }
    setIn() { this.state = { ...this.state, isIn: true } }

    updateLastOrder(orders) {
        // Get last order if exists
        if (orders[this.state.name]) {
            let lastOrder = orders[this.state.name][orders[this.state.name].length - 1]
            this.state = { ...this.state, lastOrder }
        }
    }

    openOrder(openOrder, investment) {
        if (investment > this.state.investment) {
            return
        }

        this.state = { ...this.state, investment: (this.state.investment - investment), inInvestment: (this.state.inInvestment + investment) }
        openOrder(this.state.name, investment, this.state.currencie)
        this.openMessage(investment)
        this.setIn();
    }

    closeOrder(closeOrder, orderToClose) {
        if (this.inInvestment === 0) {
            return
        }

        closeOrder(this.state.name, orderToClose.opened.date, orderToClose.currencie, (quantity, closedOrder) => this.sendQuantity(quantity, closedOrder))
    }

    checkStatus(orders, bittrex, openOrder, closeOrder) {
        return
    }

    sendQuantity(quantity, closedOrder) {
        this.state = { ...this.state, investment: this.state.investment + quantity, inInvestment: this.state.inInvestment - closedOrder.opened.quantity }
        this.closeMessage(quantity)
        this.setOut()
    }

    openMessage(quantity) {
        console.log(this.state.name, 'open an order in', this.state.currencie, 'of', quantity, '$')
    }

    closeMessage(quantity) {
        console.log(this.state.name, 'close an order in', this.state.currencie, 'and get', quantity, '$')
    }

    getPercentage(oldPrice, newPrice) {
        return ((newPrice / oldPrice) - 1).toFixed(5)
    }

    render() {
        return (
            <Card key={this.state.name} variant="outlined" style={{ margin: '50px' }}>
                <CardHeader
                    title={this.state.name + ' |' + this.state.initialInvestment.toFixed(2) + '$| [' + this.state.currencie + ']'}
                    subheader={this.state.description}
                />
                <CardContent>
                    <Typography>In: {this.state.inInvestment.toFixed(2)}$ - Remain: {this.state.investment.toFixed(2)}$</Typography>
                    <Typography>Benefits: {((this.state.investment + this.state.inInvestment) - this.state.initialInvestment).toFixed(2)}$</Typography>
                </CardContent>
            </Card>
        )
    }
}

export default BotStrategie