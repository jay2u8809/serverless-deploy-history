import { ServerlessDeployHistoryDto } from '../serverless-deploy-history.dto';

export class SlackMessageDto {
  // fields
  name: string;
  stage: string;
  branch: string;
  revision: string;
  end_at: string;
  local_end_at: string;
  user: string;

  // setter
  public set deployHistoryMessage(value: ServerlessDeployHistoryDto) {
    this.name = value.name;
    this.stage = value.stage;
    this.branch = value.branch;
    this.revision = value.revision;
    this.end_at = value.endAt;
    this.local_end_at = value.localEndAt;
    this.user = value.userName;
  }
}
