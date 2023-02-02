import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { GenderEnum, LoginStatusEnum } from 'src/enum';

export class LoginBodyWithEmailDTO {
  @ApiProperty({ required: true, description: 'Access token from firebase' })
  accessToken: string;
  @ApiProperty({ required: true, description: "device's FCM token" })
  fcmToken: string;
}

export class LoginResponseDTO {
  @ApiProperty({ enum: LoginStatusEnum })
  status: LoginStatusEnum;
  @ApiProperty()
  token?: string;
  @ApiProperty()
  refreshToken?: string;
}

export class LogoutDTO {
  @ApiProperty({ required: true })
  id: number;
  @ApiProperty({ required: true, description: "device's FCM token" })
  fcmToken: string;
}

export type LogoutResponse = {
  status: string;
};

export class UserRegisterDTO {
  @ApiProperty()
  email: string;

  @ApiProperty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsString()
  lastName: string;

  @ApiProperty()
  @IsString()
  schoolName: string;

  @ApiProperty()
  @IsString()
  phoneNumber: string;

  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  fcmToken: string;

  @ApiProperty()
  @IsString()
  address: string;

  @ApiProperty()
  gender: GenderEnum;

  @ApiProperty({ type: 'string', format: 'binary' })
  file: Express.Multer.File;

  @ApiProperty()
  dateOfBirth: Date;

  @ApiProperty()
  registerTime: Date;
}
