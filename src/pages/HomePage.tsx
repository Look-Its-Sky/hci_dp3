import { FC } from 'react';
import { formatCurrency } from '../utils';
import { MOCK_IMPACT_DATA } from '../data';

/**
 * Component for the "HOME" page content
 */
const HomePage: FC = () => {
  const totalBalance = 38445.12;

  return (
    <>
      <div className="title-header centered">
        <h1>Financial Tracker</h1>
      </div>
      <div className="balance-card-simple">
        <h2>BALANCE:</h2>
        <p>{formatCurrency(totalBalance)}</p>
      </div>
      
      <div className="impact-card">
        <h3>Impact Summary:</h3>
        <div className="impact-list-container">
          <ul className="impact-list">
            {MOCK_IMPACT_DATA.map((item, index) => (
              <li key={item.id} className="impact-item">
                <span className="impact-item-bullet">•</span>
                <div className="impact-item-bar-container">
                  {/* --- THIS IS THE NEWLY ADDED LABEL --- */}
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
    </>
  );
};

export default HomePage;
