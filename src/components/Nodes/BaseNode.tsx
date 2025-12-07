import React, { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import type { LucideIcon } from 'lucide-react';
import clsx from 'clsx';
import './Nodes.css';

interface BaseNodeProps {
    data: any;
    selected?: boolean;
    icon: LucideIcon;
    title: string;
    colorClass?: string;
    isStart?: boolean;
    isEnd?: boolean;
    children?: React.ReactNode;
}

const BaseNode: React.FC<BaseNodeProps> = ({
    data,
    selected,
    icon: Icon,
    title,
    colorClass = 'node-primary',
    isStart = false,
    isEnd = false,
    children
}) => {
    return (
        <div className={clsx('custom-node', colorClass, { 'selected': selected })}>
            {!isStart && (
                <Handle
                    type="target"
                    position={Position.Left}
                    className="custom-handle"
                />
            )}

            <div className="node-header">
                <div className={clsx("node-icon-wrapper", colorClass)}>
                    <Icon size={16} />
                </div>
                <div className="node-title">{data.label || title}</div>
            </div>

            {children && <div className="node-content">{children}</div>}

            {!isEnd && (
                <Handle
                    type="source"
                    position={Position.Right}
                    className="custom-handle"
                />
            )}
        </div>
    );
};

export default memo(BaseNode);
