import React from "react";
import { connect } from "react-redux";
import { getCryptoPrices } from "./actions";

import BotDashboard from "./bot/BotDashboard";
import BotLogic from "./bot/BotLogic";

class App extends React.Component {

  componentDidMount(){
    this.props.getCryptoPrices('BTC-USD');
  }

  render (){
    return (
      <div>
        <BotLogic/>
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

export default connect(mapStateToProps, { getCryptoPrices })(App);
