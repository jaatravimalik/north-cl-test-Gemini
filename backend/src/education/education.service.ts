import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Education, EducationDocument } from '../schemas/education.schema';
import { CreateEducationDto } from './dto/create-education.dto';

@Injectable()
export class EducationService {
  constructor(
    @InjectModel(Education.name) private eduModel: Model<EducationDocument>,
  ) {}

  async findByUser(userId: string) {
    const list = await this.eduModel.find({ userId: userId as any }).lean();
    return list.map((e: any) => ({ ...e, id: e._id.toString() }));
  }

  async create(userId: string, dto: CreateEducationDto) {
    const edu = new this.eduModel({ ...dto, userId });
    const saved = await edu.save();
    return { ...saved.toObject({ virtuals: true }), id: saved._id.toString() };
  }

  async update(userId: string, id: string, dto: CreateEducationDto) {
    if (!Types.ObjectId.isValid(id)) throw new BadRequestException('Invalid ID');
    const edu = await this.eduModel.findById(id);
    if (!edu) throw new NotFoundException('Education not found');
    if (edu.userId.toString() !== userId) throw new ForbiddenException();
    
    Object.assign(edu, dto);
    const saved = await edu.save();
    return { ...saved.toObject({ virtuals: true }), id: saved._id.toString() };
  }

  async remove(userId: string, id: string) {
    if (!Types.ObjectId.isValid(id)) throw new BadRequestException('Invalid ID');
    const edu = await this.eduModel.findById(id);
    if (!edu) throw new NotFoundException('Education not found');
    if (edu.userId.toString() !== userId) throw new ForbiddenException();
    
    await this.eduModel.findByIdAndDelete(id);
    return { deleted: true };
  }
}
