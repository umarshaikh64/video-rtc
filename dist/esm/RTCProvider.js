import React from "react";
import { Provider } from "react-redux";
import { store } from "./store";
var RTCProvider = function (_a) {
    var children = _a.children;
    return React.createElement(Provider, { store: store }, children);
};
export default RTCProvider;
//# sourceMappingURL=RTCProvider.js.map