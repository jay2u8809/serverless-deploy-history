import Serverless from 'serverless';
import { DeployInfoDto } from '../interface/serverless-deploy-history.dto';
import { DeployHistoryCustom } from '../interface/deploy-history-custom.interface';
import { Config } from '../config/deploy-history.config';
import { DeployHistoryHelper } from './helper/deploy-history.helper';
import { SlackNotification } from './notification/slack.notification';
import { DiscordNotification } from './notification/discord.notification';

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
    const tasks: Promise<boolean>[] = [];

    if (custom.slack?.webhook) {
      tasks.push(
        SlackNotification.send(dto, {
          webhook: custom.slack.webhook,
          title: custom.slack.title || Config.Slack.title,
        }),
      );
    }

    if (custom.discord?.webhook) {
      tasks.push(
        DiscordNotification.send(dto, {
          webhook: custom.discord.webhook,
          title: custom.discord.title || Config.Slack.title,
        }),
      );
    }

    if (tasks.length === 0) {
      console.error(
        'serverless-deploy-history: no webhook is configured (slack or discord)',
      );
      return false;
    }

    const results = await Promise.all(tasks);
    return results.every(Boolean);
  }

  private initDeployHistoryDto(): DeployInfoDto {
    return DeployHistoryHelper.generateDeployHistoryDto(
      this.serverless.service.service,
      this.options.stage,
    );
  }

  private getSlsCustomInfo(): DeployHistoryCustom {
    const custom = this.serverless.service.custom?.[
      Config.Title
    ] as DeployHistoryCustom;
    if (!custom?.slack && !custom?.discord) {
      throw new Error(
        'serverless-deploy-history: configuration is missing in serverless.yml',
      );
    }
    return custom;
  }
}
