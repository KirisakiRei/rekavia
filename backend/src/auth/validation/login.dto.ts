import { IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, MinLength } from "class-validator";

export class LoginDTO {
    @IsNotEmpty()
    @IsString()
    identifier: string;

    @IsNotEmpty()
    @IsString()
    password: string;
}

export class RefreshTokenDTO {
    @IsNotEmpty()
    @IsString()
    accountId: string; 

    @IsNotEmpty()
    @IsString()
    refresh_token: string
}

export class RegisterDTO {
    @IsOptional()
    @IsString({message : "username harus bertipe string"})
    username?: string;

    @IsNotEmpty({message : "password harus diisi"})
    @IsString({message : "password harus bertipe string"})
    @MinLength(6, {message : "password minimal 6 karakter"})
    password: string;

    @IsNotEmpty({message : "nama harus diisi"})
    @IsString({message : "nama harus bertipe string"})
    name: string;

    @IsNotEmpty({message : "email harus diisi"})
    @IsString({message : "email harus bertipe string"})
    @IsEmail({}, {message : "harus sesuai dengan format email"})
    email: string;

    @IsOptional()
    @IsString({message : "alamat harus bertipe string"})
    address?: string;

    @IsOptional()
    @IsString({message : "nomor telefon harus bertipe string"})
    @IsPhoneNumber("ID",{message : "nomor telefon harus sesuai format dimulai dari +62"})
    phone_number?: string;
}