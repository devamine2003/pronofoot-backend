import { UsersService } from './users.service';
import { CreateOrLoginUserDto } from './users.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    createOrLogin(dto: CreateOrLoginUserDto): Promise<any>;
    findByUuid(uuid: string): Promise<any>;
}
