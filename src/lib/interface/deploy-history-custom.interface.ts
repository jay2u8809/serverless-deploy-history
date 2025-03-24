type CustomKeyType = 'stage' | 'slack';
export const CustomKey: Record<string, CustomKeyType> = {
  stage: 'stage',
  slack: 'slack',
};

export interface DeployHistoryCustom {
  stage: string[];
  slack: {
    webhook: string;
    title: string;
  };
}
