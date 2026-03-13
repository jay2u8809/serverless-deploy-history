export interface DeployHistoryCustom {
  slack?: {
    webhook: string;
    title?: string;
  };
  discord?: {
    webhook: string;
    title?: string;
  };
}
