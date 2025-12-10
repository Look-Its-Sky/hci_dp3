import { FC, useState } from 'react';
import type { Recommendation, NewScenarioData } from '../types';
import { MOCK_RECOMMENDATIONS } from '../data';
import { formatCurrency } from '../utils';

/**
 * Component for the "Scenario Results" screen.
 * This is shown after a scenario is run.
 */
interface ScenarioResultsProps {
  totalBalance: number; // The total balance from the previous page
  activeScenario: NewScenarioData;
  onRunNew: () => void; // Function to go back to the setup screen
}

const ScenarioResults: FC<ScenarioResultsProps> = ({ totalBalance, activeScenario, onRunNew }) => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>(MOCK_RECOMMENDATIONS);

  const handleToggleRecommendation = (id: string) => {
    setRecommendations(recs => 
      recs.map(rec => 
        rec.id === id ? { ...rec, checked: !rec.checked } : rec
      )
    );
  };

  // Calculate results based on activeScenario
  const scenarioCost = activeScenario.totalCost;
  const projectedBalance = totalBalance - scenarioCost;
  
  // Determine max value for bar scaling (avoid divide by zero)
  const maxVal = Math.max(totalBalance, projectedBalance, Math.abs(scenarioCost)) || 1;

  const results = [
    {
      id: 'current',
      name: 'Current Equity',
      amount: totalBalance,
      value: (totalBalance / maxVal) * 100,
      colorIndex: 1
    },
    {
      id: 'cost',
      name: 'Scenario Impact', // Could be cost or gain
      amount: scenarioCost, 
      value: (Math.abs(scenarioCost) / maxVal) * 100,
      colorIndex: 2
    },
    {
      id: 'projected',
      name: 'Projected Equity',
      amount: projectedBalance,
      value: (projectedBalance / maxVal) * 100,
      colorIndex: 3
    }
  ];

  return (
    <>
      {/* Scenario Results Chart (re-using impact-card styles) */}
      <div className="impact-card">
        <h3>Scenario Results: {activeScenario.title}</h3>
        <div className="impact-list-container" style={{ maxHeight: '150px' }}>
          <ul className="impact-list">
            {results.map((item) => (
              <li key={item.id} className="impact-item">
                <span className="impact-item-bullet">•</span>
                <div className="impact-item-bar-container">
                  <div className="impact-item-label">
                    {item.name}: {formatCurrency(item.amount)}
                  </div>
                  
                  <div className="impact-bar-bg">
                    <div
                      className={`impact-bar-inner color-${item.colorIndex}`}
                      style={{ width: `${Math.max(item.value, 0)}%` }} // Ensure non-negative
                      title={`${item.name}: ${formatCurrency(item.amount)}`}
                    ></div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Recommendations Card */}
      <div className="recommendation-card">
        <h3>Recommendations:</h3>
        <div className="recommendation-list-container">
          <ul className="recommendation-list">
            {recommendations.map((rec) => (
              <li key={rec.id} className="recommendation-item">
                <input 
                  type="checkbox"
                  id={`rec-${rec.id}`}
                  checked={rec.checked}
                  onChange={() => handleToggleRecommendation(rec.id)}
                />
                <label htmlFor={`rec-${rec.id}`}>{rec.text}</label>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="recommendation-actions">
          <button className="scenario-button">
            Apply Recommendations
          </button>
          <button 
            className="scenario-button secondary"
            onClick={onRunNew}
          >
            Run New Scenario
          </button>
        </div>
      </div>
    </>
  );
};

export default ScenarioResults;
