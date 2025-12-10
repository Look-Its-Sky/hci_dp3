import { FC, useState } from 'react';
import type { Goal } from '../types';
import { formatCurrency } from '../utils';
import ChevronDownIcon from '../assets/icons/ChevronDownIcon';
import CheckIcon from '../assets/icons/CheckIcon';

const GoalItem: FC<{ goal: Goal, onToggleComplete: (id: number | string) => void }> = ({ goal, onToggleComplete }) => {
  const [showContributions, setShowContributions] = useState(false);
  const progressPercent = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
  const remaining = goal.targetAmount - goal.currentAmount;
  
  // Calculate estimated time to completion based on average contribution
  const getEstimatedCompletion = () => {
    if (goal.completed || goal.contributions.length < 2) return null;
    
    const totalContributed = goal.contributions.reduce((sum, c) => sum + c.amount, 0);
    const avgContribution = totalContributed / goal.contributions.length;
    const monthsToGo = Math.ceil(remaining / avgContribution);
    
    if (monthsToGo <= 0) return null;
    if (monthsToGo === 1) return '~1 month';
    if (monthsToGo < 12) return `~${monthsToGo} months`;
    const years = Math.floor(monthsToGo / 12);
    const months = monthsToGo % 12;
    return `~${years}y ${months}m`;
  };

  const estimatedCompletion = getEstimatedCompletion();

  return (
    <div className={`goal-item ${goal.completed ? 'completed-goal' : ''}`}>
      <div className="goal-item-header">
        <label className="custom-checkbox-container">
          <input
            type="checkbox"
            className="custom-checkbox-input"
            checked={goal.completed}
            onChange={() => onToggleComplete(goal.id)}
            aria-label={`Mark ${goal.name} as complete`}
          />
          <span className="custom-checkbox-styled">
            <CheckIcon />
          </span>
        </label>
        <div className="goal-title-section">
          <h2 className={goal.completed ? 'completed' : ''}>
            {goal.name}
          </h2>
          {goal.completed && <span className="completed-badge">✓ Completed</span>}
        </div>
      </div>
      
      <div className="goal-progress">
        <div className="goal-progress-text">
          <span className="current-amount">{formatCurrency(goal.currentAmount)}</span>
          <span className="target-amount">of {formatCurrency(goal.targetAmount)}</span>
        </div>
        <div className="progress-bar-bg">
          <div
            className={`progress-bar-inner ${goal.completed ? 'completed' : ''}`}
            style={{ width: `${progressPercent}%` }}
          >
            {progressPercent > 20 && (
              <span className="progress-percentage">{progressPercent.toFixed(0)}%</span>
            )}
          </div>
        </div>
        <div className="goal-meta">
          {!goal.completed && remaining > 0 && (
            <span className="remaining-amount">{formatCurrency(remaining)} to go</span>
          )}
          {estimatedCompletion && !goal.completed && (
            <span className="estimated-time">Est. {estimatedCompletion}</span>
          )}
        </div>
      </div>
      
      <div className="contributions-toggle">
        <button 
          onClick={() => setShowContributions(!showContributions)}
          aria-expanded={showContributions}
        >
          <span>Contributions ({goal.contributions?.length || 0})</span>
          <ChevronDownIcon className={showContributions ? 'rotate-180' : ''} />
        </button>
      </div>
      
      {showContributions && (
        <div className="contributions-list">
          <h4>Contribution History</h4>
          {goal.contributions && goal.contributions.length > 0 ? (
            <ul>
              {goal.contributions.map((contrib) => (
                <li key={contrib.id}>
                  <span className="contrib-date">{new Date(contrib.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  <span className="contrib-amount">+{formatCurrency(contrib.amount)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="no-contributions">No contributions recorded yet.</p>
          )}
          <button className="add-contribution-btn">
            + Add Contribution
          </button>
        </div>
      )}
    </div>
  );
};

export default GoalItem;
