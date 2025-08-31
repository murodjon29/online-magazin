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
import { AdminRole } from 'src/enum/enum';

@Injectable()
export class AdminService implements OnModuleInit {
  constructor(
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
    private readonly jwtService: JwtService,
  ) {}

  async onModuleInit() {
    try {
      const hashedPassword = await bcrypt.hash(config.ADMIN_PAROL, 10);
      const admin = this.adminRepository.create({
        email: config.ADMIN_LOGIN,
        password: hashedPassword,
        role: AdminRole.ADMIN,
      });
      await this.adminRepository.save(admin);
      return {
        statusCode: 201,
        message: 'Admin created successfully',
        data: admin,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        `Error on creating admin: ${error.message}`,
      );
    }
  }

  async login(createAdminDto: CreateAdminDto, res: Response) {
    try {
      const admin = await this.adminRepository.findOne({
        where: {
          email: createAdminDto.email,
        },
      });
      if (!admin) {
        return {
          statusCode: 404,
          message: 'Admin not found',
          data: null,
        };
      }

      const isPasswordMatch = await bcrypt.compare(
        createAdminDto.password,
        admin.password,
      );
      if (!isPasswordMatch) {
        return {
          statusCode: 404,
          message: 'Admin not found',
          data: null,
        };
      }

      const payload = {
        id: admin.id,
        email: admin.email,
        role: admin.role,
      };

      const accesToken = this.jwtService.sign(payload, {
        secret: config.ACCESS_TOKEN_KEY,
        expiresIn: config.ACCESS_TOKEN_TIME,
      });

      const refreshToken = this.jwtService.sign(payload, {
        secret: config.REFRESH_TOKEN_KEY,
        expiresIn: config.REFRESH_TOKEN_TIME,
      });

      console.log(accesToken, payload);
      
      await AdminService.writeCooki(res, refreshToken);
      return {
        statusCode: 200,
        message: 'Admin logged in successfully',
        data: accesToken,
      };
    } catch (error) {}
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
        secure: true,
        sameSite: 'none',
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `Error on writing cookie: ${error.message}`,
      );
    }
  }
}
