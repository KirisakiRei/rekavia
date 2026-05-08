import { Injectable } from '@nestjs/common';
import type { User } from 'generated/prisma';
import { SapatamuService } from 'src/sapatamu/sapatamu.service';

type AuthRequestUser = {
  accountId: string;
  role: string;
  data?: User | null;
};

@Injectable()
export class CmsService {
  constructor(private readonly sapatamuService: SapatamuService) {}

  async home(authUser: AuthRequestUser) {
    return this.sapatamuService.getCmsHome(authUser);
  }
}
