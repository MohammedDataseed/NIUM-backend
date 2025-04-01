import { HttpService } from '@nestjs/axios';
import { TracerService } from '../tracer/tracer.service';
import { RequestStorageService } from '../request-storage/request-storage.service';
export declare class HttpWrapperService {
    private http;
    private tracerService;
    private readonly requestStorage;
    constructor(http: HttpService, tracerService: TracerService, requestStorage: RequestStorageService);
    private processResponse;
    private processAxiosError;
    private processReqest;
    get(url: string, queryParams: object, headers: object, responseType?: string): import("rxjs").Observable<any>;
    post(url: string, body: object, queryParams: object, headers: object, isCaseConversionRequired?: boolean): import("rxjs").Observable<any>;
    patch(url: string, body: object, queryParams: object, headers: object, files?: any[], isMultipart?: boolean): import("rxjs").Observable<any>;
    put(url: string, body: object, queryParams: object, headers: object): import("rxjs").Observable<any>;
}
