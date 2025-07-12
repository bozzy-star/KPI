import { useState } from 'react';
import { KPINode } from '../types';
import { kpiHints, categoryDescriptions } from '../data/kpiHints';

interface HintPanelProps {
  selectedNode: KPINode;
  onAddChild: (parentId: string, childData: Partial<KPINode>) => void;
  onClose: () => void;
}

export default function HintPanel({ selectedNode, onAddChild, onClose }: HintPanelProps) {
  const [selectedHintId, setSelectedHintId] = useState<string | null>(null);
  
  const hints = kpiHints[selectedNode.name] || [];
  const selectedHint = hints.find(h => h.id === selectedHintId);

  const handleAddKPI = (hint: any) => {
    onAddChild(selectedNode.id, {
      name: hint.name,
      description: hint.description,
      formula: hint.formula
    });
  };

  return (
    <div className="h-full flex flex-col">
      {/* ヘッダー */}
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="font-semibold text-lg">KPIヒント</h3>
        <button 
          onClick={onClose}
          className="text-secondary hover:text-primary p-1"
        >
          ✕
        </button>
      </div>

      {/* 選択されたノードの情報 */}
      <div className="p-4 bg-surface border-b">
        <div className="font-medium text-primary mb-1">{selectedNode.name}</div>
        {selectedNode.description && (
          <div className="text-sm text-secondary">{selectedNode.description}</div>
        )}
      </div>

      {/* ヒント一覧 */}
      <div className="flex-1 overflow-y-auto">
        {hints.length > 0 ? (
          <div className="space-y-3 p-4">
            <div className="text-sm font-medium text-secondary mb-3">
              「{selectedNode.name}」の下位KPI候補:
            </div>
            
            {hints.map((hint) => (
              <div 
                key={hint.id} 
                className="border rounded-lg p-3 hover:bg-surface cursor-pointer transition-colors"
                onClick={() => setSelectedHintId(selectedHintId === hint.id ? null : hint.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium text-primary">{hint.name}</div>
                  <div className="text-xs px-2 py-1 bg-primary text-white rounded">
                    {categoryDescriptions[hint.category]}
                  </div>
                </div>
                
                <div className="text-sm text-secondary mb-2">
                  {hint.description}
                </div>
                
                <div className="text-xs text-primary font-mono bg-surface px-2 py-1 rounded">
                  {hint.formula}
                </div>

                {selectedHintId === hint.id && (
                  <div className="mt-3 pt-3 border-t fade-in">
                    <div className="text-sm font-medium mb-2">具体例:</div>
                    <ul className="text-sm text-secondary space-y-1 mb-3">
                      {hint.examples.map((example, index) => (
                        <li key={index} className="flex items-center">
                          <span className="w-1 h-1 bg-secondary rounded-full mr-2"></span>
                          {example}
                        </li>
                      ))}
                    </ul>
                    
                    <button 
                      className="btn btn-primary btn-sm w-full"
                      onClick={() => handleAddKPI(hint)}
                    >
                      このKPIを追加
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 text-center text-secondary">
            <div className="text-4xl mb-3">💡</div>
            <div className="text-sm">
              このKPIのヒントは現在準備中です。<br/>
              手動で子KPIを追加することができます。
            </div>
            <button 
              className="btn btn-secondary btn-sm mt-3"
              onClick={() => {
                const name = prompt('KPI名を入力してください:');
                if (name) {
                  onAddChild(selectedNode.id, { name });
                }
              }}
            >
              手動でKPIを追加
            </button>
          </div>
        )}
      </div>

      {/* フッター */}
      <div className="p-4 border-t bg-surface">
        <div className="text-xs text-secondary">
          💡 ヒント: KPIをダブルクリックして名前を編集できます
        </div>
      </div>
    </div>
  );
}