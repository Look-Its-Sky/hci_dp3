import { FC, useState } from 'react';
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
    ['House Loan', 'Student Loan', 'Car Downpayment', 'Vacation Fund', 'Emergency Fund', 'Investments'].includes(item.name)
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
  
  const totalBalance = allLongTermGoals.reduce((sum, goal) => {
    return sum + (goal.currentAmount || 0);
  }, 0);

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
      </div>
      <div className="balance-card-gradient mt-4">
        <h2>EQUITY:</h2>
        <p>{formatCurrency(totalBalance)}</p>
        <button onClick={() => setShowModal(true)} className="add-goal-btn">
          <PlusIcon />
            <span>Add New Goal</span>
        </button>
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
