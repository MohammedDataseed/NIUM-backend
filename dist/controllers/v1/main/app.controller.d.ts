import { AppService } from '../../../services/v1/app/app.service';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getHello(): Promise<object>;
}
