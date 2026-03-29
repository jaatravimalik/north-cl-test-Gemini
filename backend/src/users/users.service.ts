import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { Experience, ExperienceDocument } from '../schemas/experience.schema';
import { Education, EducationDocument } from '../schemas/education.schema';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Experience.name) private experienceModel: Model<ExperienceDocument>,
    @InjectModel(Education.name) private educationModel: Model<EducationDocument>,
  ) {}

  async findByEmail(email: string) {
    return this.userModel.findOne({ email }).select('+password');
  }

  async create(user: any) {
    const newUser = new this.userModel(user);
    return newUser.save();
  }

  async findById(id: string) {
    if (!Types.ObjectId.isValid(id)) throw new BadRequestException('Invalid ID');
    
    const user = await this.userModel.findById(id).populate('followers').populate('following').lean();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    
    const experiences = await this.experienceModel.find({ userId: id as any }).lean();
    const educations = await this.educationModel.find({ userId: id as any }).lean();
    
    return { ...user, experiences, educations, id: user._id.toString() };
  }

  async updateProfile(userId: string, dto: UpdateUserDto) {
    await this.userModel.findByIdAndUpdate(userId, dto, { new: true });
    return this.findById(userId);
  }

  async updateAvatar(userId: string, filename: string) {
    await this.userModel.findByIdAndUpdate(userId, { avatar: `/uploads/${filename}` });
    return this.findById(userId);
  }

  async updateCover(userId: string, filename: string) {
    await this.userModel.findByIdAndUpdate(userId, { cover: `/uploads/${filename}` });
    return this.findById(userId);
  }

  async followUser(currentUserId: string, targetUserId: string) {
    if (currentUserId === targetUserId) {
      throw new ForbiddenException("Cannot follow yourself");
    }
    
    const currentUser = await this.userModel.findById(currentUserId);
    const targetUser = await this.userModel.findById(targetUserId);
    
    if (!targetUser || !currentUser) {
      throw new NotFoundException('User not found');
    }
    
    if (!currentUser.following.find(id => id.toString() === targetUserId)) {
      currentUser.following.push(targetUser._id as any);
      targetUser.followers.push(currentUser._id as any);
      await currentUser.save();
      await targetUser.save();
    }
    return { success: true };
  }

  async unfollowUser(currentUserId: string, targetUserId: string) {
    const currentUser = await this.userModel.findById(currentUserId);
    const targetUser = await this.userModel.findById(targetUserId);
    
    if (!currentUser || !targetUser) throw new NotFoundException('User not found');
    
    currentUser.following = currentUser.following.filter(id => id.toString() !== targetUserId);
    targetUser.followers = targetUser.followers.filter(id => id.toString() !== currentUserId);
    
    await currentUser.save();
    await targetUser.save();
    
    return { success: true };
  }
}
