/**
 * Loan Eligibility Scoring Engine (Rule-based with AI-ready hooks)
 */

export const calculateEligibility = (data) => {
  const { monthlyIncome, creditScore, existingEmi, employmentType } = data;

  const disposableIncome = monthlyIncome - existingEmi;
  const dti = (existingEmi / monthlyIncome) * 100;

  const multiplier = employmentType === 'Salaried' ? 12 : 8;

  let creditFactor = 0.5;
  if (creditScore >= 800) creditFactor = 1.5;
  else if (creditScore >= 750) creditFactor = 1.2;
  else if (creditScore >= 700) creditFactor = 1.0;
  else if (creditScore >= 650) creditFactor = 0.8;
  else creditFactor = 0.3;

  const maxEligibleAmount = (disposableIncome * multiplier) * creditFactor;
  const approvalProbability = creditScore > 750 ? 'High' : creditScore > 700 ? 'Moderate' : 'Low';
  
  const probabilityScore = Math.min(100, Math.max(0, (creditScore - 300) / 6 + (100 - dti) / 2));

  return {
    maxEligibleAmount: Math.round(maxEligibleAmount),
    monthlyInstallmentCapacity: Math.round(disposableIncome * 0.4),
    approvalProbability,
    probabilityScore: Math.round(probabilityScore),
    dti: dti.toFixed(2),
    recommendations: generateRecommendations(creditScore, dti)
  };
};

const generateRecommendations = (score, dti) => {
  const recs = [];
  if (score < 700) recs.push("Work on improving your credit score by paying bills on time.");
  if (dti > 40) recs.push("Try closing existing small loans to increase your borrowing capacity.");
  if (score >= 750) recs.push("You qualify for 'Super Prime' interest rates. Negotiate for lower processing fees.");
  return recs;
};
