import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaClient } from '@prisma/client';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { ConfigService } from '@nestjs/config';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly prisma = new PrismaClient();

  constructor(configService: ConfigService) {
    const secretOrKey = configService.get<string>('JWT_SECRET');
    if (!secretOrKey) {
      throw new Error('JWT_SECRET is not defined');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey,
    });
  }

  async validate(payload: JwtPayload) {
    const { id } = payload;

    // Consulta al usuario utilizando Prisma
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    // Si el usuario no existe o no está activo, lanza una excepción
    if (!user) throw new UnauthorizedException('Token not valid');
    if (!user.isActive) throw new UnauthorizedException('User is not active');

    // Retorna el usuario (puedes omitir información sensible si es necesario)
    return user;
  }
}
