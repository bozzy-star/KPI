import { useState, useRef } from 'react';
import Head from 'next/head';

// KPIヒントデータ
const kpiHints = {
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
    }
  ]
};

export default function Home() {
  const [kpiTree, setKpiTree] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [showHints, setShowHints] = useState(false);
  const [showValueDialog, setShowValueDialog] = useState(false);
  const [selectedHintId, setSelectedHintId] = useState(null);
  const [draggedNode, setDraggedNode] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [calculationStep, setCalculationStep] = useState(0);
  const [calculationData, setCalculationData] = useState({
    parentValue: '',
    childEstimate: ''
  });
  const canvasRef = useRef(null);

  const handleAddRootNode = () => {
    const rootNode = {
      id: 'root',
      name: '売上',
      level: 0,
      x: 400,
      y: 100,
      children: [],
      description: 'ビジネスの主要目標指標'
    };

    const newTree = {
      id: 'tree-1',
      name: '新規KPIツリー',
      nodes: { root: rootNode },
      rootNodeId: 'root'
    };

    setKpiTree(newTree);
    setSelectedNode(rootNode);
    setShowHints(true);
  };

  const handleNodeSelect = (node) => {
    setSelectedNode(node);
    setShowHints(true);
  };

  const handleAddChildNode = (parentId, childData) => {
    if (!kpiTree) return;

    const childId = `node-${Date.now()}`;
    const parentNode = kpiTree.nodes[parentId];
    
    const childNode = {
      id: childId,
      name: childData.name || '新しいKPI',
      level: parentNode.level + 1,
      x: parentNode.x + (parentNode.children.length * 200) - 100,
      y: parentNode.y + 150,
      children: [],
      parent: parentId,
      description: childData.description,
      formula: childData.formula
    };

    const updatedParent = {
      ...parentNode,
      children: [...parentNode.children, childId]
    };

    const updatedNodes = {
      ...kpiTree.nodes,
      [parentId]: updatedParent,
      [childId]: childNode
    };

    setKpiTree({
      ...kpiTree,
      nodes: updatedNodes
    });

    setSelectedNode(childNode);
  };

  const handleNodeUpdate = (nodeId, updates) => {
    if (!kpiTree) return;

    const updatedNodes = {
      ...kpiTree.nodes,
      [nodeId]: {
        ...kpiTree.nodes[nodeId],
        ...updates
      }
    };

    setKpiTree({
      ...kpiTree,
      nodes: updatedNodes
    });
  };

  const handleNodeDoubleClick = (node) => {
    const newName = prompt('KPI名を入力してください:', node.name);
    if (newName && newName !== node.name) {
      handleNodeUpdate(node.id, { name: newName });
    }
  };

  const handleMouseDown = (e, nodeId) => {
    const node = kpiTree.nodes[nodeId];
    const rect = e.currentTarget.getBoundingClientRect();
    setDraggedNode(nodeId);
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleMouseMove = (e) => {
    if (!draggedNode || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const newX = e.clientX - rect.left - dragOffset.x;
    const newY = e.clientY - rect.top - dragOffset.y;

    handleNodeUpdate(draggedNode, { x: newX, y: newY });
  };

  const handleMouseUp = () => {
    setDraggedNode(null);
  };

  const calculateValue = () => {
    const parentVal = parseFloat(calculationData.parentValue);
    const childEst = parseFloat(calculationData.childEstimate);
    
    if (parentVal && childEst) {
      const calculated = Math.round(parentVal / childEst);
      handleNodeUpdate(selectedNode.id, { target: calculated });
      setCalculationStep(0);
      setShowValueDialog(false);
    }
  };

  const hints = selectedNode ? (kpiHints[selectedNode.name] || []) : [];

  return (
    <>
      <Head>
        <title>インテリジェントKPIツリー作成ツール</title>
        <meta name="description" content="AIによるヒント機能付きKPIツリー作成ツール" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: 'system-ui, sans-serif' }}>
        {/* ヘッダー */}
        <header style={{ 
          backgroundColor: 'white', 
          borderBottom: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)'
        }}>
          <div style={{ 
            maxWidth: '1280px', 
            margin: '0 auto', 
            padding: '0 1rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: '4rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <h1 style={{ 
                fontSize: '1.25rem', 
                fontWeight: '600', 
                color: '#2563eb',
                margin: 0
              }}>
                インテリジェントKPIツリー
              </h1>
              {kpiTree && (
                <span style={{ 
                  marginLeft: '1rem', 
                  fontSize: '0.875rem', 
                  color: '#64748b' 
                }}>
                  {kpiTree.name}
                </span>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button 
                style={{
                  padding: '0.375rem 0.75rem',
                  borderRadius: '0.375rem',
                  fontWeight: '500',
                  fontSize: '0.75rem',
                  border: '1px solid #e2e8f0',
                  cursor: 'pointer',
                  backgroundColor: selectedNode ? '#f8fafc' : '#f1f5f9',
                  color: '#0f172a'
                }}
                onClick={() => selectedNode && setShowValueDialog(true)}
                disabled={!selectedNode}
              >
                数値設定
              </button>
              <button style={{
                padding: '0.375rem 0.75rem',
                borderRadius: '0.375rem',
                fontWeight: '500',
                fontSize: '0.75rem',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: '#2563eb',
                color: 'white'
              }}>
                レポート生成
              </button>
            </div>
          </div>
        </header>

        <div style={{ display: 'flex', height: 'calc(100vh - 4rem)' }}>
          {/* メインキャンバス */}
          <div style={{ flex: 1, position: 'relative' }}>
            {kpiTree && Object.keys(kpiTree.nodes).length > 0 ? (
              <div 
                ref={canvasRef}
                style={{ 
                  position: 'relative', 
                  width: '100%', 
                  height: '100%', 
                  overflow: 'auto', 
                  backgroundColor: '#f9fafb' 
                }}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                <div style={{ 
                  position: 'absolute', 
                  inset: 0, 
                  minWidth: '1200px', 
                  minHeight: '800px' 
                }}>
                  {/* 接続線 */}
                  <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }}>
                    {Object.values(kpiTree.nodes).map(parent =>
                      parent.children.map(childId => {
                        const child = kpiTree.nodes[childId];
                        if (!child) return null;
                        const parentCenterX = parent.x + 100;
                        const parentCenterY = parent.y + 40;
                        const childCenterX = child.x + 100;
                        const childCenterY = child.y + 40;
                        return (
                          <g key={`connection-${parent.id}-${child.id}`}>
                            <line
                              x1={parentCenterX}
                              y1={parentCenterY}
                              x2={childCenterX}
                              y2={childCenterY}
                              stroke="#e2e8f0"
                              strokeWidth="2"
                            />
                            <polygon
                              points={`${childCenterX-5},${childCenterY-5} ${childCenterX+5},${childCenterY-5} ${childCenterX},${childCenterY+5}`}
                              fill="#e2e8f0"
                            />
                          </g>
                        );
                      })
                    )}
                  </svg>

                  {/* ノード */}
                  {Object.values(kpiTree.nodes).map(node => {
                    const isSelected = selectedNode?.id === node.id;
                    return (
                      <div
                        key={node.id}
                        style={{
                          position: 'absolute',
                          left: node.x,
                          top: node.y,
                          width: '200px',
                          minHeight: '80px',
                          backgroundColor: 'white',
                          borderRadius: '0.5rem',
                          boxShadow: isSelected ? '0 10px 15px -3px rgb(0 0 0 / 0.1)' : '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                          border: `2px solid ${isSelected ? '#2563eb' : '#e2e8f0'}`,
                          cursor: 'pointer',
                          zIndex: 2,
                          transition: 'all 0.2s ease'
                        }}
                        onClick={() => handleNodeSelect(node)}
                        onDoubleClick={() => handleNodeDoubleClick(node)}
                        onMouseDown={(e) => handleMouseDown(e, node.id)}
                      >
                        <div style={{ padding: '0.75rem' }}>
                          <div style={{ 
                            fontWeight: '600', 
                            fontSize: '0.875rem', 
                            marginBottom: '0.25rem', 
                            color: '#2563eb' 
                          }}>
                            {node.name}
                          </div>
                          
                          {node.description && (
                            <div style={{ 
                              fontSize: '0.75rem', 
                              color: '#64748b', 
                              marginBottom: '0.5rem' 
                            }}>
                              {node.description}
                            </div>
                          )}

                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem' }}>
                            {node.value && (
                              <div style={{ color: '#10b981', fontWeight: '500' }}>
                                実績: {node.value}{node.unit || ''}
                              </div>
                            )}
                            {node.target && (
                              <div style={{ color: '#f59e0b', fontWeight: '500' }}>
                                目標: {node.target}{node.unit || ''}
                              </div>
                            )}
                          </div>

                          {node.formula && (
                            <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem', fontStyle: 'italic' }}>
                              {node.formula}
                            </div>
                          )}
                        </div>

                        {/* 子ノード追加ボタン */}
                        <button
                          style={{
                            position: 'absolute',
                            bottom: '-0.75rem',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: '1.5rem',
                            height: '1.5rem',
                            backgroundColor: '#2563eb',
                            color: 'white',
                            borderRadius: '50%',
                            fontSize: '0.75rem',
                            border: 'none',
                            cursor: 'pointer'
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            const name = prompt('KPI名を入力してください:');
                            if (name) {
                              handleAddChildNode(node.id, { name });
                            }
                          }}
                          title="子KPIを追加"
                        >
                          +
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                height: '100%' 
              }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🌳</div>
                  <h2 style={{ 
                    fontSize: '1.5rem', 
                    fontWeight: '600', 
                    marginBottom: '1rem',
                    color: '#0f172a'
                  }}>
                    KPIツリーを作成しましょう
                  </h2>
                  <p style={{ 
                    color: '#64748b', 
                    marginBottom: '1.5rem',
                    fontSize: '1rem'
                  }}>
                    最初のKPIを追加してツリーの構築を開始します
                  </p>
                  <button 
                    onClick={handleAddRootNode}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '0.75rem 1.5rem',
                      borderRadius: '0.375rem',
                      fontWeight: '500',
                      fontSize: '1rem',
                      border: 'none',
                      cursor: 'pointer',
                      backgroundColor: '#2563eb',
                      color: 'white',
                      transition: 'all 0.2s ease-in-out'
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#1d4ed8'}
                    onMouseOut={(e) => e.target.style.backgroundColor = '#2563eb'}
                  >
                    ルートKPIを追加
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ヒントパネル */}
          {showHints && selectedNode && (
            <div style={{ width: '320px', borderLeft: '1px solid #e2e8f0', backgroundColor: 'white', overflowY: 'auto' }}>
              <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                {/* ヘッダー */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', borderBottom: '1px solid #e2e8f0' }}>
                  <h3 style={{ fontWeight: '600', fontSize: '1.125rem', margin: 0 }}>KPIヒント</h3>
                  <button 
                    onClick={() => setShowHints(false)}
                    style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '1rem' }}
                  >
                    ✕
                  </button>
                </div>

                {/* 選択されたノードの情報 */}
                <div style={{ padding: '1rem', backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  <div style={{ fontWeight: '500', color: '#2563eb', marginBottom: '0.25rem' }}>{selectedNode.name}</div>
                  {selectedNode.description && (
                    <div style={{ fontSize: '0.875rem', color: '#64748b' }}>{selectedNode.description}</div>
                  )}
                </div>

                {/* ヒント一覧 */}
                <div style={{ flex: 1, overflowY: 'auto' }}>
                  {hints.length > 0 ? (
                    <div style={{ padding: '1rem' }}>
                      <div style={{ fontSize: '0.875rem', fontWeight: '500', color: '#64748b', marginBottom: '0.75rem' }}>
                        「{selectedNode.name}」の下位KPI候補:
                      </div>
                      
                      {hints.map((hint) => (
                        <div 
                          key={hint.id} 
                          style={{ 
                            border: '1px solid #e2e8f0', 
                            borderRadius: '0.5rem', 
                            padding: '0.75rem', 
                            marginBottom: '0.75rem',
                            cursor: 'pointer',
                            backgroundColor: selectedHintId === hint.id ? '#f8fafc' : 'white'
                          }}
                          onClick={() => setSelectedHintId(selectedHintId === hint.id ? null : hint.id)}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <div style={{ fontWeight: '500', color: '#2563eb' }}>{hint.name}</div>
                            <div style={{ fontSize: '0.75rem', padding: '0.125rem 0.5rem', backgroundColor: '#2563eb', color: 'white', borderRadius: '0.25rem' }}>
                              {hint.category === 'customer' ? '顧客' : hint.category === 'revenue' ? '売上' : 'マーケ'}
                            </div>
                          </div>
                          
                          <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.5rem' }}>
                            {hint.description}
                          </div>
                          
                          <div style={{ fontSize: '0.75rem', color: '#2563eb', fontFamily: 'monospace', backgroundColor: '#f8fafc', padding: '0.25rem 0.5rem', borderRadius: '0.25rem' }}>
                            {hint.formula}
                          </div>

                          {selectedHintId === hint.id && (
                            <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid #e2e8f0' }}>
                              <div style={{ fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>具体例:</div>
                              <ul style={{ fontSize: '0.875rem', color: '#64748b', paddingLeft: '1rem', marginBottom: '0.75rem' }}>
                                {hint.examples.map((example, index) => (
                                  <li key={index} style={{ marginBottom: '0.25rem' }}>{example}</li>
                                ))}
                              </ul>
                              
                              <button 
                                style={{
                                  width: '100%',
                                  padding: '0.375rem 0.75rem',
                                  borderRadius: '0.375rem',
                                  fontWeight: '500',
                                  fontSize: '0.75rem',
                                  border: 'none',
                                  cursor: 'pointer',
                                  backgroundColor: '#2563eb',
                                  color: 'white'
                                }}
                                onClick={() => handleAddChildNode(selectedNode.id, hint)}
                              >
                                このKPIを追加
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ padding: '1rem', textAlign: 'center', color: '#64748b' }}>
                      <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>💡</div>
                      <div style={{ fontSize: '0.875rem' }}>
                        このKPIのヒントは現在準備中です。<br/>
                        手動で子KPIを追加することができます。
                      </div>
                      <button 
                        style={{
                          marginTop: '0.75rem',
                          padding: '0.375rem 0.75rem',
                          borderRadius: '0.375rem',
                          fontWeight: '500',
                          fontSize: '0.75rem',
                          border: '1px solid #e2e8f0',
                          cursor: 'pointer',
                          backgroundColor: '#f8fafc',
                          color: '#0f172a'
                        }}
                        onClick={() => {
                          const name = prompt('KPI名を入力してください:');
                          if (name) {
                            handleAddChildNode(selectedNode.id, { name });
                          }
                        }}
                      >
                        手動でKPIを追加
                      </button>
                    </div>
                  )}
                </div>

                {/* フッター */}
                <div style={{ padding: '1rem', borderTop: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    💡 ヒント: KPIをダブルクリックして名前を編集できます
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 数値入力ダイアログ */}
        {showValueDialog && selectedNode && (
          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
            <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.25)', maxWidth: '28rem', width: '100%', margin: '1rem', maxHeight: '90vh', overflowY: 'auto' }}>
              {/* ヘッダー */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.5rem', borderBottom: '1px solid #e2e8f0' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', margin: 0 }}>数値設定 - {selectedNode.name}</h3>
                <button 
                  onClick={() => {
                    setShowValueDialog(false);
                    setCalculationStep(0);
                  }}
                  style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '1rem' }}
                >
                  ✕
                </button>
              </div>

              {calculationStep === 0 ? (
                /* 通常の入力フォーム */
                <div style={{ padding: '1.5rem' }}>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>目標値</label>
                    <input
                      type="number"
                      style={{ width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #e2e8f0', borderRadius: '0.375rem', fontSize: '0.875rem' }}
                      value={selectedNode.target || ''}
                      onChange={(e) => handleNodeUpdate(selectedNode.id, { target: parseFloat(e.target.value) || undefined })}
                      placeholder="目標値を入力"
                    />
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>実績値</label>
                    <input
                      type="number"
                      style={{ width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #e2e8f0', borderRadius: '0.375rem', fontSize: '0.875rem' }}
                      value={selectedNode.value || ''}
                      onChange={(e) => handleNodeUpdate(selectedNode.id, { value: parseFloat(e.target.value) || undefined })}
                      placeholder="現在の実績値を入力"
                    />
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>単位</label>
                    <input
                      type="text"
                      style={{ width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #e2e8f0', borderRadius: '0.375rem', fontSize: '0.875rem' }}
                      value={selectedNode.unit || ''}
                      onChange={(e) => handleNodeUpdate(selectedNode.id, { unit: e.target.value })}
                      placeholder="例: 円、件、人"
                    />
                  </div>

                  {/* インテリジェント計算ボタン */}
                  <div style={{ backgroundColor: '#f8fafc', borderRadius: '0.5rem', padding: '1rem' }}>
                    <div style={{ fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>🤖 インテリジェント計算</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.75rem' }}>
                      上位KPIの情報から自動的に目標値を算出します
                    </div>
                    <button 
                      style={{
                        padding: '0.375rem 0.75rem',
                        borderRadius: '0.375rem',
                        fontWeight: '500',
                        fontSize: '0.75rem',
                        border: '1px solid #e2e8f0',
                        cursor: 'pointer',
                        backgroundColor: '#f8fafc',
                        color: '#0f172a'
                      }}
                      onClick={() => setCalculationStep(1)}
                    >
                      計算アシスタントを使用
                    </button>
                  </div>
                </div>
              ) : (
                /* インテリジェント計算フロー */
                <div style={{ padding: '1.5rem' }}>
                  <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🧮</div>
                    <div style={{ fontWeight: '500' }}>インテリジェント計算</div>
                    <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
                      いくつかの質問にお答えください
                    </div>
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                      上位KPI「{selectedNode.parent ? kpiTree.nodes[selectedNode.parent]?.name || 'Parent KPI' : '売上'}」の目標値はいくらですか？
                    </label>
                    <input
                      type="number"
                      style={{ width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #e2e8f0', borderRadius: '0.375rem', fontSize: '0.875rem' }}
                      value={calculationData.parentValue}
                      onChange={(e) => setCalculationData(prev => ({ ...prev, parentValue: e.target.value }))}
                      placeholder="例: 5000万円の場合は 50000000"
                    />
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                      過去の「{selectedNode.name}」の平均値はいくらでしたか？
                    </label>
                    <input
                      type="number"
                      style={{ width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #e2e8f0', borderRadius: '0.375rem', fontSize: '0.875rem' }}
                      value={calculationData.childEstimate}
                      onChange={(e) => setCalculationData(prev => ({ ...prev, childEstimate: e.target.value }))}
                      placeholder="例: 平均単価50万円の場合は 500000"
                    />
                  </div>

                  <div style={{ backgroundColor: '#dbeafe', borderRadius: '0.5rem', padding: '0.75rem', marginBottom: '1rem' }}>
                    <div style={{ fontSize: '0.875rem' }}>
                      💡 計算例: 売上5000万円 ÷ 平均単価50万円 = 目標件数100件
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button 
                      style={{
                        flex: 1,
                        padding: '0.5rem 1rem',
                        borderRadius: '0.375rem',
                        fontWeight: '500',
                        border: '1px solid #e2e8f0',
                        cursor: 'pointer',
                        backgroundColor: '#f8fafc',
                        color: '#0f172a'
                      }}
                      onClick={() => setCalculationStep(0)}
                    >
                      戻る
                    </button>
                    <button 
                      style={{
                        flex: 1,
                        padding: '0.5rem 1rem',
                        borderRadius: '0.375rem',
                        fontWeight: '500',
                        border: 'none',
                        cursor: calculationData.parentValue && calculationData.childEstimate ? 'pointer' : 'not-allowed',
                        backgroundColor: calculationData.parentValue && calculationData.childEstimate ? '#2563eb' : '#9ca3af',
                        color: 'white'
                      }}
                      onClick={calculateValue}
                      disabled={!calculationData.parentValue || !calculationData.childEstimate}
                    >
                      計算実行
                    </button>
                  </div>
                </div>
              )}

              {/* フッター */}
              {calculationStep === 0 && (
                <div style={{ display: 'flex', gap: '0.75rem', padding: '1.5rem', borderTop: '1px solid #e2e8f0' }}>
                  <button 
                    style={{
                      flex: 1,
                      padding: '0.5rem 1rem',
                      borderRadius: '0.375rem',
                      fontWeight: '500',
                      border: '1px solid #e2e8f0',
                      cursor: 'pointer',
                      backgroundColor: '#f8fafc',
                      color: '#0f172a'
                    }}
                    onClick={() => {
                      setShowValueDialog(false);
                      setCalculationStep(0);
                    }}
                  >
                    キャンセル
                  </button>
                  <button 
                    style={{
                      flex: 1,
                      padding: '0.5rem 1rem',
                      borderRadius: '0.375rem',
                      fontWeight: '500',
                      border: 'none',
                      cursor: 'pointer',
                      backgroundColor: '#2563eb',
                      color: 'white'
                    }}
                    onClick={() => setShowValueDialog(false)}
                  >
                    保存
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}