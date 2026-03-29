import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Rating, RatingDocument } from '../schemas/rating.schema';
import { CreateRatingDto } from './dto/create-rating.dto';

@Injectable()
export class RatingsService {
  constructor(
    @InjectModel(Rating.name) private ratingModel: Model<RatingDocument>,
  ) {}

  async findByBusiness(businessId: string) {
    const ratings = await this.ratingModel.find({ businessId: businessId as any }).populate('userId').sort({ createdAt: -1 }).lean();
    return ratings.map((r: any) => {
      const mappedUser = r.userId ? { ...r.userId, id: r.userId._id?.toString() } : null;
      return {
        ...r,
        id: r._id.toString(),
        user: mappedUser,
        userId: mappedUser?.id,
      };
    });
  }

  async createOrUpdate(userId: string, businessId: string, dto: CreateRatingDto) {
    let rating = await this.ratingModel.findOne({ userId: userId as any, businessId: businessId as any });

    if (rating) {
      rating.stars = dto.stars;
      if (dto.review) rating.review = dto.review;
      await rating.save();
    } else {
      rating = new this.ratingModel({
        userId,
        businessId,
        stars: dto.stars,
        review: dto.review,
      });
      await rating.save();
    }

    return this.ratingModel.findById(rating._id).populate('userId').lean().then((r: any) => {
      const mappedUser = r.userId ? { ...r.userId, id: r.userId._id?.toString() } : null;
      return {
        ...r,
        id: r._id.toString(),
        user: mappedUser,
        userId: mappedUser?.id,
      };
    });
  }

  async remove(userId: string, id: string) {
    if (!Types.ObjectId.isValid(id)) throw new BadRequestException('Invalid ID');
    const rating = await this.ratingModel.findById(id);
    if (!rating) throw new NotFoundException('Rating not found');
    if (rating.userId.toString() !== userId) throw new ForbiddenException();
    await this.ratingModel.findByIdAndDelete(id);
    return { deleted: true };
  }
}
