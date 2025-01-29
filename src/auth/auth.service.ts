import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto, LoginUserDto } from './dto/';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  private readonly logger = new Logger(AuthService.name);

  async create(createUserDto: CreateUserDto) {
    try {
      const { password, ...userData } = createUserDto;

      // Encripta la contraseña antes de guardar
      const hashedPassword = await bcrypt.hash(password, 10);

      // Crea el usuario en la base de datos usando Prisma
      const user = await this.prisma.user.create({
        data: {
          ...userData,
          password: hashedPassword,
        },
      });
      // Elimina la contraseña del objeto antes de retornarlo
      const { password: _, ...safeUser } = user;

      // Genera un token JWT
      const token = this.getJwtToken({
        email: safeUser.email,
        id: safeUser.id,
      });

      return { ...safeUser, token };
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const { password, email } = loginUserDto;

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) throw new UnauthorizedException('Invalid credentials');

    if (!bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException('Invalid credentials');

    return {
      ...user,
      token: this.getJwtToken({ email: user.email, id: user.id }),
    };
  }

  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }

  private handleDBErrors(error: any): never {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    if (error.code === 'P2002') {
      throw new BadRequestException('Email already exists');
    }

    this.logger.error({ error });

    throw new InternalServerErrorException('Something went wrong');
  }
}
