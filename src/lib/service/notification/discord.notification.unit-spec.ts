import { DiscordNotification } from './discord.notification';
import { DeployHistoryHelper } from '../helper/deploy-history.helper';

jest.mock('node:child_process', () => ({
  execSync: jest.fn().mockReturnValue('mocked\n'),
}));

const TAG = 'DiscordNotificationUnitTest';

const VALID_WEBHOOK = 'https://discord.com/api/webhooks/000000/token';

describe('discord notification unit test', () => {
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
      (global.fetch as jest.Mock).mockResolvedValue({ status: 204 });

      const result = await DiscordNotification.send(dto, {
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

    it('OK: request body contains embeds with stage and title', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({ status: 204 });

      await DiscordNotification.send(dto, {
        webhook: VALID_WEBHOOK,
        title: 'my-title',
      });

      const body = JSON.parse(
        (global.fetch as jest.Mock).mock.calls[0][1].body,
      );
      console.debug(TAG, 'body', JSON.stringify(body, null, 2));

      expect(body).toHaveProperty('embeds');
      expect(body.embeds[0].title).toContain('dev');
      expect(body.embeds[0].title).toContain('my-title');
      expect(body.embeds[0].fields.length).toBeGreaterThan(0);
      expect(body.embeds[0].fields[0]).toHaveProperty('inline', true);
    });

    it('OK: sends message without title', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({ status: 204 });

      const result = await DiscordNotification.send(dto, {
        webhook: VALID_WEBHOOK,
      });
      console.debug(TAG, 'result (no title)', result);

      expect(result).toBe(true);
    });

    it('FAIL: returns false when discord responds with non-204', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({ status: 400 });

      const result = await DiscordNotification.send(dto, {
        webhook: VALID_WEBHOOK,
        title: 'fake-title',
      });

      expect(result).toBe(false);
    });

    it('FAIL: returns false when fetch throws', async () => {
      (global.fetch as jest.Mock).mockRejectedValue(new Error('network error'));

      const result = await DiscordNotification.send(dto, {
        webhook: VALID_WEBHOOK,
        title: 'fake-title',
      });

      expect(result).toBe(false);
    });
  });

  describe('URL validation', () => {
    const invalidUrls = [
      'https://invalid.com/webhook',
      'http://discord.com/api/webhooks/000000/token', // http not https
      'https://discord.com/other/webhooks/000000/token', // wrong path
      'not-a-url',
      '',
    ];

    it.each(invalidUrls)(
      'FAIL: returns false for invalid url "%s"',
      async (url) => {
        const result = await DiscordNotification.send(dto, { webhook: url });
        console.debug(TAG, 'invalid url result', url, result);

        expect(global.fetch).not.toHaveBeenCalled();
        expect(result).toBe(false);
      },
    );
  });
});
