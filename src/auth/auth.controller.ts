import { Controller, Post, Body, UsePipes, ValidationPipe } from "@nestjs/common";
import { AuthService } from "./auth.service";
import FormatValidation from "../helper/validation-format";
import { AuthDto } from "./dto/auth.dto";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post()
    @UsePipes(new ValidationPipe({ exceptionFactory: FormatValidation }))
    async auth(@Body() authDto: AuthDto) {
        return this.authService.auth(authDto);
    }
    
  }