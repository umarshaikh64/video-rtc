"use strict";
exports.__esModule = true;
exports.initReducer = exports.RTCReducer = void 0;
var toolkit_1 = require("@reduxjs/toolkit");
var initialState = {};
exports.RTCReducer = (0, toolkit_1.createSlice)({
    name: "RTCReducer",
    initialState: initialState,
    reducers: {
        initReducer: function (state, action) {
            console.log(state);
            console.log(action.payload);
        }
    }
});
exports.initReducer = exports.RTCReducer.actions.initReducer;
//# sourceMappingURL=RTCReducer.js.map