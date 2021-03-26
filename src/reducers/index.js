import { combineReducers } from "redux";
import { bittrexReducer } from "./BittrexReducer";
import { ordersReducer } from "./OrdersReducer";

const rootReducer = combineReducers({
    ordersReducer: ordersReducer,
    bittrexReducer: bittrexReducer
});

export default rootReducer;