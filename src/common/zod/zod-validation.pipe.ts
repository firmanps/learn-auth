import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { z } from 'zod';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private readonly schema: z.ZodTypeAny) {}

  transform(value: unknown) {
    const result = this.schema.safeParse(value);

    if (!result.success) {
      const fieldErrors: Record<string, string[]> = {};

      for (const issue of result.error.issues) {
        const key = issue.path.length ? issue.path.join('.') : '_errors';
        (fieldErrors[key] ??= []).push(issue.message);
      }

      throw new BadRequestException({
        message: 'Validation failed',
        errors: fieldErrors,
      });
    }

    return result.data;
  }
}
