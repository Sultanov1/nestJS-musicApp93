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
import { Album, AlbumDocument } from '../schemas/album.schema';
import { Model } from 'mongoose';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateAlbumDto } from './create-album.dto';

@Controller('albums')
export class AlbumsController {
  constructor(@InjectModel(Album.name) private AlbumModel: Model<AlbumDocument>)
  {}

  @Get()
  getAll(@Query('artistId') artistId: string) {
    if (!artistId) {
      return this.AlbumModel.find().populate('artist', 'name');
    }else {
      return this.AlbumModel.find({artist: {_id:  artistId}})
        .populate('artist', 'name');
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

  @Post()
  @UseInterceptors(FileInterceptor('image', { dest: './public/images' }))
  async createAlbum(
    @Body() albumDto: CreateAlbumDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    return await this.AlbumModel.create({
      name: albumDto.name,
      artist: albumDto.artist,
      date: albumDto.date,
      image: file ? 'images/' + file.filename : null,
    });
  }


  @Delete(':id')
  async deleteAlbum(@Param('id') id: string) {
    try  {
      const album = await this.AlbumModel.deleteOne({ _id: id });

      if (album.deletedCount === 0) {
        return { message: 'Artist not found or already deleted', status: 404 };
      }

      return album;
    } catch (e) {
      console.error('Invalid server error' + e);
    }
  }

}