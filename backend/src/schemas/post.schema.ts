import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from './user.schema';

export type PostDocument = Post & Document;

@Schema({ timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } })
export class Post {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: MongooseSchema.Types.ObjectId | User;

  @Prop({ required: true })
  content: string;

  @Prop()
  imageUrl: string;

  @Prop({ default: 0 })
  likesCount: number;
}

export const PostSchema = SchemaFactory.createForClass(Post);

PostSchema.virtual('id').get(function () {
  return this._id.toHexString();
});
