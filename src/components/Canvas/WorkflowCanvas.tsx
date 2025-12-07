import React, { useCallback, useRef, useState, useMemo } from 'react';
import {
    ReactFlow,
    addEdge,
    useNodesState,
    useEdgesState,
    Controls,
    Background,
    MarkerType,
    useReactFlow,
    type Connection,
    type Edge,
    type Node,
} from '@xyflow/react';
import { useAppStore } from '../../store/useAppStore';
import { StartNode, TaskNode, ApprovalNode, AutomationNode, EndNode } from '../Nodes';
import { v4 as uuidv4 } from 'uuid';
import '@xyflow/react/dist/style.css';
import './Canvas.css';

const nodeTypes = {
    startNode: StartNode,
    taskNode: TaskNode,
    approvalNode: ApprovalNode,
    automationNode: AutomationNode,
    endNode: EndNode,
};

const initialNodes: Node[] = [
    {
        id: 'start-1',
        type: 'startNode',
        position: { x: 50, y: 50 },
        data: { label: 'Start Workflow' },
    },
];

const WorkflowCanvas = () => {
    const reactFlowWrapper = useRef<HTMLDivElement>(null);
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const { screenToFlowPosition } = useReactFlow();

    const { setSelectedNodeId, setTestPanelOpen } = useAppStore();

    const onConnect = useCallback(
        (params: Connection) => setEdges((eds) => addEdge({ ...params, markerEnd: { type: MarkerType.ArrowClosed } }, eds)),
        [setEdges],
    );

    const onDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback(
        (event: React.DragEvent) => {
            event.preventDefault();

            const type = event.dataTransfer.getData('application/reactflow');
            if (!type) return;

            const position = screenToFlowPosition({
                x: event.clientX,
                y: event.clientY,
            });

            const newNode: Node = {
                id: uuidv4(),
                type,
                position,
                data: { label: `New ${type.replace('Node', '')}` },
            };

            setNodes((nds) => nds.concat(newNode));
        },
        [screenToFlowPosition, setNodes],
    );

    const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
        setSelectedNodeId(node.id);
        setTestPanelOpen(false);
    }, [setSelectedNodeId, setTestPanelOpen]);

    return (
        <div className="canvas-wrapper" ref={reactFlowWrapper}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onDrop={onDrop}
                onDragOver={onDragOver}
                onNodeClick={onNodeClick}
                nodeTypes={nodeTypes}
                onPaneClick={() => setSelectedNodeId(null)}
                fitView
            >
                <Controls className="react-flow__controls" showInteractive={false} />
                <Background color="#ccc" gap={20} size={1} />
            </ReactFlow>
        </div>
    );
};

export default WorkflowCanvas;
