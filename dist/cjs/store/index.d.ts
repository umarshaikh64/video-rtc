export declare const store: import("@reduxjs/toolkit/dist/configureStore").ToolkitStore<{
    RTCReducer: any;
}, import("redux").AnyAction, [import("@reduxjs/toolkit").ThunkMiddleware<{
    RTCReducer: any;
}, import("redux").AnyAction, undefined>]>;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
