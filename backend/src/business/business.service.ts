import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Business, BusinessDocument } from '../schemas/business.schema';
import { Rating, RatingDocument } from '../schemas/rating.schema';
import { CreateBusinessDto } from './dto/create-business.dto';

@Injectable()
export class BusinessService {
  constructor(
    @InjectModel(Business.name) private bizModel: Model<BusinessDocument>,
    @InjectModel(Rating.name) private ratingModel: Model<RatingDocument>,
  ) {}

  async findAll(query?: string, category?: string) {
    const filter: any = {};
    if (category) filter.category = category;
    if (query) filter.name = { $regex: query, $options: 'i' };

    const businesses = await this.bizModel
      .find(filter)
      .populate('ownerId')
      .sort({ createdAt: -1 })
      .lean();

    return Promise.all(businesses.map(async (biz: any) => {
      const bizId = biz._id.toString();
      const ratings: any[] = await this.ratingModel.find({ businessId: bizId as any }).lean();
      const avgRating = ratings.length > 0
        ? ratings.reduce((sum, r) => sum + r.stars, 0) / ratings.length : 0;
      const mappedOwner = biz.ownerId ? { ...biz.ownerId, id: biz.ownerId._id?.toString() } : null;
      return {
        ...biz, id: bizId, owner: mappedOwner,
        ownerId: mappedOwner?.id,
        avgRating: Math.round(avgRating * 10) / 10,
        ratingsCount: ratings.length,
      };
    }));
  }

  /** Get all businesses owned by a specific user */
  async findByOwner(ownerId: string) {
    const businesses = await this.bizModel
      .find({ ownerId: ownerId as any })
      .sort({ createdAt: -1 })
      .lean();

    return Promise.all(businesses.map(async (biz: any) => {
      const bizId = biz._id.toString();
      const ratings: any[] = await this.ratingModel.find({ businessId: bizId as any }).lean();
      const avgRating = ratings.length > 0
        ? ratings.reduce((sum, r) => sum + r.stars, 0) / ratings.length : 0;
      return {
        ...biz, id: bizId,
        avgRating: Math.round(avgRating * 10) / 10,
        ratingsCount: ratings.length,
      };
    }));
  }

  async findById(id: string) {
    if (!Types.ObjectId.isValid(id)) throw new BadRequestException('Invalid ID');
    const biz: any = await this.bizModel.findById(id).populate('ownerId').lean();
    if (!biz) throw new NotFoundException('Business not found');

    const ratings: any[] = await this.ratingModel.find({ businessId: id as any }).populate('userId').lean();
    const mappedRatings = ratings.map((r: any) => {
      const mappedUser = r.userId ? { ...r.userId, id: r.userId._id?.toString() } : null;
      return { ...r, id: r._id.toString(), user: mappedUser, userId: mappedUser?.id };
    });

    const avgRating = ratings.length > 0
      ? ratings.reduce((sum, r) => sum + r.stars, 0) / ratings.length : 0;
    const mappedOwner = biz.ownerId ? { ...biz.ownerId, id: biz.ownerId._id?.toString() } : null;

    return {
      ...biz,
      id: biz._id.toString(),
      owner: mappedOwner,
      ownerId: mappedOwner?.id,
      avgRating: Math.round(avgRating * 10) / 10,
      ratingsCount: ratings.length,
      ratings: mappedRatings,
    };
  }

  async create(ownerId: string, dto: CreateBusinessDto, imageUrl?: string) {
    const biz = new this.bizModel({ ...dto, ownerId, imageUrl });
    const saved = await biz.save();
    return this.findById(saved._id.toString());
  }

  /** Update a business listing — owner only */
  async update(userId: string, bizId: string, dto: Partial<CreateBusinessDto>) {
    if (!Types.ObjectId.isValid(bizId)) throw new BadRequestException('Invalid ID');
    const biz = await this.bizModel.findById(bizId);
    if (!biz) throw new NotFoundException('Business not found');
    if (biz.ownerId.toString() !== userId) throw new ForbiddenException('Not your listing');
    await this.bizModel.findByIdAndUpdate(bizId, dto, { new: true });
    return this.findById(bizId);
  }

  /** Update business logo — owner only */
  async updateLogo(userId: string, bizId: string, imageUrl: string) {
    if (!Types.ObjectId.isValid(bizId)) throw new BadRequestException('Invalid ID');
    const biz = await this.bizModel.findById(bizId);
    if (!biz) throw new NotFoundException('Business not found');
    if (biz.ownerId.toString() !== userId) throw new ForbiddenException('Not your listing');
    await this.bizModel.findByIdAndUpdate(bizId, { imageUrl }, { new: true });
    return this.findById(bizId);
  }
}
