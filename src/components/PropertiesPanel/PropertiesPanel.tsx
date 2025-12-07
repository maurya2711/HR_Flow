import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useReactFlow, useNodes } from '@xyflow/react';
import { X } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { api } from '../../services/api';
import { MOCK_ROLES, MOCK_USERS } from '../../services/mockData';
import './PropertiesPanel.css';

interface NodeData {
    label: string;
    [key: string]: any;
}

const PropertiesPanel = () => {
    const { selectedNodeId, setSelectedNodeId } = useAppStore();
    const nodes = useNodes();
    const { setNodes } = useReactFlow();
    const [automations, setAutomations] = useState<any[]>([]);

    const selectedNode = nodes.find((n) => n.id === selectedNodeId);

    const { register, reset, watch, setValue } = useForm<NodeData>({
        defaultValues: selectedNode?.data || {},
        mode: 'onChange'
    });

    useEffect(() => {
        api.getAutomations().then(setAutomations);
    }, []);

    // Sync form when selection changes
    useEffect(() => {
        if (selectedNode) {
            reset(selectedNode.data);
        }
    }, [selectedNodeId, reset]); // Removed 'selectedNode' from deps to avoid loop while editing

    // Sync changes back to Node
    useEffect(() => {
        const subscription = watch((value) => {
            if (selectedNodeId) {
                setNodes((nds) =>
                    nds.map((node) =>
                        node.id === selectedNodeId
                            ? { ...node, data: { ...node.data, ...value } }
                            : node
                    )
                );
            }
        });
        return () => subscription.unsubscribe();
    }, [watch, selectedNodeId, setNodes]);

    // Handle Automation Label Sync
    const watchedAutomationId = watch('automationId');
    useEffect(() => {
        if (watchedAutomationId && automations.length > 0) {
            const auto = automations.find(a => a.id === watchedAutomationId);
            if (auto) {
                setValue('action', auto.label); // Sync label for display on Node
            }
        }
    }, [watchedAutomationId, automations, setValue]);

    if (!selectedNodeId || !selectedNode) {
        return (
            <div className="properties-panel no-selection">
                <p>Select a node to configure</p>
            </div>
        );
    }

    const renderFields = () => {
        switch (selectedNode.type) {
            case 'startNode':
                return (
                    <>
                        <div className="form-group">
                            <label>Title</label>
                            <input {...register('label')} className="input" />
                        </div>
                        <div className="form-group">
                            <label>Metadata (JSON/Text)</label>
                            <textarea {...register('metadata')} className="input" rows={4} />
                        </div>
                    </>
                );
            case 'taskNode':
                return (
                    <>
                        <div className="form-group">
                            <label>Title</label>
                            <input {...register('label')} className="input" />
                        </div>
                        <div className="form-group">
                            <label>Assignee</label>
                            <select {...register('assignee')} className="input">
                                <option value="">Select User</option>
                                {MOCK_USERS.map(u => <option key={u} value={u}>{u}</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Due Date</label>
                            <input type="date" {...register('dueDate')} className="input" />
                        </div>
                        <div className="form-group">
                            <label>Description</label>
                            <textarea {...register('description')} className="input" rows={3} />
                        </div>
                    </>
                );
            case 'approvalNode':
                return (
                    <>
                        <div className="form-group">
                            <label>Title</label>
                            <input {...register('label')} className="input" />
                        </div>
                        <div className="form-group">
                            <label>Approver Role</label>
                            <select {...register('role')} className="input">
                                <option value="">Select Role</option>
                                {MOCK_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Auto-approve Threshold ($)</label>
                            <input type="number" {...register('threshold')} className="input" />
                        </div>
                    </>
                );
            case 'automationNode':
                const selectedAutomation = automations.find(a => a.id === watchedAutomationId);
                return (
                    <>
                        <div className="form-group">
                            <label>Title</label>
                            <input {...register('label')} className="input" />
                        </div>
                        <div className="form-group">
                            <label>Action</label>
                            <select {...register('automationId')} className="input">
                                <option value="">Select Action</option>
                                {automations.map(a => <option key={a.id} value={a.id}>{a.label}</option>)}
                            </select>
                        </div>
                        {selectedAutomation && (
                            <div className="dynamic-params">
                                <h4>Parameters</h4>
                                {selectedAutomation.params.map((param: any) => (
                                    <div key={param.name} className="form-group">
                                        <label>{param.label}</label>
                                        {param.type === 'textarea' ? (
                                            <textarea {...register(param.name)} className="input" rows={2} />
                                        ) : param.type === 'select' ? (
                                            <select {...register(param.name)} className="input">
                                                {param.options?.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
                                            </select>
                                        ) : (
                                            <input type={param.type} {...register(param.name)} className="input" />
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                );
            case 'endNode':
                return (
                    <>
                        <div className="form-group">
                            <label>Title</label>
                            <input {...register('label')} className="input" />
                        </div>
                        <div className="form-group">
                            <label>End Message</label>
                            <textarea {...register('message')} className="input" rows={3} />
                        </div>
                        <div className="form-group checkbox">
                            <label>
                                <input type="checkbox" {...register('isSummary')} /> Is Summary Step
                            </label>
                        </div>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <aside className="properties-panel">
            <div className="panel-header">
                <h3>Configure {selectedNode.data.label}</h3>
                <button className="close-btn" onClick={() => setSelectedNodeId(null)}>
                    <X size={18} />
                </button>
            </div>

            <form onSubmit={(e) => e.preventDefault()} className="panel-content">
                {renderFields()}
            </form>

            <div className="panel-footer">
                <button
                    className="delete-btn"
                    onClick={() => {
                        setNodes((nds) => nds.filter((n) => n.id !== selectedNodeId));
                        setSelectedNodeId(null);
                    }}
                >
                    Delete Node
                </button>
            </div>
        </aside>
    );
};

export default PropertiesPanel;
