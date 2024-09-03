import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Pet } from './entities/pet.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Pet])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
