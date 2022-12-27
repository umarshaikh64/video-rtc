import { createSlice } from "@reduxjs/toolkit";
var initialState = {
    configure: {
        appId: "",
        secretKey: ""
    },
    initialize: false
};
export var RTCReducer = createSlice({
    name: "RTCReducer",
    initialState: initialState,
    reducers: {
        initReducer: function (state, action) {
            state.initialize = action.payload;
        }
    }
});
export var initReducer = RTCReducer.actions.initReducer;
//# sourceMappingURL=RTCReducer.js.map