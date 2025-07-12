export interface KPINode {
  id: string;
  name: string;
  value?: number;
  target?: number;
  unit?: string;
  formula?: string;
  description?: string;
  parent?: string;
  children: string[];
  level: number;
  x: number;
  y: number;
  hints?: KPIHint[];
}

export interface KPIHint {
  id: string;
  name: string;
  description: string;
  formula: string;
  examples: string[];
  category: 'revenue' | 'customer' | 'marketing' | 'operations' | 'finance';
}

export interface KPITree {
  id: string;
  name: string;
  description?: string;
  nodes: { [id: string]: KPINode };
  rootNodeId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReportTemplate {
  id: string;
  name: string;
  description?: string;
  kpiTreeId: string;
  sections: ReportSection[];
  isDefault: boolean;
}

export interface ReportSection {
  id: string;
  type: 'summary' | 'chart' | 'table' | 'text';
  title: string;
  content: any;
  order: number;
}