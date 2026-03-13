import axios from 'axios';
import { DeployInfoDto } from '../../interface/serverless-deploy-history.dto';

const sendSlackMessage = async (url: string, data: any): Promise<boolean> => {
  try {
    // send slack message
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const response = await axios.post(url, data, config);
    // return
    return response.data === 'ok';
  } catch (err) {
    console.error('fail-send-slack', err.message);
    return false;
  }
};

const makeRichMessageTemplate = (dto: DeployInfoDto, title: string): object => {
  const map = new Map<string, string>()
    .set('name', dto.name)
    .set('stage', dto.stage)
    .set('branch', dto.branch)
    .set('revision', dto.revision)
    .set('end_at', dto.endAt)
    .set('local_end_at', dto.localEndAt)
    .set('user', dto.userName);
  // return
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
        fields: [...map.entries()].map((item: [string, string]) => {
          return {
            type: 'mrkdwn',
            text: `*${item[0].toUpperCase()}: *\n ${item[1]}`,
          };
        }),
      },
    ],
  };
};

export const MessageHelper = {
  sendSlackMessage,
  makeRichMessageTemplate,
};
