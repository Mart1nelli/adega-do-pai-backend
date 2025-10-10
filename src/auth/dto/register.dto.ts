import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { IsStrongPassword } from '../../utils/password.validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsStrongPassword()
  password: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  phone?: string;
}