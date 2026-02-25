import { IsNotEmpty, IsString } from 'class-validator';
import { IsStrongPassword } from '../../utils/password.validator';

export class ChangePasswordDto {
  @IsNotEmpty()
  @IsString()
  currentPassword: string;

  @IsNotEmpty()
  @IsString()
  @IsStrongPassword()
  newPassword: string;
}
