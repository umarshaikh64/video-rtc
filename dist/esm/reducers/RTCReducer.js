import { createSlice } from "@reduxjs/toolkit";
var initialState = {};
export var RTCReducer = createSlice({
    name: "RTCReducer",
    initialState: initialState,
    reducers: {
        initReducer: function (state, action) {
            console.log(state);
            console.log(action.payload);
        }
    }
});
export var initReducer = RTCReducer.actions.initReducer;
//# sourceMappingURL=RTCReducer.js.map