import { DeployHistoryHelper } from './deploy-history.helper';

const TAG = 'DeployHistoryHelperUnitTest';

describe('deploy history helper unit test', () => {
  describe('execCommand', () => {
    it('OK: get git user name', () => {
      const command = 'git config user.name';
      const result = DeployHistoryHelper.execGitPrintCommand(command);
      console.debug(TAG, result);

      expect(result).not.toBeNull();
    });

    it('OK: get current branch name', () => {
      const command = 'git branch --show-current';
      const result = DeployHistoryHelper.execGitPrintCommand(command);
      console.debug(TAG, result);

      // detached HEAD 상태에서는 빈 문자열('')이 반환되며, null이 아니어야 함
      expect(result).not.toBeNull();
    });

    it('OK: get git revision', () => {
      const command = 'git rev-parse HEAD';
      const result = DeployHistoryHelper.execGitPrintCommand(command);
      console.debug(TAG, result);

      expect(result).not.toBeNull();
    });
  });

  describe('generateDeployHistoryDto', () => {
    it('OK', () => {
      const name = 'dev.ian';
      const result = DeployHistoryHelper.generateDeployHistoryDto(name);
      console.debug(TAG, result);

      expect(result).toBeDefined();
      expect(result).toHaveProperty('name');
      expect(result).toHaveProperty('stage');
      expect(result).toHaveProperty('endAt');
      expect(result).toHaveProperty('localEndAt');
      expect(result).toHaveProperty('userName');
      expect(result).toHaveProperty('branch');
      expect(result).toHaveProperty('revision');
      expect(result.name).toEqual(name);
    });
  });
});
