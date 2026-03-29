import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment, CommentDocument } from '../schemas/comment.schema';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
  ) {}

  async findByPost(postId: string) {
    const comments = await this.commentModel.find({ postId: postId as any }).populate('userId').sort({ createdAt: 1 }).lean();
    return comments.map((c: any) => {
      const mappedUser = c.userId ? { ...c.userId, id: c.userId._id?.toString() } : null;
      return {
        ...c,
        id: c._id.toString(),
        user: mappedUser,
        userId: mappedUser?.id,
      };
    });
  }

  async create(userId: string, postId: string, content: string) {
    const comment = new this.commentModel({ userId, postId, content });
    const saved = await comment.save();
    return this.commentModel.findById(saved._id).populate('userId').lean().then((c: any) => {
      const mappedUser = c.userId ? { ...c.userId, id: c.userId._id?.toString() } : null;
      return {
        ...c,
        id: c._id.toString(),
        user: mappedUser,
        userId: mappedUser?.id,
      };
    });
  }
}
