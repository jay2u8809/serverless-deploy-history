import Serverless from 'serverless';
import { ServerlessDeployHistoryRunner } from './service/runner/serverless-deploy-history.runner';

type Hooks = { [key: string]: () => void };

export class ServerlessDeployHistory {
  hooks: Hooks;
  runner: ServerlessDeployHistoryRunner;

  constructor(
    private readonly serverless: Serverless,
    private readonly options: Serverless.Options,
  ) {
    this.hooks = {
      'after:deploy:deploy': this.afterDeploy.bind(this),
    };
    this.runner = new ServerlessDeployHistoryRunner(
      this.serverless,
      this.options,
    );
  }

  async afterDeploy() {
    try {
      const result = await this.runner.exec();
      if (!result) {
        console.warn(
          'serverless-deploy-history: 배포 히스토리 전송에 실패했습니다.',
        );
      }
    } catch (err) {
      console.warn(
        `serverless-deploy-history: 배포 히스토리 전송에 실패했습니다. (${err.message})`,
      );
    }
  }
}
