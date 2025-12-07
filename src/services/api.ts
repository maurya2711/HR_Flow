import { MOCK_AUTOMATIONS } from './mockData';

// Types
export interface WorkflowNode {
    id: string;
    type: string;
    data: any;
}

export interface WorkflowEdge {
    id: string;
    source: string;
    target: string;
}

export interface WorkflowGraph {
    nodes: WorkflowNode[];
    edges: WorkflowEdge[];
}

export interface SimulationStep {
    stepId: number;
    nodeId: string;
    nodeType: string;
    action: string;
    status: 'pending' | 'success' | 'failed';
    timestamp: string;
    details?: string;
}

// Simulated API
export const api = {
    getAutomations: async () => {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));
        return MOCK_AUTOMATIONS;
    },

    saveWorkflow: async (workflow: WorkflowGraph): Promise<{ success: boolean; message: string }> => {
        await new Promise(resolve => setTimeout(resolve, 800));
        console.log('Saved Workflow:', workflow);
        return { success: true, message: 'Workflow saved successfully!' };
    },

    simulateWorkflow: async (workflow: WorkflowGraph): Promise<SimulationStep[]> => {
        await new Promise(resolve => setTimeout(resolve, 1000));

        const steps: SimulationStep[] = [];
        let stepCount = 1;

        // 1. Find Start Node
        const startNode = workflow.nodes.find(n => n.type === 'startNode');
        if (!startNode) {
            throw new Error("Validation Failed: No Start Node found.");
        }

        // Basic Graph Traversal (BFS/DFS simplified for prototype linear path)
        // In a real app we'd do a topological sort or full traversal engine
        let currentNode: WorkflowNode | undefined = startNode;
        const visited = new Set<string>();

        while (currentNode) {
            if (visited.has(currentNode.id)) {
                steps.push({
                    stepId: stepCount++,
                    nodeId: currentNode.id,
                    nodeType: currentNode.type,
                    action: 'Loop Detected',
                    status: 'failed',
                    timestamp: new Date().toISOString(),
                    details: "Cycle detected in workflow."
                });
                break;
            }
            visited.add(currentNode.id);

            // Log execution
            steps.push({
                stepId: stepCount++,
                nodeId: currentNode.id,
                nodeType: currentNode.type,
                action: getNodeActionDescription(currentNode),
                status: 'success',
                timestamp: new Date().toISOString(),
                details: JSON.stringify(currentNode.data)
            });

            // Find next node
            const edge = workflow.edges.find(e => e.source === currentNode?.id);
            if (edge) {
                currentNode = workflow.nodes.find(n => n.id === edge.target);
            } else {
                currentNode = undefined;
            }
        }

        return steps;
    }
};

function getNodeActionDescription(node: WorkflowNode): string {
    switch (node.type) {
        case 'startNode': return `Workflow Started: ${node.data.label}`;
        case 'taskNode': return `Task Assigned to ${node.data.assignee || 'Unassigned'}`;
        case 'approvalNode': return `Approval Requested from ${node.data.role || 'Manager'}`;
        case 'automationNode': return `Executing Automation: ${node.data.automationId || 'Unknown'}`;
        case 'endNode': return `Workflow Ended.`;
        default: return `Executed Node ${node.type}`;
    }
}
