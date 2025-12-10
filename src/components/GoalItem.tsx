import { FC, useState } from 'react';
import type { Goal } from '../types';
import { formatCurrency } from '../utils';
import ChevronDownIcon from '../assets/icons/ChevronDownIcon';
import CheckIcon from '../assets/icons/CheckIcon';

const GoalItem: FC<{ goal: Goal, onToggleComplete: (id: number | string) => void }> = ({ goal, onToggleComplete }) => {
  const [showContributions, setShowContributions] = useState(false);
  const progressPercent = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);

  return (
    <div className="goal-item">
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
        <h2 className={goal.completed ? 'completed' : ''}>
          {goal.name}
        </h2>
      </div>
      <div className="goal-progress">
        <div className="goal-progress-text">
          <span>{formatCurrency(goal.currentAmount)}</span>
          <span>{formatCurrency(goal.targetAmount)}</span>
        </div>
        <div className="progress-bar-bg">
          <div
            className={`progress-bar-inner ${goal.completed ? 'completed' : ''}`}
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>
      <div className="contributions-toggle">
        <button onClick={() => setShowContributions(!showContributions)}>
          Contributions
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
                  <span>{contrib.date}</span>
                  <span>{formatCurrency(contrib.amount)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p>No contributions recorded for this goal.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default GoalItem;
