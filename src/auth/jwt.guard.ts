// import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
// import { Observable } from 'rxjs';
// import { JwtService } from '@nestjs/jwt';
// import { Request } from 'express';

// @Injectable()
// export class JwtGuard implements CanActivate {
//   constructor(private jwtService: JwtService) {}

//   canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
//     const request = context.switchToHttp().getRequest<Request>(); 
//     const token = this.extractTokenFromHeader(request);
  
//     console.log('Extracted Token:', token); // 🔍 Debug log
  
//     if (!token) {
//       console.log('No token found');
//       return false;
//     }
  
//     try {
//       const decoded = this.jwtService.verify(token);
//       console.log('Decoded Token:', decoded); // 🔍 Debug log
//       (request as any).user = decoded;
//       return true;
//     } catch (error) {
//       console.error('JWT Verification Failed:', error.message);
//       return false;
//     }
//   }
  

//   private extractTokenFromHeader(request: Request): string | null {
//     const authHeader = request.headers['authorization'];
//     if (authHeader && authHeader.startsWith('Bearer ')) {
//       return authHeader.split(' ')[1];
//     }
//     return null;
//   }
// }
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const decoded = this.jwtService.verify(token);

      // Reject tokens that are meant for password reset only
      if (decoded.type === 'reset') {
        throw new UnauthorizedException('Invalid token type');
      }

      (request as any).user = decoded;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
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
