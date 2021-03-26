import { applyMiddleware, compose, createStore } from "redux";
import thunk from "redux-thunk";
import reducers from '../reducers';

const composeEnchancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default createStore(reducers, {},
    composeEnchancers(applyMiddleware(thunk)));