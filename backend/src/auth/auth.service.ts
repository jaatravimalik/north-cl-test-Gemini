import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from '../schemas/user.schema';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.userModel.findOne({ email: dto.email });
    if (existing) {
      throw new ConflictException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = new this.userModel({
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
      phone: dto.phone,
      city: dto.city,
      state: dto.state,
    });
    const savedUser = await user.save();

    const tokens = this.generateTokens(savedUser);
    return {
      user: this.sanitizeUser(savedUser.toObject({ virtuals: true })),
      ...tokens,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.userModel.findOne({ email: dto.email }).select('+password');
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = this.generateTokens(user);
    return {
      user: this.sanitizeUser(user.toObject({ virtuals: true })),
      ...tokens,
    };
  }

  async refresh(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET || 'defaultRefreshSecret',
      });
      const user = await this.userModel.findById(payload.sub);
      if (!user) {
        throw new UnauthorizedException();
      }
      const tokens = this.generateTokens(user);
      return {
        user: this.sanitizeUser(user.toObject({ virtuals: true })),
        ...tokens,
      };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  private generateTokens(user: any) {
    const payload = { sub: user.id || user._id.toString(), email: user.email };
    return {
      accessToken: this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET || 'defaultSecret',
        expiresIn: process.env.JWT_EXPIRATION || '15m',
      }),
      refreshToken: this.jwtService.sign(payload, {
        secret: process.env.JWT_REFRESH_SECRET || 'defaultRefreshSecret',
        expiresIn: process.env.JWT_REFRESH_EXPIRATION || '7d',
      }),
    };
  }

  private sanitizeUser(user: any) {
    const { password, _id, __v, ...result } = user;
    if (!result.id && _id) result.id = _id.toString();
    return result;
  }
}
