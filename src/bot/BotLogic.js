import { AppBar, Toolbar } from '@material-ui/core'
import React from 'react'
import { connect } from 'react-redux'
import { updateCrypto, getCurrentCryptoPrice, openOrder, closeOrder } from "../actions"
import FirstStrategie from './strategies/FirstStrategie'
import ThresholdStrategie from './strategies/ThresholdStrategie'

class BotLogic extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            seconds: 2,
            loading: false,
            strategies: [
                new FirstStrategie('First', 'BTC-USD', 1000),
                new ThresholdStrategie('TH 0.5%', 'BTC-USD', 1000, -0.005, 0.005, 0.005, -0.005),
                new ThresholdStrategie('TH 1%  ', 'BTC-USD', 1000),
                new ThresholdStrategie('TH     ', 'BTC-USD', 1000, -0.005, 0.003, 0.0075, -0.01),
            ]
        }
    }

    componentDidMount (){
        
        this.myInterval = setInterval(() => {
            if(!this.state.loading){
                this.setState(prevState => ({
                    seconds: prevState.seconds - 1
                }))
            }
            
            if(this.state.seconds <= 0 && !this.state.loading){
                this.wakeUpBot()
            }
            
        }, 1000)
    }
    
    componentWillUnmount(){
        clearInterval(this.myInterval)
    }

    openOrder(name, quantity, currencie){
        this.props.openOrder(name, quantity, this.props.bittrexReducer[currencie].currentPrice, currencie)
    }

    closeOrder(name, openDate, currencie, sendQuantity){
        this.props.closeOrder(name, openDate, this.props.bittrexReducer[currencie].currentPrice, sendQuantity)
    }
    
    async wakeUpBot(){
        this.setState({ loading: true })
        console.log("Waking up...")
        await this.props.updateCrypto('BTC-USD')
        await this.props.getCurrentCryptoPrice('BTC-USD')

        for(let strategie of this.state.strategies){
            strategie.checkStatus(this.props.ordersReducer, this.props.bittrexReducer, (name, quantity, currencie) => {this.openOrder(name,quantity,currencie)}, (name, openDate, currencie, sendQuantity) => this.closeOrder(name, openDate, currencie, sendQuantity))
        }

        this.resetTimer()
    }

    resetTimer() {
        this.setState({ seconds: 60, loading: false})
    }

    render(){
        return (
            <div>
                <AppBar position='static'>
                    <Toolbar>
                        {(this.state.seconds < 10)? '0'+this.state.seconds: this.state.seconds}s | {this.state.strategies.length} bots running
                    </Toolbar>
                </AppBar>
                {this.state.strategies.map(strategie => {
                    return strategie.render()
                })}
            </div>
        );
    }
}

function mapStateToProps(state) {
  return {
    ordersReducer: state.ordersReducer,
    bittrexReducer: state.bittrexReducer
  }
}

export default connect(mapStateToProps, { updateCrypto, getCurrentCryptoPrice, openOrder, closeOrder })(BotLogic);
  