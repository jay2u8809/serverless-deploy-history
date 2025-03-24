import { DeployHistoryCustom } from '../../interface/deploy-history-custom.interface';
import { Config } from '../../interface/deploy-history.config';
import { ServerlessDeployHistoryDto } from '../../interface/serverless-deploy-history.dto';
import { Helper } from '../helper/deploy-history.helper';
import { SlackMessageDto } from '../../interface/result/slack-message.dto';

const TAG = 'SendSlackMessageRunner';

export class SendSlackMessageRunner {
  constructor(
    private readonly history: ServerlessDeployHistoryDto,
    private readonly custom: DeployHistoryCustom,
  ) {}

  public async run(): Promise<boolean> {
    // generate message
    const message = this.generateRichMessage();
    // send message
    return this.sendSlackMessage(message);
  }

  // === private ===
  private generateRichMessage(): unknown {
    // title
    const title = this.custom.slack.title || Config.Slack.title;
    // set data
    const data: SlackMessageDto = new SlackMessageDto();
    data.deployHistoryMessage = this.history;
    // generate message template
    return {
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `[${this.history.stage.toUpperCase()}] *${title}*`,
          },
        },
        {
          type: 'section',
          fields: Object.keys(data).map((key: string) => {
            return {
              type: 'mrkdwn',
              text: `*${key.toUpperCase()}: *\n ${data[key]}`,
            };
          }),
        },
      ],
    };
  }

  private async sendSlackMessage(message: unknown): Promise<boolean> {
    // webhook url
    const url = this.custom.slack.webhook;
    try {
      // send slack message
      const response = await Helper.sendMessage(url, message);
      return response.data === 'ok';
    } catch (err) {
      console.error(TAG, 'fail-send-slack-message', err.message);
      throw new Error('fail-send-slack-message');
    }
  }
}
