import { DeployInfoDto } from '../../interface/serverless-deploy-history.dto';

const sendSlackMessage = async (url: string, data: object): Promise<boolean> => {
  try {
    const response = await fetch(url, {
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
};

const makeRichMessageTemplate = (dto: DeployInfoDto, title: string): object => {
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

export const MessageHelper = {
  sendSlackMessage,
  makeRichMessageTemplate,
};
