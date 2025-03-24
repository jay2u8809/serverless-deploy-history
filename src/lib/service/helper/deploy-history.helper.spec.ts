import { Helper } from './deploy-history.helper';

const TAG = 'DeployHistoryHelperSpec';

describe('DeployHistoryHelperSpec', () => {
  it('defined', () => {
    expect(Helper).toBeDefined();
  });

  describe('DeployHistoryHelperUnit', () => {
    it('createDeployHistoryDto: OK', async () => {
      const name = 'Dummy-Service';
      const stage = 'Dummy-staging';

      const result = await Helper.createDeployHistoryDto(name, stage);
      console.log(TAG, 'result', JSON.stringify(result, null, 2));

      expect(result).toBeDefined();
      expect(result.name).toEqual(name);
      expect(result.stage).toEqual(stage);
    }, 999_999_999);

    it('createDeployHistoryDto: OK - no stage', async () => {
      const name = 'Dummy-Service';

      const result = await Helper.createDeployHistoryDto(name);
      console.log(TAG, 'result', JSON.stringify(result, null, 2));

      expect(result).toBeDefined();
      expect(result.name).toEqual(name);
      expect(result.stage).toEqual('dev');
    }, 999_999_999);
  });
});
