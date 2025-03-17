// jwt-strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UserService } from '../services/v1/user/user.service';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: '123456',  // Use a stronger key in production
    });
  }

  async validate(payload: JwtPayload) {
    console.log('Payload:', payload);  // Log the payload for debugging
    const { email } = payload;
    const user = await this.userService.findByEmail(email);
    console.log('User:', user);  // Log the user object for debugging

    if (!user) {
      throw new Error('Invalid token');
    }
    return user;  // Return the user object
  }
}
