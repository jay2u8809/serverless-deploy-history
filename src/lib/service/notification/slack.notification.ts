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
      parsed.hostname === 'hooks.slack.com' &&
      parsed.pathname.startsWith('/services/')
    );
  } catch {
    return false;
  }
};

const makeMessageTemplate = (dto: DeployInfoDto, title: string): object => {
  const fields = [
    ['name', dto.name],
    ['stage', dto.stage],
    ['branch', dto.branch],
    ['revision', dto.revision],
    ['end_at', dto.endAt],
    ['local_end_at', dto.localEndAt],
    ['user', dto.userName],
  ].map(([key, value]) => ({
    type: 'mrkdwn',
    text: `*${key.toUpperCase()}: *\n ${value}`,
  }));

  return {
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `[${dto.stage}] *${title}*`,
        },
      },
      {
        type: 'section',
        fields,
      },
    ],
  };
};

export const SlackNotification: NotificationSender = {
  async send(dto: DeployInfoDto, config: NotificationConfig): Promise<boolean> {
    if (!isValidWebhookUrl(config.webhook)) {
      console.error(
        `serverless-deploy-history: invalid slack webhook url: ${config.webhook}`,
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
      const text = await response.text();
      return text === 'ok';
    } catch (err) {
      console.error('fail-send-slack', err.message);
      return false;
    }
  },
};
