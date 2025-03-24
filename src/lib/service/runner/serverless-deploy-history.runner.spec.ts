import { ServerlessDeployHistoryRunner } from './serverless-deploy-history.runner';

const TAG = 'ServerlessDeployHistoryRunnerSpec';

const DUMMY = {
  Serverless: {
    service: {
      service: 'Dummy-Service',
      custom: {
        serverlessDeployHistory: {
          stage: ['Dummy-dev', 'Dummy-staging'],
          slack: {
            title: 'Dummy-Title',
            webhook: 'https://localhost:3000/services',
          },
        },
      },
    },
  },
  Options: {
    stage: 'Dummy-dev',
  },
};

describe('ServerlessDeployHistoryRunnerSpec', () => {
  let runner: ServerlessDeployHistoryRunner;

  beforeEach(async () => {
    const serverless: any = DUMMY.Serverless;
    const options: any = DUMMY.Options;
    runner = new ServerlessDeployHistoryRunner(serverless, options);
  });

  it('defined', () => {
    expect(runner).toBeDefined();
  });

  describe('SendSlackMessageRunnerUnit', () => {
    it('runner', async () => {
      // given
      const serverless: any = { ...DUMMY.Serverless };
      const options: any = { ...DUMMY.Options };
      runner = new ServerlessDeployHistoryRunner(serverless, options);

      const sendSlackMessage = jest
        .spyOn(runner as any, 'sendSlackMessage')
        .mockImplementation(async (message: unknown) => {
          console.log(
            TAG,
            'mock-send-slack-msg',
            JSON.stringify(message, null, 2),
          );
          return message;
        });

      // when
      const result = await runner.run();
      console.log(TAG, 'result', JSON.stringify(result, null, 2));

      // then
      expect(result).toBeDefined();
      expect(sendSlackMessage).toHaveBeenCalledTimes(1);
    }, 999_999_999);

    it('runner: NG - No target stage', async () => {
      // given
      const serverless: any = { ...DUMMY.Serverless };
      const options: any = { ...DUMMY.Options };
      options.stage = 'Dummy-prod';
      runner = new ServerlessDeployHistoryRunner(serverless, options);

      const sendSlackMessage = jest
        .spyOn(runner as any, 'sendSlackMessage')
        .mockImplementation(async (message: unknown) => {
          console.log(
            TAG,
            'mock-send-slack-msg',
            JSON.stringify(message, null, 2),
          );
          return message;
        });

      // when
      const result = await runner.run();
      console.log(TAG, 'result', JSON.stringify(result, null, 2));

      // then
      expect(result).toBeDefined();
      expect(sendSlackMessage).toHaveBeenCalledTimes(0);
    }, 999_999_999);

    it('runner: NG - No setting file(slack)', async () => {
      // given
      const serverless: any = { ...DUMMY.Serverless };
      const options: any = { ...DUMMY.Options };
      serverless.service.custom.serverlessDeployHistory = {
        stage: ['Dummy-dev', 'Dummy-staging'],
      };
      runner = new ServerlessDeployHistoryRunner(serverless, options);

      const sendSlackMessage = jest
        .spyOn(runner as any, 'sendSlackMessage')
        .mockImplementation(async (message: unknown) => {
          console.log(
            TAG,
            'mock-send-slack-msg',
            JSON.stringify(message, null, 2),
          );
          return message;
        });

      // when
      const result = await runner.run();
      console.log(TAG, 'result', JSON.stringify(result, null, 2));

      // then
      expect(result).toBeDefined();
      expect(sendSlackMessage).toHaveBeenCalledTimes(0);
    }, 999_999_999);
  });
});
