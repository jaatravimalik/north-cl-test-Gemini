import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ select: false })
  password: string;

  @Prop()
  headline: string;

  @Prop()
  location: string;

  @Prop()
  city: string;

  @Prop()
  state: string;

  @Prop()
  about: string;

  @Prop()
  avatar: string;

  @Prop()
  cover: string;

  @Prop({ type: [String], default: [] })
  skills: string[];

  @Prop()
  website: string;

  @Prop()
  phone: string;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'User' }] })
  followers: User[];

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'User' }] })
  following: User[];
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.virtual('id').get(function () {
  return this._id.toHexString();
});
