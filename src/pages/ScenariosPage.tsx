import { FC, useState, useMemo } from 'react';
import type { NewScenarioData, Scenario } from '../types';
import { formatCurrency } from '../utils';
import { MOCK_IMPACT_DATA, MOCK_SAVED_SCENARIOS, MOCK_PRESET_SCENARIOS, MOCK_USER_PROFILE, calculateNetWorth, calculateMonthlySavings } from '../data';
import CreateScenarioModal from '../components/CreateScenarioModal';
import ScenarioResults from '../components/ScenarioResults';

const MOCK_SCENARIO_DETAILS: Record<string, NewScenarioData> = {
  's1': { title: 'Aggressive Savings Plan', impactPeriod: 'recurring', totalCost: -5000, costEachPeriod: -1000, periodUnit: 'month' },
  's2': { title: 'Early Retirement Study', impactPeriod: 'one-time', totalCost: 0, costEachPeriod: 0, periodUnit: 'year' },
  's3': { title: 'New House Purchase', impactPeriod: 'one-time', totalCost: 50000, costEachPeriod: 0, periodUnit: 'year' },
  'p1': { title: 'Market Crash (30%)', impactPeriod: 'one-time', totalCost: 0, costEachPeriod: 0, periodUnit: 'year' }, 
  'p2': { title: 'High Inflation (10%)', impactPeriod: 'recurring', totalCost: 0, costEachPeriod: 0, periodUnit: 'year' },
  'p3': { title: 'Windfall (10k)', impactPeriod: 'one-time', totalCost: -10000, costEachPeriod: 0, periodUnit: 'year' },
  'p4': { title: 'Job Loss (6 months)', impactPeriod: 'one-time', totalCost: 45000, costEachPeriod: 0, periodUnit: 'year' },
  'p5': { title: 'Medical Emergency ($15k)', impactPeriod: 'one-time', totalCost: 15000, costEachPeriod: 0, periodUnit: 'year' },
};

/**
 * Main Component for the "SCENARIOS" page.
 * This component now manages two states:
 * 1. Scenario Setup (dropdowns)
 * 2. Scenario Results (charts and recommendations)
 */
