import React, { useState } from 'react';
import { useReactFlow } from '@xyflow/react';
import { Play, RotateCw, X, AlertCircle } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { api, type SimulationStep } from '../../services/api';
import clsx from 'clsx';
import './TestPanel.css';

const TestPanel = () => {
    const { toObject } = useReactFlow();
    const { setTestPanelOpen } = useAppStore();
    const [loading, setLoading] = useState(false);
    const [logs, setLogs] = useState<SimulationStep[]>([]);
    const [error, setError] = useState<string | null>(null);

    const runSimulation = async () => {
        setLoading(true);
        setError(null);
        setLogs([]);

        try {
            const graph = toObject();
            // Ensure we pass the graph correctly typed as 'any' for mock API or matching interface
            // The Mock API expects { nodes, edges } which toObject provides.
            const steps = await api.simulateWorkflow(graph as any);
            setLogs(steps);
        } catch (err: any) {
            setError(err.message || 'Simulation failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="test-panel-overlay">
            <div className="test-panel">
                <div className="test-header">
                    <div className="flex items-center gap-2">
                        <Play size={20} className="text-primary" />
                        <h3>Workflow Simulation</h3>
                    </div>
                    <button onClick={() => setTestPanelOpen(false)} className="close-btn">
                        <X size={20} />
                    </button>
                </div>

                <div className="test-actions">
                    <button
                        className={clsx("run-btn", { 'loading': loading })}
                        onClick={runSimulation}
                        disabled={loading}
                    >
                        {loading ? <RotateCw className="animate-spin" size={16} /> : <Play size={16} />}
                        {loading ? 'Running...' : 'Run Simulation'}
                    </button>
                </div>

                <div className="test-content">
                    {error && (
                        <div className="error-banner">
                            <AlertCircle size={16} />
                            <span>{error}</span>
                        </div>
                    )}

                    {logs.length === 0 && !loading && !error && (
                        <div className="empty-state">
                            Click Run to simulate the workflow logic.
                        </div>
                    )}

                    <div className="logs-list">
                        {logs.map((step) => (
                            <div key={step.stepId} className={clsx("log-item", step.status)}>
                                <div className="log-time">{step.timestamp.split('T')[1].split('.')[0]}</div>
                                <div className="log-msg">
                                    <strong>{step.action}</strong>
                                    {step.details && <div className="log-details">{step.details}</div>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TestPanel;
