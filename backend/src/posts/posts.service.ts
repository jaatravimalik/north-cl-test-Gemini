import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Post, PostDocument } from '../schemas/post.schema';
import { Comment, CommentDocument } from '../schemas/comment.schema';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
  ) {}

  async getFeed(page = 1, limit = 10) {
    const total = await this.postModel.countDocuments();
    const posts = await this.postModel
      .find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('userId')
      .lean();

    const mappedPosts = await Promise.all(posts.map(async (p: any) => {
      const pId = p._id.toString();
      const commentsCount = await this.commentModel.countDocuments({ postId: pId as any });
      
      const mappedUser = p.userId ? { ...p.userId, id: p.userId._id?.toString() } : null;
      
      return {
        ...p,
        id: pId,
        user: mappedUser,
        userId: mappedUser?.id,
        commentsCount,
      };
    }));

    return {
      posts: mappedPosts,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async create(userId: string, content: string, imageUrl?: string) {
    const post = new this.postModel({ userId, content, imageUrl });
    const saved = await post.save();
    return this.postModel.findById(saved._id).populate('userId').lean().then((p: any) => {
      const mappedUser = p.userId ? { ...p.userId, id: p.userId._id?.toString() } : null;
      return {
        ...p,
        id: p._id.toString(),
        user: mappedUser,
        userId: mappedUser?.id
      };
    });
  }

  async findById(id: string) {
    if (!Types.ObjectId.isValid(id)) throw new BadRequestException('Invalid ID');
    
    const post: any = await this.postModel.findById(id).populate('userId').lean();
    if (!post) throw new NotFoundException('Post not found');
    
    const comments: any = await this.commentModel.find({ postId: id as any }).populate('userId').lean();
    
    const mappedComments = comments.map(c => {
      const mappedUser = c.userId ? { ...c.userId, id: c.userId._id?.toString() } : null;
      return {
        ...c,
        id: c._id.toString(),
        user: mappedUser,
        userId: mappedUser?.id,
      };
    });

    const mappedPostUser = post.userId ? { ...post.userId, id: post.userId._id?.toString() } : null;

    return {
      ...post,
      id: post._id.toString(),
      user: mappedPostUser,
      userId: mappedPostUser?.id,
      comments: mappedComments,
    };
  }

  async remove(userId: string, id: string) {
    if (!Types.ObjectId.isValid(id)) throw new BadRequestException('Invalid ID');
    const post = await this.postModel.findById(id);
    if (!post) throw new NotFoundException('Post not found');
    if (post.userId.toString() !== userId) throw new ForbiddenException();
    await this.postModel.findByIdAndDelete(id);
    return { deleted: true };
  }

  async incrementLikes(postId: string, delta: number) {
    if (!Types.ObjectId.isValid(postId)) return;
    await this.postModel.findByIdAndUpdate(postId, { $inc: { likesCount: delta } });
  }
}
