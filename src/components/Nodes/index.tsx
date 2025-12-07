import React, { memo } from 'react';
import type { NodeProps } from '@xyflow/react';
import { Play, FileText, CheckCircle, Bot, Flag } from 'lucide-react'; // Icons
import BaseNode from './BaseNode';

// 1. Start Node
export const StartNode = memo((props: NodeProps) => (
    <BaseNode
        {...props}
        title="Start"
        icon={Play}
        colorClass="node-primary"
        isStart
    />
));

// 2. Task Node
export const TaskNode = memo(({ data, selected, ...props }: NodeProps) => (
    <BaseNode
        data={data}
        selected={selected}
        title="Human Task"
        icon={FileText}
        colorClass="node-blue"
        {...props}
    >
        {data.assignee && <div>Assignee: {data.assignee} </div>}
    </BaseNode>
));

// 3. Approval Node
export const ApprovalNode = memo(({ data, selected, ...props }: NodeProps) => (
    <BaseNode
        data={data}
        selected={selected}
        title="Approval"
        icon={CheckCircle}
        colorClass="node-purple"
        {...props}
    >
        {data.role && <div>Role: {data.role} </div>}
    </BaseNode>
));

// 4. Automated Step Node
export const AutomationNode = memo(({ data, selected, ...props }: NodeProps) => (
    <BaseNode
        data={data}
        selected={selected}
        title="Automated Step"
        icon={Bot}
        colorClass="node-orange"
        {...props}
    >
        {data.action && <div>Action: {data.action} </div>}
    </BaseNode>
));

// 5. End Node
export const EndNode = memo((props: NodeProps) => (
    <BaseNode
        {...props}
        title="End"
        icon={Flag}
        colorClass="node-red"
        isEnd
    />
));
