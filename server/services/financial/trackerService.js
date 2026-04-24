/**
 * Financial Health & Tracker Engine
 */

export const calculateFinancialHealth = (income, expenses, investments, loans) => {
  const totalIncome = income.reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const totalInvested = investments.reduce((acc, curr) => acc + curr.investedAmount, 0);
  const totalEmi = loans.reduce((acc, curr) => acc + curr.monthlyEmi, 0);

  if (totalIncome === 0) return { score: 0, status: 'N/A', insights: ["Please add your income to see your health score."] };

  // 1. Savings Rate Factor (Max 30 points)
  const savings = totalIncome - totalExpenses;
  const savingsRate = (savings / totalIncome) * 100;
  let savingsScore = Math.min(30, (savingsRate / 30) * 30);
  if (savingsRate < 0) savingsScore = 0;

  // 2. Debt Ratio Factor (Max 30 points)
  const emiRatio = (totalEmi / totalIncome) * 100;
  let debtScore = 30;
  if (emiRatio > 50) debtScore = 0;
  else if (emiRatio > 30) debtScore = 15;
  else debtScore = 30 - (emiRatio / 2);

  // 3. Investment Multiplier (Max 40 points)
  const investmentRatio = (totalInvested / (totalIncome * 12)) * 100; // Annualized ratio
  let investScore = Math.min(40, investmentRatio * 2);

  // Final Score
  const totalScore = Math.round(savingsScore + debtScore + investScore);
  
  let status = 'Poor';
  if (totalScore >= 80) status = 'Excellent';
  else if (totalScore >= 60) status = 'Good';
  else if (totalScore >= 40) status = 'Average';

  const insights = generateInsights(savingsRate, emiRatio, investmentRatio);

  return {
    score: totalScore,
    status,
    metrics: { savingsRate, emiRatio, investmentRatio },
    insights
  };
};

const generateInsights = (savingsRate, emiRatio, investmentRatio) => {
  const insights = [];

  if (savingsRate < 20) insights.push({ type: 'warning', text: `Your savings rate is ${savingsRate.toFixed(1)}%. Aim for at least 30% to build a safety net.` });
  if (emiRatio > 40) insights.push({ type: 'danger', text: "Your EMI burden is in the critical zone (>40%). Avoid any new debt immediately." });
  if (investmentRatio < 50) insights.push({ type: 'action', text: "Your wealth multiplier is low. Consider starting a recursive SIP to beat inflation." });
  if (savingsRate > 40 && investmentRatio < 100) insights.push({ type: 'tip', text: "You have high savings but low investments. You are losing money to inflation!" });

  return insights;
};
