import { DeployInfoDto } from '../../interface/serverless-deploy-history.dto';
import {
  NotificationConfig,
  NotificationSender,
} from './notification.interface';

const isValidWebhookUrl = (url: string): boolean => {
  try {
    const parsed = new URL(url);
    return (
      parsed.protocol === 'https:' &&
      parsed.hostname === 'discord.com' &&
      parsed.pathname.startsWith('/api/webhooks/')
    );
  } catch {
    return false;
  }
};

const makeMessageTemplate = (dto: DeployInfoDto, title: string): object => {
  const fields = [
    { name: 'NAME', value: dto.name },
    { name: 'STAGE', value: dto.stage },
    { name: 'BRANCH', value: dto.branch },
    { name: 'REVISION', value: dto.revision },
    { name: 'END_AT', value: dto.endAt },
    { name: 'LOCAL_END_AT', value: dto.localEndAt },
    { name: 'USER', value: dto.userName },
  ].map((field) => ({ ...field, inline: true }));

  return {
    embeds: [
      {
        title: `[${dto.stage}] ${title}`,
        fields,
      },
    ],
  };
};

export const DiscordNotification: NotificationSender = {
  async send(dto: DeployInfoDto, config: NotificationConfig): Promise<boolean> {
    if (!isValidWebhookUrl(config.webhook)) {
      console.error(
        `serverless-deploy-history: invalid discord webhook url: ${config.webhook}`,
      );
      return false;
    }

    const data = makeMessageTemplate(dto, config.title);

    try {
      const response = await fetch(config.webhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      // Discord returns 204 No Content on success
      return response.status === 204;
    } catch (err) {
      console.error('fail-send-discord', err.message);
      return false;
    }
  },
};
