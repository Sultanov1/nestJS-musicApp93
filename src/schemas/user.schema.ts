import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {randomUUID} from 'crypto';
import { compare, genSalt, hash } from 'bcrypt';
import { Document } from 'mongoose';

export interface UserMethods {
  generateToken: () => void;
  checkPassword: (password: string) => Promise<boolean>;
}

export type UserDocument = User & Document & UserMethods;

const SALT_WORD_FACTORY = 10;

@Schema()
export class User {
  @Prop({
    required: true,
    unique: true,
  })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  token: string;

  @Prop({
    required: true,
    enum: ['user', 'admin'],
    default: 'user',
  })
  role: string;

  @Prop()
  displayName: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.methods.generateToken = function() {
  this.token = randomUUID();
}

UserSchema.methods.checkPassword = function(password: string) {
  return compare(password, this.password);
}

UserSchema.pre<UserDocument>('save',async function() {
  if (!this.isModified('password')) {
    return;
  }

  const salt = await genSalt(SALT_WORD_FACTORY);
  this.password = await hash(this.password, salt);
})

UserSchema.set('toJSON', {
  transform: (_doc, ret) => {
    delete ret.password;
    return ret;
  },
})