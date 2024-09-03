import { Controller, Post, Body, HttpCode, UseGuards, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { UserService } from './user.service';
import { Signup, UpdateReceiveEmail, CreatePet } from './schema/user.schema';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post('signup')
    @HttpCode(200)
    async signup(@Body() user: Signup) {
        return await this.userService.signup(user);
    }

    @Post('updateReceiveEmail')
    @HttpCode(200)
    async updateReceiveEmail(@Body() email: UpdateReceiveEmail) {
        return await this.userService.updateReceiveEmail(email);
    }

    // 采用form-data格式，body为json，image为文件
    @Post('createPet')
    @HttpCode(200)
    @UseInterceptors(FilesInterceptor('images', 5)) // 允许最多10个文件，您可以根据需要调整这个数字
    async createPet(
        @Body('pet') petString: string,
        @UploadedFiles() files: Express.Multer.File[]
    ) {
        const pet: CreatePet = JSON.parse(petString);
        return await this.userService.createPet(pet, files);
    }

    // webhook for stripe
    @Post('subscriptionStatus')
    @HttpCode(200)
    async subscriptionStatus() {
        
    }


}
