import React from "react";
import BotLogic from "./bot/BotLogic";

class App extends React.Component {

  render() {
    return (
      <div className='.noselect'>
        <BotLogic />
      </div>
    );
  }
}

export default App;
