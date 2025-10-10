import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';
import * as zxcvbn from 'zxcvbn';

export function IsStrongPassword(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isStrongPassword',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, _args: ValidationArguments) {
          if (typeof value !== 'string') {
            return false;
          }

          const result = zxcvbn.default(value);
          // Requer força de pelo menos 3 (boa) em uma escala de 0-4
          return result.score >= 3;
        },
        defaultMessage(args: ValidationArguments) {
          const result = zxcvbn.default(args.value);
          let message = 'Password is too weak. ';

          if (result.feedback.warning) {
            message += result.feedback.warning + '. ';
          }

          if (result.feedback.suggestions.length > 0) {
            message += 'Suggestions: ' + result.feedback.suggestions.join(', ');
          }

          return message;
        },
      },
    });
  };
}