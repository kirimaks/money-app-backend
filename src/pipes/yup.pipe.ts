import { ArgumentMetadata, Injectable, PipeTransform, BadRequestException } from '@nestjs/common';
import { ObjectSchema, ValidationError } from 'yup';


@Injectable()
export class YupPipe implements PipeTransform {
    constructor(private objectSchema: {validate: (value:unknown) => void}) {}

    async transform(value: unknown, metadata: ArgumentMetadata) {
        try {
            await this.objectSchema.validate(value);

        } catch(error) {
            if (error instanceof ValidationError) {
                for (const errorText of error.errors) {
                    throw new BadRequestException(errorText);
                }
            }

            throw new BadRequestException('Validation error');
        }

        return value;
    }
}
