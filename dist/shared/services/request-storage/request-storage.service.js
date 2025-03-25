"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestStorageService = void 0;
const common_1 = require("@nestjs/common");
const contextService = require('request-context');
let RequestStorageService = class RequestStorageService {
    get(key) {
        try {
            return contextService.get(key);
        }
        catch (e) {
            return null;
        }
    }
    set(key, val) {
        try {
            return contextService.set(key, val);
        }
        catch (e) {
            return null;
        }
    }
};
exports.RequestStorageService = RequestStorageService;
exports.RequestStorageService = RequestStorageService = __decorate([
    (0, common_1.Injectable)()
], RequestStorageService);
//# sourceMappingURL=request-storage.service.js.map