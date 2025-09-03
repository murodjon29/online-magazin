import {
  Injectable,
  InternalServerErrorException,
  OnModuleInit,
} from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Admin } from 'src/core/entities/admin.entity';
import { Repository } from 'typeorm';
import { config } from 'src/config';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { AdminRole } from 'src/common/enum/enum';

@Injectable()
export class AdminService implements OnModuleInit {
  constructor(
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
    private readonly jwtService: JwtService,
  ) {}

  async onModuleInit() {
    try {
      const exist = await this.adminRepository.findOne({
        where: { email: config.ADMIN_LOGIN },
      });
      if (exist) return; // agar allaqachon bor bo‘lsa, qaytamiz

      const hashedPassword = await bcrypt.hash(config.ADMIN_PAROL, 10);
      const admin = this.adminRepository.create({
        email: config.ADMIN_LOGIN,
        password: hashedPassword,
        role: AdminRole.ADMIN,
      });
      await this.adminRepository.save(admin);
      console.log('✅ Default admin created');
    } catch (error) {
      throw new InternalServerErrorException(
        `Error on creating admin: ${error.message}`,
      );
    }
  }

  async login(createAdminDto: CreateAdminDto, res: Response) {
    try {
      const admin = await this.adminRepository.findOne({
        where: { email: createAdminDto.email },
      });

      if (!admin) {
        return res.status(404).json({
          statusCode: 404,
          message: 'Admin not found',
          data: null,
        });
      }

      const isPasswordMatch = await bcrypt.compare(
        createAdminDto.password,
        admin.password,
      );
      if (!isPasswordMatch) {
        return res.status(404).json({
          statusCode: 404,
          message: 'Admin not found',
          data: null,
        });
      }

      const payload = {
        id: admin.id,
        email: admin.email,
        role: admin.role,
      };

      const accessToken = this.jwtService.sign(payload, {
        secret: config.ACCESS_TOKEN_KEY,
        expiresIn: config.ACCESS_TOKEN_TIME,
      });

      const refreshToken = this.jwtService.sign(payload, {
        secret: config.REFRESH_TOKEN_KEY,
        expiresIn: config.REFRESH_TOKEN_TIME,
      });

      await AdminService.writeCooki(res, refreshToken);

      return res.status(200).json({
        statusCode: 200,
        message: 'Admin logged in successfully',
        data: accessToken,
      });
    } catch (error) {
      return res.status(500).json({
        statusCode: 500,
        message: 'Internal server error',
        error: error.message,
      });
    }
  }

  findAll() {
    return `This action returns all admin`;
  }

  findOne(id: number) {
    return `This action returns a #${id} admin`;
  }

  update(id: number, updateAdminDto: UpdateAdminDto) {
    return `This action updates a #${id} admin`;
  }

  remove(id: number) {
    return `This action removes a #${id} admin`;
  }

  static async writeCooki(res: Response, refreshToken: string) {
    try {
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: false, // faqat HTTPS bo‘lsa true qilinadi
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `Error on writing cookie: ${error.message}`,
      );
    }
  }
}
