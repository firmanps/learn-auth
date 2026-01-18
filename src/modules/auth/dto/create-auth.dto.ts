import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator"
export class CreateAuthDto{
   @IsNotEmpty()
   @IsString()
   @MaxLength(50)
   username: string

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