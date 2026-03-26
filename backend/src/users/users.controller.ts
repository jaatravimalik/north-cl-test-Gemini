import {
  Controller,
  Get,
  Put,
  Param,
  Body,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
  Post,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuid } from 'uuid';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';

const multerOptions = {
  storage: diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => {
      const name = uuid() + extname(file.originalname);
      cb(null, name);
    },
  }),
};

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@Request() req) {
    return this.usersService.findById(req.user.id);
  }

  @Get(':id')
  getUser(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put('me')
  updateProfile(@Request() req, @Body() dto: UpdateUserDto) {
    return this.usersService.updateProfile(req.user.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('me/avatar')
  @UseInterceptors(FileInterceptor('avatar', multerOptions))
  uploadAvatar(@Request() req, @UploadedFile() file: Express.Multer.File) {
    return this.usersService.updateAvatar(req.user.id, file.filename);
  }

  @UseGuards(JwtAuthGuard)
  @Post('me/cover')
  @UseInterceptors(FileInterceptor('cover', multerOptions))
  uploadCover(@Request() req, @UploadedFile() file: Express.Multer.File) {
    return this.usersService.updateCover(req.user.id, file.filename);
  }
}
