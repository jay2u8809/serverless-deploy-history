import Serverless from 'serverless';
import { ServerlessDeployHistoryDto } from './interface/serverless-deploy-history.dto';
import { ServerlessDeployHistoryRunner } from './service/runner/serverless-deploy-history.runner';

export class ServerlessDeployHistory {
  hooks: { [key: string]: () => void };
  dto: ServerlessDeployHistoryDto;
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
    const result = await this.runner.run();
    console.assert(result, 'Fail to send deployment history');
  }
}
