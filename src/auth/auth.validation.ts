import * as Yup from 'yup';


export const signInBodySchema = Yup.object({
    email: Yup.string().email().required(),
    password: Yup.string().required(),
});

export class SignInBody implements Yup.InferType<typeof signInBodySchema> {
    email: string;
    password: string;
}

export const signUpBodySchema = Yup.object({
    firstName: Yup.string(),
    lastName: Yup.string(),
    email: Yup.string().email().required(),
    password: Yup.string().required(),
});

export class SignUpDTO implements Yup.InferType<typeof signUpBodySchema> {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}
