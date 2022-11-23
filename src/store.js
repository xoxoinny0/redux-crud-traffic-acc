import { configureStore } from "@reduxjs/toolkit";
import TrafficSlice from "./slice/TrafficSlice";

const store = configureStore({
    reducer: {
        TrafficSlice: TrafficSlice
    }
});

export default store;
