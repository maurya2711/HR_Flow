import React from 'react';
import { ReactFlowProvider, useReactFlow } from '@xyflow/react';
import { Play } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import WorkflowCanvas from './Canvas/WorkflowCanvas';
import Sidebar from './Sidebar/Sidebar';
import PropertiesPanel from './PropertiesPanel/PropertiesPanel';
import TestPanel from './TestPanel/TestPanel';
import './WorkflowEditor.css';

const TopBar = () => {
    const { setTestPanelOpen } = useAppStore();
    const { toObject, setNodes, setEdges } = useReactFlow();

    const handleSave = async () => {
        const flow = toObject();
        alert('Saving workflow... (Check console)');
        console.log('Saving:', flow);
        // Simulate API
        await new Promise(r => setTimeout(r, 500));
        alert('Workflow Saved Successfully!');
    };

    const handleNew = () => {
        if (confirm('Are you sure? Unsaved changes will be lost.')) {
            setNodes([]);
            setEdges([]);
        }
    };

    return (
        <header className="top-bar">
            <div className="logo">
                <div className="logo-icon">HR</div>
                <h1>Workflow Designer</h1>
            </div>
            <div className="actions" style={{ display: 'flex', gap: '8px' }}>
                <button className="btn-secondary" onClick={handleNew}>
                    New Flow
                </button>
                <button className="btn-secondary" onClick={handleSave}>
                    Save Flow
                </button>
                <button className="btn-primary" onClick={() => setTestPanelOpen(true)}>
                    <Play size={16} fill="currentColor" />
                    <span>Test Workflow</span>
                </button>
            </div>
        </header>
    );
};

const EditorLayout = () => {
    const { isTestPanelOpen } = useAppStore();

    return (
        <div className="editor-container">
            <TopBar />
            <div className="editor-body">
                <Sidebar />
                <div className="canvas-area">
                    <WorkflowCanvas />
                    <PropertiesPanel />
                </div>
            </div>
            {isTestPanelOpen && <TestPanel />}
        </div>
    );
};

export default function WorkflowEditor() {
    return (
        <ReactFlowProvider>
            <EditorLayout />
        </ReactFlowProvider>
    );
}
