"use strict";
exports.__esModule = true;
exports.useRTCStore = exports.RTCProvider = void 0;
var tslib_1 = require("tslib");
var RTCProvider_1 = tslib_1.__importDefault(require("./RTCProvider"));
exports.RTCProvider = RTCProvider_1["default"];
var getStore_1 = require("./getStore");
exports.useRTCStore = getStore_1.useRTCStore;
var VideoRTC_1 = tslib_1.__importDefault(require("./VideoRTC"));
exports["default"] = VideoRTC_1["default"];
//# sourceMappingURL=index.js.map