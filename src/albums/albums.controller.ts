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
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Album, AlbumDocument } from '../schemas/album.schema';
import mongoose, { Model } from 'mongoose';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateAlbumDto } from './dto/create-album.dto';
import { albumStorage } from '../multer/storage-config';
import { AuthGuard } from '@nestjs/passport';
import { RoleAuthGuard } from '../auth/role-auth.guard';

@Controller('albums')
export class AlbumsController {
  constructor(
    @InjectModel(Album.name) private AlbumModel: Model<AlbumDocument>,
  ) {}

  @Get()
  getAll(@Query('artistId') artistId: string) {
    if (!artistId) {
      return this.AlbumModel.find().populate('artist', 'name');
    } else {
      return this.AlbumModel.find({ artist: { _id: artistId } }).populate(
        'artist',
        'name',
      );
    }
  }

  @Get(':id')
  getOneArtist(@Param('id') id: string) {
    const album = this.AlbumModel.findOne({ _id: id });

    if (!album) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    return album;
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  @UseInterceptors(FileInterceptor('image', { storage: albumStorage }))
  async createAlbum(
    @Body() albumDto: CreateAlbumDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      const album = new this.AlbumModel({
        name: albumDto.name,
        artist: albumDto.artist,
        date: albumDto.date,
        image: file ? 'images/albums/' + file.filename : null,
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
  async deleteAlbum(@Param('id') id: string) {
    const album = await this.AlbumModel.findByIdAndDelete( id );

    if (!album) {
      throw new NotFoundException('Such album don\'t exist');
    }

    return album;
  }
}
