import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  UnprocessableEntityException,
  UseGuards,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Track, TrackDocument } from '../schemas/track.schema';
import mongoose, { Model } from 'mongoose';
import { CreateTrackDto } from './dto/create-track.dto';
import { AuthGuard } from '@nestjs/passport';
import { RoleAuthGuard } from '../auth/role-auth.guard';

@Controller('tracks')
export class TracksController {
  constructor(
    @InjectModel(Track.name) private trackModel: Model<TrackDocument>,
  ) {}

  @Get()
  getAll(@Query('trackId') trackId: string) {
    if (!trackId) {
      return this.trackModel.find().populate('track', 'name');
    } else {
      return this.trackModel
        .find({ track: { _id: trackId } })
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

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async createTrack(@Body() trackDto: CreateTrackDto) {
    try {
      const album = new this.trackModel({
        name: trackDto.name,
        album: trackDto.album,
        duration: trackDto.duration,
        number: trackDto.number,
      });

      await album.save();

      return album;
    } catch (e) {
      if (e instanceof mongoose.Error.ValidationError) {
        throw new UnprocessableEntityException(e);
      }
      throw e;
    }
  }

  @UseGuards(RoleAuthGuard)
  @Delete(':id')
  async deleteTrack(@Param('id') id: string) {
    const track = await this.trackModel.findByIdAndDelete(id);

    if (!track) {
      throw new NotFoundException("Such artist don't exist");
    }

    return track;
  }
}
