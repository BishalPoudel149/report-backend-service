import { Injectable, Res, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { DatabaseService } from './database.service';
import {Base64} from 'js-base64'

@Injectable()
export class UserService {
  private readonly jwtSecret = 'secret@123'; // Replace with your secret key

  constructor(private readonly dbService: DatabaseService) {}

  async login(email: string, password: string) :Promise<{ userName:string,userEmail:string,accessToken: string }>{
    // Fetch user from the database
    const user = await this.dbService.findUserByEmail(email);
    
    if (!user) {
      throw new UnauthorizedException('Invalid Username');
    }

    console.log(user.PASSWORD);

     // Decode the stored Base64 password
  const decodedPassword = Base64.decode(user.PASSWORD);

  console.log(decodedPassword);

  // Compare the provided password with the decoded password
  if (password !== decodedPassword) {
    throw new UnauthorizedException('Invalid credentials');
  }

    // Generate JWT token

    const userName=user.CUSTOMERNAME;
    const userEmail=email;
    const payload = { email: user.EMAIL, sub: user.ID };
    const accessToken = jwt.sign(payload, this.jwtSecret, { expiresIn: '24h' });

    return { userName,userEmail,accessToken };
  }

  async logout(token: string): Promise<void> {
    // Here, you would typically invalidate the token
    // For a stateless JWT, you can't "invalidate" it directly, but you can implement token blacklisting
    // For simplicity, this function could store the token in a blacklist or just do nothing.
    console.log(`Logout token: ${token}`);
  }
}
