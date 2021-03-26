import React from 'react'
import { Card, CardContent, CardHeader, Typography } from '@material-ui/core'

class BotStrategie {
    constructor(name, description, currencie, investment){
        this.state = {
            name,
            description,
            currencie,
            investment,
            inInvestment: 0,
            initialInvestment: investment
        }
    }

    openOrder(openOrder, investment){
        if(investment > this.state.investment){
            return
        }

        this.state = { ...this.state, investment: (this.state.investment-investment), inInvestment: (this.state.inInvestment+investment) }
        this.openMessage(investment)
        openOrder(this.state.name, investment, this.state.currencie)
    }

    closeOrder(closeOrder, orderToClose){
        if(this.inInvestment === 0){
            return
        }

        closeOrder(this.state.name, orderToClose.opened.date, orderToClose.currencie, (quantity, closedOrder) => this.sendQuantity(quantity, closedOrder))
    }

    checkStatus(orders, bittrex, openOrder, closeOrder){
        return
    }

    sendQuantity(quantity, closedOrder){
        this.state = { ...this.state, investment: this.state.investment+quantity, inInvestment: this.state.inInvestment-closedOrder.opened.quantity}
        this.closeMessage(quantity)
    }

    openMessage(quantity){
        console.log(this.state.name,'open an order in',this.state.currencie,'of',quantity,'$')
    }
    
    closeMessage(quantity){
        console.log(this.state.name,'close an order in',this.state.currencie,'and get', quantity,'$')
    }

    render(){
        return(
            <Card key={this.state.name} variant="outlined" style={{margin: '50px'}}>
                <CardHeader
                title={this.state.name+' |'+this.state.initialInvestment.toFixed(2)+'$| ['+this.state.currencie+']'}
                subheader={this.state.description}
                />
                <CardContent>
                    <Typography>In: {this.state.inInvestment.toFixed(2)}$ - Remain: {this.state.investment.toFixed(2)}$</Typography>
                    <Typography>Benefits: {((this.state.investment+this.state.inInvestment)-this.state.initialInvestment).toFixed(2)}$</Typography>
                </CardContent>
            </Card>
        )
    }
}

export default BotStrategie