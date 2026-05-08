import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { Roles } from 'src/auth/decorators/roles/roles.decorator';
import { JwtGuard } from 'src/auth/guards/jwt/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles/roles.guard';
import {
  SAPATAMU_ALBUM_ALLOWED_EXTENSIONS,
  SAPATAMU_ALBUM_ALLOWED_MIME_TYPES,
  SAPATAMU_ALBUM_MAX_SIZE_BYTES,
  SAPATAMU_EDITOR_ALLOWED_EXTENSIONS,
  SAPATAMU_EDITOR_ALLOWED_MIME_TYPES,
  SAPATAMU_EDITOR_MAX_SIZE_BYTES,
} from 'src/helpers/upload-policy.helper';
import { SingleFileInterceptor } from 'src/interceptors/upload/single/single.interceptor';
import { SapatamuService } from './sapatamu.service';

@Controller('sapatamu')
@UseGuards(JwtGuard, RolesGuard)
@Roles('user')
export class SapatamuController {
  constructor(private readonly service: SapatamuService) {}

  @Post('drafts')
  async createDraft(
    @Request() req: { user: any },
    @Body() body: Record<string, unknown>,
    @Res() res: Response,
  ): Promise<Response> {
    const data = await this.service.createDraft(req.user, body);
    return res.status(201).send({
      status: 'success',
      code: 201,
      message: 'Draft undangan berhasil dibuat',
      data,
    });
  }

