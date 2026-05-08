import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Request, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { Response } from 'express';
import { Roles } from 'src/auth/decorators/roles/roles.decorator';
import { JwtGuard } from 'src/auth/guards/jwt/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles/roles.guard';
import {
  SAPATAMU_ALBUM_ALLOWED_EXTENSIONS,
  SAPATAMU_ALBUM_ALLOWED_MIME_TYPES,
  SAPATAMU_EDITOR_MAX_SIZE_BYTES,
} from 'src/helpers/upload-policy.helper';
import { SingleFileInterceptor } from 'src/interceptors/upload/single/single.interceptor';
import { AdminService } from './admin.service';

type AdminRequest = {
  user: any;
  ip?: string;
  headers: Record<string, string | string[] | undefined>;
};

const SAPATAMU_DEMO_UPLOAD_EXTENSIONS = [
  ...SAPATAMU_ALBUM_ALLOWED_EXTENSIONS,
  '.mp3',
  '.wav',
  '.ogg',
];

const SAPATAMU_DEMO_UPLOAD_MIME_TYPES = [
  ...SAPATAMU_ALBUM_ALLOWED_MIME_TYPES,
  'audio/mpeg',
  'audio/mp3',
  'audio/wav',
  'audio/x-wav',
  'audio/ogg',
];

@Controller('admin')
@UseGuards(JwtGuard, RolesGuard)
@Roles('admin')
export class AdminController {
  constructor(private readonly service: AdminService) {}

  private ctx(req: AdminRequest) {
    return {
      admin: req.user,
      ip: req.ip,
      userAgent: Array.isArray(req.headers['user-agent']) ? req.headers['user-agent'][0] : req.headers['user-agent'],
    };
  }

  private ok(res: Response, message: string, data: unknown, code = 200) {
    return res.status(code).send({ status: 'success', code, message, data });
  }

  @Get('overview')
  async overview(@Res() res: Response): Promise<Response> {
    return this.ok(res, 'Overview admin ditemukan', await this.service.overview());
  }

  @Get('users')
  async users(@Query() query: any, @Res() res: Response): Promise<Response> {
    return this.ok(res, 'Daftar user ditemukan', await this.service.users(query));
  }

  @Get('users/:id')
  async userDetail(@Param('id') id: string, @Res() res: Response): Promise<Response> {
    return this.ok(res, 'Detail user ditemukan', await this.service.userDetail(id));
  }

  @Patch('users/:id/status')
  async setUserStatus(
    @Request() req: AdminRequest,
    @Param('id') id: string,
    @Body() body: Record<string, unknown>,
    @Res() res: Response,
  ): Promise<Response> {
    return this.ok(res, 'Status user diperbarui', await this.service.setUserStatus(id, body, this.ctx(req)));
  }

  @Get('products')
  async products(@Res() res: Response): Promise<Response> {
    return this.ok(res, 'Daftar produk ditemukan', await this.service.products());
  }

  @Get('products/:productCode/overview')
  async productOverview(@Param('productCode') productCode: string, @Res() res: Response): Promise<Response> {
    return this.ok(res, 'Overview produk ditemukan', await this.service.productOverview(productCode));
  }

  @Get('sapatamu/templates')
  async templates(@Query() query: any, @Res() res: Response): Promise<Response> {
    return this.ok(res, 'Daftar template ditemukan', await this.service.templates({ ...query, productCode: query.productCode ?? 'sapatamu' }));
  }

  @Post('sapatamu/templates')
  async createTemplate(
    @Request() req: AdminRequest,
    @Body() body: Record<string, unknown>,
    @Res() res: Response,
  ): Promise<Response> {
    return this.ok(res, 'Template dibuat', await this.service.upsertTemplate(body, this.ctx(req)), 201);
  }

  @Patch('sapatamu/templates/:id')
  async updateTemplate(
    @Request() req: AdminRequest,
    @Param('id') id: string,
    @Body() body: Record<string, unknown>,
    @Res() res: Response,
  ): Promise<Response> {
    return this.ok(res, 'Template diperbarui', await this.service.upsertTemplate(body, this.ctx(req), id));
  }

