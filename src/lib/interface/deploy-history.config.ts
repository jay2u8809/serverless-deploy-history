export const Config = {
  GitCommand: {
    USER_NAME: 'git config user.name',
    BRANCH_NAME: 'git branch --show-current',
    REVISION: 'git rev-parse HEAD',
  },
  Fallback: {
    USER_NAME: 'NoUserName',
    BRANCH_NAME: 'NoBranchName',
    REVISION: 'NoRevision',
  },
  Title: 'serverlessDeployHistory',
  Slack: {
    title: 'Deployment History Notification',
  },
};
