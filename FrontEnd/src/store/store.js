import { configureStore } from "@reduxjs/toolkit";
import useReducer from "./slices/userSlice"; 
import commissionReducer from "./slices/commissionSlice";
import auctionReducer from "./slices/auctionSlice";
import bidReducer from "./slices/bidSlice";


export const store = configureStore({
    reducer: {
        user: useReducer,
        commission: commissionReducer,
        auction: auctionReducer,
        bid: bidReducer
        
        
    },
});
