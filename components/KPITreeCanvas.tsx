import { useEffect, useRef, useState } from 'react';
import { KPINode, KPITree } from '../types';

interface KPITreeCanvasProps {
  tree: KPITree;
  selectedNode: KPINode | null;
  onNodeSelect: (node: KPINode) => void;
  onNodeUpdate: (nodeId: string, updates: Partial<KPINode>) => void;
  onAddChild: (parentId: string, childData: Partial<KPINode>) => void;
}

export default function KPITreeCanvas({
  tree,
  selectedNode,
  onNodeSelect,
  onNodeUpdate,
  onAddChild
}: KPITreeCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [draggedNode, setDraggedNode] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleNodeClick = (node: KPINode) => {
    onNodeSelect(node);
  };

  const handleNodeDoubleClick = (node: KPINode) => {
    const newName = prompt('KPI名を入力してください:', node.name);
    if (newName && newName !== node.name) {
      onNodeUpdate(node.id, { name: newName });
    }
  };

  const handleAddChild = (parentNode: KPINode) => {
    const childName = prompt('子KPIの名前を入力してください:');
    if (childName) {
      onAddChild(parentNode.id, { name: childName });
    }
  };

  const handleMouseDown = (e: React.MouseEvent, nodeId: string) => {
    const node = tree.nodes[nodeId];
    const rect = e.currentTarget.getBoundingClientRect();
    setDraggedNode(nodeId);
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggedNode || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const newX = e.clientX - rect.left - dragOffset.x;
    const newY = e.clientY - rect.top - dragOffset.y;

    onNodeUpdate(draggedNode, { x: newX, y: newY });
  };

  const handleMouseUp = () => {
    setDraggedNode(null);
  };

  const renderConnection = (parent: KPINode, child: KPINode) => {
    const parentCenterX = parent.x + 100; // ノード幅の半分
    const parentCenterY = parent.y + 40;  // ノード高さの半分
    const childCenterX = child.x + 100;
    const childCenterY = child.y + 40;

    return (
      <svg
        key={`connection-${parent.id}-${child.id}`}
        className="absolute top-0 left-0 pointer-events-none"
        style={{
          width: '100%',
          height: '100%',
          zIndex: 1
        }}
      >
        <line
          x1={parentCenterX}
          y1={parentCenterY}
          x2={childCenterX}
          y2={childCenterY}
          stroke="#e2e8f0"
          strokeWidth="2"
        />
        {/* 矢印 */}
        <polygon
          points={`${childCenterX-5},${childCenterY-5} ${childCenterX+5},${childCenterY-5} ${childCenterX},${childCenterY+5}`}
          fill="#e2e8f0"
        />
      </svg>
    );
  };

  const renderNode = (node: KPINode) => {
    const isSelected = selectedNode?.id === node.id;
    const hasValue = node.value !== undefined;
    const hasTarget = node.target !== undefined;
    
    return (
      <div
        key={node.id}
        className={`absolute bg-white rounded-lg shadow-md border-2 cursor-pointer transition-all duration-200 ${
          isSelected ? 'border-primary shadow-lg' : 'border-gray-200 hover:border-primary hover:shadow-md'
        }`}
        style={{
          left: node.x,
          top: node.y,
          width: '200px',
          minHeight: '80px',
          zIndex: 2
        }}
        onClick={() => handleNodeClick(node)}
        onDoubleClick={() => handleNodeDoubleClick(node)}
        onMouseDown={(e) => handleMouseDown(e, node.id)}
      >
        <div className="p-3">
          <div className="font-semibold text-sm mb-1 text-primary">
            {node.name}
          </div>
          
          {node.description && (
            <div className="text-xs text-secondary mb-2">
              {node.description}
            </div>
          )}

          <div className="flex justify-between items-center text-xs">
            {hasValue && (
              <div className="text-success font-medium">
                実績: {node.value}{node.unit || ''}
              </div>
            )}
            {hasTarget && (
              <div className="text-warning font-medium">
                目標: {node.target}{node.unit || ''}
              </div>
            )}
          </div>

          {node.formula && (
            <div className="text-xs text-secondary mt-1 italic">
              {node.formula}
            </div>
          )}
        </div>

        {/* 子ノード追加ボタン */}
        <button
          className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-primary text-white rounded-full text-xs hover:bg-primary-hover transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            handleAddChild(node);
          }}
          title="子KPIを追加"
        >
          +
        </button>
      </div>
    );
  };

  return (
    <div
      ref={canvasRef}
      className="relative w-full h-full overflow-auto bg-gray-50"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div className="absolute inset-0" style={{ minWidth: '1200px', minHeight: '800px' }}>
        {/* 接続線を描画 */}
        {Object.values(tree.nodes).map(parent =>
          parent.children.map(childId => {
            const child = tree.nodes[childId];
            return child ? renderConnection(parent, child) : null;
          })
        )}

        {/* ノードを描画 */}
        {Object.values(tree.nodes).map(renderNode)}
      </div>

      {/* ミニマップ（オプション） */}
      <div className="absolute bottom-4 right-4 w-48 h-32 bg-white rounded border shadow-md opacity-80">
        <div className="text-xs p-2 text-secondary">
          ミニマップ（今後実装予定）
        </div>
      </div>
    </div>
  );
}