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
    serverlessDeployHistory: {
      slack: {
        webhook: 'https://hooks.slack.com/services/~', // webhook url
        title: 'Deployment Notifications', // default: Deployment History Notification
      },
      // using SSM Parameter Store
      // slack: {
      //   webhook: '${ssm:/your/ssm/parameter/path}', // SSM parameter path
      //   title: 'Deployment Notifications',
      // },
      discord: {
        webhook: 'https://discord.com/api/webhooks/~', // webhook url
        title: 'Deployment Notifications', // default: Deployment History Notification
      },
      // using SSM Parameter Store
      // discord: {
      //   webhook: '${ssm:/your/ssm/parameter/path}', // SSM parameter path
      //   title: 'Deployment Notifications',
      // },
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
