export declare class AuditLogPayload {
    request: IRequest;
    response: object;
    success: boolean;
    method: HttpMethods;
    latency: number;
}
interface IRequest {
    path: string;
    query: object;
    body: object;
    params: object;
}
declare enum HttpMethods {
    GET = 0,
    PUT = 1,
    POST = 2,
    PATCH = 3,
    OPTIONS = 4
}
export {};
