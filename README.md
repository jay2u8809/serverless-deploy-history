# serverlessDeployHistory
- Create a deployment history when deploying with serverless framework.
  + method
    - slack webhook

| No | Field | Desc |
| --- | --- | --- |
| 1 | Name | AWS Lambda name | 
| 2 | Stage | dev, staging, production, ... |
| 3 | Branch | Git Branch name |
| 4 | Revision | Git Commit hash | 
| 5 | EndAt | Deploy end timestamp | 
| 6 | LocalEndAt | Deploy end timestamp (Local) | 
| 7 | User | Git User name | 

## Required
- git
- nodejs

## Installation
- Using npm
```shell
$ npm install --save-dev serverless-deploy-history
```

- Using yarn
```shell
$ yarn add -D serverless-deploy-history
```

## Usage
### Sample: slack webhook
#### serverless.yaml
- [View Sample](./sample/serverless.yaml)
- Plugin
```yaml
plugins:
  - serverless-deploy-history
```

- Custom
```yaml
custom:
  serverlessDeployHistory:
    stage: # optional(default: all stages)
      - production
    slack:
      webhook: 'https://hooks.slack.com/services/~'
      title: 'Sample Deploy History'
```

#### serverless.ts
- [View Sample](./sample/serverless.ts)
- Plugin
```typescript
plugins: [
    ...,
    'serverless-deploy-history'
  ],
```

- Custom
```typescript
custom: {
  serverlessDeployHistory: {
      stage: [   // optional(default: all stages)
        'production'
      ],
      slack: {
        webhook: 'https://hooks.slack.com/services/~',
        title: 'Sample Deploy History'
      },
    },
  },
}
```

## License
- [MIT](./LICENSE)