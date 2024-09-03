import { IsString } from 'class-validator';
export class Signup {
    @IsString()
    email: string;
}

export class UpdateReceiveEmail {
    @IsString()
    credential: string;

    @IsString()
    receiveEmail: string;
}

export class CreatePet {
    @IsString()
    credential: string;

    @IsString()
    name: string;
}