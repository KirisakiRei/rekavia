import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { DatabaseService } from 'src/database/database.service';
import { AuthTokens, LoginDTO, RegisterDTO, RegisterParameter } from './types/auth-result-type';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { Account, AuthActivity } from 'generated/prisma';
import { JwtPayload } from './types/jwt-payload.type';
import { randomBytes } from 'crypto';
import { ResponseDTO } from 'src/dto/response.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly DB: DatabaseService,
        private jwtService: JwtService,
        private config: ConfigService,
    ) {

    }

    private saltRounds(): number {
        return Number(this.config.get<number>('BCRYPT_SALT_ROUNDS') ?? 12);
    }

    private normalizeUsername(source: string): string {
        const username = source
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9._-]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '')
            .slice(0, 30);

        return username || `user-${Date.now()}`;
    }

    private async generateUniqueUsername(base: string): Promise<string> {
        const normalizedBase = this.normalizeUsername(base);
        let username = normalizedBase;
        let counter = 1;

        while (await this.DB.account.findUnique({ where: { username } })) {
            counter += 1;
            username = `${normalizedBase}-${counter}`;
        }

        return username;
    }

    async register({ username, password, email, phone_number, address, name }: RegisterParameter): Promise<RegisterDTO> {
        const emailExist = await this.DB.user.findUnique({ where: { email } });
        if (emailExist) {
            throw new ConflictException('Email sudah terdaftar. Silakan gunakan email lain atau masuk ke akun Anda.');
        }

        const baseUsername = username ?? email.split('@')[0] ?? name;
        const finalUsername = await this.generateUniqueUsername(baseUsername);

        const existUser = await this.DB.account.findUnique({ where: { username: finalUsername } });
        if (existUser) {
            throw new ConflictException(`Username ${finalUsername} sudah digunakan.`);
        }

        const hashed = await bcrypt.hash(password, this.saltRounds());

        const account = await this.DB.account.create({
            data: {
                username: finalUsername,
                password: hashed,
                role: 'user',
                User: {
                    create: {
                        name,
                        email,
                        address,
                        phone_number,
                    },
                },
            },
            include: { User: true },
        });

        if (!account.User) {
            throw new BadRequestException('Akun belum berhasil dibuat. Silakan coba lagi.');
        }

        return {
            status: "success",
            code: 200,
            message: "Akun berhasil terdaftar",
            data: account.User
        }
    }

    async validateUser(identifier: string, password: string): Promise<Account> {
        let account = await this.DB.account.findUnique({ where: { username: identifier } });

        if (!account) {
            const user = await this.DB.user.findUnique({ where: { email: identifier } });
            if (user) {
                account = await this.DB.account.findUnique({ where: { id: user.account_id } });
            }
        }

        if (!account) {
            throw new UnauthorizedException('Username atau password salah.');
        }

        if ((account as Account & { status?: string }).status === 'suspended') {
            throw new UnauthorizedException('Akun Anda sedang dinonaktifkan. Silakan hubungi admin.');
        }

        const isValid = await bcrypt.compare(password, account.password);
        if (!isValid) {
            throw new UnauthorizedException('Username atau password salah.');
        }

        return account;
    }

    private signAccessToken(account: Account): string {
        const payload: JwtPayload = { sub: account.id, username: account.username, role: account.role };
        return this.jwtService.sign(payload, {
            expiresIn: this.config.get<string>('JWT_ACCESS_EXPIRES_IN') ?? '15m',
        });
    }

    private async createAndStoreRefreshToken(accountId: string): Promise<string> {
        const raw = randomBytes(64).toString('hex'); // secure random
        const hash = await bcrypt.hash(raw, this.saltRounds());
        await this.DB.account.update({ where: { id: accountId }, data: { refresh_token_hash: hash } });
        return raw;
    }

    async login(account: Account): Promise<LoginDTO> {
        const access_token = this.signAccessToken(account);
        const refresh_token = await this.createAndStoreRefreshToken(account.id);

        await this.DB.authLog.create({ data: { account_id: account.id, activity: AuthActivity.login } });

        return {
            status: "success",
            code: 200,
            message: "Login Berhasil",
            data: {
                access_token, refresh_token
            }
        };
    }

    async refreshToken(accountId: string, providedToken: string): Promise<LoginDTO> {
        const account = await this.DB.account.findUnique({ where: { id: accountId } });
        if (!account || !account.refresh_token_hash) {
            throw new UnauthorizedException('Sesi login Anda tidak valid atau sudah berakhir. Silakan masuk kembali.');
        }

        if ((account as Account & { status?: string }).status === 'suspended') {
            await this.DB.account.update({ where: { id: accountId }, data: { refresh_token_hash: null } });
            throw new UnauthorizedException('Akun Anda sedang dinonaktifkan. Silakan hubungi admin.');
        }

        const match = await bcrypt.compare(providedToken, account.refresh_token_hash);
        if (!match) {
            // possible reuse/compromise -> revoke all
            await this.DB.account.update({ where: { id: accountId }, data: { refresh_token_hash: null } });
            throw new UnauthorizedException('Sesi login Anda tidak valid atau sudah berakhir. Silakan masuk kembali.');
        }

        // rotate refresh token
        const newRefresh = await this.createAndStoreRefreshToken(accountId);
        const access_token = this.signAccessToken(account);
        return {
            status: "success",
            code: 200,
            message: "Token Direfresh",
            data: {
                access_token, refresh_token: newRefresh
            }
        };
    }

    async logout(accountId: string): Promise<ResponseDTO> {
        await this.DB.account.update({ where: { id: accountId }, data: { refresh_token_hash: null } });
        await this.DB.authLog.create({ data: { account_id: accountId, activity: AuthActivity.logout } });
        return {
            status : "success",
            code : 200,
            message : "Logout Berhasil. Sampai Jumpa Lagi."
        };
    }


}
