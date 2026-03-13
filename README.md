# ServerlessDeployHistory

A Serverless Framework plugin that automatically sends deployment notifications after each successful deploy.
It collects deployment information such as the Lambda name, stage, git branch, commit revision, and deploying user, then delivers a summary to your team via Slack or Discord webhook.

**Supported notification methods**
- Slack webhook
- Discord webhook

| No | Field | Desc | Fallback |
| --- | --- | --- | --- |
| 1 | Name | Serverless Framework service name | - |
| 2 | Stage | The value specified by the `-s` option of the Serverless Framework (e.g. dev, staging, production) | `dev` |
| 3 | Branch | Git branch name | `NoBranchName` |
| 4 | Revision | Git commit hash | `NoRevision` |
| 5 | EndAt | Deploy end timestamp (UTC, ISO 8601) | - |
| 6 | LocalEndAt | Deploy end timestamp in the local environment's locale format | - |
| 7 | User | Git username | `NoUserName` |
| 8 | Title | Notification message header, configurable via the `title` field in the `custom` section | `Deployment History Notification` |

## Required
- Git
- Node.js >= 18.0.0

## Installation

- Using npm

```shell
npm install --save-dev serverless-deploy-history
```

- Using yarn

```shell
yarn add -D serverless-deploy-history
```

## Usage

### Plugin

#### serverless.yml
```yaml
plugins:
  - serverless-deploy-history
```

#### serverless.ts
```typescript
plugins: [
    ...,
    'serverless-deploy-history'
  ],
```

---

### Slack Webhook

#### serverless.yml
```yaml
custom:
  serverlessDeployHistory:
    slack:
      webhook: 'https://hooks.slack.com/services/~'
      title: 'Deployment Notifications' # default: Deployment History Notification
```

#### serverless.ts
```typescript
custom: {
  serverlessDeployHistory: {
    slack: {
      webhook: 'https://hooks.slack.com/services/~',
      title: 'Deployment Notifications', // default: Deployment History Notification
    },
  },
},
```

#### Using SSM Parameter Store

```yaml
custom:
  serverlessDeployHistory:
    slack:
      webhook: '${ssm:/your/ssm/parameter/path}'
      title: 'Deployment Notifications'
```

```typescript
custom: {
  serverlessDeployHistory: {
    slack: {
      webhook: '${ssm:/your/ssm/parameter/path}',
      title: 'Deployment Notifications',
    },
  },
},
```

---

### Discord Webhook

#### serverless.yml
```yaml
custom:
  serverlessDeployHistory:
    discord:
      webhook: 'https://discord.com/api/webhooks/~'
      title: 'Deployment Notifications' # default: Deployment History Notification
```

#### serverless.ts
```typescript
custom: {
  serverlessDeployHistory: {
    discord: {
      webhook: 'https://discord.com/api/webhooks/~',
      title: 'Deployment Notifications', // default: Deployment History Notification
    },
  },
},
```

#### Using SSM Parameter Store

```yaml
custom:
  serverlessDeployHistory:
    discord:
      webhook: '${ssm:/your/ssm/parameter/path}'
      title: 'Deployment Notifications'
```

```typescript
custom: {
  serverlessDeployHistory: {
    discord: {
      webhook: '${ssm:/your/ssm/parameter/path}',
      title: 'Deployment Notifications',
    },
  },
},
```

---

### Using Slack and Discord together

```yaml
custom:
  serverlessDeployHistory:
    slack:
      webhook: 'https://hooks.slack.com/services/~'
      title: 'Deployment Notifications'
    discord:
      webhook: 'https://discord.com/api/webhooks/~'
      title: 'Deployment Notifications'
```

## Notification Message Example

The message is sent after a successful deployment and includes the following fields.

### English (en-US locale environment)
```
[production] Deployment History Notification

NAME:         my-service
STAGE:        production
BRANCH:       main
REVISION:     a1b2c3d4e5f6...
END_AT:       2026-03-14T10:00:00.000Z
LOCAL_END_AT: 3/14/2026, 10:00:00 AM
USER:         github-username
```

### Japanese (ja-JP locale environment)
```
[production] Deployment History Notification

NAME:         my-service
STAGE:        production
BRANCH:       main
REVISION:     a1b2c3d4e5f6...
END_AT:       2026-03-14T10:00:00.000Z
LOCAL_END_AT: 2026/3/14 19:00:00
USER:         github-username
```

> `LOCAL_END_AT` format varies depending on the execution environment's locale. `END_AT` is always in ISO 8601 format (UTC).
> The `title` field in the custom configuration is used as the notification header. Default: `Deployment History Notification`

## License
- [MIT](./LICENSE)
