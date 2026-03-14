import { ServerlessDeployHistoryRunner } from './serverless-deploy-history.runner';
import { SlackNotification } from './notification/slack.notification';
import { DiscordNotification } from './notification/discord.notification';
import { Config } from '../config/deploy-history.config';

jest.mock('node:child_process', () => ({
  execSync: jest.fn().mockReturnValue('mocked\n'),
}));

jest.mock('./notification/slack.notification');
jest.mock('./notification/discord.notification');

const TAG = 'ServerlessDeployHistoryRunnerUnitTest';

const SLACK_WEBHOOK = 'https://hooks.slack.com/services/T000/B000/token';
const DISCORD_WEBHOOK = 'https://discord.com/api/webhooks/000000/token';

const createMockServerless = (custom: object) =>
  ({
    service: {
      service: 'test-service',
      custom,
    },
  }) as any;

const createMockOptions = (stage = 'dev') => ({ stage }) as any;

describe('serverless deploy history runner unit test', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('getSlsCustomInfo', () => {
    it('FAIL: throws when custom config is missing entirely', async () => {
      const runner = new ServerlessDeployHistoryRunner(
        createMockServerless({}),
        createMockOptions(),
      );

      await expect(runner.exec()).rejects.toThrow(
        'configuration is missing in serverless.yml',
      );
    });

    it('FAIL: throws when custom exists but neither slack nor discord is set', async () => {
      const runner = new ServerlessDeployHistoryRunner(
        createMockServerless({ [Config.Title]: {} }),
        createMockOptions(),
      );

      await expect(runner.exec()).rejects.toThrow(
        'configuration is missing in serverless.yml',
      );
    });
  });

  describe('sendNotification', () => {
    it('OK: sends slack only when only slack is configured', async () => {
      (SlackNotification.send as jest.Mock).mockResolvedValue(true);

      const runner = new ServerlessDeployHistoryRunner(
        createMockServerless({
          [Config.Title]: { slack: { webhook: SLACK_WEBHOOK } },
        }),
        createMockOptions(),
      );
      const result = await runner.exec();
      console.debug(TAG, 'slack only', result);

      expect(SlackNotification.send).toHaveBeenCalledTimes(1);
      expect(DiscordNotification.send).not.toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('OK: sends discord only when only discord is configured', async () => {
      (DiscordNotification.send as jest.Mock).mockResolvedValue(true);

      const runner = new ServerlessDeployHistoryRunner(
        createMockServerless({
          [Config.Title]: { discord: { webhook: DISCORD_WEBHOOK } },
        }),
        createMockOptions(),
      );
      const result = await runner.exec();
      console.debug(TAG, 'discord only', result);

      expect(DiscordNotification.send).toHaveBeenCalledTimes(1);
      expect(SlackNotification.send).not.toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('OK: sends both when slack and discord are configured', async () => {
      (SlackNotification.send as jest.Mock).mockResolvedValue(true);
      (DiscordNotification.send as jest.Mock).mockResolvedValue(true);

      const runner = new ServerlessDeployHistoryRunner(
        createMockServerless({
          [Config.Title]: {
            slack: { webhook: SLACK_WEBHOOK },
            discord: { webhook: DISCORD_WEBHOOK },
          },
        }),
        createMockOptions(),
      );
      const result = await runner.exec();
      console.debug(TAG, 'both', result);

      expect(SlackNotification.send).toHaveBeenCalledTimes(1);
      expect(DiscordNotification.send).toHaveBeenCalledTimes(1);
      expect(result).toBe(true);
    });

    it('OK: uses default title when title is not configured', async () => {
      (SlackNotification.send as jest.Mock).mockResolvedValue(true);

      const runner = new ServerlessDeployHistoryRunner(
        createMockServerless({
          [Config.Title]: { slack: { webhook: SLACK_WEBHOOK } },
        }),
        createMockOptions(),
      );
      await runner.exec();

      expect(SlackNotification.send).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ title: Config.Slack.title }),
      );
    });

    it('FAIL: returns false when one of the notifications fails', async () => {
      (SlackNotification.send as jest.Mock).mockResolvedValue(true);
      (DiscordNotification.send as jest.Mock).mockResolvedValue(false);

      const runner = new ServerlessDeployHistoryRunner(
        createMockServerless({
          [Config.Title]: {
            slack: { webhook: SLACK_WEBHOOK },
            discord: { webhook: DISCORD_WEBHOOK },
          },
        }),
        createMockOptions(),
      );
      const result = await runner.exec();
      console.debug(TAG, 'partial fail', result);

      expect(result).toBe(false);
    });

    it('FAIL: returns false when webhook is not set despite slack key existing', async () => {
      const errorSpy = jest.spyOn(console, 'error').mockImplementation();

      const runner = new ServerlessDeployHistoryRunner(
        createMockServerless({
          [Config.Title]: { slack: { title: 'no-webhook' } },
        }),
        createMockOptions(),
      );
      const result = await runner.exec();
      console.debug(TAG, 'no webhook', result);

      expect(SlackNotification.send).not.toHaveBeenCalled();
      expect(result).toBe(false);
      expect(errorSpy).toHaveBeenCalledWith(
        expect.stringContaining('no webhook is configured'),
      );
      errorSpy.mockRestore();
    });
  });
});
