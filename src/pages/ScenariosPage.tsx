import { FC, useState } from 'react';
import type { NewScenarioData } from '../types';
import { formatCurrency } from '../utils';
import { MOCK_SAVED_SCENARIOS, MOCK_PRESET_SCENARIOS } from '../data';
import CreateScenarioModal from '../components/CreateScenarioModal';
import ScenarioResults from '../components/ScenarioResults';

/**
 * Main Component for the "SCENARIOS" page.
 * This component now manages two states:
 * 1. Scenario Setup (dropdowns)
 * 2. Scenario Results (charts and recommendations)
 */
const ScenariosPage: FC = () => {
  const totalBalance = 38445.12;
  const [savedScenario, setSavedScenario] = useState('');
  const [presetScenario, setPresetScenario] = useState('');
  const [hasRunScenario, setHasRunScenario] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false); // State for new modal

  // Handler for running a newly created scenario
  const handleCreateScenario = (data: NewScenarioData) => {
    // In a real app, you'd use this data to calculate results
    console.log("Running new scenario with data:", data);
    // For now, just close the modal and show the results page
    setShowCreateModal(false);
    setHasRunScenario(true);
  };

  // Show the Results page
  if (hasRunScenario) {
    return (
      <>
        <div className="title-header centered">
          <h1>Financial Tracker</h1>
        </div>
        <div className="balance-card-simple">
          <h2>BALANCE:</h2>
          <p>{formatCurrency(totalBalance)}</p>
        </div>
        <ScenarioResults 
          totalBalance={totalBalance}
          onRunNew={() => setHasRunScenario(false)} 
        />
      </>
    );
  }

  // Show the Setup page
  return (
    <>
      <div className="title-header centered">
        <h1>Financial Tracker</h1>
      </div>
      <div className="balance-card-simple">
        <h2>BALANCE:</h2>
        <p>{formatCurrency(totalBalance)}</p>
      </div>
      
      <div className="scenario-container">
        <div className="scenario-select-group">
          <label htmlFor="saved-scenarios">Saved Scenarios:</label>
          <select 
            id="saved-scenarios" 
            className="scenario-select"
            value={savedScenario}
            onChange={(e) => setSavedScenario(e.target.value)}
          >
            <option value="" disabled>Select a saved scenario...</option>
            {MOCK_SAVED_SCENARIOS.map((scenario) => (
              <option key={scenario.id} value={scenario.id}>
                {scenario.name}
              </option>
            ))}
          </select>
        </div>

        <div className="scenario-select-group">
          <label htmlFor="preset-scenarios">Preset Scenarios:</label>
          <select 
            id="preset-scenarios" 
            className="scenario-select"
            value={presetScenario}
            onChange={(e) => setPresetScenario(e.target.value)}
          >
            <option value="" disabled>Select a preset scenario...</option>
            {MOCK_PRESET_SCENARIOS.map((scenario) => (
              <option key={scenario.id} value={scenario.id}>
                {scenario.name}
              </option>
            ))}
          </select>
        </div>

        <div className="scenario-actions">
          <button 
            className="scenario-button"
            onClick={() => setHasRunScenario(true)}
          >
            Run Scenario
          </button>
          <button 
            className="scenario-button"
            onClick={() => setShowCreateModal(true)} // Open modal
          >
            Create New Scenario
          </button>
        </div>
      </div>
      
      {/* Render the new modal */}
      <CreateScenarioModal 
        show={showCreateModal} 
        onClose={() => setShowCreateModal(false)}
        onRunScenario={handleCreateScenario}
      />
    </>
  );
};

export default ScenariosPage;
