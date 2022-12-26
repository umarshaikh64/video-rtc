"use strict";
exports.__esModule = true;
exports.store = void 0;
var toolkit_1 = require("@reduxjs/toolkit");
var RTCReducer_1 = require("../reducers/RTCReducer");
exports.store = (0, toolkit_1.configureStore)({
    reducer: {
        RTCReducer: RTCReducer_1.RTCReducer.reducer
    }
});
//# sourceMappingURL=index.js.map