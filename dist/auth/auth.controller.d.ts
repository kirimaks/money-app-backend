import { AuthService } from './auth.service';
import { SignUpDTO, SignInBody } from './auth.validation';
export declare class AuthController {
    authService: AuthService;
    constructor(authService: AuthService);
    root(): string;
    signUp(signUpDTO: SignUpDTO): string;
    signIn(signInBody: SignInBody): string;
}