  @Get('sapatamu/templates/:id/assets')
  async templateAssets(@Param('id') id: string, @Query() query: any, @Res() res: Response): Promise<Response> {
    return this.ok(res, 'Daftar asset template ditemukan', await this.service.templateAssets(id, query));
  }

  @Get('sapatamu/templates/:id/editor')
  async templateEditor(@Param('id') id: string, @Res() res: Response): Promise<Response> {
    return this.ok(res, 'Editor default template ditemukan', await this.service.templateEditor(id));
  }

  @Get('sapatamu/templates/:id/demo-preview')
  async templateDemoPreview(@Param('id') id: string, @Res() res: Response): Promise<Response> {
    return this.ok(res, 'Demo preview template ditemukan', await this.service.getTemplateDemoPreview(id));
  }

  @Get('sapatamu/demo-preview')
  async globalDemoPreview(@Res() res: Response): Promise<Response> {
    return this.ok(res, 'Demo preview global ditemukan', await this.service.getSapatamuGlobalDemoPreview());
  }

  @Patch('sapatamu/demo-preview')
  async updateGlobalDemoPreview(
    @Request() req: AdminRequest,
    @Body() body: Record<string, unknown>,
    @Res() res: Response,
  ): Promise<Response> {
    return this.ok(res, 'Demo preview global diperbarui', await this.service.saveSapatamuGlobalDemoPreview(body, this.ctx(req)));
  }

  @Post('sapatamu/demo-preview/upload')
  @UseInterceptors(
    SingleFileInterceptor('file', {
      allowedExts: SAPATAMU_DEMO_UPLOAD_EXTENSIONS,
      allowedMimeTypes: SAPATAMU_DEMO_UPLOAD_MIME_TYPES,
      maxFileSizeBytes: SAPATAMU_EDITOR_MAX_SIZE_BYTES,
    }),
  )
  async uploadGlobalDemoPreviewAsset(
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
  ): Promise<Response> {
    return this.ok(res, 'Asset demo preview diunggah', await this.service.uploadSapatamuDemoPreviewAsset(file), 201);
  }

  @Patch('sapatamu/templates/:id/demo-preview')
  async updateTemplateDemoPreview(
    @Request() req: AdminRequest,
    @Param('id') id: string,
    @Body() body: Record<string, unknown>,
    @Res() res: Response,
  ): Promise<Response> {
    return this.ok(res, 'Demo preview template diperbarui', await this.service.saveTemplateDemoPreview(id, body, this.ctx(req)));
  }

  @Patch('sapatamu/templates/:id/editor/defaults')
  async updateTemplateEditorDefaults(
    @Request() req: AdminRequest,
    @Param('id') id: string,
    @Body() body: Record<string, unknown>,
    @Res() res: Response,
  ): Promise<Response> {
    return this.ok(res, 'Default template diperbarui', await this.service.saveTemplateEditorDefaults(id, body, this.ctx(req)));
  }

  @Patch('sapatamu/templates/:id/editor/layouts/:layoutCode')
  async updateTemplateEditorLayout(
    @Request() req: AdminRequest,
    @Param('id') id: string,
    @Param('layoutCode') layoutCode: string,
    @Body() body: Record<string, unknown>,
    @Res() res: Response,
  ): Promise<Response> {
    return this.ok(res, 'Default layout template diperbarui', await this.service.saveTemplateEditorLayout(id, layoutCode, body, this.ctx(req)));
  }

  @Post('sapatamu/templates/:id/assets')
  async createAsset(
    @Request() req: AdminRequest,
    @Param('id') id: string,
    @Body() body: Record<string, unknown>,
    @Res() res: Response,
  ): Promise<Response> {
    return this.ok(res, 'Asset template dibuat', await this.service.createAsset(id, body, this.ctx(req)), 201);
  }

  @Patch('sapatamu/assets/:assetId')
  async updateAsset(
    @Request() req: AdminRequest,
    @Param('assetId') assetId: string,
    @Body() body: Record<string, unknown>,
    @Res() res: Response,
  ): Promise<Response> {
    return this.ok(res, 'Asset template diperbarui', await this.service.updateAsset(assetId, body, this.ctx(req)));
  }

