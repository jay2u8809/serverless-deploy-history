import * as childProcess from 'node:child_process';
import { DeployHistoryHelper } from './deploy-history.helper';
import { Config } from '../../config/deploy-history.config';

jest.mock('node:child_process');

const TAG = 'DeployHistoryHelperUnitTest';

describe('deploy history helper unit test', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('execGitPrintCommand', () => {
    it('OK: returns trimmed string on success', () => {
      (childProcess.execSync as jest.Mock).mockReturnValue('main\n');

      const result = DeployHistoryHelper.execGitPrintCommand(
        'git branch --show-current',
      );
      console.debug(TAG, result);

      expect(result).toBe('main');
    });

    it('OK: returns empty string when command outputs nothing (detached HEAD)', () => {
      (childProcess.execSync as jest.Mock).mockReturnValue('\n');

      const result = DeployHistoryHelper.execGitPrintCommand(
        'git branch --show-current',
      );
      console.debug(TAG, result);

      // detached HEAD 상태에서는 빈 문자열('')이 반환되며, null이 아니어야 함
      expect(result).not.toBeNull();
      expect(result).toBe('');
    });

    it('FAIL: returns null when command throws', () => {
      (childProcess.execSync as jest.Mock).mockImplementation(() => {
        throw new Error('not a git repository');
      });

      const result = DeployHistoryHelper.execGitPrintCommand(
        'git branch --show-current',
      );
      console.debug(TAG, result);

      expect(result).toBeNull();
    });
  });

  describe('generateDeployHistoryDto', () => {
    it('OK: returns dto with correct name and default stage', () => {
      (childProcess.execSync as jest.Mock).mockReturnValue('value\n');

      const name = 'my-service';
      const result = DeployHistoryHelper.generateDeployHistoryDto(name);
      console.debug(TAG, result);

      expect(result.name).toBe(name);
      expect(result.stage).toBe('dev');
      expect(result).toHaveProperty('endAt');
      expect(result).toHaveProperty('localEndAt');
    });

    it('OK: uses given stage when provided', () => {
      (childProcess.execSync as jest.Mock).mockReturnValue('value\n');

      const result = DeployHistoryHelper.generateDeployHistoryDto(
        'my-service',
        'prod',
      );
      console.debug(TAG, result);

      expect(result.stage).toBe('prod');
    });

    it('OK: uses fallback values when git commands fail', () => {
      (childProcess.execSync as jest.Mock).mockImplementation(() => {
        throw new Error('not a git repository');
      });

      const result = DeployHistoryHelper.generateDeployHistoryDto('my-service');
      console.debug(TAG, result);

      expect(result.userName).toBe(Config.Fallback.USER_NAME);
      expect(result.branch).toBe(Config.Fallback.BRANCH_NAME);
      expect(result.revision).toBe(Config.Fallback.REVISION);
    });
  });
});
