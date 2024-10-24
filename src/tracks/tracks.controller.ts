import {
  Body,
  Controller, Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Track, TrackDocument } from '../schemas/track.schema';
import { Model } from 'mongoose';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateTrackDto } from './create-track.dto';

@Controller('tracks')
export class TracksController {
  constructor(@InjectModel(Track.name) private trackModel: Model<TrackDocument>) {
  }

  @Get()
  getAll(@Query('trackId') trackId: string) {
    if (!trackId) {
      return this.trackModel.find().populate('track', 'name');
    } else {
      return this.trackModel.find({ track: { _id: trackId } })
        .populate('track', 'name');
    }
  }

  @Get(':id')
  getOneTrack(@Param('id') id: string) {
    const track = this.trackModel.findOne({ _id: id });

    if (!track) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    return track;
  }

  @Post()
  @UseInterceptors(FileInterceptor('image', { dest: './public/images' }))
 async createTrack(@Body() trackDto: CreateTrackDto, @UploadedFile() file: Express.Multer.File) {
    return  await this.trackModel.create({
      name: trackDto.name,
      album: trackDto.album,
      duration: trackDto.duration,
      number: trackDto.number,
    });
  }

  @Delete(':id')
  async deleteTrack(@Param('id') id: string) {
    try {
      const track = await this.trackModel.deleteOne({ _id: id });

      if (track.deletedCount === 0) {
        return { message: 'Artist not found or already deleted', status: 404 };
      }

      return track;
    } catch (e) {
      console.error(`Invalid server error${e}`);
    }
  }
}
