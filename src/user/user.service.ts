import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Signup, UpdateReceiveEmail, CreatePet } from './schema/user.schema';
import { HttpException, HttpStatus } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { Express } from 'express';
import * as fs from 'fs';
import { Pet } from './entities/pet.entity';




@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Pet)
        private readonly petRepository: Repository<Pet>,
    ) {}

    async signup(user: Signup) {
        // 检查是否存在该用户
        if (await this.userRepository.findOne({ where: { email: user.email } })) {
            throw new HttpException('User already exists', HttpStatus.FOUND);
        }
        // 如果不存在则注册新用户
        const newUser = await this.userRepository.create({ email: user.email });
        await this.userRepository.save(newUser);
        return newUser;
    }

    /**
     * 解析Google jwt token，返回用户
     * @param token Google Jwt token
     * @returns 
     */
    async encryptGoogleJwtToken(token) {
        var client: OAuth2Client;
        client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
        try {
            const ticket = await client.verifyIdToken({
                idToken: token,
                audience: process.env.GOOGLE_CLIENT_ID,
            });
            const payload = ticket.getPayload();
            const email = payload['email'];
            const user = await this.userRepository.findOne({ where: { email: email } })
            if (user === null) {
                throw new HttpException('User not found', HttpStatus.NOT_FOUND);
            }
            return user;
        } catch (error) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
    }

    async updateReceiveEmail(updateReceiveEmail: UpdateReceiveEmail) {
        const user = await this.encryptGoogleJwtToken(updateReceiveEmail.credential)
        user.receiveEmail = updateReceiveEmail.receiveEmail;
        await this.userRepository.save(user);
        return { updateReceiveEmail: user.receiveEmail }
    }

    async createPet(pet: CreatePet, files: Express.Multer.File[]) {
        // 判断是否存储该用户的存储folder
        const user = await this.encryptGoogleJwtToken(pet.credential)
        const folderName = user.email;
        const folderPath = path.join(__dirname, '..', '..', 'pics', folderName);
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true });
        }
        // 上传图片存储在服务器上。仅存储付费用户的宠物图片
        const uploadedFiles = files.map(file => {
            const uniqueFilename = `${Date.now()}-${file.originalname}`;
            const filePath = path.join(folderPath, uniqueFilename);
            fs.writeFileSync(filePath, file.buffer);
        })
        // 选择性格

        // 保存宠物
        const newPet = await this.petRepository.create({
            owner: user.email,
            name: pet.name,
        })
        await this.petRepository.save(newPet);
    }
    async getPet() {

    }


    async subscriptionStatus() {

    }

    
    
    

}
