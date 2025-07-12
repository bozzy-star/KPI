import { useState } from 'react';
import Head from 'next/head';

export default function Home() {
  const [kpiTree, setKpiTree] = useState(null);

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
      description: 'インテリジェントKPIツリー作成ツールで作成されたKPIツリーです',
      nodes: { root: rootNode },
      rootNodeId: 'root',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setKpiTree(newTree);
  };

  return (
    <>
      <Head>
        <title>インテリジェントKPIツリー作成ツール</title>
        <meta name="description" content="AIによるヒント機能付きKPIツリー作成ツール" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
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
              <button style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0.375rem 0.75rem',
                borderRadius: '0.375rem',
                fontWeight: '500',
                fontSize: '0.75rem',
                border: '1px solid #e2e8f0',
                cursor: 'pointer',
                backgroundColor: '#f8fafc',
                color: '#0f172a'
              }}>
                数値設定
              </button>
              <button style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
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
              <div style={{ 
                position: 'relative', 
                width: '100%', 
                height: '100%', 
                overflow: 'auto', 
                backgroundColor: '#f9fafb' 
              }}>
                <div style={{ 
                  position: 'absolute', 
                  inset: 0, 
                  minWidth: '1200px', 
                  minHeight: '800px' 
                }}>
                  {/* ルートノード */}
                  <div style={{
                    position: 'absolute',
                    left: kpiTree.nodes.root.x,
                    top: kpiTree.nodes.root.y,
                    width: '200px',
                    minHeight: '80px',
                    backgroundColor: 'white',
                    borderRadius: '0.5rem',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    border: '2px solid #2563eb',
                    cursor: 'pointer',
                    zIndex: 2
                  }}>
                    <div style={{ padding: '0.75rem' }}>
                      <div style={{ 
                        fontWeight: '600', 
                        fontSize: '0.875rem', 
                        marginBottom: '0.25rem', 
                        color: '#2563eb' 
                      }}>
                        {kpiTree.nodes.root.name}
                      </div>
                      <div style={{ 
                        fontSize: '0.75rem', 
                        color: '#64748b', 
                        marginBottom: '0.5rem' 
                      }}>
                        {kpiTree.nodes.root.description}
                      </div>
                    </div>
                    {/* 子ノード追加ボタン */}
                    <button style={{
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
                    }}>
                      +
                    </button>
                  </div>
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
        </div>
      </div>
    </>
  );
}