  @Delete('sapatamu/assets/:assetId')
  async deleteAsset(@Request() req: AdminRequest, @Param('assetId') assetId: string, @Res() res: Response): Promise<Response> {
    return this.ok(res, 'Asset template dihapus', await this.service.deleteAsset(assetId, this.ctx(req)));
  }

  @Get('sapatamu/layouts')
  async layouts(@Query() query: any, @Res() res: Response): Promise<Response> {
    return this.ok(res, 'Daftar layout ditemukan', await this.service.layouts({ ...query, productCode: query.productCode ?? 'sapatamu' }));
  }

  @Post('sapatamu/layouts')
  async createLayout(
    @Request() req: AdminRequest,
    @Body() body: Record<string, unknown>,
    @Res() res: Response,
  ): Promise<Response> {
    return this.ok(res, 'Layout dibuat', await this.service.upsertLayout(body, this.ctx(req)), 201);
  }

  @Patch('sapatamu/layouts/:id')
  async updateLayout(
    @Request() req: AdminRequest,
    @Param('id') id: string,
    @Body() body: Record<string, unknown>,
    @Res() res: Response,
  ): Promise<Response> {
    return this.ok(res, 'Layout diperbarui', await this.service.upsertLayout(body, this.ctx(req), id));
  }

  @Get('packages')
  async packages(@Query() query: any, @Res() res: Response): Promise<Response> {
    return this.ok(res, 'Daftar package ditemukan', await this.service.packages(query));
  }

  @Post('packages')
  async createPackage(
    @Request() req: AdminRequest,
    @Body() body: Record<string, unknown>,
    @Res() res: Response,
  ): Promise<Response> {
    return this.ok(res, 'Package dibuat', await this.service.upsertPackage(body, this.ctx(req)), 201);
  }

  @Patch('packages/:id')
  async updatePackage(
    @Request() req: AdminRequest,
    @Param('id') id: string,
    @Body() body: Record<string, unknown>,
    @Res() res: Response,
  ): Promise<Response> {
    return this.ok(res, 'Package diperbarui', await this.service.upsertPackage(body, this.ctx(req), id));
  }

  @Get('vouchers')
  async vouchers(@Query() query: any, @Res() res: Response): Promise<Response> {
    return this.ok(res, 'Daftar voucher ditemukan', await this.service.vouchers(query));
  }

  @Post('vouchers')
  async createVoucher(
    @Request() req: AdminRequest,
    @Body() body: Record<string, unknown>,
    @Res() res: Response,
  ): Promise<Response> {
    return this.ok(res, 'Voucher dibuat', await this.service.upsertVoucher(body, this.ctx(req)), 201);
  }

  @Patch('vouchers/:id')
  async updateVoucher(
    @Request() req: AdminRequest,
    @Param('id') id: string,
    @Body() body: Record<string, unknown>,
    @Res() res: Response,
  ): Promise<Response> {
    return this.ok(res, 'Voucher diperbarui', await this.service.upsertVoucher(body, this.ctx(req), id));
  }

  @Get('finance/orders')
  async financeOrders(@Query() query: any, @Res() res: Response): Promise<Response> {
    return this.ok(res, 'Daftar order ditemukan', await this.service.financeOrders(query));
  }

  @Get('finance/payments')
  async financePayments(@Query() query: any, @Res() res: Response): Promise<Response> {
    return this.ok(res, 'Daftar payment ditemukan', await this.service.financePayments(query));
  }

  @Get('finance/payments/:id')
  async paymentDetail(@Param('id') id: string, @Res() res: Response): Promise<Response> {
    return this.ok(res, 'Detail payment ditemukan', await this.service.paymentDetail(id));
  }

  @Post('finance/payments/:id/reconcile')
  async reconcilePayment(
    @Request() req: AdminRequest,
    @Param('id') id: string,
    @Body() body: Record<string, unknown>,
    @Res() res: Response,
  ): Promise<Response> {
    return this.ok(res, 'Payment direkonsiliasi', await this.service.reconcilePayment(id, body, this.ctx(req)));
  }

  @Get('audit-logs')
  async auditLogs(@Query() query: any, @Res() res: Response): Promise<Response> {
    return this.ok(res, 'Audit log ditemukan', await this.service.auditLogs(query));
  }
}
