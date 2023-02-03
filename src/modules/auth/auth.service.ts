import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  async validateUser(phoneNumber: string): Promise<null> {
    // Logic validate user
    return null;
  }

  async removeRefreshToken(id: number): Promise<null> {
    return null;
  }
}
