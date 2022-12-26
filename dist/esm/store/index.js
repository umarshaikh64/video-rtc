import { configureStore } from "@reduxjs/toolkit";
import { RTCReducer } from "../reducers/RTCReducer";
export var store = configureStore({
    reducer: {
        RTCReducer: RTCReducer.reducer
    }
});
//# sourceMappingURL=index.js.map