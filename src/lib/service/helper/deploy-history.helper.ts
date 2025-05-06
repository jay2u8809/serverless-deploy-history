import * as childProcess from 'node:child_process';
import { DeployInfoDto } from '../../interface/serverless-deploy-history.dto';
import { Config } from '../../interface/deploy-history.config';

const TAG = 'DeployHistoryHelper';

const execGitPrintCommand = async (command: string): Promise<string | null> => {
  try {
    const exec = childProcess.execSync(command, {
      encoding: 'utf8',
    });
    // remove new-line character
    return [...exec].filter((c) => c !== '\n').join('');
  } catch (err) {
    console.error(TAG, 'command-exec-error', command);
    return null;
  }
};

const generateDeployHistoryDto = async (
  name: string,
  stage?: string,
): Promise<DeployInfoDto> => {
  const [userName, branch, revision]: string[] = await Promise.all([
    execGitPrintCommand(Config.GitCommand.USER_NAME),
    execGitPrintCommand(Config.GitCommand.BRANCH_NAME),
    execGitPrintCommand(Config.GitCommand.REVISION),
  ]);
  const now = new Date();
  // return
  return {
    name: name,
    stage: stage || 'dev',
    endAt: now.toISOString(),
    localEndAt: now.toLocaleString(),
    userName: userName || `NoUserName`,
    branch: branch || `NoBranchName`,
    revision: revision || `NoRevision`,
  } as DeployInfoDto;
};

export const DeployHistoryHelper = {
  execGitPrintCommand,
  generateDeployHistoryDto,
};
