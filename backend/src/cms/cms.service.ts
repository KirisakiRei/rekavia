import { ForbiddenException, Injectable } from '@nestjs/common';
import type { User } from 'generated/prisma';
import { DatabaseService } from 'src/database/database.service';
import { SapatamuService } from 'src/sapatamu/sapatamu.service';

type AuthRequestUser = {
  accountId: string;
  role: string;
  data?: User | null;
};

@Injectable()
export class CmsService {
  constructor(
    private readonly sapatamuService: SapatamuService,
    private readonly db: DatabaseService,
  ) {}

  private async getCurrentUser(authUser: AuthRequestUser): Promise<User> {
    if (authUser.data?.id) {
      return authUser.data;
    }

    const user = await this.db.user.findFirst({
      where: {
        account_id: authUser.accountId,
        deleted_at: null,
      },
    });

    if (!user) {
      throw new ForbiddenException('Profil pengguna tidak ditemukan.');
    }

    return user;
  }

  async home(authUser: AuthRequestUser) {
    return this.sapatamuService.getCmsHome(authUser);
  }

  async langganan(authUser: AuthRequestUser) {
    const user = await this.getCurrentUser(authUser);

    const [orders, licenses, templates, packages, invitations] = await Promise.all([
      this.db.order.findMany({
        where: {
          user_id: user.id,
          deleted_at: null,
        },
        orderBy: { created_at: 'desc' },
        take: 50,
        select: {
          id: true,
          user_id: true,
          status: true,
          total_amount: true,
          checkout_token: true,
          expired_at: true,
          created_at: true,
        },
      }),
      this.db.userTemplateLicense.findMany({
        where: {
          user_id: user.id,
          deleted_at: null,
        },
        orderBy: { created_at: 'desc' },
        take: 50,
        select: {
          id: true,
          user_id: true,
          template_id: true,
          package_id: true,
          order_item_id: true,
          status: true,
          activated_at: true,
          created_at: true,
        },
      }),
      this.db.invitationTemplate.findMany({
        where: {
          deleted_at: null,
        },
        orderBy: { created_at: 'desc' },
        take: 100,
        select: {
          id: true,
          code: true,
          name: true,
          category: true,
        },
      }),
      this.db.package.findMany({
        where: {
          deleted_at: null,
        },
        orderBy: { created_at: 'desc' },
        take: 100,
        select: {
          id: true,
          code: true,
          name: true,
          price: true,
          package_type: true,
        },
      }),
      this.db.invitation.findMany({
        where: {
          user_id: user.id,
          deleted_at: null,
        },
        orderBy: { created_at: 'desc' },
        take: 50,
        select: {
          id: true,
          title: true,
          bride_name: true,
          groom_name: true,
          template_id: true,
        },
      }),
    ]);

    const orderIds = orders.map((order) => order.id);
    const [payments, orderItems] = orderIds.length
      ? await Promise.all([
          this.db.payment.findMany({
            where: {
              order_id: { in: orderIds },
              deleted_at: null,
            },
            orderBy: { created_at: 'desc' },
            take: 500,
            select: {
              id: true,
              order_id: true,
              method: true,
              status: true,
              amount: true,
              metadata: true,
              created_at: true,
              paid_at: true,
            },
          }),
          this.db.orderItem.findMany({
            where: {
              order_id: { in: orderIds },
              deleted_at: null,
            },
            orderBy: { created_at: 'desc' },
            take: 500,
            select: {
              id: true,
              order_id: true,
              template_id: true,
              package_id: true,
              subtotal: true,
              metadata: true,
            },
          }),
        ])
      : [[], []];

    return {
      orders,
      licenses,
      templates,
      packages,
      payments,
      orderItems,
      invitations,
    };
  }
}
