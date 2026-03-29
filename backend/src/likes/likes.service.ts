import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Like, LikeDocument } from '../schemas/like.schema';
import { PostsService } from '../posts/posts.service';

@Injectable()
export class LikesService {
  constructor(
    @InjectModel(Like.name) private likeModel: Model<LikeDocument>,
    private postsService: PostsService,
  ) {}

  async toggle(userId: string, postId: string) {
    const existing = await this.likeModel.findOne({ userId: userId as any, postId: postId as any });

    if (existing) {
      await this.likeModel.findByIdAndDelete(existing._id);
      await this.postsService.incrementLikes(postId, -1);
      return { liked: false };
    } else {
      const like = new this.likeModel({ userId, postId });
      await like.save();
      await this.postsService.incrementLikes(postId, 1);
      return { liked: true };
    }
  }

  async isLiked(userId: string, postId: string) {
    const like = await this.likeModel.findOne({ userId: userId as any, postId: postId as any });
    return { liked: !!like };
  }
}
