import type { AWS } from '@serverless/typescript';

const serverlessConfiguration: AWS = {
  service: 'sample-deploy-history',
  frameworkVersion: '3',
  plugins: ['serverless-deploy-history'],
  provider: {
    name: 'aws',
    runtime: 'nodejs16.x',
    region: 'ap-northeast-1',
  },
  custom: {
    'serverless-deploy-history': {
      stage: [   // optional(default: all stages)
        'production'
      ],
      slack: {
        webhook: 'https://hooks.slack.com/services/~', // webhook url
        title: 'Deployment Notifications', // default: Deployment History Notification
      },
    },
  },
  functions: {
    hello: {
      handler: 'handler.hello',
      events: [
        {
          http: {
            method: 'ANY',
            path: '/',
          },
        },
        {
          http: {
            method: 'ANY',
            path: '{proxy+}',
          },
        },
      ],
    },
  },
};

module.exports = serverlessConfiguration;
