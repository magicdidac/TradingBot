import React from 'react'
import { CardContent, GridListTile, Paper, Typography } from '@material-ui/core'
import { MAX_BOTS_COLUMNS } from '../../config'

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

        openOrder(this.state.name, investment, this.state.currencie, (quantity, openedOrder) => this.comfirmOpen(quantity, openedOrder))
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

    comfirmOpen(quantity, openedOrder) {
        this.state = { ...this.state, lastOrder: openedOrder, investment: (this.state.investment - openedOrder.opened.quantityWithoutFees), inInvestment: (this.state.inInvestment + quantity) }
        this.openMessage(quantity)
        this.setIn()
    }

    sendQuantity(quantity, closedOrder) {
        this.state = { ...this.state, lastOrder: closedOrder, investment: this.state.investment + quantity, inInvestment: this.state.inInvestment - closedOrder.opened.quantity }
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

    render(isBig, setBigBot) {

        const totalInvestment = (this.state.investment + this.state.inInvestment)
        const percentageOfBenefits = parseFloat(this.getPercentage(this.state.initialInvestment, totalInvestment) * 100).toFixed(2)
        const cryptoQuantity = (this.state.isIn && this.state.lastOrder) ? this.state.lastOrder.cryptoQuantity.toFixed(6) : undefined
        if (isBig) {
            console.log(cryptoQuantity)
        }

        return (
            <GridListTile key={this.state.name} cols={(isBig) ? MAX_BOTS_COLUMNS : 1}>
                <Paper onClick={setBigBot} elevation={0} style={{ margin: '1vw', height: isBig ? '95%' : '90%', background: ((percentageOfBenefits < 0) ? '#ffa4a2' : '#b2fab4') }}>
                    <CardContent>
                        <div style={{ textAlign: 'right' }}>
                            {this.state.isIn ? 'IN' : 'OUT'}
                        </div>
                        <Typography variant='h4'>{this.state.name}</Typography>
                        <Typography variant='h6'>{this.state.initialInvestment.toFixed(2) + '$'}</Typography>
                        <Typography variant='h6'>{'[' + this.state.currencie + ']'}</Typography>
                    </CardContent>
                    {isBig && this.state.description &&
                        <CardContent style={{ paddingTop: '0px' }}>
                            <Typography variant='h6'>Description</Typography>
                            <Typography variant='body2'>{this.state.description}</Typography>
                        </CardContent>
                    }
                    {!isBig &&
                        <CardContent>
                            <Typography>In: {this.state.inInvestment.toFixed(2)}$</Typography>
                            <Typography>Out: {this.state.investment.toFixed(2)}$</Typography>
                            <Typography>Benefits: {(totalInvestment - this.state.initialInvestment).toFixed(2)}$ | {percentageOfBenefits}%</Typography>
                        </CardContent>
                    }
                    {isBig &&
                        <CardContent>
                            <Typography>In: {this.state.inInvestment.toFixed(2)}$ | Out: {this.state.investment.toFixed(2)}$</Typography>
                            <Typography>Benefits: {(totalInvestment - this.state.initialInvestment).toFixed(2)}$ | {percentageOfBenefits}%</Typography>
                            {cryptoQuantity && <Typography>Quantity: {cryptoQuantity}</Typography>}
                        </CardContent>
                    }

                </Paper>
            </GridListTile>
        )
    }
}

export default BotStrategie