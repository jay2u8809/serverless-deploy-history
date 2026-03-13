import * as childProcess from 'node:child_process';
import { DeployInfoDto } from '../../interface/serverless-deploy-history.dto';
import { Config } from '../../config/deploy-history.config';

const TAG = 'DeployHistoryHelper';

const execGitPrintCommand = (command: string): string | null => {
  try {
    const result = childProcess.execSync(command, { encoding: 'utf8' });
    return result.trim();
  } catch (err) {
    console.error(TAG, 'command-exec-error', command);
    return null;
  }
};

const generateDeployHistoryDto = (
  name: string,
  stage?: string,
): DeployInfoDto => {
  const userName = execGitPrintCommand(Config.GitCommand.USER_NAME);
  const branch = execGitPrintCommand(Config.GitCommand.BRANCH_NAME);
  const revision = execGitPrintCommand(Config.GitCommand.REVISION);
  const now = new Date();
  return {
    name: name,
    stage: stage || 'dev',
    endAt: now.toISOString(),
    localEndAt: now.toLocaleString(),
    userName: userName || Config.Fallback.USER_NAME,
    branch: branch || Config.Fallback.BRANCH_NAME,
    revision: revision || Config.Fallback.REVISION,
  };
};

export const DeployHistoryHelper = {
  execGitPrintCommand,
  generateDeployHistoryDto,
};
