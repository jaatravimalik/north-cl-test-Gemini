import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from './user.schema';
import { Post } from './post.schema';

export type LikeDocument = Like & Document;

@Schema({ toJSON: { virtuals: true }, toObject: { virtuals: true } })
export class Like {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: MongooseSchema.Types.ObjectId | User;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Post', required: true })
  postId: MongooseSchema.Types.ObjectId | Post;
}

export const LikeSchema = SchemaFactory.createForClass(Like);
LikeSchema.index({ userId: 1, postId: 1 }, { unique: true });
LikeSchema.virtual('id').get(function () { return this._id.toHexString(); });
