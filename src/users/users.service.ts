import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrLoginUserDto } from './users.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Crée un compte si le pseudo n'existe pas,
   * sinon retourne le compte existant (connexion automatique).
   */
  async createOrLogin(dto: CreateOrLoginUserDto) {
    const existing = await (this.prisma as any).user.findUnique({
      where: { pseudo: dto.pseudo.trim() },
    });

    if (existing) {
      this.logger.log(`Login: ${existing.pseudo}`);
      return { ...existing, isNew: false };
    }

    const user = await (this.prisma as any).user.create({
      data: { pseudo: dto.pseudo.trim() },
    });

    this.logger.log(`Nouveau compte: ${user.pseudo}`);
    return { ...user, isNew: true };
  }

  async findByUuid(uuid: string) {
    return (this.prisma as any).user.findUnique({ where: { uuid } });
  }

  async findAll() {
    return (this.prisma as any).user.findMany({ orderBy: { createdAt: 'asc' } });
  }
}