"use strict";
exports.__esModule = true;
var tslib_1 = require("tslib");
var react_1 = tslib_1.__importDefault(require("react"));
var react_redux_1 = require("react-redux");
var store_1 = require("./store");
var RTCProvider = function (_a) {
    var children = _a.children;
    return react_1["default"].createElement(react_redux_1.Provider, { store: store_1.store }, children);
};
exports["default"] = RTCProvider;
//# sourceMappingURL=RTCProvider.js.map