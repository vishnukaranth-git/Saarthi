export interface Profile {
  id: string;
  email?: string;
  phone?: string;
  full_name?: string;
  created_at?: string;
}

export interface Merchant {
  id: string;
  user_id: string;
  business_name: string;
  business_type?: string;
  city?: string;
  phone?: string;
  created_at?: string;
}

export type TaskStatus = 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED';

export interface AgentTask {
  id: string;
  merchant_id: string;
  goal: string;
  status: TaskStatus;
  current_agent?: string;
  created_at?: string;
  updated_at?: string;
  result?: Record<string, unknown>;
  error?: string;
}

export interface AgentLog {
  id?: string | number;
  task_id: string;
  agent_name: string;
  action: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  input_data?: Record<string, unknown> | string;
  output_data?: Record<string, unknown> | string;
  timestamp: string;
  execution_time_ms?: number;
}

export interface Campaign {
  id: string;
  merchant_id: string;
  task_id?: string;
  offer: string;
  message: string;
  language: string;
  campaign_type: string;
  target_segment: string;
  status: 'DRAFT' | 'SCHEDULED' | 'RUNNING' | 'COMPLETED' | 'FAILED';
  created_at?: string;
  budget?: number;
  sent_count?: number;
  open_rate?: number;
  conversion_rate?: number;
}

export interface CampaignResult {
  id: string;
  campaign_id: string;
  status: string;
  baseline_value?: number;
  result_value?: number;
  lift_percentage?: number;
  recommendation?: string;
  is_simulation?: boolean;
}

export interface Customer {
  id: string;
  merchant_id?: string;
  name: string;
  phone?: string;
  email?: string;
  segment: 'New' | 'Repeat' | 'High Value' | 'Inactive';
  purchase_count: number;
  total_spend: number;
  last_purchase: string;
  status: 'Active' | 'Churn Risk' | 'Lapsed';
}

export interface Transaction {
  id: string;
  merchant_id: string;
  product_id?: string;
  amount: number;
  transaction_time: string;
  customer_name?: string;
  payment_mode?: string;
  status?: string;
}

export interface MemoryItem {
  id: string;
  category: 'Business Preferences' | 'Campaign History' | 'Business Patterns' | 'Merchant Preferences' | 'Previous Outcomes';
  title: string;
  content: string;
  source: string;
  confidence: number;
  date: string;
}

export interface DashboardKpis {
  totalSales: number;
  totalTransactions: number;
  totalCustomers: number;
  activeCampaigns: number;
  salesGrowth: number;
  txGrowth: number;
}
