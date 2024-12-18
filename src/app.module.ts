import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArtistsController } from './artists/artists.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Artist, ArtistSchema } from './schemas/artist.schema';
import { AlbumsController } from './albums/albums.controller';
import { Album, AlbumSchema } from './schemas/album.schema';
import { Track, TrackSchema } from './schemas/track.schema';
import { User, UserSchema } from './schemas/user.schema';
import { UsersController } from './users/users.controller';
import { AuthService } from './auth/auth.service';
import { LocalStrategy } from './auth/local.strategy';
import { PassportModule } from '@nestjs/passport';
import { UniqueUserEmailConstraint } from './users/validators/uniqueUserEmail.validator';
import { TracksController } from './tracks/tracks.controller';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/music'),
    MongooseModule.forFeature([
      {name: Artist.name, schema: ArtistSchema},
      {name: Album.name, schema: AlbumSchema},
      {name: Track.name, schema: TrackSchema},
      {name: User.name, schema: UserSchema},
    ]),
    PassportModule,
  ],
  controllers: [AppController, ArtistsController, AlbumsController, TracksController, UsersController],
  providers: [AppService, AuthService, LocalStrategy, UniqueUserEmailConstraint],
})

export class AppModule {
}
