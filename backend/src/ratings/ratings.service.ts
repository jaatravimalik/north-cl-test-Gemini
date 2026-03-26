import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rating } from '../entities/rating.entity';
import { CreateRatingDto } from './dto/create-rating.dto';

@Injectable()
export class RatingsService {
  constructor(
    @InjectRepository(Rating)
    private ratingsRepository: Repository<Rating>,
  ) {}

  async findByBusiness(businessId: string) {
    return this.ratingsRepository.find({
      where: { businessId },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async createOrUpdate(userId: string, businessId: string, dto: CreateRatingDto) {
    let rating = await this.ratingsRepository.findOne({
      where: { userId, businessId },
    });

    if (rating) {
      rating.stars = dto.stars;
      rating.review = dto.review || rating.review;
    } else {
      rating = this.ratingsRepository.create({
        userId,
        businessId,
        stars: dto.stars,
        review: dto.review,
      });
    }

    const saved = await this.ratingsRepository.save(rating);
    return this.ratingsRepository.findOne({
      where: { id: saved.id },
      relations: ['user'],
    });
  }

  async remove(userId: string, id: string) {
    const rating = await this.ratingsRepository.findOne({ where: { id } });
    if (!rating) throw new NotFoundException('Rating not found');
    if (rating.userId !== userId) throw new ForbiddenException();
    await this.ratingsRepository.remove(rating);
    return { deleted: true };
  }
}
