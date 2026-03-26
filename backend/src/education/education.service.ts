import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Education } from '../entities/education.entity';
import { CreateEducationDto } from './dto/create-education.dto';

@Injectable()
export class EducationService {
  constructor(
    @InjectRepository(Education)
    private eduRepository: Repository<Education>,
  ) {}

  async findByUser(userId: string) {
    return this.eduRepository.find({ where: { userId } });
  }

  async create(userId: string, dto: CreateEducationDto) {
    const edu = this.eduRepository.create({ ...dto, userId });
    return this.eduRepository.save(edu);
  }

  async update(userId: string, id: string, dto: CreateEducationDto) {
    const edu = await this.eduRepository.findOne({ where: { id } });
    if (!edu) throw new NotFoundException('Education not found');
    if (edu.userId !== userId) throw new ForbiddenException();
    Object.assign(edu, dto);
    return this.eduRepository.save(edu);
  }

  async remove(userId: string, id: string) {
    const edu = await this.eduRepository.findOne({ where: { id } });
    if (!edu) throw new NotFoundException('Education not found');
    if (edu.userId !== userId) throw new ForbiddenException();
    await this.eduRepository.remove(edu);
    return { deleted: true };
  }
}
