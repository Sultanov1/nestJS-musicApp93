import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Album } from './album.schema';

export type TrackDocument = Track & Document;

@Schema()
export class Track {
  @Prop({required: true})
  name: string;

  @Prop()
  duration: string;

  @Prop({ ref: Album.name, required: true })
  album: mongoose.Types.ObjectId;

  @Prop({required: true})
  number: number;
}

export const TrackSchema = SchemaFactory.createForClass(Track);
