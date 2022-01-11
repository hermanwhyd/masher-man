export interface Tier {
  unitTime: number;
  tierPlan: string;
  stopOnQuotaReach: boolean;
  tierLevel: string;
  requestCount: number;
  description: string;
  name: string;
  attributes: any;
  selected?: boolean;
  default?: boolean;
}
