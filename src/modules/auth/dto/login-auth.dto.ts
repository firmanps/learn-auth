import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator"
export class LoginAuthDto{
   @IsNotEmpty()
   @IsEmail()
   @MaxLength(100)
   email: string

   @IsNotEmpty()
   @IsString()
   @MinLength(8)
   @MaxLength(255)
   password: string
}