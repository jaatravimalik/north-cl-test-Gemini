import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from './user.schema';
import { Business } from './business.schema';

export type RatingDocument = Rating & Document;

@Schema({ timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } })
export class Rating {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: MongooseSchema.Types.ObjectId | User;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Business', required: true })
  businessId: MongooseSchema.Types.ObjectId | Business;

  @Prop({ required: true, type: Number })
  stars: number;

  @Prop()
  review: string;
}

export const RatingSchema = SchemaFactory.createForClass(Rating);
RatingSchema.index({ userId: 1, businessId: 1 }, { unique: true });
RatingSchema.virtual('id').get(function () { return this._id.toHexString(); });
