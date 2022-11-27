import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

import type { JWTSignPayload } from './auth.types';
import type { UserInRequest } from '../user/user.types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  validate(payload: JWTSignPayload): UserInRequest {
    return {
      email: payload.sub.email,
      id: payload.sub.id,
    };
  }
}
