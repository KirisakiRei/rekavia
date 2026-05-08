import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { ResponseDTO } from 'src/dto/response.dto';
import { migrateContentJson } from 'src/sapatamu/sapatamu-content.helper';
import { SupportedDataEntity } from './types/data-entity.type';
import { DataListQuery } from './validation/data.validation';

interface EntityConfig {
  delegate: string;
  softDelete: boolean;
}

@Injectable()
export class DataService {
  constructor(private readonly DB: DatabaseService) {}

  private readonly entities: Record<SupportedDataEntity, EntityConfig> = {
    users: { delegate: 'user', softDelete: true },
    packages: { delegate: 'package', softDelete: true },
    'invitation-templates': { delegate: 'invitationTemplate', softDelete: true },
    'package-template-access': { delegate: 'packageTemplateAccess', softDelete: true },
    orders: { delegate: 'order', softDelete: true },
    'order-items': { delegate: 'orderItem', softDelete: true },
    payments: { delegate: 'payment', softDelete: true },
    'user-template-licenses': { delegate: 'userTemplateLicense', softDelete: true },
    invitations: { delegate: 'invitation', softDelete: true },
    'invitation-slugs': { delegate: 'invitationSlug', softDelete: true },
    'invitation-contents': { delegate: 'invitationContent', softDelete: true },
    'invitation-media': { delegate: 'invitationMedia', softDelete: true },
    'invitation-guests': { delegate: 'invitationGuest', softDelete: true },
    'invitation-drafts': { delegate: 'invitationDraft', softDelete: true },
    'invitation-feature-grants': { delegate: 'invitationFeatureGrant', softDelete: true },
    'invitation-visits': { delegate: 'invitationVisit', softDelete: false },
    'invitation-rsvps': { delegate: 'invitationRsvp', softDelete: true },
    'invitation-greetings': { delegate: 'invitationGreeting', softDelete: true },
    'editor-layout-templates': { delegate: 'editorLayoutTemplate', softDelete: true },
    'invitation-analytics-daily': { delegate: 'invitationAnalyticsDaily', softDelete: false },
  };

  getSupportedEntities(): ResponseDTO {
    return {
      status: 'success',
      code: 200,
      message: 'Supported entities',
      data: Object.keys(this.entities),
    };
  }

  private getEntityConfig(entity: string): EntityConfig {
    const config = this.entities[entity as SupportedDataEntity];
    if (!config) {
      throw new NotFoundException(`Entity ${entity} tidak didukung`);
    }
    return config;
  }

  private getDelegate(entity: string): any {
    const config = this.getEntityConfig(entity);
    return (this.DB as any)[config.delegate];
  }

