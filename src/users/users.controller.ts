import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

// Sin proteger todavia: esto es lo primero que se va a "romper" a proposito
// en el video para mostrar por que hace falta autenticacion y autorizacion.
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto.email, dto.password);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }
}
