import { FC, useState, useMemo, useEffect, useCallback } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import type { Recommendation, NewScenarioData, UserFinancialProfile, SavedScenarioResult } from '../types';
import { generateAIRecommendations, calculateProjections, AIRecommendationRequest } from '../services/aiAdvisor';
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
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoadingRecs, setIsLoadingRecs] = useState(true);
  const [show1YearGraph, setShow1YearGraph] = useState(false);
  const [show5YearGraph, setShow5YearGraph] = useState(false);

  const selectedRecommendationsImpact = useMemo(() => {
    return recommendations.filter(r => r.checked).reduce((sum, r) => sum + (r.impact || 0), 0);
  }, [recommendations]);

  const analysis = useMemo(() => {
    const scenarioCost = activeScenario.totalCost;
    const appliedImpact = appliedRecommendationsHistory.reduce((sum, r) => sum + (r.impact || 0), 0);
    const currentProjectedBalance = totalBalance - scenarioCost + appliedImpact;
    
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

    const balanceWithSelectedRecs = currentProjectedBalance + selectedRecommendationsImpact;
    const projection1YearWithRecs = balanceWithSelectedRecs * (1 + yearlyReturn) + (projectedMonthlySavings * 12);
    const projection5YearWithRecs = balanceWithSelectedRecs * Math.pow(1 + yearlyReturn, 5) + 
                                     (projectedMonthlySavings * 12 * 5 * (1 + yearlyReturn * 2.5));

    const balanceChange = ((currentProjectedBalance - totalBalance) / totalBalance) * 100;
    const savingsRateChange = projectedSavingsRate - currentSavingsRate;
    const projection1YearChange = ((afterProjection1Year - currentProjection1Year) / currentProjection1Year) * 100;
    const projection5YearChange = ((afterProjection5Year - currentProjection5Year) / currentProjection5Year) * 100;

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
      withRecommendations: {
        balance: balanceWithSelectedRecs,
        projection1Year: projection1YearWithRecs,
        projection5Year: projection5YearWithRecs
      },
      changes: {
        balance: balanceChange,
        savingsRate: savingsRateChange,
        projection1Year: projection1YearChange,
        projection5Year: projection5YearChange
      },
      impact: scenarioCost,
      appliedImpact,
      selectedRecommendationsImpact,
      yearlyReturn
    };
  }, [totalBalance, monthlySavings, activeScenario, userProfile, appliedRecommendationsHistory, selectedRecommendationsImpact]);

  const projection1YearData = useMemo(() => {
    const beforeData = calculateProjections(analysis.before.balance, analysis.before.monthlySavings, analysis.yearlyReturn, 1);
    const afterData = calculateProjections(analysis.after.balance, analysis.after.monthlySavings, analysis.yearlyReturn, 1);
    const withRecsData = selectedRecommendationsImpact > 0 
      ? calculateProjections(analysis.withRecommendations.balance, analysis.after.monthlySavings, analysis.yearlyReturn, 1)
      : null;

    return beforeData.map((item, index) => ({
      month: item.month,
      label: item.label,
      before: item.value,
      after: afterData[index]?.value || 0,
      ...(withRecsData ? { withRecs: withRecsData[index]?.value || 0 } : {})
    }));
  }, [analysis, selectedRecommendationsImpact]);

  const projection5YearData = useMemo(() => {
    const beforeData = calculateProjections(analysis.before.balance, analysis.before.monthlySavings, analysis.yearlyReturn, 5);
    const afterData = calculateProjections(analysis.after.balance, analysis.after.monthlySavings, analysis.yearlyReturn, 5);
    const withRecsData = selectedRecommendationsImpact > 0 
      ? calculateProjections(analysis.withRecommendations.balance, analysis.after.monthlySavings, analysis.yearlyReturn, 5)
      : null;

    return beforeData.filter((_, i) => i % 3 === 0).map((item, index) => ({
      month: item.month,
      label: index === 0 ? 'Now' : `Year ${Math.floor(item.month / 12)}`,
      before: item.value,
      after: afterData[index * 3]?.value || 0,
      ...(withRecsData ? { withRecs: withRecsData[index * 3]?.value || 0 } : {})
    }));
  }, [analysis, selectedRecommendationsImpact]);

  const loadRecommendations = useCallback(async () => {
    setIsLoadingRecs(true);
    try {
      const request: AIRecommendationRequest = {
        user: userProfile,
        scenarioTitle: activeScenario.title,
        scenarioCost: activeScenario.totalCost,
        projectedBalance: analysis.after.balance,
        currentNetWorth: totalBalance,
        monthlySavings: analysis.after.monthlySavings,
        savingsRate: analysis.after.savingsRate,
        appliedRecommendations: appliedRecommendationsHistory.map(r => r.text)
      };
      
      const aiRecs = await generateAIRecommendations(request);
      setRecommendations(aiRecs);
    } catch (error) {
      console.error('Failed to load AI recommendations:', error);
    } finally {
      setIsLoadingRecs(false);
    }
  }, [userProfile, activeScenario, analysis.after.balance, analysis.after.monthlySavings, analysis.after.savingsRate, totalBalance, appliedRecommendationsHistory]);

  useEffect(() => {
    loadRecommendations();
  }, [loadRecommendations]);

  const handleToggleRecommendation = (id: string) => {
    setRecommendations(recs => 
      recs.map(rec => 
        rec.id === id ? { ...rec, checked: !rec.checked } : rec
      )
    );
  };

  const handleApplyAdjustment = () => {
    const newCost = parseFloat(adjustedCost) || 0;
    onAdjustScenario({
      ...activeScenario,
      totalCost: newCost
    });
    setShowAdjustPanel(false);
  };

  const handleApplyRecommendations = async () => {
    const selectedRecs = recommendations.filter(r => r.checked);
    if (selectedRecs.length === 0) return;

    setAppliedRecommendationsHistory(prev => [...prev, ...selectedRecs]);

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
        totalEquity: analysis.withRecommendations.balance,
        monthlyExpenses: userProfile.monthlyIncome - analysis.after.monthlySavings,
        savingsRate: analysis.after.savingsRate,
        projectedEquity1Year: analysis.withRecommendations.projection1Year,
        projectedEquity5Year: analysis.withRecommendations.projection5Year
      },
      recommendations: recommendations,
      appliedRecommendations: selectedRecs,
      outcomeStatus: analysis.withRecommendations.balance >= analysis.before.balance ? 'positive' : 
                     analysis.withRecommendations.balance >= analysis.before.balance * 0.9 ? 'neutral' : 'negative'
    };

    if (onSaveResult) {
      onSaveResult(savedResult);
    }

    setRunCount(prev => prev + 1);
    await loadRecommendations();
  };

  const selectedCount = recommendations.filter(r => r.checked).length;

  const formatTooltipValue = (value: number) => formatCurrency(value);

  return (
    <>
      <div className="results-header">
        <div className="results-title-section">
          <h2>{activeScenario.title}</h2>
          <span className="results-subtitle">Scenario Analysis {runCount > 1 && `• Run #${runCount}`}</span>
        </div>
        <button className="back-button" onClick={onRunNew}>
          ← Run Another
        </button>
      </div>

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
            <div className="comparison-metric projection clickable" onClick={() => setShow1YearGraph(true)}>
              <span className="metric-label">1 Year Projection 📈</span>
              <span className="metric-value">{formatCurrency(analysis.before.projection1Year)}</span>
            </div>
            <div className="comparison-metric projection clickable" onClick={() => setShow5YearGraph(true)}>
              <span className="metric-label">5 Year Projection 📈</span>
              <span className="metric-value">{formatCurrency(analysis.before.projection5Year)}</span>
            </div>
          </div>

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
            <div className="comparison-metric projection clickable" onClick={() => setShow1YearGraph(true)}>
              <span className="metric-label">1 Year Projection 📈</span>
              <span className="metric-value">{formatCurrency(analysis.after.projection1Year)}</span>
            </div>
            <div className="comparison-metric projection clickable" onClick={() => setShow5YearGraph(true)}>
              <span className="metric-label">5 Year Projection 📈</span>
              <span className="metric-value">{formatCurrency(analysis.after.projection5Year)}</span>
            </div>
          </div>
        </div>

        {appliedRecommendationsHistory.length > 0 && (
          <div className="applied-impact-summary">
            <span className="applied-label">✓ Applied Recommendations Impact:</span>
            <span className="applied-value positive">+{formatCurrency(analysis.appliedImpact)}</span>
          </div>
        )}

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

      <div className="recommendation-card enhanced">
        <div className="recommendation-header">
          <div>
            <h3>AI-Powered Recommendations</h3>
            <span className="recommendation-subtitle">
              Personalized for your {userProfile.riskTolerance} risk profile {runCount > 1 && `• Updated for Run #${runCount}`}
            </span>
          </div>
          {selectedCount > 0 && (
            <div className="selected-impact">
              <span className="selected-count">{selectedCount} selected</span>
              <span className="selected-value positive">
                +{formatCurrency(selectedRecommendationsImpact)}
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
          {isLoadingRecs ? (
            <div className="loading-recommendations">
              <div className="loading-spinner"></div>
              <span>AI is analyzing your financial situation...</span>
            </div>
          ) : (
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
          )}
        </div>

        {selectedCount > 0 && (
          <div className="with-recommendations">
            <div className="with-rec-label">With selected recommendations:</div>
            <div className="with-rec-value">
              {formatCurrency(analysis.withRecommendations.balance)}
              <span className="with-rec-change positive">
                (+{formatCurrency(selectedRecommendationsImpact)} from recommendations)
              </span>
            </div>
            <div className="with-rec-projections">
              <span>1Y: {formatCurrency(analysis.withRecommendations.projection1Year)}</span>
              <span>5Y: {formatCurrency(analysis.withRecommendations.projection5Year)}</span>
            </div>
          </div>
        )}
        
        <div className="recommendation-actions">
          <button 
            className="scenario-button primary" 
            disabled={selectedCount === 0 || isLoadingRecs}
            onClick={handleApplyRecommendations}
          >
            {isLoadingRecs ? 'Loading...' : `Apply ${selectedCount} Recommendation${selectedCount !== 1 ? 's' : ''} & Re-analyze`}
          </button>
          <button 
            className="scenario-button secondary"
            onClick={onRunNew}
          >
            Run New Scenario
          </button>
        </div>
      </div>

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

      {show1YearGraph && (
        <div className="graph-modal-overlay" onClick={() => setShow1YearGraph(false)}>
          <div className="graph-modal" onClick={(e) => e.stopPropagation()}>
            <div className="graph-modal-header">
              <h3>1 Year Projection</h3>
              <button className="graph-close-btn" onClick={() => setShow1YearGraph(false)}>✕</button>
            </div>
            <div className="graph-container">
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={projection1YearData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <defs>
                    <linearGradient id="colorBefore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorAfter" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#374151" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#374151" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorWithRecs" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="label" tick={{ fontSize: 12 }} interval="preserveStartEnd" />
                  <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} tick={{ fontSize: 12 }} />
                  <Tooltip formatter={formatTooltipValue} />
                  <Legend />
                  <Area type="monotone" dataKey="before" name="Before Scenario" stroke="#6366f1" fill="url(#colorBefore)" strokeWidth={2} />
                  <Area type="monotone" dataKey="after" name="After Scenario" stroke="#374151" fill="url(#colorAfter)" strokeWidth={2} />
                  {selectedRecommendationsImpact > 0 && (
                    <Area type="monotone" dataKey="withRecs" name="With Recommendations" stroke="#10b981" fill="url(#colorWithRecs)" strokeWidth={2} />
                  )}
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="graph-summary">
              <div className="summary-item">
                <span className="summary-label">Before:</span>
                <span className="summary-value">{formatCurrency(analysis.before.projection1Year)}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">After Scenario:</span>
                <span className="summary-value">{formatCurrency(analysis.after.projection1Year)}</span>
              </div>
              {selectedRecommendationsImpact > 0 && (
                <div className="summary-item positive">
                  <span className="summary-label">With Recommendations:</span>
                  <span className="summary-value">{formatCurrency(analysis.withRecommendations.projection1Year)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {show5YearGraph && (
        <div className="graph-modal-overlay" onClick={() => setShow5YearGraph(false)}>
          <div className="graph-modal" onClick={(e) => e.stopPropagation()}>
            <div className="graph-modal-header">
              <h3>5 Year Projection</h3>
              <button className="graph-close-btn" onClick={() => setShow5YearGraph(false)}>✕</button>
            </div>
            <div className="graph-container">
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={projection5YearData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <defs>
                    <linearGradient id="colorBefore5" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorAfter5" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#374151" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#374151" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorWithRecs5" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                  <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} tick={{ fontSize: 12 }} />
                  <Tooltip formatter={formatTooltipValue} />
                  <Legend />
                  <Area type="monotone" dataKey="before" name="Before Scenario" stroke="#6366f1" fill="url(#colorBefore5)" strokeWidth={2} />
                  <Area type="monotone" dataKey="after" name="After Scenario" stroke="#374151" fill="url(#colorAfter5)" strokeWidth={2} />
                  {selectedRecommendationsImpact > 0 && (
                    <Area type="monotone" dataKey="withRecs" name="With Recommendations" stroke="#10b981" fill="url(#colorWithRecs5)" strokeWidth={2} />
                  )}
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="graph-summary">
              <div className="summary-item">
                <span className="summary-label">Before:</span>
                <span className="summary-value">{formatCurrency(analysis.before.projection5Year)}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">After Scenario:</span>
                <span className="summary-value">{formatCurrency(analysis.after.projection5Year)}</span>
              </div>
              {selectedRecommendationsImpact > 0 && (
                <div className="summary-item positive">
                  <span className="summary-label">With Recommendations:</span>
                  <span className="summary-value">{formatCurrency(analysis.withRecommendations.projection5Year)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ScenarioResults;
