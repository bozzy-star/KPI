import { KPIHint } from '../types';

export const kpiHints: { [key: string]: KPIHint[] } = {
  '売上': [
    {
      id: 'customers',
      name: '顧客数',
      description: '売上を生み出す顧客の総数。新規・既存に分けて管理することが重要です。',
      formula: '売上 = 顧客数 × 顧客単価',
      examples: ['月間アクティブユーザー数', '契約企業数', '会員数'],
      category: 'customer'
    },
    {
      id: 'customer_price',
      name: '顧客単価',
      description: '一人の顧客が平均的に支払う金額。LTV（顧客生涯価値）の基礎となります。',
      formula: '売上 = 顧客数 × 顧客単価',
      examples: ['ARPU（Average Revenue Per User）', '平均注文金額', '契約単価'],
      category: 'revenue'
    },
    {
      id: 'contracts',
      name: '成約数',
      description: '実際に契約や購入に至った件数。成約率と組み合わせて分析します。',
      formula: '売上 = 成約数 × 平均契約金額',
      examples: ['月間成約件数', '新規契約数', 'オーダー数'],
      category: 'revenue'
    },
    {
      id: 'conversion_rate',
      name: '成約率',
      description: 'リードから実際の成約に至る割合。営業効率の重要指標です。',
      formula: '成約率 = 成約数 ÷ リード数',
      examples: ['商談成約率', 'CVR（Conversion Rate）', 'クロージング率'],
      category: 'marketing'
    }
  ],
  '顧客数': [
    {
      id: 'new_customers',
      name: '新規顧客数',
      description: '新たに獲得した顧客の数。成長の原動力となる重要指標です。',
      formula: '顧客数 = 新規顧客数 + 既存顧客数',
      examples: ['月間新規登録数', '新規契約企業数', '初回購入者数'],
      category: 'customer'
    },
    {
      id: 'existing_customers',
      name: '既存顧客数',
      description: '継続利用している顧客の数。リテンション率と密接に関係します。',
      formula: '顧客数 = 新規顧客数 + 既存顧客数',
      examples: ['アクティブユーザー数', '継続契約数', 'リピーター数'],
      category: 'customer'
    },
    {
      id: 'leads',
      name: 'リード数',
      description: '潜在顧客の数。マーケティング活動の成果を表します。',
      formula: '顧客数 = リード数 × 成約率',
      examples: ['問い合わせ数', '資料ダウンロード数', '見込み客数'],
      category: 'marketing'
    }
  ],
  '成約数': [
    {
      id: 'proposals',
      name: '提案数',
      description: '顧客に対して行った提案の数。商談機会の創出力を表します。',
      formula: '成約数 = 提案数 × 提案成約率',
      examples: ['見積提出数', 'プレゼン実施数', '商談数'],
      category: 'marketing'
    },
    {
      id: 'proposal_rate',
      name: '提案成約率',
      description: '提案から実際の成約に至る割合。提案の質を表す指標です。',
      formula: '提案成約率 = 成約数 ÷ 提案数',
      examples: ['見積成約率', 'プレゼン成功率', '商談クロージング率'],
      category: 'marketing'
    }
  ]
};

export const categoryDescriptions = {
  revenue: '売上・収益に直接関連するKPI',
  customer: '顧客に関連するKPI',
  marketing: 'マーケティング・営業活動に関連するKPI',
  operations: '業務・オペレーションに関連するKPI',
  finance: '財務・コストに関連するKPI'
};