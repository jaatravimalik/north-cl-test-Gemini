import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ExperienceModule } from './experience/experience.module';
import { EducationModule } from './education/education.module';
import { PostsModule } from './posts/posts.module';
import { LikesModule } from './likes/likes.module';
import { CommentsModule } from './comments/comments.module';
import { BusinessModule } from './business/business.module';
import { RatingsModule } from './ratings/ratings.module';
import { User } from './entities/user.entity';
import { Experience } from './entities/experience.entity';
import { Education } from './entities/education.entity';
import { Post } from './entities/post.entity';
import { Like } from './entities/like.entity';
import { Comment } from './entities/comment.entity';
import { Business } from './entities/business.entity';
import { Rating } from './entities/rating.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite',
      entities: [User, Experience, Education, Post, Like, Comment, Business, Rating],
      synchronize: true,
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
