import Serverless from 'serverless';
import { ServerlessDeployHistoryDto } from '../../interface/serverless-deploy-history.dto';
import {
  CustomKey,
  DeployHistoryCustom,
} from '../../interface/deploy-history-custom.interface';
import { Config } from '../../interface/deploy-history.config';
import { Helper } from '../helper/deploy-history.helper';
import { SendSlackMessageRunner } from './send-slack-message.runner';

const TAG = 'ServerlessDeployHistoryService';

export class ServerlessDeployHistoryRunner {
  private readonly custom: DeployHistoryCustom;

  constructor(
    private readonly serverless: Serverless,
    private readonly options: Serverless.Options,
  ) {
    this.custom = this.serverless.service.custom[
      Config.Title
    ] as DeployHistoryCustom;
  }

  public async run(): Promise<boolean> {
    // init
    const dto: ServerlessDeployHistoryDto = await this.initDeployHistoryDto();
    // check stage
    if (!this.checkStage()) {
      console.log(TAG, "It's not deploy history target", this.options.stage);
      return false;
    }
    // return
    return this.exec(dto);
  }

  // === private ===
  private async initDeployHistoryDto(): Promise<ServerlessDeployHistoryDto> {
    return Helper.createDeployHistoryDto(
      this.serverless.service.service,
      this.options.stage,
    );
  }

  private checkStage(): boolean {
    // get stage data from serverless.ts or serverless.yaml
    const stages: string[] = this.custom.stage || [];
    // target: all stages
    if (stages.length === 0) {
      return true;
    }
    // check stage info
    return stages.some((item) => item === this.options.stage);
  }

  private async exec(dto: ServerlessDeployHistoryDto): Promise<boolean> {
    // get custom setting keys
    const keys: string[] = Object.keys(this.custom);
    try {
      // exec deploy history process
      await Promise.all(
        keys.map(async (key: string) => {
          switch (key) {
            case CustomKey.slack:
              await this.sendSlackMessage(dto);
              console.log(TAG, 'complete send slack message');
              break;
          }
        }),
      );
      return true;
    } catch (err) {
      return false;
    }
  }

  private async sendSlackMessage(
    dto: ServerlessDeployHistoryDto,
  ): Promise<boolean> {
    const runner = new SendSlackMessageRunner(dto, this.custom);
    return runner.run();
  }
}
