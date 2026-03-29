import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from './user.schema';

export type BusinessDocument = Business & Document;

@Schema({ timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } })
export class Business {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  ownerId: MongooseSchema.Types.ObjectId | User;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  category: string;

  @Prop()
  description: string;

  @Prop()
  location: string;

  @Prop()
  phone: string;

  @Prop()
  email: string;

  @Prop()
  website: string;

  @Prop()
  imageUrl: string;

  @Prop()
  openingHours: string;
}

export const BusinessSchema = SchemaFactory.createForClass(Business);

BusinessSchema.virtual('id').get(function () {
  return this._id.toHexString();
});
