import { Injectable, OnModuleInit, INestApplication } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaClientService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    // this.$on('beforeExit', async () => {
    //   app.close();
    // });
  }
}
