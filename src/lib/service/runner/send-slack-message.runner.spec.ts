import { SendSlackMessageRunner } from './send-slack-message.runner';

const TAG = 'SendSlackMessageRunnerSpec';

const DUMMY = {
  History: {
    name: 'Dummy-Service',
    stage: 'Dummy-dev',
    branch: 'Dummy-branch',
    revision: 'Dummy-revision',
    endAt: '2024-01-01T12:50:50.134Z',
    localEndAt: '2024-01-01T21:50:50.134Z',
    userName: 'Dummy-userName',
  },
  Custom: {
    stage: ['Dummy-dev', 'Dummy-staging'],
    slack: {
      title: 'Dummy-Title',
      webhook: 'https://localhost:3000/services',
    },
  },
};

describe('SendSlackMessageRunnerSpec', () => {
  let runner: SendSlackMessageRunner;

  beforeEach(async () => {
    const history: any = DUMMY.History;
    const custom: any = DUMMY.Custom;
    runner = new SendSlackMessageRunner(history, custom);
  });

  it('defined', () => {
    expect(runner).toBeDefined();
  });

  describe('SendSlackMessageRunnerUnit', () => {
    it('runner', async () => {
      // given
      const sendSlackMessage = jest
        .spyOn(runner as any, 'sendSlackMessage')
        .mockImplementation(async (message: unknown) => {
          console.log('mock-send-slack-msg', JSON.stringify(message, null, 2));
          return message;
        });

      // when
      const result = await runner.run();
      console.log(TAG, 'result', JSON.stringify(result, null, 2));

      // then
      expect(result).toBeDefined();
      expect(sendSlackMessage).toHaveBeenCalledTimes(1);
    }, 999_999_999);
  });
});
