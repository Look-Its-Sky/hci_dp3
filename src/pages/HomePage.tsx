import { FC } from 'react';
import { formatCurrency } from '../utils';
import { MOCK_IMPACT_DATA } from '../data';

/**
 * Component for the "HOME" page content
 */
const HomePage: FC = () => {
  const longTermGoals = MOCK_IMPACT_DATA.filter(item => 
    ['House Loan', 'Student Loan', 'Car Downpayment', 'Vacation Fund', 'Emergency Fund', 'Investments'].includes(item.name)
  );

  const totalBalance = longTermGoals.reduce((sum, goal) => {
    return sum + (goal.currentAmount || 0);
  }, 0);

  const monthlyExpenses = MOCK_IMPACT_DATA.filter(item =>
    ['Utilities', 'Groceries', 'Subscriptions'].includes(item.name)
  );

  return (
    <>
      <div className="title-header centered">
      </div>
      <div className="balance-card-simple">
        <h2>EQUITY:</h2>
        <p>{formatCurrency(totalBalance)}</p>
      </div>
      
      <div className="impact-card" style={{ marginBottom: '1rem' }}>
        <h3>Long Term Goals:</h3>
        <div className="impact-list-container">
          <ul className="impact-list">
            {longTermGoals.map((item, index) => (
              <li key={item.id} className="impact-item">
                <span className="impact-item-bullet">•</span>
                <div className="impact-item-bar-container">
                  <div className="impact-item-label">
                    {item.name}: {item.value}%
                    {item.currentAmount !== undefined && item.targetAmount !== undefined && (
                      <span className="impact-goal-amounts">
                        ({formatCurrency(item.currentAmount)} / {formatCurrency(item.targetAmount)})
                      </span>
                    )}
                  </div>
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

      <div className="impact-card">
        <h3>Monthly Expenses:</h3>
        <div className="impact-list-container">
          <ul className="impact-list">
            {monthlyExpenses.map((item, index) => (
              <li key={item.id} className="impact-item">
                <span className="impact-item-bullet">•</span>
                <div className="impact-item-bar-container">
                  <div className="impact-item-label">
                    {item.name}: {item.value.toFixed(2)}%
                    {item.currentAmount !== undefined && item.targetAmount !== undefined && (
                      <span className="impact-goal-amounts">
                        ({formatCurrency(item.currentAmount)} / {formatCurrency(item.targetAmount)})
                      </span>
                    )}
                  </div>
                  <div className="impact-bar-bg">
                    <div
                      className={`impact-bar-inner color-${(index % 5) + 1}`}
                      style={{ width: `${item.value}%` }}
                      title={`${item.name}: ${item.value.toFixed(2)}%`}
                    ></div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default HomePage;
