import { Injectable } from '@nestjs/common';
const contextService = require('request-context');

@Injectable()
export class RequestStorageService {
  public get<T>(key: string): T {
    try {
      return contextService.get(key);
    } catch (e) {
      return null;
    }
  }

  public set(key: string, val: any) {
    try {
      return contextService.set(key, val);
    } catch (e) {
      return null;
    }
  }
}
