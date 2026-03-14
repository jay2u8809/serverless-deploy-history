import { ServerlessDeployHistory } from './serverless-deploy-history';
import { ServerlessDeployHistoryRunner } from './service/serverless-deploy-history.runner';

jest.mock('./service/serverless-deploy-history.runner');

const TAG = 'ServerlessDeployHistoryUnitTest';

const createMockServerless = () =>
  ({
    service: {
      service: 'test-service',
      custom: {},
    },
  }) as any;

const createMockOptions = () => ({ stage: 'dev' }) as any;

describe('serverless deploy history unit test', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('afterDeploy', () => {
    it('OK: does not warn when runner returns true', async () => {
      (ServerlessDeployHistoryRunner.prototype.exec as jest.Mock).mockResolvedValue(true);
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation();

      const plugin = new ServerlessDeployHistory(
        createMockServerless(),
        createMockOptions(),
      );
      await plugin.afterDeploy();
      console.debug(TAG, 'no warn case');

      expect(warnSpy).not.toHaveBeenCalled();
      warnSpy.mockRestore();
    });

    it('FAIL: warns when runner returns false', async () => {
      (ServerlessDeployHistoryRunner.prototype.exec as jest.Mock).mockResolvedValue(false);
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation();

      const plugin = new ServerlessDeployHistory(
        createMockServerless(),
        createMockOptions(),
      );
      await plugin.afterDeploy();
      console.debug(TAG, 'warn case (false result)');

      expect(warnSpy).toHaveBeenCalledTimes(1);
      warnSpy.mockRestore();
    });

    it('FAIL: warns with error message when runner throws', async () => {
      (ServerlessDeployHistoryRunner.prototype.exec as jest.Mock).mockRejectedValue(
        new Error('something went wrong'),
      );
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation();

      const plugin = new ServerlessDeployHistory(
        createMockServerless(),
        createMockOptions(),
      );
      await plugin.afterDeploy();
      console.debug(TAG, 'warn case (throws)');

      expect(warnSpy).toHaveBeenCalledTimes(1);
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining('something went wrong'),
      );
      warnSpy.mockRestore();
    });
  });
});
