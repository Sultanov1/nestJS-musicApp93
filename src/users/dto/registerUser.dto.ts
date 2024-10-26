import { IsEmail, IsNotEmpty, IsStrongPassword, MinLength } from 'class-validator';
import { UniqueUserEmail } from '../validators/uniqueUserEmail.validator';

export class RegisterUserDto {
  @IsEmail()
  @UniqueUserEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  @IsStrongPassword()
  password: string;

  displayName: string;
}