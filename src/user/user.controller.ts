import { Controller, Post, Body, HttpCode, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { Signup, UpdateReceiveEmail, CreatePet } from './schema/user.schema';
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

    @Post('createPet')
    @HttpCode(200)
    async createPet(@Body() pet: CreatePet) {
        return await this.userService.createPet(pet);
    }


}
