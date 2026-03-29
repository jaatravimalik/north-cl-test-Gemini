import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from './user.schema';

export type ExperienceDocument = Experience & Document;

@Schema({ toJSON: { virtuals: true }, toObject: { virtuals: true } })
export class Experience {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: MongooseSchema.Types.ObjectId | User;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  company: string;

  @Prop()
  startDate: string;

  @Prop()
  endDate: string;

  @Prop({ default: false })
  current: boolean;

  @Prop()
  description: string;
}

export const ExperienceSchema = SchemaFactory.createForClass(Experience);
ExperienceSchema.virtual('id').get(function () { return this._id.toHexString(); });
