import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Artist, ArtistDocument } from '../schemas/artist.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateArtistDto } from './create-artist.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { artistStorage} from '../multer/storage-config';

@Controller('artists')
export class ArtistsController {
  constructor(
    @InjectModel(Artist.name) private artistModel: Model<ArtistDocument>,
  ) {}

  @Get()
  async getArtists() {
    return this.artistModel.find();
  }

  @Get(':id')
  async getOneArtist(@Param('id') id: string) {
    const artist = await this.artistModel.findOne({ _id: id });

    if (!artist) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    return artist;
  }

  @Post()
  @UseInterceptors(FileInterceptor('image', {storage: artistStorage}))
  async createArtist(
    @Body() artistDto: CreateArtistDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.artistModel.create({
      name: artistDto.name,
      info: artistDto.info,
      image: file ? 'images/artists/' + file.filename : null,
    });
  }

  @Delete(':id')
  async deleteArtist(@Param('id') id: string) {
    try {
      const artist = await this.artistModel.deleteOne({ _id: id });

      if (artist.deletedCount === 0) {
        return { message: 'Artist not found or already deleted', status: 404 };
      }

      return artist;
    }catch (e) {
      console.error('Invalid server error' + e);
    }
  }
}
