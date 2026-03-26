import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Business } from '../entities/business.entity';
import { CreateBusinessDto } from './dto/create-business.dto';

@Injectable()
export class BusinessService {
  constructor(
    @InjectRepository(Business)
    private bizRepository: Repository<Business>,
  ) {}

  async findAll(query?: string, category?: string) {
    const where: any = {};
    if (category) {
      where.category = category;
    }
    if (query) {
      where.name = ILike(`%${query}%`);
    }

    const businesses = await this.bizRepository.find({
      where,
      relations: ['owner', 'ratings'],
      order: { createdAt: 'DESC' },
    });

    return businesses.map((biz) => {
      const avgRating =
        biz.ratings && biz.ratings.length > 0
          ? biz.ratings.reduce((sum, r) => sum + r.stars, 0) / biz.ratings.length
          : 0;
      return {
        ...biz,
        avgRating: Math.round(avgRating * 10) / 10,
        ratingsCount: biz.ratings?.length || 0,
        ratings: undefined,
      };
    });
  }

  async findById(id: string) {
    const biz = await this.bizRepository.findOne({
      where: { id },
      relations: ['owner', 'ratings', 'ratings.user'],
    });
    if (!biz) throw new NotFoundException('Business not found');
    const avgRating =
      biz.ratings && biz.ratings.length > 0
        ? biz.ratings.reduce((sum, r) => sum + r.stars, 0) / biz.ratings.length
        : 0;
    return {
      ...biz,
      avgRating: Math.round(avgRating * 10) / 10,
      ratingsCount: biz.ratings?.length || 0,
    };
  }

  async create(ownerId: string, dto: CreateBusinessDto, imageUrl?: string) {
    const biz = this.bizRepository.create({ ...dto, ownerId, imageUrl });
    const saved = await this.bizRepository.save(biz);
    return this.findById(saved.id);
  }
}
