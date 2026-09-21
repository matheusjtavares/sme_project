export interface WeekdayCommission {
  id: number;
  weekday: number;
  min_percent: string;
  max_percent: string;
}

export interface SellerCommission {
  id: number;
  name: string;
  total_commission: string;
}

export interface CommissionReport {
  start: string;
  end: string;
  sellers: SellerCommission[];
  total_commission: string;
}