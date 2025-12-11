import { FC, useState, useMemo } from 'react';
import type { NewScenarioData, Scenario, Recommendation } from '../types';
import type { NewScenarioData, SavedScenarioResult } from '../types';
import { formatCurrency } from '../utils';
import { MOCK_SAVED_SCENARIOS, MOCK_PRESET_SCENARIOS, USER_PROFILES, calculateNetWorthForUser, calculateMonthlySavingsForUser } from '../data';
import CreateScenarioModal from '../components/CreateScenarioModal';
import ScenarioResults from '../components/ScenarioResults';
import { analyzeScenario } from '../services/scenarioService';
import { useAuth } from '../contexts/AuthContext';

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

const ScenariosPage: FC = () => {
  const { currentUser } = useAuth();
  const userProfile = currentUser || USER_PROFILES['user-001'];
  
  const totalBalance = calculateNetWorthForUser(userProfile);
  const monthlySavings = calculateMonthlySavingsForUser(userProfile);
  
  const [selectedScenarioId, setSelectedScenarioId] = useState('');
  const [hasRunScenario, setHasRunScenario] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeScenario, setActiveScenario] = useState<NewScenarioData | null>(null);
  const [savedResults, setSavedResults] = useState<SavedScenarioResult[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  const [isLoading, setIsLoading] = useState(false);
  const [aiRecommendations, setAiRecommendations] = useState<Recommendation[] | undefined>(undefined);

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
  const handleCreateScenario = async (data: NewScenarioData) => {
    console.log("Running new scenario with data:", data);
    
    setIsLoading(true);
    try {
      // Even for custom scenarios, we can ask AI for recommendations
      const { recommendations } = await analyzeScenario(
        data.title,
        "User created custom scenario with specific costs.",
        MOCK_USER_PROFILE
      );
      setAiRecommendations(recommendations);
    } catch (error) {
      console.error("AI Analysis failed", error);
      setAiRecommendations(undefined); // Fallback to default
    } finally {
      setIsLoading(false);
    }
  

    setActiveScenario(data);
    setShowCreateModal(false);
    setHasRunScenario(true);
  };

  const handleRunSelectedScenario = async () => {
    let scenarioData: NewScenarioData | null = null;
    const basicInfo = [...MOCK_SAVED_SCENARIOS, ...MOCK_PRESET_SCENARIOS].find(s => s.id === selectedScenarioId);

    // Try AI first if key exists
    setIsLoading(true);
    if (basicInfo) { // Add this check
      try {
        const result = await analyzeScenario(
          basicInfo.name,
          basicInfo.description || "",
          MOCK_USER_PROFILE
        );
        scenarioData = result.scenarioData;
        setAiRecommendations(result.recommendations);
      } catch (error) {
        console.error("AI Analysis failed, falling back to mock", error);
      } finally {
        setIsLoading(false);
      }
    } else { // Handle case where basicInfo is undefined if no matching scenario is found
        setIsLoading(false); // Make sure loading state is cleared
    }
    

    // Fallback if AI failed or no key, or if we haven't set scenarioData yet
    if (!scenarioData && selectedScenarioId && MOCK_SCENARIO_DETAILS[selectedScenarioId]) {
      scenarioData = MOCK_SCENARIO_DETAILS[selectedScenarioId];
      setAiRecommendations(undefined); // Clear any stale recommendations
    }

    if (scenarioData) {
      setActiveScenario(scenarioData);
      setHasRunScenario(true);
    }
  };

  const handleAdjustAndRerun = (adjustedScenario: NewScenarioData) => {
    setActiveScenario(adjustedScenario);
  };

  if (isLoading) {
    return (
      <div className="scenario-loading">
        <div className="loading-spinner"></div>
        <h3>Analyzing Financial Impact...</h3>
        <p>Our AI advisor is crunching the numbers for you.</p>
      </div>
    );
  }

  // Show the Results page
  if (hasRunScenario && activeScenario) {
    return (
      <>
        <ScenarioResults 
          totalBalance={totalBalance}
          monthlySavings={monthlySavings}
          userProfile={userProfile}
          activeScenario={activeScenario}
          initialRecommendations={aiRecommendations}
          onRunNew={() => {
            setHasRunScenario(false);
            setActiveScenario(null);
            setSelectedScenarioId('');
            setAiRecommendations(undefined);
          }}
          onAdjustScenario={handleAdjustAndRerun}
          onSaveResult={handleSaveScenarioResult}
          savedResults={savedResults}
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
            <span className="metric-value capitalize">{userProfile.riskTolerance}</span>
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
            <h3>Scenario History</h3>
            <div className="recent-list">
              {savedResults.slice(-3).reverse().map((result) => (
                <div
                  key={result.id}
                  className={`recent-scenario-item ${result.outcomeStatus}`}
                >
                  <span className="recent-title">{result.scenarioTitle}</span>
                  <span className={`recent-status ${result.outcomeStatus}`}>
                    {result.outcomeStatus === 'positive' ? '✓' : result.outcomeStatus === 'neutral' ? '○' : '✗'}
                  </span>
                  <span className="recent-impact">
                    {result.afterState.totalEquity >= result.beforeState.totalEquity ? '+' : ''}
                    {formatCurrency(result.afterState.totalEquity - result.beforeState.totalEquity)}
                  </span>
                </div>
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
