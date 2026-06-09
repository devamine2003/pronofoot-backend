import { PrismaService } from '../prisma/prisma.service';
import { CreateOrLoginUserDto } from './users.dto';
export declare class UsersService {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    createOrLogin(dto: CreateOrLoginUserDto): Promise<any>;
    findByUuid(uuid: string): Promise<any>;
    findAll(): Promise<any>;
}
