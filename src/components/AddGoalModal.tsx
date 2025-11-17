import { FC, useState, FormEvent } from 'react';
import type { Goal } from '../types';

interface AddGoalModalProps {
  show: boolean;
  onClose: () => void;
  onAddGoal: (newGoal: Goal) => void;
}

const AddGoalModal: FC<AddGoalModalProps> = ({ show, onClose, onAddGoal }) => {
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('');

  if (!show) {
    return null;
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name || !targetAmount) {
      console.warn("Please fill in at least 'Goal Name' and 'Target Amount'.");
      return;
    }
    const parsedCurrentAmount = parseFloat(currentAmount) || 0;
    const newGoal: Goal = {
      id: crypto.randomUUID(),
      name,
      targetAmount: parseFloat(targetAmount),
      currentAmount: parsedCurrentAmount,
      completed: false,
      contributions: parsedCurrentAmount > 0 ? [
        { id: crypto.randomUUID(), date: new Date().toISOString().split('T')[0], amount: parsedCurrentAmount }
      ] : []
    };
    onAddGoal(newGoal);
    setName('');
    setTargetAmount('');
    setCurrentAmount('');
    onClose();
  };

  return (
    <>
      <div className="modal-backdrop" onClick={onClose} aria-hidden="true"></div>
      <div className="modal-panel" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <h2 id="modal-title">Add New Financial Goal</h2>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group-container">
            <div className="form-group">
              <label htmlFor="goalName">Goal Name</label>
              <input type="text" id="goalName" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Vacation Fund" />
            </div>
            <div className="form-group">
              <label htmlFor="targetAmount">Target Amount ($)</label>
              <input type="number" id="targetAmount" value={targetAmount} onChange={(e) => setTargetAmount(e.target.value)} placeholder="5000" min="0" />
            </div>
            <div className="form-group">
              <label htmlFor="currentAmount">Current Amount (Optional, $)</label>
              <input type="number" id="currentAmount" value={currentAmount} onChange={(e) => setCurrentAmount(e.target.value)} placeholder="0" min="0" />
            </div>
          </div>
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="modal-btn-cancel">Cancel</button>
            <button type="submit" className="modal-btn-submit">Add Goal</button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddGoalModal;
