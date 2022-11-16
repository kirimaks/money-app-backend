import * as Yup from 'yup';
export declare const signInBodySchema: import("yup/lib/object").OptionalObjectSchema<{
    email: Yup.StringSchema<string | undefined, import("yup/lib/types").AnyObject, string | undefined>;
    password: import("yup/lib/string").RequiredStringSchema<string | undefined, import("yup/lib/types").AnyObject>;
}, import("yup/lib/object").AnyObject, import("yup/lib/object").TypeOfShape<{
    email: Yup.StringSchema<string | undefined, import("yup/lib/types").AnyObject, string | undefined>;
    password: import("yup/lib/string").RequiredStringSchema<string | undefined, import("yup/lib/types").AnyObject>;
}>>;
export declare class SignInBody implements Yup.InferType<typeof signInBodySchema> {
    email: string;
    password: string;
}
export declare class SignUpDTO {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}
