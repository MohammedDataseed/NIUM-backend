export class AuditLogPayload {
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

enum HttpMethods {
  GET,
  PUT,
  POST,
  PATCH,
  OPTIONS,
}
