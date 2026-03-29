import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Experience, ExperienceDocument } from '../schemas/experience.schema';
import { CreateExperienceDto } from './dto/create-experience.dto';

@Injectable()
export class ExperienceService {
  constructor(
    @InjectModel(Experience.name) private expModel: Model<ExperienceDocument>,
  ) {}

  async findByUser(userId: string) {
    const list = await this.expModel.find({ userId: userId as any }).sort({ startDate: -1 }).lean();
    return list.map((e: any) => ({ ...e, id: e._id.toString() }));
  }

  async create(userId: string, dto: CreateExperienceDto) {
    const exp = new this.expModel({ ...dto, userId });
    const saved = await exp.save();
    return { ...saved.toObject({ virtuals: true }), id: saved._id.toString() };
  }

  async update(userId: string, id: string, dto: CreateExperienceDto) {
    if (!Types.ObjectId.isValid(id)) throw new BadRequestException('Invalid ID');
    const exp = await this.expModel.findById(id);
    if (!exp) throw new NotFoundException('Experience not found');
    if (exp.userId.toString() !== userId) throw new ForbiddenException();
    
    Object.assign(exp, dto);
    const saved = await exp.save();
    return { ...saved.toObject({ virtuals: true }), id: saved._id.toString() };
  }

  async remove(userId: string, id: string) {
    if (!Types.ObjectId.isValid(id)) throw new BadRequestException('Invalid ID');
    const exp = await this.expModel.findById(id);
    if (!exp) throw new NotFoundException('Experience not found');
    if (exp.userId.toString() !== userId) throw new ForbiddenException();
    
    await this.expModel.findByIdAndDelete(id);
    return { deleted: true };
  }
}
