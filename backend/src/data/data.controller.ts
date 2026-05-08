import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { Roles } from 'src/auth/decorators/roles/roles.decorator';
import { JwtGuard } from 'src/auth/guards/jwt/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles/roles.guard';
import { DataService } from './data.service';
import { DataListQuery } from './validation/data.validation';

/**
 * Entity yang boleh dibaca publik (tanpa autentikasi).
 * Digunakan oleh halaman live undangan (TenantWeddingPage).
 */
const PUBLIC_READ_ENTITIES = new Set([
  'invitation-slugs',
  'invitations',
  'invitation-contents',
  'invitation-media',
  'invitation-greetings',
  'editor-layout-templates',
]);

/**
 * Entity yang boleh di-POST publik (tanpa autentikasi).
 * Tamu undangan bisa submit RSVP, ucapan, dan kunjungan.
 */
const PUBLIC_WRITE_ENTITIES = new Set([
  'invitation-visits',
  'invitation-rsvps',
  'invitation-greetings',
]);

@Controller('data')
export class DataController {
  constructor(private readonly service: DataService) {}

  // ── Admin-only ─────────────────────────────────────────────────────────────

  @Get('entities')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('admin')
  getEntities(@Res() res: Response): Response {
    const response = this.service.getSupportedEntities();
    return res.status(response.code).send(response);
  }

  // ── List — publik untuk entity tertentu, admin untuk sisanya ───────────────

  @Get(':entity')
  async list(
    @Param('entity') entity: string,
    @Query() query: DataListQuery,
    @Res() res: Response,
  ): Promise<Response> {
    if (!PUBLIC_READ_ENTITIES.has(entity)) {
      throw new ForbiddenException('Akses ke entity ini memerlukan autentikasi admin.');
    }
    const response = await this.service.list(entity, query);
    return res.status(response.code).send(response);
  }

  @Get(':entity/:id')
  async detail(
    @Param('entity') entity: string,
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<Response> {
    if (!PUBLIC_READ_ENTITIES.has(entity)) {
      throw new ForbiddenException('Akses ke entity ini memerlukan autentikasi admin.');
    }
    const response = await this.service.detail(entity, id);
    return res.status(response.code).send(response);
  }

  // ── Create — publik untuk entity tertentu, admin untuk sisanya ────────────

  @Post(':entity')
  async create(
    @Param('entity') entity: string,
    @Body() body: Record<string, any>,
    @Res() res: Response,
  ): Promise<Response> {
    if (!PUBLIC_WRITE_ENTITIES.has(entity)) {
      throw new ForbiddenException('Operasi ini memerlukan autentikasi admin.');
    }
    const response = await this.service.create(entity, body);
    return res.status(response.code).send(response);
  }

  // ── Update & Delete — admin-only ───────────────────────────────────────────

  @Patch(':entity/:id')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('admin')
  async update(
    @Param('entity') entity: string,
    @Param('id') id: string,
    @Body() body: Record<string, any>,
    @Res() res: Response,
  ): Promise<Response> {
    const response = await this.service.update(entity, id, body);
    return res.status(response.code).send(response);
  }

  @Delete(':entity/:id')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('admin')
  async remove(
    @Param('entity') entity: string,
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<Response> {
    const response = await this.service.remove(entity, id);
    return res.status(response.code).send(response);
  }

  @Post(':entity/:id/restore')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('admin')
  async restore(
    @Param('entity') entity: string,
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<Response> {
    const response = await this.service.restore(entity, id);
    return res.status(response.code).send(response);
  }
}
