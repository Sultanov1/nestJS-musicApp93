import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Artist } from './artist.schema';
import mongoose from 'mongoose';

export type AlbumDocument = Artist & Document;

@Schema()
export class Album {
  @Prop({ required: true })
  name: string;

  @Prop({ ref: Artist.name, required: true})
  artist: mongoose.Types.ObjectId;

  @Prop({ required: true })
  date: number;

  @Prop()
  image: string;
}

export const AlbumSchema = SchemaFactory.createForClass(Album);