import {forwardRef, Module} from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {JwtModule} from "@nestjs/jwt";
import {JWTAuthGuard} from "./guards/jwt-guard";
import {JwtStrategy} from "./guards/jwt-strategy";
import {RolesGuard} from "./guards/roles.guard";
import {UserService} from "../user/user.service";
import {UserModule} from "../user/user.module";

@Module({
  imports: [
      forwardRef(() => UserModule),
      JwtModule.registerAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: async (configService: ConfigService) => ({
          secret: configService.get('JWT_SECRET'),
          signOptions: {expiresIn: '10000s'}
        })
      })
  ],
  controllers: [AuthController],
  providers: [AuthService, JWTAuthGuard, JwtStrategy, RolesGuard],
  exports: [AuthService]
})
export class AuthModule {}
