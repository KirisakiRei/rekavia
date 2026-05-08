import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { DataService } from './data.service';
import { DataListQuery } from './validation/data.validation';

@Controller('data')
export class DataController {
  constructor(private readonly service: DataService) {}

  @Get('entities')
  getEntities(@Res() res: Response): Response {
    const response = this.service.getSupportedEntities();
    return res.status(response.code).send(response);
  }

  @Get(':entity')
  async list(
    @Param('entity') entity: string,
    @Query() query: DataListQuery,
    @Res() res: Response,
  ): Promise<Response> {
    const response = await this.service.list(entity, query);
    return res.status(response.code).send(response);
  }

  @Get(':entity/:id')
  async detail(
    @Param('entity') entity: string,
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<Response> {
    const response = await this.service.detail(entity, id);
    return res.status(response.code).send(response);
  }

  @Post(':entity')
  async create(
    @Param('entity') entity: string,
    @Body() body: Record<string, any>,
    @Res() res: Response,
  ): Promise<Response> {
    const response = await this.service.create(entity, body);
    return res.status(response.code).send(response);
  }

  @Patch(':entity/:id')
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
  async remove(
    @Param('entity') entity: string,
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<Response> {
    const response = await this.service.remove(entity, id);
    return res.status(response.code).send(response);
  }

  @Post(':entity/:id/restore')
  async restore(
    @Param('entity') entity: string,
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<Response> {
    const response = await this.service.restore(entity, id);
    return res.status(response.code).send(response);
  }
}
