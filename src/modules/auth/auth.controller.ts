import {
  BadRequestException,
  Body,
  Controller,
  UseInterceptors,
  UploadedFile,
  HttpCode,
  Post,
} from '@nestjs/common';
import * as firebase from 'firebase-admin';
import { AuthService } from './auth.service';
import { getFirestore } from 'firebase-admin/firestore';
import {
  LoginBodyWithEmailDTO,
  LoginResponseDTO,
  LogoutDTO,
  LogoutResponse,
  UserRegisterDTO,
} from './auth.dto';
import { LoginStatusEnum } from 'src/enum';
import {
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiConsumes,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { HttpStatus, HttpException } from '@nestjs/common';

@Controller('auth')
@ApiTags('authenticate')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async register(
    @UploadedFile() file: Express.Multer.File,
    @Body() data: UserRegisterDTO,
  ): Promise<void> {
    try {
      const auth = await firebase.auth().verifyIdToken(data.accessToken);
      const email = auth.email;
      const user = await this.authService.validateUser(email);
      if (user) {
        throw new HttpException('Existed!', HttpStatus.BAD_REQUEST);
      }
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('login/email')
  @ApiOkResponse({ type: LoginResponseDTO })
  @HttpCode(200)
  async loginWithGoogle(
    @Body() data: LoginBodyWithEmailDTO,
  ): Promise<LoginResponseDTO> {
    if (data !== null) {
      try {
        const auth = await firebase.auth().verifyIdToken(data.accessToken);
        const email = auth.email;
        const account = await this.authService.validateUser(email);
        if (account) {
          return {
            status: LoginStatusEnum.SUCCESS,
          };
        } else {
          return {
            status: LoginStatusEnum.NEWER,
          };
        }
      } catch (error) {
        throw new BadRequestException(error);
      }
    } else {
      throw new BadRequestException();
    }
  }

  @Post('logout')
  @ApiOperation({ description: 'Logout' })
  @HttpCode(200)
  async logout(@Body() data: LogoutDTO): Promise<LogoutResponse> {
    await this.authService.removeRefreshToken(data.id);
    await getFirestore()
      .collection('fcm')
      .where('id', '==', data.id)
      .where('fcm', '==', data.fcmToken)
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          doc.ref.delete();
        });
      });
    return {
      status: 'ok',
    };
  }
}
