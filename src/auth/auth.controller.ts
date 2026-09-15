import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from "@nestjs/common";
import { Request as ExpressRequest } from "express";
import { LocalAuthGuard } from "./guards/local-auth.guard";
@Controller("auth")
export class AuthController {
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Post("login")
  async login(@Request() req: ExpressRequest) {
    return req.user;
  }
}
