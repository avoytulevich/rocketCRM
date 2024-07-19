import { Module } from '@nestjs/common';
import { AmocrmService } from './amocrm.service';
import { AmocrmController } from './amocrm.controller';

@Module({
  providers: [AmocrmService],
  controllers: [AmocrmController]
})
export class AmocrmModule {}
