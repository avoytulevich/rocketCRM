import { Controller, Get, Query } from '@nestjs/common';
import { AmocrmService } from './amocrm.service';

@Controller('api/leads')
export class AmocrmController {
  constructor(private readonly amocrmService: AmocrmService) {}

  @Get()
  async getLeads(@Query('query') query: string) {
    return this.amocrmService.computedLeadsInfo(query);
  }
}