const ScenariosPage: FC = () => {
  const longTermGoals = MOCK_IMPACT_DATA.filter(item => 
    ['House Loan', 'Student Loan', 'Car Down Payment', 'Vacation Fund', 'Emergency Fund', 'Investments'].includes(item.name)
  );

  const totalBalance = calculateNetWorth();
  const monthlySavings = calculateMonthlySavings();
  
  const [selectedScenarioId, setSelectedScenarioId] = useState('');
  const [hasRunScenario, setHasRunScenario] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeScenario, setActiveScenario] = useState<NewScenarioData | null>(null);
  const [savedResults, setSavedResults] = useState<NewScenarioData[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Get selected scenario details for preview
  const selectedScenarioDetails = useMemo(() => {
    if (!selectedScenarioId) return null;
    
    const allScenarios = [...MOCK_SAVED_SCENARIOS, ...MOCK_PRESET_SCENARIOS];
    const scenario = allScenarios.find(s => s.id === selectedScenarioId);
    const details = MOCK_SCENARIO_DETAILS[selectedScenarioId];
    
    return scenario && details ? { ...scenario, ...details } : null;
  }, [selectedScenarioId]);

  // Filter scenarios by category
  const filteredPresetScenarios = useMemo(() => {
    if (selectedCategory === 'all') return MOCK_PRESET_SCENARIOS;
    return MOCK_PRESET_SCENARIOS.filter(s => s.category === selectedCategory);
  }, [selectedCategory]);

  // Handler for running a newly created scenario
  const handleCreateScenario = (data: NewScenarioData) => {
    console.log("Running new scenario with data:", data);
    setActiveScenario(data);
    setSavedResults(prev => [...prev, data]);
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

  const handleAdjustAndRerun = (adjustedScenario: NewScenarioData) => {
    setActiveScenario(adjustedScenario);
  };

  // Show the Results page
  if (hasRunScenario && activeScenario) {
    return (
      <>
        <ScenarioResults 
          totalBalance={totalBalance}
          monthlySavings={monthlySavings}
          userProfile={MOCK_USER_PROFILE}
          activeScenario={activeScenario}
          onRunNew={() => {
            setHasRunScenario(false);
            setActiveScenario(null);
            setSelectedScenarioId('');
          }}
          onAdjustScenario={handleAdjustAndRerun}
        />
      </>
    );
  }

  // Show the Setup page
  return (
    <>
      {/* Current Financial Snapshot */}
      <div className="scenario-snapshot">
        <div className="snapshot-header">
          <h2>Financial Snapshot</h2>
          <span className="snapshot-subtitle">Your current position</span>
        </div>
        <div className="snapshot-metrics">
          <div className="snapshot-metric main">
            <span className="metric-label">Net Worth</span>
            <span className="metric-value">{formatCurrency(totalBalance)}</span>
          </div>
          <div className="snapshot-metric">
            <span className="metric-label">Monthly Savings</span>
            <span className="metric-value positive">+{formatCurrency(monthlySavings)}</span>
          </div>
          <div className="snapshot-metric">
            <span className="metric-label">Risk Tolerance</span>
            <span className="metric-value capitalize">{MOCK_USER_PROFILE.riskTolerance}</span>
          </div>
        </div>
      </div>
      
      <div className="scenario-container enhanced">
        {/* Scenario Selection */}
        <div className="scenario-section">
          <h3>Run a Scenario</h3>
          <p className="section-description">See how different events could impact your finances</p>
          
          <div className="scenario-select-group">
            <label htmlFor="all-scenarios">Select Scenario:</label>
            <select 
              id="all-scenarios" 
              className="scenario-select"
              value={selectedScenarioId}
              onChange={(e) => setSelectedScenarioId(e.target.value)}
            >
              <option value="" disabled>Select a scenario...</option>
              <optgroup label="Your Saved Scenarios">
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

          {/* Scenario Preview */}
          {selectedScenarioDetails && (
            <div className="scenario-preview">
              <div className="preview-header">
                <h4>{selectedScenarioDetails.name}</h4>
                {selectedScenarioDetails.category && (
                  <span className={`category-badge ${selectedScenarioDetails.category}`}>
                    {selectedScenarioDetails.category}
                  </span>
                )}
              </div>
              {selectedScenarioDetails.description && (
                <p className="preview-description">{selectedScenarioDetails.description}</p>
              )}
              <div className="preview-impact">
                <div className="impact-detail">
                  <span className="detail-label">Type:</span>
                  <span className="detail-value">{selectedScenarioDetails.impactPeriod}</span>
                </div>
                {selectedScenarioDetails.totalCost !== 0 && (
                  <div className="impact-detail">
                    <span className="detail-label">Impact:</span>
                    <span className={`detail-value ${selectedScenarioDetails.totalCost > 0 ? 'negative' : 'positive'}`}>
                      {selectedScenarioDetails.totalCost > 0 ? '-' : '+'}{formatCurrency(Math.abs(selectedScenarioDetails.totalCost))}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="scenario-actions">
            <button 
              className="scenario-button primary"
              onClick={handleRunSelectedScenario}
              disabled={!selectedScenarioId}
            >
              <span className="btn-icon">▶</span>
              Run Scenario
            </button>
            <button 
              className="scenario-button secondary"
              onClick={() => setShowCreateModal(true)}
            >
              <span className="btn-icon">+</span>
              Create Custom Scenario
            </button>
          </div>
        </div>

        {/* Quick Scenarios */}
        <div className="scenario-section quick-scenarios">
          <h3>Quick Scenarios</h3>
          <div className="category-filters">
            <button 
              className={`category-filter ${selectedCategory === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('all')}
            >
              All
            </button>
            <button 
              className={`category-filter ${selectedCategory === 'emergency' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('emergency')}
            >
              🚨 Emergency
            </button>
            <button 
              className={`category-filter ${selectedCategory === 'investment' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('investment')}
            >
              📈 Investment
            </button>
            <button 
              className={`category-filter ${selectedCategory === 'expense' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('expense')}
            >
              💸 Expense
            </button>
          </div>
          <div className="quick-scenario-grid">
            {filteredPresetScenarios.map((scenario) => (
              <button
                key={scenario.id}
                className={`quick-scenario-card ${selectedScenarioId === scenario.id ? 'selected' : ''}`}
                onClick={() => {
                  setSelectedScenarioId(scenario.id);
                }}
              >
                <span className="scenario-icon">
                  {scenario.category === 'emergency' ? '🚨' : 
                   scenario.category === 'investment' ? '📈' : 
                   scenario.category === 'expense' ? '💸' : '📊'}
                </span>
                <span className="scenario-name">{scenario.name}</span>
                {scenario.description && (
                  <span className="scenario-desc">{scenario.description}</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Recent Scenarios */}
        {savedResults.length > 0 && (
          <div className="scenario-section recent-scenarios">
            <h3>Recent Scenarios</h3>
            <div className="recent-list">
              {savedResults.slice(-3).reverse().map((result, index) => (
                <button
                  key={index}
                  className="recent-scenario-item"
                  onClick={() => {
                    setActiveScenario(result);
                    setHasRunScenario(true);
                  }}
                >
                  <span className="recent-title">{result.title}</span>
                  <span className="recent-impact">
                    {result.totalCost > 0 ? '-' : '+'}{formatCurrency(Math.abs(result.totalCost))}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
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
