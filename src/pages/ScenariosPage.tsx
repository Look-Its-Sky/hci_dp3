import { FC, useState } from 'react';
import type { NewScenarioData } from '../types';
import { formatCurrency } from '../utils';
import { MOCK_IMPACT_DATA, MOCK_SAVED_SCENARIOS, MOCK_PRESET_SCENARIOS } from '../data';
import CreateScenarioModal from '../components/CreateScenarioModal';
import ScenarioResults from '../components/ScenarioResults';

const MOCK_SCENARIO_DETAILS: Record<string, NewScenarioData> = {
  's1': { title: 'Aggressive Savings Plan', impactPeriod: 'recurring', totalCost: -5000, costEachPeriod: -1000, periodUnit: 'month' },
  's2': { title: 'Early Retirement Study', impactPeriod: 'one-time', totalCost: 0, costEachPeriod: 0, periodUnit: 'year' },
  's3': { title: 'New House Purchase', impactPeriod: 'one-time', totalCost: 50000, costEachPeriod: 0, periodUnit: 'year' },
  'p1': { title: 'Market Crash (30%)', impactPeriod: 'one-time', totalCost: 0, costEachPeriod: 0, periodUnit: 'year' }, 
  'p2': { title: 'High Inflation (10%)', impactPeriod: 'recurring', totalCost: 0, costEachPeriod: 0, periodUnit: 'year' },
  'p3': { title: 'Windfall (10k)', impactPeriod: 'one-time', totalCost: -10000, costEachPeriod: 0, periodUnit: 'year' },
};

/**
 * Main Component for the "SCENARIOS" page.
 * This component now manages two states:
 * 1. Scenario Setup (dropdowns)
 * 2. Scenario Results (charts and recommendations)
 */
const ScenariosPage: FC = () => {
  const longTermGoals = MOCK_IMPACT_DATA.filter(item => 
    ['House Loan', 'Student Loan', 'Car Downpayment', 'Vacation Fund', 'Emergency Fund', 'Investments'].includes(item.name)
  );

  const totalBalance = longTermGoals.reduce((sum, goal) => {
    return sum + (goal.currentAmount || 0);
  }, 0);
  
  const [selectedScenarioId, setSelectedScenarioId] = useState('');
  const [hasRunScenario, setHasRunScenario] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false); // State for new modal
  const [activeScenario, setActiveScenario] = useState<NewScenarioData | null>(null);

  // Handler for running a newly created scenario
  const handleCreateScenario = (data: NewScenarioData) => {
    // In a real app, you'd use this data to calculate results
    console.log("Running new scenario with data:", data);
    setActiveScenario(data);
    setShowCreateModal(false);
    setHasRunScenario(true);
  };

  const handleRunSelectedScenario = () => {
    let scenarioData: NewScenarioData | null = null;

    if (selectedScenarioId && MOCK_SCENARIO_DETAILS[selectedScenarioId]) {
      scenarioData = MOCK_SCENARIO_DETAILS[selectedScenarioId];
    }

    if (scenarioData) {
      setActiveScenario(scenarioData);
      setHasRunScenario(true);
    }
  };

  // Show the Results page
  if (hasRunScenario && activeScenario) {
    return (
      <>
        <div className="title-header centered">
        </div>
        <div className="balance-card-simple">
          <h2>EQUITY:</h2>
          <p>{formatCurrency(totalBalance)}</p>
        </div>
        <ScenarioResults 
          totalBalance={totalBalance}
          activeScenario={activeScenario}
          onRunNew={() => {
            setHasRunScenario(false);
            setActiveScenario(null);
            setSelectedScenarioId('');
          }} 
        />
      </>
    );
  }

  // Show the Setup page
  return (
    <>
      <div className="title-header centered">
      </div>
      <div className="balance-card-simple">
        <h2>EQUITY:</h2>
        <p>{formatCurrency(totalBalance)}</p>
      </div>
      
      <div className="scenario-container">
        <div className="scenario-select-group">
          <label htmlFor="all-scenarios">Select Scenario:</label>
          <select 
            id="all-scenarios" 
            className="scenario-select"
            value={selectedScenarioId}
            onChange={(e) => setSelectedScenarioId(e.target.value)}
          >
            <option value="" disabled>Select a scenario...</option>
            <optgroup label="Saved Scenarios">
              {MOCK_SAVED_SCENARIOS.map((scenario) => (
                <option key={scenario.id} value={scenario.id}>
                  {scenario.name}
                </option>
              ))}
            </optgroup>
            <optgroup label="Preset Scenarios">
              {MOCK_PRESET_SCENARIOS.map((scenario) => (
                <option key={scenario.id} value={scenario.id}>
                  {scenario.name}
                </option>
              ))}
            </optgroup>
          </select>
        </div>

        <div className="scenario-actions">
          <button 
            className="scenario-button"
            onClick={handleRunSelectedScenario}
            disabled={!selectedScenarioId}
            style={{ opacity: !selectedScenarioId ? 0.5 : 1 }}
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
