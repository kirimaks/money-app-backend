import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

import type { JWTSignPayload, UserInRequest } from './auth.types';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: 'SOME_JWT_SECRET'
        });
    }

    validate(payload: JWTSignPayload):UserInRequest {
        return { 
            email: payload.sub.email,
            id: payload.sub.id 
        };
    }
}
