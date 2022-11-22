import {
  // ArgumentMetadata,
  Injectable,
  PipeTransform,
  BadRequestException,
} from '@nestjs/common';

import { z as Zod } from 'zod';

@Injectable()
export class ZodPipe implements PipeTransform {
  constructor(private objectSchema: any) {}

  // async transform(value: unknown, metadata: ArgumentMetadata) {
  async transform(value: unknown) {
    try {
      await this.objectSchema.parseAsync(value);
    } catch (error) {
      if (error instanceof Zod.ZodError) {
        for (const issue of error.issues) {
          throw new BadRequestException(issue.message);
        }
      }

      throw new BadRequestException('Unknown validation error');
    }

    return value;
  }
}