  @Get('drafts/:id')
  async getDraft(
    @Request() req: { user: any },
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<Response> {
    const data = await this.service.getDraft(req.user, id);
    return res.status(200).send({
      status: 'success',
      code: 200,
      message: 'Draft undangan ditemukan',
      data,
    });
  }

  @Patch('drafts/:id')
  async updateDraft(
    @Request() req: { user: any },
    @Param('id') id: string,
    @Body() body: Record<string, unknown>,
    @Res() res: Response,
  ): Promise<Response> {
    const data = await this.service.updateDraft(req.user, id, body);
    return res.status(200).send({
      status: 'success',
      code: 200,
      message: 'Draft undangan berhasil diperbarui',
      data,
    });
  }

  @Delete('drafts/:id')
  async deleteDraft(
    @Request() req: { user: any },
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<Response> {
    const data = await this.service.deleteDraft(req.user, id);
    return res.status(200).send({
      status: 'success',
      code: 200,
      message: 'Draft undangan berhasil dihapus',
      data,
    });
  }

  @Post('drafts/:id/finalize')
  async finalizeDraft(
    @Request() req: { user: any },
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<Response> {
    const data = await this.service.finalizeDraft(req.user, id);
    return res.status(200).send({
      status: 'success',
      code: 200,
      message: 'Draft undangan berhasil diselesaikan',
      data,
    });
  }

  @Get(':id/activation-offers')
  async getActivationOffers(
    @Request() req: { user: any },
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<Response> {
    const data = await this.service.getActivationOffers(req.user, id);
    return res.status(200).send({
      status: 'success',
      code: 200,
      message: 'Pilihan aktivasi ditemukan',
      data,
    });
  }

  @Post(':id/cart')
  async upsertCart(
    @Request() req: { user: any },
    @Param('id') id: string,
    @Body() body: { packageId?: string; kind?: string; themeIds?: string[] },
    @Res() res: Response,
  ): Promise<Response> {
    const data = await this.service.upsertCart(req.user, id, body);
    return res.status(200).send({
      status: 'success',
      code: 200,
      message: 'Keranjang berhasil diperbarui',
      data,
    });
  }

  @Get(':id/cart')
  async getCart(
    @Request() req: { user: any },
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<Response> {
    const data = await this.service.getCart(req.user, id);
    return res.status(200).send({
      status: 'success',
      code: 200,
      message: 'Keranjang ditemukan',
      data,
    });
  }

  @Post(':id/checkout/apply-voucher')
  async applyVoucher(
    @Request() req: { user: any },
    @Param('id') id: string,
    @Body() body: { code?: string },
    @Res() res: Response,
  ): Promise<Response> {
    const data = await this.service.applyVoucher(req.user, id, body.code ?? '');
    return res.status(200).send({
      status: 'success',
      code: 200,
      message: 'Voucher berhasil diterapkan',
      data,
    });
  }

  @Post(':id/checkout/create-payment')
  async createPayment(
    @Request() req: { user: any },
    @Param('id') id: string,
    @Body() body: { method?: string },
    @Res() res: Response,
  ): Promise<Response> {
    const data = await this.service.createPayment(req.user, id, body.method ?? '');
    return res.status(200).send({
      status: 'success',
      code: 200,
      message: 'Pembayaran berhasil dibuat',
      data,
    });
  }

  @Post(':id/theme-addons/cart')
  async upsertThemeAddonCart(
    @Request() req: { user: any },
    @Param('id') id: string,
    @Body() body: { themeIds?: string[] },
    @Res() res: Response,
  ): Promise<Response> {
    const data = await this.service.upsertThemeAddonCart(req.user, id, body.themeIds ?? []);
    return res.status(200).send({
      status: 'success',
      code: 200,
      message: 'Keranjang tema add-on berhasil diperbarui',
      data,
    });
  }

  @Get(':id/workspace')
  async getWorkspace(
    @Request() req: { user: any },
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<Response> {
    const data = await this.service.getWorkspace(req.user, id);
    return res.status(200).send({
      status: 'success',
      code: 200,
      message: 'Workspace SapaTamu ditemukan',
      data,
    });
  }

  @Get(':id/editor')
  async getEditor(
    @Request() req: { user: any },
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<Response> {
    const data = await this.service.getEditor(req.user, id);
    return res.status(200).send({
      status: 'success',
      code: 200,
      message: 'Editor invitation ditemukan',
      data,
    });
  }

  @Patch(':id/editor/document')
  async patchEditorDocument(
    @Request() req: { user: any },
    @Param('id') id: string,
    @Body() body: { baseVersion?: number; operations?: Array<Record<string, unknown>> },
    @Res() res: Response,
  ): Promise<Response> {
    const data = await this.service.patchEditorDocument(req.user, id, {
      baseVersion: body.baseVersion,
      operations: body.operations as any,
    });
    return res.status(200).send({
      status: 'success',
      code: 200,
      message: 'Perubahan editor berhasil disimpan',
      data,
    });
  }

  @Post(':id/editor/apply-theme')
  async applyEditorTheme(
    @Request() req: { user: any },
    @Param('id') id: string,
    @Body() body: { baseVersion?: number; themeId?: string },
    @Res() res: Response,
  ): Promise<Response> {
    const data = await this.service.applyEditorTheme(req.user, id, {
      baseVersion: body.baseVersion,
      themeId: body.themeId,
    });
    return res.status(200).send({
      status: 'success',
      code: 200,
      message: 'Tema editor berhasil diterapkan',
      data,
    });
  }

  @Post(':id/editor/theme-preview')
  async previewEditorTheme(
    @Request() req: { user: any },
    @Param('id') id: string,
    @Body() body: { themeId?: string },
    @Res() res: Response,
  ): Promise<Response> {
    const data = await this.service.previewEditorTheme(req.user, id, {
      themeId: body.themeId,
    });
    return res.status(200).send({
      status: 'success',
      code: 200,
      message: 'Preview tema editor berhasil dibuat',
      data,
    });
  }

  @Patch(':id/editor/pages/reorder')
  async reorderEditorPages(
    @Request() req: { user: any },
    @Param('id') id: string,
    @Body() body: { baseVersion?: number; orderedUniqueIds?: number[] },
    @Res() res: Response,
  ): Promise<Response> {
    const data = await this.service.reorderEditorPages(req.user, id, body);
    return res.status(200).send({
      status: 'success',
      code: 200,
      message: 'Urutan layout berhasil diperbarui',
      data,
    });
  }

  @Patch(':id/editor/pages/:uniqueId/toggle')
  async toggleEditorPage(
    @Request() req: { user: any },
    @Param('id') id: string,
    @Param('uniqueId') uniqueId: string,
    @Body() body: { baseVersion?: number; isActive?: boolean },
    @Res() res: Response,
  ): Promise<Response> {
    const data = await this.service.toggleEditorPage(req.user, id, Number(uniqueId), body);
    return res.status(200).send({
      status: 'success',
      code: 200,
      message: 'Status layout berhasil diperbarui',
      data,
    });
  }

  @Post(':id/editor/pages')
  async addEditorPage(
    @Request() req: { user: any },
    @Param('id') id: string,
    @Body() body: { baseVersion?: number; layoutCode?: string; afterUniqueId?: number },
    @Res() res: Response,
  ): Promise<Response> {
    const data = await this.service.addEditorPage(req.user, id, body);
    return res.status(201).send({
      status: 'success',
      code: 201,
      message: 'Layout berhasil ditambahkan',
      data,
    });
  }

  @Delete(':id/editor/pages/:uniqueId')
  async removeEditorPage(
    @Request() req: { user: any },
    @Param('id') id: string,
    @Param('uniqueId') uniqueId: string,
    @Body() body: { baseVersion?: number },
    @Res() res: Response,
  ): Promise<Response> {
    const data = await this.service.removeEditorPage(req.user, id, Number(uniqueId), body);
    return res.status(200).send({
      status: 'success',
      code: 200,
      message: 'Layout berhasil dihapus',
      data,
    });
  }

  @Post(':id/editor/media/upload')
  @UseInterceptors(
    SingleFileInterceptor('file', {
      allowedExts: SAPATAMU_EDITOR_ALLOWED_EXTENSIONS,
      allowedMimeTypes: SAPATAMU_EDITOR_ALLOWED_MIME_TYPES,
      maxFileSizeBytes: SAPATAMU_EDITOR_MAX_SIZE_BYTES,
    }),
  )
  async uploadEditorMedia(
    @Request() req: { user: any },
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
  ): Promise<Response> {
    const data = await this.service.uploadEditorMedia(req.user, id, file);
    return res.status(201).send({
      status: 'success',
      code: 201,
      message: 'Media editor berhasil diunggah',
      data,
    });
  }

  @Patch(':id/send')
  async updateSend(
    @Request() req: { user: any },
    @Param('id') id: string,
    @Body() body: Record<string, unknown>,
    @Res() res: Response,
  ): Promise<Response> {
    const data = await this.service.updateSend(req.user, id, body);
    return res.status(200).send({
      status: 'success',
      code: 200,
      message: 'Pengaturan pengiriman berhasil diperbarui',
      data,
    });
  }

  @Patch(':id/profiles')
  async updateProfiles(
    @Request() req: { user: any },
    @Param('id') id: string,
    @Body() body: Record<string, unknown>,
    @Res() res: Response,
  ): Promise<Response> {
    const data = await this.service.updateProfiles(req.user, id, body);
    return res.status(200).send({
      status: 'success',
      code: 200,
      message: 'Profil mempelai berhasil diperbarui',
      data,
    });
  }

  @Patch(':id/events')
  async updateEvents(
    @Request() req: { user: any },
    @Param('id') id: string,
    @Body() body: Record<string, unknown>,
    @Res() res: Response,
  ): Promise<Response> {
    const data = await this.service.updateEvents(req.user, id, body);
    return res.status(200).send({
      status: 'success',
      code: 200,
      message: 'Detail acara berhasil diperbarui',
      data,
    });
  }

  @Post(':id/album/upload')
  @UseInterceptors(
    SingleFileInterceptor('file', {
      allowedExts: SAPATAMU_ALBUM_ALLOWED_EXTENSIONS,
      allowedMimeTypes: SAPATAMU_ALBUM_ALLOWED_MIME_TYPES,
      maxFileSizeBytes: SAPATAMU_ALBUM_MAX_SIZE_BYTES,
    }),
  )
  async uploadAlbumImage(
    @Request() req: { user: any },
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
  ): Promise<Response> {
    const data = await this.service.uploadAlbumImage(req.user, id, file);
    return res.status(201).send({
      status: 'success',
      code: 201,
      message: 'Foto berhasil diunggah',
      data,
    });
  }

  @Delete(':id/album/:mediaId')
  async deleteAlbumImage(
    @Request() req: { user: any },
    @Param('id') id: string,
    @Param('mediaId') mediaId: string,
    @Res() res: Response,
  ): Promise<Response> {
    const data = await this.service.deleteAlbumImage(req.user, id, mediaId);
    return res.status(200).send({
      status: 'success',
      code: 200,
      message: 'Foto berhasil dihapus',
      data,
    });
  }

  @Post(':id/album/quota-checkout')
  async checkoutAlbumQuota(
    @Request() req: { user: any },
    @Param('id') id: string,
    @Body() body: { packageId?: string },
    @Res() res: Response,
  ): Promise<Response> {
    const data = await this.service.checkoutAlbumQuota(req.user, id, body.packageId ?? '');
    return res.status(200).send({
      status: 'success',
      code: 200,
      message: 'Kuota foto berhasil ditambahkan',
      data,
    });
  }

  @Patch(':id/settings')
  async updateSettings(
    @Request() req: { user: any },
    @Param('id') id: string,
    @Body() body: Record<string, unknown>,
    @Res() res: Response,
  ): Promise<Response> {
    const data = await this.service.updateSettings(req.user, id, body);
    return res.status(200).send({
      status: 'success',
      code: 200,
      message: 'Pengaturan undangan berhasil diperbarui',
      data,
    });
  }

  @Get(':id/history')
  async getHistory(
    @Request() req: { user: any },
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<Response> {
    const data = await this.service.listHistory(req.user, id);
    return res.status(200).send({
      status: 'success',
      code: 200,
      message: 'Riwayat undangan ditemukan',
      data,
    });
  }

  @Patch(':id/messages/:messageId')
  async moderateMessage(
    @Request() req: { user: any },
    @Param('id') id: string,
    @Param('messageId') messageId: string,
    @Body() body: { isApproved?: boolean },
    @Res() res: Response,
  ): Promise<Response> {
    const data = await this.service.moderateMessage(
      req.user,
      id,
      messageId,
      Boolean(body.isApproved),
    );
    return res.status(200).send({
      status: 'success',
      code: 200,
      message: 'Moderasi pesan berhasil diperbarui',
      data,
    });
  }

  @Delete(':id')
  async deleteInvitation(
    @Request() req: { user: any },
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<Response> {
    const data = await this.service.deleteInvitation(req.user, id);
    return res.status(200).send({
      status: 'success',
      code: 200,
      message: 'Undangan berhasil dihapus',
      data,
    });
  }
}
