import { SlackNotification } from './slack.notification';
import { DeployHistoryHelper } from '../helper/deploy-history.helper';

jest.mock('node:child_process', () => ({
  execSync: jest.fn().mockReturnValue('mocked\n'),
}));

const TAG = 'SlackNotificationUnitTest';

const VALID_WEBHOOK = 'https://hooks.slack.com/services/T000/B000/token';

describe('slack notification unit test', () => {
  let dto: ReturnType<typeof DeployHistoryHelper.generateDeployHistoryDto>;

  beforeEach(() => {
    dto = DeployHistoryHelper.generateDeployHistoryDto('fake-service', 'dev');
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('send', () => {
    it('OK: sends message and returns true on success', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        text: async () => 'ok',
      });

      const result = await SlackNotification.send(dto, {
        webhook: VALID_WEBHOOK,
        title: 'fake-title',
      });
      console.debug(TAG, 'result', result);

      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(global.fetch).toHaveBeenCalledWith(
        VALID_WEBHOOK,
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        }),
      );
      expect(result).toBe(true);
    });

    it('OK: request body contains blocks with stage and title', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        text: async () => 'ok',
      });

      await SlackNotification.send(dto, {
        webhook: VALID_WEBHOOK,
        title: 'my-title',
      });

      const body = JSON.parse(
        (global.fetch as jest.Mock).mock.calls[0][1].body,
      );
      console.debug(TAG, 'body', JSON.stringify(body, null, 2));

      expect(body).toHaveProperty('blocks');
      expect(body.blocks[0].text.text).toContain('dev');
      expect(body.blocks[0].text.text).toContain('my-title');
      expect(body.blocks[1].fields.length).toBeGreaterThan(0);
    });

    it('OK: sends message without title', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        text: async () => 'ok',
      });

      const result = await SlackNotification.send(dto, {
        webhook: VALID_WEBHOOK,
      });
      console.debug(TAG, 'result (no title)', result);

      expect(result).toBe(true);
    });

    it('FAIL: returns false when slack responds with non-ok', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        text: async () => 'error',
      });

      const result = await SlackNotification.send(dto, {
        webhook: VALID_WEBHOOK,
        title: 'fake-title',
      });

      expect(result).toBe(false);
    });

    it('FAIL: returns false when fetch throws', async () => {
      (global.fetch as jest.Mock).mockRejectedValue(new Error('network error'));

      const result = await SlackNotification.send(dto, {
        webhook: VALID_WEBHOOK,
        title: 'fake-title',
      });

      expect(result).toBe(false);
    });
  });

  describe('URL validation', () => {
    const invalidUrls = [
      'https://invalid.com/webhook',
      'http://hooks.slack.com/services/T000/B000/token', // http not https
      'https://hooks.slack.com/other/T000/B000/token', // wrong path
      'not-a-url',
      '',
    ];

    it.each(invalidUrls)(
      'FAIL: returns false for invalid url "%s"',
      async (url) => {
        const result = await SlackNotification.send(dto, { webhook: url });
        console.debug(TAG, 'invalid url result', url, result);

        expect(global.fetch).not.toHaveBeenCalled();
        expect(result).toBe(false);
      },
    );
  });
});
