import React from 'react';
import { Play, FileText, CheckCircle, Bot, Flag } from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
    const onDragStart = (event: React.DragEvent, nodeType: string) => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.effectAllowed = 'move';
    };

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <h2>Nodes</h2>
                <p>Drag to canvas</p>
            </div>

            <div className="nodes-list">
                <div className="dndnode input" onDragStart={(event) => onDragStart(event, 'startNode')} draggable>
                    <Play size={16} /> <span>Start</span>
                </div>

                <div className="dndnode" onDragStart={(event) => onDragStart(event, 'taskNode')} draggable>
                    <FileText size={16} /> <span>Human Task</span>
                </div>

                <div className="dndnode" onDragStart={(event) => onDragStart(event, 'approvalNode')} draggable>
                    <CheckCircle size={16} /> <span>Approval</span>
                </div>

                <div className="dndnode" onDragStart={(event) => onDragStart(event, 'automationNode')} draggable>
                    <Bot size={16} /> <span>Automation</span>
                </div>

                <div className="dndnode output" onDragStart={(event) => onDragStart(event, 'endNode')} draggable>
                    <Flag size={16} /> <span>End</span>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
