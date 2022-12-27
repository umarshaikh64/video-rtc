export declare const store: import("@reduxjs/toolkit/dist/configureStore").ToolkitStore<{
    RTCReducer: import("../types/reducerType").RTCReducerType;
}, import("redux").AnyAction, [import("@reduxjs/toolkit").ThunkMiddleware<{
    RTCReducer: import("../types/reducerType").RTCReducerType;
}, import("redux").AnyAction, undefined>]>;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
