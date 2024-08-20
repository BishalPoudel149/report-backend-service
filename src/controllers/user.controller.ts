import { Body, Controller, Post, Req, Res, UnauthorizedException } from "@nestjs/common";
import { ResponseFormatter } from "src/services/responseFormatter";
import { UserService } from "src/services/user.service";


@Controller('user')
export class UserController{
    constructor(private readonly userService: UserService) {}

    @Post('login')
    async login(@Body('email') email: string, @Body('password') password: string, @Res() res) {
      try {
        const { userName,userEmail,accessToken } = await this.userService.login(email, password);

        const formattedReponse = ResponseFormatter.success(
            {
            name:userName,
            email:userEmail,
            accessToken:accessToken,
            },
            'Login successful'
        )
        return res.json(formattedReponse );
      } catch (error) {
        const formattedErrorResponse = ResponseFormatter.error('Invalid credentials', 401);
        return res.status(401).json(formattedErrorResponse);      }
    }
  
    @Post('logout')
    async logout(@Req() req, @Res() res) {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        const formattedErrorResponse = ResponseFormatter.error('No token provided', 400);
        return res.status(400).json(formattedErrorResponse);      }
  
      await this.userService.logout(token);
      const formattedResponse = ResponseFormatter.success(null, 'Logged out successfully');
      return res.status(200).json(formattedResponse);    }
}