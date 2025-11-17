import { FC, useState } from 'react';
import type { Goal } from '../types';
import { INITIAL_GOALS } from '../data';
import { formatCurrency } from '../utils';
import PlusIcon from '../assets/icons/PlusIcon';
import GoalItem from '../components/GoalItem';
import AddGoalModal from '../components/AddGoalModal';

/**
 * Component for the "MY GOALS" page content
 */
const MyGoalsPage: FC = () => {
  const [goals, setGoals] = useState<Goal[]>(INITIAL_GOALS);
  const [showModal, setShowModal] = useState(false);
  const totalBalance = 38445.12; // This seems to be static in the wireframes

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
      <div className="title-header">
        <h1>Financial Tracker</h1>
        <button onClick={() => setShowModal(true)} className="add-goal-btn">
          <PlusIcon />
            <span>Add New Goal</span>
        </button>
      </div>
      <div className="balance-card-gradient">
        <h2>Total Balance</h2>
        <p>{formatCurrency(totalBalance)}</p>
      </div>
      <div>
        {goals.map((goal) => (
          <GoalItem key={goal.id} goal={goal} onToggleComplete={handleToggleComplete} />
        ))}
      </div>
      <AddGoalModal show={showModal} onClose={() => setShowModal(false)} onAddGoal={handleAddGoal} />
    </>
  );
};

export default MyGoalsPage;
