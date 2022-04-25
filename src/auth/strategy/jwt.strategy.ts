import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private config: ConfigService, private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get('JWT_SECRET'),
    });
  }

  async validate (payload: {sub: number, email: string}) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: payload.sub
      }
    });

    delete user.hash;

    return user;
  }
};