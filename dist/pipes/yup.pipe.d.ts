import { ArgumentMetadata, PipeTransform } from '@nestjs/common';
export declare class YupPipe implements PipeTransform {
    private objectSchema;
    constructor(objectSchema: {
        validate: (value: unknown) => void;
    });
    transform(value: unknown, metadata: ArgumentMetadata): Promise<unknown>;
}
