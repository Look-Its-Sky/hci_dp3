import { FC, useState, useMemo, useEffect } from 'react';
import type { Recommendation, NewScenarioData, UserFinancialProfile, SavedScenarioResult } from '../types';
import { generateRecommendations } from '../data';
import { formatCurrency } from '../utils';

interface ScenarioResultsProps {
  totalBalance: number;
  monthlySavings: number;
  userProfile: UserFinancialProfile;
  activeScenario: NewScenarioData;
  onRunNew: () => void;
  onAdjustScenario: (adjusted: NewScenarioData) => void;
  onSaveResult?: (result: SavedScenarioResult) => void;
  savedResults?: SavedScenarioResult[];
}

const ScenarioResults: FC<ScenarioResultsProps> = ({ 
  totalBalance, 
  monthlySavings,
  userProfile,
  activeScenario, 
  onRunNew,
  onAdjustScenario,
  onSaveResult,
  savedResults = []
}) => {
  const [showAdjustPanel, setShowAdjustPanel] = useState(false);
  const [adjustedCost, setAdjustedCost] = useState(activeScenario.totalCost.toString());
  const [appliedRecommendationsHistory, setAppliedRecommendationsHistory] = useState<Recommendation[]>([]);
  const [runCount, setRunCount] = useState(1);

  const projectedBalance = totalBalance - activeScenario.totalCost;

  const [recommendations, setRecommendations] = useState<Recommendation[]>(() => 
    generateRecommendations(userProfile, activeScenario.title, activeScenario.totalCost, projectedBalance)
  );

  useEffect(() => {
    const newRecs = generateRecommendations(userProfile, activeScenario.title, activeScenario.totalCost, projectedBalance);
    setRecommendations(newRecs);
  }, [activeScenario, userProfile, projectedBalance]);

  const handleToggleRecommendation = (id: string) => {
    setRecommendations(recs => 
      recs.map(rec => 
        rec.id === id ? { ...rec, checked: !rec.checked } : rec
      )
    );
  };

  const analysis = useMemo(() => {
    const scenarioCost = activeScenario.totalCost;
    const currentProjectedBalance = totalBalance - scenarioCost;
    
    const monthlyImpact = activeScenario.impactPeriod === 'recurring' 
      ? activeScenario.costEachPeriod 
      : 0;
    const projectedMonthlySavings = monthlySavings - monthlyImpact;
    
    const currentSavingsRate = (monthlySavings / userProfile.monthlyIncome) * 100;
    const projectedSavingsRate = (projectedMonthlySavings / userProfile.monthlyIncome) * 100;
    
    const yearlyReturn = userProfile.riskTolerance === 'aggressive' ? 0.10 : 
                         userProfile.riskTolerance === 'moderate' ? 0.07 : 0.04;
    
    const currentProjection1Year = totalBalance * (1 + yearlyReturn) + (monthlySavings * 12);
    const currentProjection5Year = totalBalance * Math.pow(1 + yearlyReturn, 5) + 
                                    (monthlySavings * 12 * 5 * (1 + yearlyReturn * 2.5));
    
    const afterProjection1Year = currentProjectedBalance * (1 + yearlyReturn) + (projectedMonthlySavings * 12);
    const afterProjection5Year = currentProjectedBalance * Math.pow(1 + yearlyReturn, 5) + 
                                  (projectedMonthlySavings * 12 * 5 * (1 + yearlyReturn * 2.5));

    const balanceChange = ((currentProjectedBalance - totalBalance) / totalBalance) * 100;
    const savingsRateChange = projectedSavingsRate - currentSavingsRate;
    const projection1YearChange = ((afterProjection1Year - currentProjection1Year) / currentProjection1Year) * 100;
    const projection5YearChange = ((afterProjection5Year - currentProjection5Year) / currentProjection5Year) * 100;

    const selectedRecommendations = recommendations.filter(r => r.checked);
    const recommendationsImpact = selectedRecommendations.reduce((sum, r) => sum + (r.impact || 0), 0);
    const balanceWithRecommendations = currentProjectedBalance + recommendationsImpact;

    const appliedImpact = appliedRecommendationsHistory.reduce((sum, r) => sum + (r.impact || 0), 0);

    return {
      before: {
        balance: totalBalance,
        monthlySavings,
        savingsRate: currentSavingsRate,
        projection1Year: currentProjection1Year,
        projection5Year: currentProjection5Year
      },
      after: {
        balance: currentProjectedBalance,
        monthlySavings: projectedMonthlySavings,
        savingsRate: projectedSavingsRate,
        projection1Year: afterProjection1Year,
        projection5Year: afterProjection5Year
      },
      changes: {
        balance: balanceChange,
        savingsRate: savingsRateChange,
        projection1Year: projection1YearChange,
        projection5Year: projection5YearChange
      },
      impact: scenarioCost,
      recommendationsImpact,
      balanceWithRecommendations,
      appliedImpact,
      selectedRecommendations
    };
  }, [totalBalance, monthlySavings, activeScenario, userProfile, recommendations, appliedRecommendationsHistory]);

  const handleApplyAdjustment = () => {
    const newCost = parseFloat(adjustedCost) || 0;
    onAdjustScenario({
      ...activeScenario,
      totalCost: newCost
    });
    setShowAdjustPanel(false);
  };

  const handleApplyRecommendations = () => {
    const selectedRecs = recommendations.filter(r => r.checked);
    if (selectedRecs.length === 0) return;

    setAppliedRecommendationsHistory(prev => [...prev, ...selectedRecs]);

    const totalImpact = selectedRecs.reduce((sum, r) => sum + (r.impact || 0), 0);
    
    const savedResult: SavedScenarioResult = {
      id: `result-${Date.now()}`,
      scenarioTitle: activeScenario.title,
      runDate: new Date().toISOString(),
      totalCost: activeScenario.totalCost,
      impactPeriod: activeScenario.impactPeriod,
      beforeState: {
        totalEquity: analysis.before.balance,
        monthlyExpenses: userProfile.monthlyIncome - analysis.before.monthlySavings,
        savingsRate: analysis.before.savingsRate
      },
      afterState: {
        totalEquity: analysis.balanceWithRecommendations,
        monthlyExpenses: userProfile.monthlyIncome - analysis.after.monthlySavings,
        savingsRate: analysis.after.savingsRate,
        projectedEquity1Year: analysis.after.projection1Year + totalImpact,
        projectedEquity5Year: analysis.after.projection5Year + (totalImpact * 5)
      },
      recommendations: recommendations,
      appliedRecommendations: selectedRecs,
      outcomeStatus: analysis.balanceWithRecommendations >= analysis.before.balance ? 'positive' : 
                     analysis.balanceWithRecommendations >= analysis.before.balance * 0.9 ? 'neutral' : 'negative'
    };

    if (onSaveResult) {
      onSaveResult(savedResult);
    }

    const newProjectedBalance = analysis.balanceWithRecommendations;
    const newRecs = generateRecommendations(
      userProfile, 
      activeScenario.title, 
      activeScenario.totalCost - totalImpact,
      newProjectedBalance
    );
    
    setRecommendations(newRecs);
    setRunCount(prev => prev + 1);
  };

  const selectedCount = recommendations.filter(r => r.checked).length;

  return (
    <>
      {/* Results Header */}
      <div className="results-header">
        <div className="results-title-section">
          <h2>{activeScenario.title}</h2>
          <span className="results-subtitle">Scenario Analysis</span>
        </div>
        <button className="back-button" onClick={onRunNew}>
          ← Run Another
        </button>
      </div>

      {/* Before/After Comparison */}
      <div className="comparison-card">
        <div className="comparison-header">
          <h3>Impact Analysis</h3>
          <button 
            className="adjust-toggle"
            onClick={() => setShowAdjustPanel(!showAdjustPanel)}
          >
            {showAdjustPanel ? 'Close' : '⚙️ Adjust Parameters'}
          </button>
        </div>

        {showAdjustPanel && (
          <div className="adjust-panel">
            <div className="adjust-field">
              <label>Total Cost/Gain ($)</label>
              <input 
                type="number"
                value={adjustedCost}
                onChange={(e) => setAdjustedCost(e.target.value)}
              />
            </div>
            <button className="apply-adjustment-btn" onClick={handleApplyAdjustment}>
              Re-run with Adjustments
            </button>
          </div>
        )}

        <div className="comparison-grid">
          {/* Before Column */}
          <div className="comparison-column before">
            <div className="column-header">
              <span className="column-label">Before</span>
            </div>
            <div className="comparison-metric">
              <span className="metric-label">Net Worth</span>
              <span className="metric-value">{formatCurrency(analysis.before.balance)}</span>
            </div>
            <div className="comparison-metric">
              <span className="metric-label">Monthly Savings</span>
              <span className="metric-value">{formatCurrency(analysis.before.monthlySavings)}</span>
            </div>
            <div className="comparison-metric">
              <span className="metric-label">Savings Rate</span>
              <span className="metric-value">{analysis.before.savingsRate.toFixed(1)}%</span>
            </div>
            <div className="comparison-metric projection">
              <span className="metric-label">1 Year Projection</span>
              <span className="metric-value">{formatCurrency(analysis.before.projection1Year)}</span>
            </div>
            <div className="comparison-metric projection">
              <span className="metric-label">5 Year Projection</span>
              <span className="metric-value">{formatCurrency(analysis.before.projection5Year)}</span>
            </div>
          </div>

          {/* Change Indicator */}
          <div className="comparison-column change">
            <div className="column-header">
              <span className="column-label">Change</span>
            </div>
            <div className="comparison-metric">
              <span className={`change-indicator ${analysis.changes.balance >= 0 ? 'positive' : 'negative'}`}>
                {analysis.changes.balance >= 0 ? '↑' : '↓'} {Math.abs(analysis.changes.balance).toFixed(1)}%
              </span>
            </div>
            <div className="comparison-metric">
              <span className={`change-indicator ${analysis.after.monthlySavings >= analysis.before.monthlySavings ? 'positive' : 'negative'}`}>
                {analysis.after.monthlySavings >= analysis.before.monthlySavings ? '→' : '↓'}
              </span>
            </div>
            <div className="comparison-metric">
              <span className={`change-indicator ${analysis.changes.savingsRate >= 0 ? 'positive' : 'negative'}`}>
                {analysis.changes.savingsRate >= 0 ? '↑' : '↓'} {Math.abs(analysis.changes.savingsRate).toFixed(1)}pp
              </span>
            </div>
            <div className="comparison-metric projection">
              <span className={`change-indicator ${analysis.changes.projection1Year >= 0 ? 'positive' : 'negative'}`}>
                {analysis.changes.projection1Year >= 0 ? '↑' : '↓'} {Math.abs(analysis.changes.projection1Year).toFixed(1)}%
              </span>
            </div>
            <div className="comparison-metric projection">
              <span className={`change-indicator ${analysis.changes.projection5Year >= 0 ? 'positive' : 'negative'}`}>
                {analysis.changes.projection5Year >= 0 ? '↑' : '↓'} {Math.abs(analysis.changes.projection5Year).toFixed(1)}%
              </span>
            </div>
          </div>

          {/* After Column */}
          <div className="comparison-column after">
            <div className="column-header">
              <span className="column-label">After</span>
            </div>
            <div className="comparison-metric">
              <span className="metric-label">Net Worth</span>
              <span className={`metric-value ${analysis.after.balance >= analysis.before.balance ? 'positive' : 'negative'}`}>
                {formatCurrency(analysis.after.balance)}
              </span>
            </div>
            <div className="comparison-metric">
              <span className="metric-label">Monthly Savings</span>
              <span className={`metric-value ${analysis.after.monthlySavings >= analysis.before.monthlySavings ? '' : 'negative'}`}>
                {formatCurrency(analysis.after.monthlySavings)}
              </span>
            </div>
            <div className="comparison-metric">
              <span className="metric-label">Savings Rate</span>
              <span className={`metric-value ${analysis.after.savingsRate >= analysis.before.savingsRate ? '' : 'negative'}`}>
                {analysis.after.savingsRate.toFixed(1)}%
              </span>
            </div>
            <div className="comparison-metric projection">
              <span className="metric-label">1 Year Projection</span>
              <span className="metric-value">{formatCurrency(analysis.after.projection1Year)}</span>
            </div>
            <div className="comparison-metric projection">
              <span className="metric-label">5 Year Projection</span>
              <span className="metric-value">{formatCurrency(analysis.after.projection5Year)}</span>
            </div>
          </div>
        </div>

        {/* Visual Impact Bar */}
        <div className="impact-visualization">
          <div className="impact-bar-label">
            <span>Net Impact: </span>
            <span className={analysis.impact > 0 ? 'negative' : 'positive'}>
              {analysis.impact > 0 ? '-' : '+'}{formatCurrency(Math.abs(analysis.impact))}
            </span>
          </div>
          <div className="impact-bar-track">
            <div 
              className={`impact-bar-fill ${analysis.impact > 0 ? 'negative' : 'positive'}`}
              style={{ 
                width: `${Math.min(Math.abs(analysis.impact) / totalBalance * 100, 100)}%` 
              }}
            ></div>
          </div>
        </div>
      </div>

      {/* Personalized Recommendations Card */}
      <div className="recommendation-card enhanced">
        <div className="recommendation-header">
          <div>
            <h3>Personalized Recommendations</h3>
            <span className="recommendation-subtitle">
              Based on your {userProfile.riskTolerance} risk profile {runCount > 1 && `(Run #${runCount})`}
            </span>
          </div>
          {selectedCount > 0 && (
            <div className="selected-impact">
              <span className="selected-count">{selectedCount} selected</span>
              <span className="selected-value positive">
                +{formatCurrency(analysis.recommendationsImpact)}
              </span>
            </div>
          )}
        </div>

        {appliedRecommendationsHistory.length > 0 && (
          <div className="applied-recommendations-summary">
            <span className="applied-label">✓ Previously applied: </span>
            <span className="applied-count">{appliedRecommendationsHistory.length} recommendations</span>
            <span className="applied-impact positive">+{formatCurrency(analysis.appliedImpact)} impact</span>
          </div>
        )}
        
        <div className="recommendation-list-container">
          <ul className="recommendation-list">
            {recommendations.map((rec) => (
              <li key={rec.id} className={`recommendation-item ${rec.checked ? 'checked' : ''}`}>
                <input 
                  type="checkbox"
                  id={`rec-${rec.id}`}
                  checked={rec.checked}
                  onChange={() => handleToggleRecommendation(rec.id)}
                />
                <label htmlFor={`rec-${rec.id}`}>
                  <span className="rec-text">{rec.text}</span>
                  <div className="rec-meta">
                    {rec.impact && (
                      <span className="rec-impact positive">+{formatCurrency(rec.impact)}</span>
                    )}
                    {rec.priority && (
                      <span className={`rec-priority ${rec.priority}`}>{rec.priority}</span>
                    )}
                  </div>
                </label>
              </li>
            ))}
          </ul>
        </div>

        {selectedCount > 0 && (
          <div className="with-recommendations">
            <div className="with-rec-label">With selected recommendations:</div>
            <div className="with-rec-value">
              {formatCurrency(analysis.balanceWithRecommendations)}
              <span className="with-rec-change positive">
                (+{formatCurrency(analysis.recommendationsImpact)} from recommendations)
              </span>
            </div>
          </div>
        )}
        
        <div className="recommendation-actions">
          <button 
            className="scenario-button primary" 
            disabled={selectedCount === 0}
            onClick={handleApplyRecommendations}
          >
            Apply {selectedCount} Recommendation{selectedCount !== 1 ? 's' : ''} & Re-analyze
          </button>
          <button 
            className="scenario-button secondary"
            onClick={onRunNew}
          >
            Run New Scenario
          </button>
        </div>
      </div>

      {/* Saved Scenario History */}
      {savedResults.length > 0 && (
        <div className="scenario-history-card">
          <h3>Scenario History</h3>
          <div className="history-list">
            {savedResults.slice().reverse().map((result) => (
              <div key={result.id} className={`history-item ${result.outcomeStatus}`}>
                <div className="history-header">
                  <span className="history-title">{result.scenarioTitle}</span>
                  <span className={`history-status ${result.outcomeStatus}`}>
                    {result.outcomeStatus === 'positive' ? '✓ Positive' : 
                     result.outcomeStatus === 'neutral' ? '○ Neutral' : '✗ Negative'}
                  </span>
                </div>
                <div className="history-details">
                  <span className="history-date">
                    {new Date(result.runDate).toLocaleDateString()}
                  </span>
                  <span className="history-applied">
                    {result.appliedRecommendations.length} recommendations applied
                  </span>
                  <span className={`history-impact ${result.afterState.totalEquity >= result.beforeState.totalEquity ? 'positive' : 'negative'}`}>
                    {result.afterState.totalEquity >= result.beforeState.totalEquity ? '+' : ''}
                    {formatCurrency(result.afterState.totalEquity - result.beforeState.totalEquity)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default ScenarioResults;
