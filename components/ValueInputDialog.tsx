import { useState } from 'react';
import { KPINode } from '../types';

interface ValueInputDialogProps {
  node: KPINode;
  onSave: (values: Partial<KPINode>) => void;
  onClose: () => void;
}

export default function ValueInputDialog({ node, onSave, onClose }: ValueInputDialogProps) {
  const [values, setValues] = useState({
    target: node.target?.toString() || '',
    value: node.value?.toString() || '',
    unit: node.unit || '',
    pastData: ''
  });

  const [calculationStep, setCalculationStep] = useState(0);
  const [calculationData, setCalculationData] = useState({
    parentValue: '',
    childEstimate: '',
    relationship: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setValues(prev => ({ ...prev, [field]: value }));
  };

  const handleCalculationInputChange = (field: string, value: string) => {
    setCalculationData(prev => ({ ...prev, [field]: value }));
  };

  const startIntelligentCalculation = () => {
    setCalculationStep(1);
  };

  const calculateValue = () => {
    // 簡単な計算例（実際はより複雑な計算ロジックを実装）
    const parentVal = parseFloat(calculationData.parentValue);
    const childEst = parseFloat(calculationData.childEstimate);
    
    if (parentVal && childEst) {
      const calculated = Math.round(parentVal / childEst);
      setValues(prev => ({
        ...prev,
        target: calculated.toString()
      }));
      setCalculationStep(0);
    }
  };

  const handleSave = () => {
    const updates: Partial<KPINode> = {};
    
    if (values.target) updates.target = parseFloat(values.target);
    if (values.value) updates.value = parseFloat(values.value);
    if (values.unit) updates.unit = values.unit;
    
    onSave(updates);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* ヘッダー */}
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-lg font-semibold">数値設定 - {node.name}</h3>
          <button 
            onClick={onClose}
            className="text-secondary hover:text-primary p-1"
          >
            ✕
          </button>
        </div>

        {calculationStep === 0 ? (
          /* 通常の入力フォーム */
          <div className="p-6 space-y-4">
            <div className="form-group">
              <label className="form-label">目標値</label>
              <input
                type="number"
                className="form-input"
                value={values.target}
                onChange={(e) => handleInputChange('target', e.target.value)}
                placeholder="目標値を入力"
              />
            </div>

            <div className="form-group">
              <label className="form-label">実績値</label>
              <input
                type="number"
                className="form-input"
                value={values.value}
                onChange={(e) => handleInputChange('value', e.target.value)}
                placeholder="現在の実績値を入力"
              />
            </div>

            <div className="form-group">
              <label className="form-label">単位</label>
              <input
                type="text"
                className="form-input"
                value={values.unit}
                onChange={(e) => handleInputChange('unit', e.target.value)}
                placeholder="例: 円、件、人"
              />
            </div>

            {/* インテリジェント計算ボタン */}
            <div className="bg-surface rounded-lg p-4">
              <div className="text-sm font-medium mb-2">🤖 インテリジェント計算</div>
              <div className="text-xs text-secondary mb-3">
                上位KPIの情報から自動的に目標値を算出します
              </div>
              <button 
                className="btn btn-secondary btn-sm"
                onClick={startIntelligentCalculation}
              >
                計算アシスタントを使用
              </button>
            </div>
          </div>
        ) : (
          /* インテリジェント計算フロー */
          <div className="p-6 space-y-4">
            <div className="text-center mb-4">
              <div className="text-2xl mb-2">🧮</div>
              <div className="font-medium">インテリジェント計算</div>
              <div className="text-sm text-secondary">
                いくつかの質問にお答えください
              </div>
            </div>

            {calculationStep === 1 && (
              <div className="space-y-4">
                <div className="form-group">
                  <label className="form-label">
                    上位KPI「{node.parent ? 'Parent KPI' : '売上'}」の目標値はいくらですか？
                  </label>
                  <input
                    type="number"
                    className="form-input"
                    value={calculationData.parentValue}
                    onChange={(e) => handleCalculationInputChange('parentValue', e.target.value)}
                    placeholder="例: 5000万円の場合は 50000000"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    過去の「{node.name}」の平均値はいくらでしたか？
                  </label>
                  <input
                    type="number"
                    className="form-input"
                    value={calculationData.childEstimate}
                    onChange={(e) => handleCalculationInputChange('childEstimate', e.target.value)}
                    placeholder="例: 平均単価50万円の場合は 500000"
                  />
                </div>

                <div className="bg-blue-50 rounded-lg p-3">
                  <div className="text-sm">
                    💡 計算例: 売上5000万円 ÷ 平均単価50万円 = 目標件数100件
                  </div>
                </div>

                <div className="flex gap-2">
                  <button 
                    className="btn btn-secondary flex-1"
                    onClick={() => setCalculationStep(0)}
                  >
                    戻る
                  </button>
                  <button 
                    className="btn btn-primary flex-1"
                    onClick={calculateValue}
                    disabled={!calculationData.parentValue || !calculationData.childEstimate}
                  >
                    計算実行
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* フッター */}
        {calculationStep === 0 && (
          <div className="flex gap-3 p-6 border-t">
            <button 
              className="btn btn-secondary flex-1"
              onClick={onClose}
            >
              キャンセル
            </button>
            <button 
              className="btn btn-primary flex-1"
              onClick={handleSave}
            >
              保存
            </button>
          </div>
        )}
      </div>
    </div>
  );
}