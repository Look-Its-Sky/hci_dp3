import { FC, useState, useMemo } from 'react';
import type { Goal } from '../types';
import { MOCK_IMPACT_DATA } from '../data';
import { formatCurrency } from '../utils';
import PlusIcon from '../assets/icons/PlusIcon';
import GoalItem from '../components/GoalItem';
import AddGoalModal from '../components/AddGoalModal';

/**
 * Component for the "MY GOALS" page content
 */
const MyGoalsPage: FC = () => {
  const allLongTermGoals = MOCK_IMPACT_DATA.filter(item => 
    ['House Loan', 'Student Loan', 'Car Down Payment', 'Vacation Fund', 'Emergency Fund', 'Investments'].includes(item.name)
  ).map(item => ({
    id: item.id,
    name: item.name,
    currentAmount: item.currentAmount || 0,
    targetAmount: item.targetAmount || 0,
    completed: (item.currentAmount || 0) >= (item.targetAmount || 0), // Determine based on amounts
    contributions: [] // MOCK_IMPACT_DATA does not contain contributions
  }));

  const [goals, setGoals] = useState<Goal[]>(allLongTermGoals);
  const [showModal, setShowModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'completed'>('all');

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    const totalGoals = goals.length;
    const completedGoals = goals.filter(g => g.completed).length;
    const activeGoals = totalGoals - completedGoals;
    const totalSaved = goals.reduce((sum, g) => sum + g.currentAmount, 0);
    const totalTarget = goals.reduce((sum, g) => sum + g.targetAmount, 0);
    const overallProgress = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;
    
    // Find nearest goal to completion
    const activeGoalsList = goals.filter(g => !g.completed);
    const nearestGoal = activeGoalsList.sort((a, b) => {
      const progressA = a.currentAmount / a.targetAmount;
      const progressB = b.currentAmount / b.targetAmount;
      return progressB - progressA;
    })[0];

    // Calculate monthly contribution needed to reach all goals in 12 months
    const totalRemaining = totalTarget - totalSaved;
    const monthlyNeeded = totalRemaining / 12;

    return {
      totalGoals,
      completedGoals,
      activeGoals,
      totalSaved,
      totalTarget,
      overallProgress,
      nearestGoal,
      monthlyNeeded,
      completionRate: totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0
    };
  }, [goals]);

  const filteredGoals = useMemo(() => {
    switch (filterStatus) {
      case 'active':
        return goals.filter(g => !g.completed);
      case 'completed':
        return goals.filter(g => g.completed);
      default:
        return goals;
    }
  }, [goals, filterStatus]);

  const handleToggleComplete = (id: number | string) => {
    setGoals(goals.map(goal =>
      goal.id === id ? { ...goal, completed: !goal.completed } : goal
    ));
  };

  const handleAddGoal = (newGoal: Goal) => {
    setGoals([newGoal, ...goals]);
  };

  return (
    <>
      {/* Goals Summary Dashboard */}
      <div className="goals-summary-dashboard">
        <div className="summary-header">
          <h2>Goals Overview</h2>
          <span className="summary-date">As of December 2025</span>
        </div>
        
        {/* Progress Ring and Stats */}
        <div className="summary-main">
          <div className="progress-ring-container">
            <svg className="progress-ring" viewBox="0 0 120 120">
              <circle
                className="progress-ring-bg"
                cx="60"
                cy="60"
                r="52"
                fill="none"
                strokeWidth="12"
              />
              <circle
                className="progress-ring-fill"
                cx="60"
                cy="60"
                r="52"
                fill="none"
                strokeWidth="12"
                strokeDasharray={`${summaryStats.overallProgress * 3.27} 327`}
                strokeLinecap="round"
                transform="rotate(-90 60 60)"
              />
            </svg>
            <div className="progress-ring-text">
              <span className="progress-percentage">{summaryStats.overallProgress.toFixed(0)}%</span>
              <span className="progress-label">Overall</span>
            </div>
          </div>
          
          <div className="summary-stats-grid">
            <div className="stat-item">
              <span className="stat-value">{summaryStats.activeGoals}</span>
              <span className="stat-label">Active Goals</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{summaryStats.completedGoals}</span>
              <span className="stat-label">Completed</span>
            </div>
            <div className="stat-item highlight">
              <span className="stat-value">{formatCurrency(summaryStats.totalSaved)}</span>
              <span className="stat-label">Total Saved</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{formatCurrency(summaryStats.totalTarget)}</span>
              <span className="stat-label">Total Target</span>
            </div>
          </div>
        </div>

        {/* Insights Section */}
        <div className="summary-insights">
          {summaryStats.nearestGoal && (
            <div className="insight-card nearest-goal">
              <span className="insight-icon">🎯</span>
              <div className="insight-content">
                <span className="insight-title">Nearest Goal</span>
                <span className="insight-value">{summaryStats.nearestGoal.name}</span>
                <span className="insight-detail">
                  {((summaryStats.nearestGoal.currentAmount / summaryStats.nearestGoal.targetAmount) * 100).toFixed(0)}% complete — {formatCurrency(summaryStats.nearestGoal.targetAmount - summaryStats.nearestGoal.currentAmount)} to go
                </span>
              </div>
            </div>
          )}
          <div className="insight-card monthly-target">
            <span className="insight-icon">📅</span>
            <div className="insight-content">
              <span className="insight-title">Monthly Target</span>
              <span className="insight-value">{formatCurrency(summaryStats.monthlyNeeded)}/mo</span>
              <span className="insight-detail">To reach all goals in 12 months</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="goals-action-bar">
        <div className="filter-tabs">
          <button 
            className={`filter-tab ${filterStatus === 'all' ? 'active' : ''}`}
            onClick={() => setFilterStatus('all')}
          >
            All ({goals.length})
          </button>
          <button 
            className={`filter-tab ${filterStatus === 'active' ? 'active' : ''}`}
            onClick={() => setFilterStatus('active')}
          >
            Active ({summaryStats.activeGoals})
          </button>
          <button 
            className={`filter-tab ${filterStatus === 'completed' ? 'active' : ''}`}
            onClick={() => setFilterStatus('completed')}
          >
            Completed ({summaryStats.completedGoals})
          </button>
        </div>
        <button onClick={() => setShowModal(true)} className="add-goal-btn">
          <PlusIcon />
          <span>Add Goal</span>
        </button>
      </div>

      {/* Goals List */}
      <div className="goals-list">
        {filteredGoals.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">🎯</span>
            <p className="empty-text">
              {filterStatus === 'completed' 
                ? "No completed goals yet. Keep going!" 
                : filterStatus === 'active'
                ? "All goals completed! Add a new one."
                : "No goals yet. Start by adding your first goal!"}
            </p>
          </div>
        ) : (
          filteredGoals.map((goal) => (
            <GoalItem key={goal.id} goal={goal} onToggleComplete={handleToggleComplete} />
          ))
        )}
      </div>

      <AddGoalModal show={showModal} onClose={() => setShowModal(false)} onAddGoal={handleAddGoal} />
    </>
  );
};

export default MyGoalsPage;
