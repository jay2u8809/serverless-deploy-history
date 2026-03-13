import { DeployInfoDto } from '../../interface/serverless-deploy-history.dto';

export interface NotificationConfig {
  webhook: string;
  title?: string;
}

export interface NotificationSender {
  send(dto: DeployInfoDto, config: NotificationConfig): Promise<boolean>;
}
