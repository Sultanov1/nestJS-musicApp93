import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  UnprocessableEntityException,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Artist, ArtistDocument } from '../schemas/artist.schema';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { CreateArtistDto } from './dto/create-artist.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { artistStorage} from '../multer/storage-config';
import { AuthGuard } from '@nestjs/passport';
import { RoleAuthGuard } from '../auth/role-auth.guard';

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

  @UseGuards(AuthGuard('jwt'))
  @Post()
  @UseInterceptors(FileInterceptor('image', {storage: artistStorage}))
  async createArtist(
    @Body() artistDto: CreateArtistDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      const artist  = new this.artistModel({
        name: artistDto.name,
        info: artistDto.info,
        image: file ? 'images/artists/' + file.filename : null,
      });

      await artist.save();

      return artist;
    } catch (e) {
      if (e instanceof mongoose.Error.ValidationError) {
        throw new UnprocessableEntityException(e);
      }

      throw e;
    }
  }

  @UseGuards(RoleAuthGuard)
  @Delete(':id')
  async deleteArtist(@Param('id') id: string) {
    const artist = await this.artistModel.findByIdAndDelete(id);

    if (!artist) {
      throw new NotFoundException('Such artist don\'t exist');
    }

    return artist;
  }
}