  private parseJsonObject(raw: string | undefined, fieldName: string): Record<string, any> {
    if (!raw) return {};

    try {
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
        throw new BadRequestException(`${fieldName} harus berupa JSON object`);
      }
      return parsed;
    } catch {
      throw new BadRequestException(`${fieldName} harus valid JSON`);
    }
  }

  private sanitizeWritePayload(entity: string, payload: Record<string, any>): Record<string, any> {
    const data = { ...payload };
    delete data.id;
    delete data.created_at;
    delete data.updated_at;
    delete data.deleted_at;

    if (entity === 'invitation-rsvps') {
      delete data.phone_number;
      const status = typeof data.status === 'string' ? data.status : '';
      if (!['hadir', 'tidak', 'ragu'].includes(status)) {
        data.status = 'hadir';
      }
      data.attendees_count = Number.isFinite(Number(data.attendees_count))
        ? Math.max(1, Math.floor(Number(data.attendees_count)))
        : 1;
      if (typeof data.message === 'string') data.message = data.message.trim() || null;
      if (typeof data.guest_name === 'string') data.guest_name = data.guest_name.trim();
    }

    if (entity === 'invitation-greetings') {
      if (typeof data.message === 'string') data.message = data.message.trim();
      if (typeof data.guest_name === 'string') data.guest_name = data.guest_name.trim();
      data.is_approved = data.is_approved !== false;
    }

    return data;
  }

  private normalizeReadRow(entity: string, row: any): any {
    if (entity !== 'invitation-contents' || !row?.content_json) {
      return row;
    }

    return {
      ...row,
      content_json: migrateContentJson(row.content_json),
    };
  }

  async list(entity: string, query: DataListQuery): Promise<ResponseDTO> {
    const config = this.getEntityConfig(entity);
    const delegate = this.getDelegate(entity);

    const normalizedPage =
      typeof query.page === 'number' ? query.page : Number(query.page);
    const normalizedLimit =
      typeof query.limit === 'number' ? query.limit : Number(query.limit);

    const page = Number.isFinite(normalizedPage) && normalizedPage > 0 ? normalizedPage : 1;
    const limit = Number.isFinite(normalizedLimit) && normalizedLimit > 0 ? normalizedLimit : 20;
    const skip = (page - 1) * limit;

    const parsedWhere = this.parseJsonObject(query.where, 'where');
    const parsedOrderBy = this.parseJsonObject(query.orderBy, 'orderBy');

    const where = {
      ...parsedWhere,
      ...(config.softDelete && !query.includeDeleted ? { deleted_at: null } : {}),
    };

    const orderBy = Object.keys(parsedOrderBy).length > 0 ? parsedOrderBy : { created_at: 'desc' };

    const [items, total] = await Promise.all([
      delegate.findMany({ where, orderBy, skip, take: limit }),
      delegate.count({ where }),
    ]);
    const normalizedItems = Array.isArray(items)
      ? items.map((item) => this.normalizeReadRow(entity, item))
      : items;

    return {
      status: 'success',
      code: 200,
      message: 'Data ditemukan',
      data: {
        items: normalizedItems,
        total,
        page,
        limit,
        total_page: Math.ceil(total / limit),
      },
    };
  }

  async detail(entity: string, id: string): Promise<ResponseDTO> {
    const config = this.getEntityConfig(entity);
    const delegate = this.getDelegate(entity);

    const data = await delegate.findFirst({
      where: {
        id,
        ...(config.softDelete ? { deleted_at: null } : {}),
      },
    });

    if (!data) {
      throw new NotFoundException(`Data ${entity} dengan id ${id} tidak ditemukan`);
    }

    return {
      status: 'success',
      code: 200,
      message: 'Detail data ditemukan',
      data: this.normalizeReadRow(entity, data),
    };
  }

  async create(entity: string, payload: Record<string, any>): Promise<ResponseDTO> {
    const delegate = this.getDelegate(entity);

    const data = await delegate.create({
      data: this.sanitizeWritePayload(entity, payload),
    });

    return {
      status: 'success',
      code: 201,
      message: 'Data berhasil dibuat',
      data,
    };
  }

  async update(entity: string, id: string, payload: Record<string, any>): Promise<ResponseDTO> {
    const config = this.getEntityConfig(entity);
    const delegate = this.getDelegate(entity);

    const existing = await delegate.findFirst({
      where: {
        id,
        ...(config.softDelete ? { deleted_at: null } : {}),
      },
    });

    if (!existing) {
      throw new NotFoundException(`Data ${entity} dengan id ${id} tidak ditemukan`);
    }

    const data = await delegate.update({
      where: { id },
      data: this.sanitizeWritePayload(entity, payload),
    });

    return {
      status: 'success',
      code: 200,
      message: 'Data berhasil diperbarui',
      data,
    };
  }

  async remove(entity: string, id: string): Promise<ResponseDTO> {
    const config = this.getEntityConfig(entity);
    const delegate = this.getDelegate(entity);

    if (config.softDelete) {
      await delegate.update({ where: { id }, data: { deleted_at: new Date() } });
      return {
        status: 'success',
        code: 200,
        message: 'Data berhasil dihapus (soft delete)',
      };
    }

    await delegate.delete({ where: { id } });

    return {
      status: 'success',
      code: 200,
      message: 'Data berhasil dihapus',
    };
  }

  async restore(entity: string, id: string): Promise<ResponseDTO> {
    const config = this.getEntityConfig(entity);
    if (!config.softDelete) {
      throw new BadRequestException(`Entity ${entity} tidak mendukung restore`);
    }

    const delegate = this.getDelegate(entity);
    const data = await delegate.update({ where: { id }, data: { deleted_at: null } });

    return {
      status: 'success',
      code: 200,
      message: 'Data berhasil direstore',
      data,
    };
  }
}
