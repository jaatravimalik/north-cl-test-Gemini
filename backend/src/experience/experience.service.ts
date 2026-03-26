import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Experience } from '../entities/experience.entity';
import { CreateExperienceDto } from './dto/create-experience.dto';

@Injectable()
export class ExperienceService {
  constructor(
    @InjectRepository(Experience)
    private expRepository: Repository<Experience>,
  ) {}

  async findByUser(userId: string) {
    return this.expRepository.find({ where: { userId }, order: { startDate: 'DESC' } });
  }

  async create(userId: string, dto: CreateExperienceDto) {
    const exp = this.expRepository.create({ ...dto, userId });
    return this.expRepository.save(exp);
  }

  async update(userId: string, id: string, dto: CreateExperienceDto) {
    const exp = await this.expRepository.findOne({ where: { id } });
    if (!exp) throw new NotFoundException('Experience not found');
    if (exp.userId !== userId) throw new ForbiddenException();
    Object.assign(exp, dto);
    return this.expRepository.save(exp);
  }

  async remove(userId: string, id: string) {
    const exp = await this.expRepository.findOne({ where: { id } });
    if (!exp) throw new NotFoundException('Experience not found');
    if (exp.userId !== userId) throw new ForbiddenException();
    await this.expRepository.remove(exp);
    return { deleted: true };
  }
}
