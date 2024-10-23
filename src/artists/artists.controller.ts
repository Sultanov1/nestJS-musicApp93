import { Body, Controller, Get, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { Artist, ArtistDocument } from '../schemas/artist.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateArtistDto } from './create-artist.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('artists')
export class ArtistsController {
  constructor(
    @InjectModel(Artist.name) private artistModel: Model<ArtistDocument>
  ) {}

  @Get()
  async getArtists() {
     return this.artistModel.find();
  }

  @Post()
  @UseInterceptors(FileInterceptor('image', { dest: './public/images' }))
  async createArtist(
    @Body() artistDto: CreateArtistDto,
    @UploadedFile() file: Express.Multer.File,
    ) {
    return await this.artistModel.create({
      name: artistDto.name,
      info: artistDto.info,
      image: file ? 'images/' + file.filename : null,
    })
  }
}
