import React from 'react'
import { AppBar, GridList, Toolbar } from '@material-ui/core'
import { connect } from 'react-redux'
import { updateCrypto, getCurrentCryptoPrice, getCryptoPrices, openOrder, closeOrder } from "../actions"
import FirstStrategie from './strategies/FirstStrategie'
import LuisStrategie from './strategies/LuisStrategie'
import ThresholdStrategie from './strategies/ThresholdStrategie'
import { MAX_BOTS_COLUMNS } from '../config'

class BotLogic extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            seconds: 2,
            loading: false,
            markets: [],
            currentBigBot: -1,
            // strategies: [
            //     new FirstStrategie('First', 'BTC-USD', 100),
            //     new ThresholdStrategie('TH 0.5%', 'BTC-USD', 100, -0.005, 0.005, 0.005, -0.005),
            //     new ThresholdStrategie('TH 1%  ', 'BTC-USD', 100),
            //     new ThresholdStrategie('TH     ', 'BTC-USD', 100, -0.005, 0.003, 0.0075, -0.01),
            // ]

            // strategies: [
            //     new FirstStrategie('First', 'BTC-USD', 100),
            //     new LuisStrategie('L 5%', 'BTC-USD', 100),
            //     new LuisStrategie('L 10%', 'BTC-USD', 100, 0.1),
            //     new LuisStrategie('LU 5%', 'ETH-USD', 100),
            //     new LuisStrategie('LU 10%', 'ETH-USD', 100, 0.1),
            //     new LuisStrategie('LUI 5%', 'ADA-USD', 100),
            //     new LuisStrategie('LUI 10%', 'ADA-USD', 100, 0.1),
            //     new LuisStrategie('LUIS 5%', 'HBAR-USD', 100),
            //     new LuisStrategie('LUIS 10%', 'HBAR-USD', 100, 0.1),
            //     new LuisStrategie('LUISS 5%', 'LBC-USD', 100),
            //     new LuisStrategie('LUISS 10%', 'LBC-USD', 100, 0.1),
            // ]

            strategies: [
                new FirstStrategie('First', 'BTC-USD', 100),
                new LuisStrategie('D 2%', 'BTC-USD', 100, 0.02, -0.01, 0.01),
                new LuisStrategie('D 3%', 'BTC-USD', 100, 0.03, -0.015, 0.01),
                new LuisStrategie('DI 2%', 'ETH-USD', 100, 0.02, -0.01, 0.01),
                new LuisStrategie('DI 3%', 'ETH-USD', 100, 0.03, -0.015, 0.01),
                new LuisStrategie('DID 2%', 'ADA-USD', 100, 0.02, -0.01, 0.01),
                new LuisStrategie('DID 3%', 'ADA-USD', 100, 0.03, -0.015, 0.01),
                new LuisStrategie('DIDA 2%', 'HBAR-USD', 100, 0.02, -0.01, 0.01),
                new LuisStrategie('DIDA 3%', 'HBAR-USD', 100, 0.03, -0.015, 0.01),
                new LuisStrategie('DIDAC 2%', 'DOGE-USD', 100, 0.02, -0.01, 0.01),
                new LuisStrategie('DIDAC 3%', 'DOGE-USD', 100, 0.03, -0.015, 0.01),
            ]
        }
    }

    setBigBot(index) {
        this.setState({ currentBigBot: ((this.state.currentBigBot === index) ? -1 : index) })
    }

    componentDidMount() {

        if (this.state.markets.length === 0) {
            let markets = []
            for (let strategie of this.state.strategies) {
                if (!markets.includes(strategie.state.currencie)) {
                    markets.push(strategie.state.currencie)
                }
            }
            this.setState({ markets })

            for (let market of markets) {
                this.props.getCryptoPrices(market)
            }

        }

        this.myInterval = setInterval(() => {
            if (!this.state.loading) {
                this.setState(prevState => ({
                    seconds: prevState.seconds - 1
                }))
            }

            if (this.state.seconds <= 0 && !this.state.loading) {
                this.wakeUpBot()
            }

        }, 1000)
    }

    componentWillUnmount() {
        clearInterval(this.myInterval)
    }

    openOrder(name, quantity, currencie, comfirmOrder) {
        this.props.openOrder(name, quantity, this.props.bittrexReducer[currencie].sellCryptoPrice, currencie, comfirmOrder)
    }

    closeOrder(name, openDate, currencie, sendQuantity) {
        this.props.closeOrder(name, openDate, this.props.bittrexReducer[currencie].buyCryptoPrice, sendQuantity)
    }

    async wakeUpBot() {
        this.setState({ loading: true })
        console.log("Waking up...")

        for (let market of this.state.markets) {
            await this.props.updateCrypto(market)
            await this.props.getCurrentCryptoPrice(market)
        }

        for (let strategie of this.state.strategies) {
            strategie.updateLastOrder(this.props.ordersReducer)
            strategie.checkStatus(this.props.ordersReducer, this.props.bittrexReducer, (name, quantity, currencie, comfirmOrder) => { this.openOrder(name, quantity, currencie, comfirmOrder) }, (name, openDate, currencie, sendQuantity) => this.closeOrder(name, openDate, currencie, sendQuantity))
        }

        this.resetTimer()
    }

    resetTimer() {
        console.log("...Sleeping")
        this.setState({ seconds: 10, loading: false })
    }

    getPriceRounded(price) {
        return parseFloat(price).toFixed(4)
    }



    render() {
        const { bittrexReducer } = this.props

        return (
            <div>
                <AppBar position='static'>
                    <Toolbar>
                        {(this.state.seconds < 10) ? '0' + this.state.seconds : this.state.seconds}s | {this.state.strategies.length} bots running
                        {
                            this.state.markets.map((market) => {
                                return (bittrexReducer[market] && bittrexReducer[market].currentPrice) ? ' | ' + market + ': ' + this.getPriceRounded(bittrexReducer[market].currentPrice) + '$' : ''
                            })
                        }
                    </Toolbar>
                </AppBar>
                <GridList cols={MAX_BOTS_COLUMNS} spacing={0} cellHeight='auto'>
                    {this.state.strategies.map((strategie, index) => {
                        return strategie.render((this.state.currentBigBot === index), () => { this.setBigBot(index) })
                    })}
                </GridList>
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

export default connect(mapStateToProps, { updateCrypto, getCurrentCryptoPrice, getCryptoPrices, openOrder, closeOrder })(BotLogic);
