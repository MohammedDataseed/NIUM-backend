import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  // canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
  //   const request = context.switchToHttp().getRequest<Request>(); // Explicitly type request
  //   const token = this.extractTokenFromHeader(request);

  //   if (!token) {
  //     return false;
  //   }

  //   try {
  //     const decoded = this.jwtService.verify(token);
  //     (request as any).user = decoded; // ✅ Type assertion to fix error
  //     return true;
  //   } catch (error) {
  //     return false;
  //   }
  // }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>(); 
    const token = this.extractTokenFromHeader(request);
  
    console.log('Extracted Token:', token); // 🔍 Debug log
  
    if (!token) {
      console.log('No token found');
      return false;
    }
  
    try {
      const decoded = this.jwtService.verify(token);
      console.log('Decoded Token:', decoded); // 🔍 Debug log
      (request as any).user = decoded;
      return true;
    } catch (error) {
      console.error('JWT Verification Failed:', error.message);
      return false;
    }
  }
  

  private extractTokenFromHeader(request: Request): string | null {
    const authHeader = request.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.split(' ')[1];
    }
    return null;
  }
}
