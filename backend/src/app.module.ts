import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ExperienceModule } from './experience/experience.module';
import { EducationModule } from './education/education.module';
import { PostsModule } from './posts/posts.module';
import { LikesModule } from './likes/likes.module';
import { CommentsModule } from './comments/comments.module';
import { BusinessModule } from './business/business.module';
import { RatingsModule } from './ratings/ratings.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI') || 'mongodb://localhost:27017/northindia_connect',
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    ExperienceModule,
    EducationModule,
    PostsModule,
    LikesModule,
    CommentsModule,
    BusinessModule,
    RatingsModule,
  ],
})
export class AppModule {}
