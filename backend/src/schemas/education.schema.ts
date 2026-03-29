import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from './user.schema';

export type EducationDocument = Education & Document;

@Schema({ toJSON: { virtuals: true }, toObject: { virtuals: true } })
export class Education {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: MongooseSchema.Types.ObjectId | User;

  @Prop({ required: true })
  degree: string;

  @Prop({ required: true })
  institution: string;

  @Prop()
  year: string;

  @Prop()
  description: string;
}

export const EducationSchema = SchemaFactory.createForClass(Education);
EducationSchema.virtual('id').get(function () { return this._id.toHexString(); });
