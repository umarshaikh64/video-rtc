export interface AppConfigure {
    appId: string;
    secretKey: string;
}
export interface RTCReducerType {
    configure?: AppConfigure;
    initialize?: boolean;
}
