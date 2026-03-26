import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findById(id: string) {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['experiences', 'educations', 'followers', 'following'],
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async updateProfile(userId: string, dto: UpdateUserDto) {
    await this.usersRepository.update(userId, dto);
    return this.findById(userId);
  }

  async updateAvatar(userId: string, filename: string) {
    await this.usersRepository.update(userId, { avatar: `/uploads/${filename}` });
    return this.findById(userId);
  }

  async updateCover(userId: string, filename: string) {
    await this.usersRepository.update(userId, { cover: `/uploads/${filename}` });
    return this.findById(userId);
  }

  async followUser(currentUserId: string, targetUserId: string) {
    if (currentUserId === targetUserId) {
      throw new ForbiddenException("Cannot follow yourself");
    }
    
    const currentUser = await this.usersRepository.findOne({ 
      where: { id: currentUserId }, 
      relations: ['following'] 
    });
    const targetUser = await this.usersRepository.findOne({ 
      where: { id: targetUserId } 
    });
    
    if (!targetUser || !currentUser) {
      throw new NotFoundException('User not found');
    }
    
    if (!currentUser.following.find(u => u.id === targetUserId)) {
      currentUser.following.push(targetUser);
      await this.usersRepository.save(currentUser);
    }
    return { success: true };
  }

  async unfollowUser(currentUserId: string, targetUserId: string) {
    const currentUser = await this.usersRepository.findOne({ 
      where: { id: currentUserId }, 
      relations: ['following'] 
    });
    
    if (!currentUser) throw new NotFoundException('User not found');
    
    currentUser.following = currentUser.following.filter(u => u.id !== targetUserId);
    await this.usersRepository.save(currentUser);
    return { success: true };
  }
}
