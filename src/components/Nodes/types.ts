export type NodeType = 'startNode' | 'taskNode' | 'approvalNode' | 'automationNode' | 'endNode';

export interface BaseNodeData {
    label: string;
    [key: string]: any;
}

export const NODE_TYPES: Record<string, string> = {
    START: 'startNode',
    TASK: 'taskNode',
    APPROVAL: 'approvalNode',
    AUTOMATION: 'automationNode',
    END: 'endNode',
};
