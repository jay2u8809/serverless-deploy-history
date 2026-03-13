import { MessageHelper } from './message.helper';
import { DeployHistoryHelper } from './deploy-history.helper';
import { DeployInfoDto } from '../../interface/serverless-deploy-history.dto';

const TAG = 'MessageHelperUnitTest';

describe('deploy history helper unit test', () => {
  describe('sendSlackMessage', () => {
    beforeAll(() => {
      // fake
      MessageHelper['sendSlackMessage'] = async (url: string, data: any) => {
        console.debug(TAG, 'fake', 'sendSlackMessage', url, data);
        return true;
      };
    });

    it('OK: send slack message', async () => {
      const url = 'abcde.com';
      const data = 'fsa';
      const result = await MessageHelper.sendSlackMessage(url, data);
      console.debug(TAG, 'result', result);

      expect(result).toBeDefined();
    });
  });

  describe('makeRichMessageTemplate', () => {
    let dto: DeployInfoDto;

    beforeEach(() => {
      dto = DeployHistoryHelper.generateDeployHistoryDto('fake-service');
      console.debug(TAG, 'dto', dto);
    });

    it('OK', () => {
      const result = MessageHelper.makeRichMessageTemplate(
        dto,
        'fake-titil',
      );
      console.debug(TAG, 'template', JSON.stringify(result, null, 2));

      expect(result).toBeDefined();
    });
  });
});
