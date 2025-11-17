import { FC, useState } from 'react';
import type { Recommendation } from '../types';
import { MOCK_RECOMMENDATIONS, MOCK_SCENARIO_RESULTS } from '../data';

/**
 * Component for the "Scenario Results" screen.
 * This is shown after a scenario is run.
 */
interface ScenarioResultsProps {
  onRunNew: () => void; // Function to go back to the setup screen
}

const ScenarioResults: FC<ScenarioResultsProps> = ({ onRunNew }) => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>(MOCK_RECOMMENDATIONS);

  const handleToggleRecommendation = (id: string) => {
    setRecommendations(recs => 
      recs.map(rec => 
        rec.id === id ? { ...rec, checked: !rec.checked } : rec
      )
    );
  };

  return (
    <>
      {/* Scenario Results Chart (re-using impact-card styles) */}
      <div className="impact-card">
        <h3>Scenario Results:</h3>
        <div className="impact-list-container" style={{ maxHeight: '150px' }}>
          <ul className="impact-list">
            {MOCK_SCENARIO_RESULTS.map((item, index) => (
              <li key={item.id} className="impact-item">
                <span className="impact-item-bullet">•</span>
                <div className="impact-item-bar-container">
                  {/* --- THIS IS THE LABEL YOU ADDED --- */}
                  <div className="impact-item-label">{item.name}</div>
                  
                  <div className="impact-bar-bg">
                    <div
                      className={`impact-bar-inner color-${(index % 5) + 1}`}
                      style={{ width: `${item.value}%` }}
                      title={`${item.name}: ${item.value}%`}
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
