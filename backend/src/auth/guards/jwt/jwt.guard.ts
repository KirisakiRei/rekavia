import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtGuard extends AuthGuard("jwt") {
    handleRequest<TUser = any>(
        err: Error | null,
        user: TUser | false,
        info: { message?: string } | undefined,
        context: ExecutionContext,
        status?: number,
    ): TUser {
        if (err || !user) {
            const message = info?.message?.toLowerCase().includes('expired')
                ? 'Sesi login Anda sudah berakhir. Silakan masuk kembali.'
                : 'Sesi login Anda tidak valid atau sudah berakhir. Silakan masuk kembali.';
            throw new UnauthorizedException(message);
        }
        return user;
    }
}
