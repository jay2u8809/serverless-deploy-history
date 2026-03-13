export interface DeployInfoDto {
  name: string; // required: sls service name
  stage: string; // required: sls stage name
  userName?: string; // git user name
  revision?: string; // git revision
  branch?: string; // git branch name
  endAt?: string; // deployment end time
  localEndAt?: string; // deployment end time (local)
}
