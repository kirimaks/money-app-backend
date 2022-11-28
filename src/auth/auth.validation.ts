import { z as Zod } from 'zod';

const NAME_MAX_LENGTH = 24;
const MIN_PASSWORD_LENGH = 8;

export const signInBodySchema = Zod.object({
  email: Zod.string({
    required_error: 'Email required',
  }).email({
    message: 'Invalid email address',
  }),
  password: Zod.string({
    required_error: 'Password required',
  }),
});

export class SignInDTO implements Zod.infer<typeof signInBodySchema> {
  email: string;
  password: string;
}

export const signUpBodySchema = Zod.object({
  firstName: Zod.string().max(NAME_MAX_LENGTH).default(''),
  lastName: Zod.string().max(NAME_MAX_LENGTH).default(''),

  email: Zod.string({
    required_error: 'Email required',
  }).email({
    message: 'Invalid email address',
  }),

  password: Zod.string({
    required_error: 'Password required',
  })
    .min(MIN_PASSWORD_LENGH, `Minimum password length is ${MIN_PASSWORD_LENGH}`)
    .refine((val) => val.match(/\d+/), {
      message: 'Passwourd should container number',
    })
    .refine((val) => val.match(/[A-Z]/), {
      message: 'Password should container upper case letters',
    })
    .refine((val) => val.match(/[a-z]/), {
      message: 'Password should contain lower case letters',
    })
    .refine((val) => val.match(/[0-9]/), {
      message: 'Password should contain numbers',
    }),

  confirm: Zod.string({
    required_error: 'Password confirmation required',
  }),

  accountName: Zod.string().max(NAME_MAX_LENGTH).default(''),

}).refine((data) => data.password === data.confirm, {
  message: "Passwords don't match",
  path: ['confirm'],
});

export class SignUpDTO implements Zod.infer<typeof signUpBodySchema> {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirm: string;
  accountName: string;
}
