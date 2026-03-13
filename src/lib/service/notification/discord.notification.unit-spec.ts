import { DiscordNotification } from './discord.notification';
import { DeployHistoryHelper } from '../helper/deploy-history.helper';

const TAG = 'DiscordNotificationUnitTest';

const VALID_WEBHOOK = 'https://discord.com/api/webhooks/000000/token';
const INVALID_WEBHOOK = 'https://invalid.com/webhook';

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
        expect.objectContaining({ method: 'POST' }),
      );
      expect(result).toBe(true);
    });

    it('FAIL: returns false when discord responds with non-204', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({ status: 400 });

      const result = await DiscordNotification.send(dto, {
        webhook: VALID_WEBHOOK,
        title: 'fake-title',
      });
      console.debug(TAG, 'result', result);

      expect(result).toBe(false);
    });

    it('FAIL: returns false for invalid webhook url', async () => {
      const result = await DiscordNotification.send(dto, {
        webhook: INVALID_WEBHOOK,
        title: 'fake-title',
      });
      console.debug(TAG, 'result', result);

      expect(global.fetch).not.toHaveBeenCalled();
      expect(result).toBe(false);
    });

    it('FAIL: returns false when fetch throws', async () => {
      (global.fetch as jest.Mock).mockRejectedValue(new Error('network error'));

      const result = await DiscordNotification.send(dto, {
        webhook: VALID_WEBHOOK,
        title: 'fake-title',
      });
      console.debug(TAG, 'result', result);

      expect(result).toBe(false);
    });
  });
});
