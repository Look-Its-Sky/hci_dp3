import { FC, useState, FormEvent } from 'react';
import type { NewScenarioData } from '../types';

/**
 * Modal for creating a new scenario
 */
interface CreateScenarioModalProps {
  show: boolean;
  onClose: () => void;
  onRunScenario: (data: NewScenarioData) => void;
}

const CreateScenarioModal: FC<CreateScenarioModalProps> = ({ show, onClose, onRunScenario }) => {
  const [title, setTitle] = useState('');
  const [impactPeriod, setImpactPeriod] = useState('');
  const [totalCost, setTotalCost] = useState('');
  const [costEachPeriod, setCostEachPeriod] = useState('');
  const [periodUnit, setPeriodUnit] = useState('');
  
  if (!show) {
    return null;
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title) {
      console.warn("Title is required.");
      return;
    }
    
    const formData: NewScenarioData = {
      title,
      impactPeriod,
      totalCost: parseFloat(totalCost) || 0,
      costEachPeriod: parseFloat(costEachPeriod) || 0,
      periodUnit
    };
    
    // Pass data up and close modal
    onRunScenario(formData);
    onClose();
    
    // Reset form
    setTitle('');
    setImpactPeriod('');
    setTotalCost('');
    setCostEachPeriod('');
    setPeriodUnit('');
  };

  return (
    <>
      <div className="modal-backdrop" onClick={onClose} aria-hidden="true"></div>
      <div className="modal-panel" role="dialog" aria-modal="true" aria-labelledby="create-scenario-title">
        <h2 id="create-scenario-title">Create New Scenario</h2>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="scenarioTitle">Title</label>
            <input type="text" id="scenarioTitle" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Buy a New Car" />
          </div>
          
          <div className="form-group">
            <label htmlFor="impactPeriod">Impact Period</label>
            <select id="impactPeriod" className="scenario-select" value={impactPeriod} onChange={(e) => setImpactPeriod(e.target.value)}>
              <option value="" disabled>Select impact period...</option>
              <option value="one-time">One-time</option>
              <option value="recurring">Recurring</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="totalCost">Total Cost ($)</label>
            <input type="number" id="totalCost" value={totalCost} onChange={(e) => setTotalCost(e.target.value)} placeholder="15000" min="0" />
          </div>
          
          <div className="form-group">
            <label htmlFor="costEachPeriod">Cost each Period ($)</label>
            <input type="number" id="costEachPeriod" value={costEachPeriod} onChange={(e) => setCostEachPeriod(e.target.value)} placeholder="300" min="0" />
          </div>
          
          <div className="form-group">
            <label htmlFor="periodUnit">Period Unit</label>
            <select id="periodUnit" className="scenario-select" value={periodUnit} onChange={(e) => setPeriodUnit(e.target.value)}>
              <option value="" disabled>Select unit...</option>
              <option value="year">Year</option>
              <option value="month">Month</option>
              <option value="day">Day</option>
              <option value="hour">Hour</option>
            </select>
          </div>
          
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="modal-btn-cancel">Cancel</button>
            <button type="submit" className="modal-btn-submit">Run Scenario</button>
          </div>
        </form>
      </div>
    </>
  );
};

export default CreateScenarioModal;
