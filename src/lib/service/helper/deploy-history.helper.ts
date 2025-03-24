import { ServerlessDeployHistoryDto } from '../../interface/serverless-deploy-history.dto';
import { Config } from '../../interface/deploy-history.config';

import * as childProcess from 'node:child_process';
import { ChildProcess } from 'node:child_process';
import axios from 'axios';

const createDeployHistoryDto = async (
  name: string,
  stage?: string,
): Promise<ServerlessDeployHistoryDto> => {
  // fetch git info
  const [userName, branch, revision]: string[] = await Promise.all([
    execGitCommand(Config.GitCommand.USER_NAME),
    execGitCommand(Config.GitCommand.BRANCH_NAME),
    execGitCommand(Config.GitCommand.REVISION),
  ]);
  // result
  const dto = new ServerlessDeployHistoryDto();
  dto.name = name;
  dto.stage = stage;
  dto.userName = userName;
  dto.branch = branch;
  dto.revision = revision;
  dto.endAt = new Date().toISOString();
  dto.localEndAt = new Date().toLocaleString();
  // return
  return dto;
};

const sendMessage = async (url: string, data: unknown): Promise<any> => {
  const response = await axios.post(url, data, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};

// === private ===
const execGitCommand = async (command: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const result: ChildProcess = childProcess.exec(command, {
      encoding: 'utf8',
    });
    result.stdout
      .on('error', (err: Error) => {
        console.error('command-exec-error', command, err);
        reject(undefined);
      })
      .on('data', (data: string) => {
        // remove new-line character
        const result: string = [...data].filter((c) => c !== '\n').join('');
        resolve(result);
      });
  });
};

export const Helper = {
  createDeployHistoryDto,
  sendMessage,
};
