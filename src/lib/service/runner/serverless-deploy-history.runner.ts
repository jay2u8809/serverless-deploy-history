import Serverless from 'serverless';
import { DeployInfoDto } from '../../interface/serverless-deploy-history.dto';
import { DeployHistoryCustom } from '../../interface/deploy-history-custom.interface';
import { Config } from '../../interface/deploy-history.config';
import { DeployHistoryHelper } from '../helper/deploy-history.helper';
import { MessageHelper } from '../helper/message.helper';

export class ServerlessDeployHistoryRunner {
  constructor(
    private readonly serverless: Serverless,
    private readonly options: Serverless.Options,
  ) {}

  async exec(): Promise<boolean> {
    const dto = this.initDeployHistoryDto();
    return this.sendNotification(dto);
  }

  // === private ===
  private async sendNotification(dto: DeployInfoDto): Promise<boolean> {
    const custom = this.getSlsCustomInfo();
    const url = custom.slack.webhook;

    if (!url) {
      console.error(
        'serverless-deploy-history: slack.webhook is not configured',
      );
      return false;
    }

    // make rich message
    const data = MessageHelper.makeRichMessageTemplate(
      dto,
      custom.slack.title || Config.Slack.title,
    );
    // send slack message
    return MessageHelper.sendSlackMessage(url, data);
  }

  private initDeployHistoryDto(): DeployInfoDto {
    return DeployHistoryHelper.generateDeployHistoryDto(
      this.serverless.service.service,
      this.options.stage,
    );
  }

  private getSlsCustomInfo(): DeployHistoryCustom {
    return this.serverless.service.custom[Config.Title] as DeployHistoryCustom;
  }
}
