import { BankAccount, Transaction, TPPServiceDefinition } from '../types/openBanking';

export const TPP_SERVICE_DEFINITIONS: TPPServiceDefinition[] = [
  {
    id: 'service-aggregation',
    number: 1,
    name: 'Financial Aggregation & Dashboards',
    category: 'Consumer & Business Intelligence',
    iconName: 'LayoutDashboard',
    tagline: 'Single view of all accounts across multiple banks with net worth tracking',
    description: 'Aggregates checking, savings, credit cards, and business accounts from multiple institutions into a single unified dashboard, calculating real-time net worth and historical spending trajectories.',
    realWorldExamples: ['Mint (US, historical)', 'Emma (UK)', 'Plaid-powered aggregators', 'Copilot Money'],
    requiredScopes: ['accounts', 'balances', 'transactions'],
    targetFrameworks: ['UK_OBIE', 'PSD2_EU', 'INDIA_AA', 'AU_CDR'],
    impactMetric: 'Unified View across 4 Accounts: £34,825 Net Worth',
    features: [
      'Multi-bank unified account portfolio',
      'Consolidated net worth calculation (Assets - Liabilities)',
      'Cross-institution liquidity analysis',
      'Spending trend visualization over time'
    ]
  },
  {
    id: 'service-budgeting',
    number: 2,
    name: 'Budgeting & Money Management',
    category: 'Personal Financial Management (PFM)',
    iconName: 'PieChart',
    tagline: 'Auto-categorizing transactions, spending alerts & forgotten subscription flagger',
    description: 'Auto-categorizes transactions (groceries, rent, dining, utilities, subscriptions) without manual entry. Emits spending alerts (e.g. 80% dining budget) and flags recurring subscriptions you forgot about.',
    realWorldExamples: ['Emma', 'Snoop', 'Cleo', 'PocketGuard'],
    requiredScopes: ['transactions', 'balances'],
    targetFrameworks: ['UK_OBIE', 'PSD2_EU', 'AU_CDR'],
    impactMetric: '1 Forgotten Gym Subscription (£34.50/mo) Flagged',
    features: [
      'Zero-touch automatic transaction categorization',
      'Dynamic threshold spending alerts ("80% of dining budget reached")',
      'Forgotten subscription detector (flags recurring charges with low engagement)',
      'Predictive end-of-month budget forecast'
    ]
  },
  {
    id: 'service-credit-scoring',
    number: 3,
    name: 'Alternative Credit Scoring / Lending',
    category: 'Inclusion & Underwriting',
    iconName: 'TrendingUp',
    tagline: 'Cash-flow & income pattern analyzer for thin-file gig workers & students',
    description: 'Lenders analyze real cash-flow, regular deposits, and income patterns instead of relying solely on traditional bureau credit scores. Enables fast approvals for gig workers, freelancers, and students who lack credit history.',
    realWorldExamples: ['Koyo Loans', 'Credit Kudos (now Apple)', 'Plaid Credit Underwrite', 'Perenna'],
    requiredScopes: ['accounts', 'transactions', 'balances'],
    targetFrameworks: ['UK_OBIE', 'PSD2_EU', 'INDIA_AA', 'AU_CDR'],
    impactMetric: 'Bureau Score 685 -> Cash-Flow Score 782 (Instant Pre-Approval)',
    features: [
      'Cash-flow stability index computed from real bank ledger',
      'Verification of gig-economy & freelance income streams (£750 verified)',
      'Savings buffer ratio calculation (income vs non-discretionary costs)',
      'Instant loan approval in seconds without PDF bank statements'
    ]
  },
  {
    id: 'service-affordability',
    number: 4,
    name: 'Affordability & Risk Checks',
    category: 'Lending & Compliance',
    iconName: 'CheckSquare',
    tagline: 'Mortgage stress tests, instant rental verification & BNPL risk check',
    description: 'Verifies whether applicants can afford loan repayments, rental leases, or Buy-Now-Pay-Later (BNPL) purchases without landlords or underwriters manually reviewing PDF bank statements.',
    realWorldExamples: ['Canopy (Rent Passport)', 'Mortgage Brain Open Banking', 'Klarna Open Banking Underwrite'],
    requiredScopes: ['accounts', 'balances', 'transactions'],
    targetFrameworks: ['UK_OBIE', 'PSD2_EU', 'AU_CDR'],
    impactMetric: 'Mortgage Stress Test (£950/mo): PASSED (Debt-to-Income 24.2%)',
    features: [
      'Automated mortgage stress test at stressed interest rate +3%',
      'Instant tenant rental affordability certificate',
      'BNPL pre-purchase debt exposure & existing commitment check',
      'Elimination of manual document forgery risk'
    ]
  },
  {
    id: 'service-savings-wellness',
    number: 5,
    name: 'Savings & Financial Wellness Tools',
    category: 'Micro-Savings & Optimization',
    iconName: 'PiggyBank',
    tagline: 'Round-up savings, bill negotiation & cash-flow shortfall predictor',
    description: 'Automates micro-savings by rounding up debit purchases, spots recurring bills and negotiates lower rates, and predicts cash-flow shortfalls before payday (e.g. "you\'ll be short by £200").',
    realWorldExamples: ['Chip', 'Moneybox', 'Plum', 'Truebill / Rocket Money'],
    requiredScopes: ['transactions', 'balances'],
    targetFrameworks: ['UK_OBIE', 'PSD2_EU', 'INDIA_AA', 'AU_CDR'],
    impactMetric: '£18.42 Round-Ups Saved + £120/yr Bill Savings Identified',
    features: [
      'Algorithmic round-up to nearest £1 on daily card purchases',
      'Recurring bill renegotiation detector (Octopus Energy contract)',
      'Predictive cash-flow trajectory to next payroll date',
      'Emergency cushion builder recommendation'
    ]
  },
  {
    id: 'service-accounting-sme',
    number: 6,
    name: 'Accounting & Small Business Tools',
    category: 'Commercial & SME Automation',
    iconName: 'Calculator',
    tagline: 'Auto-reconciling business transactions into Xero/QuickBooks & cash-flow runway',
    description: 'Feeds live bank transactions directly into accounting software, automatically matching invoices and bills, saving hours of manual bookkeeping, and calculating real-time cash runway.',
    realWorldExamples: ['Xero Bank Feeds', 'Intuit QuickBooks', 'FreeAgent', 'FreshBooks'],
    requiredScopes: ['accounts', 'balances', 'transactions'],
    targetFrameworks: ['UK_OBIE', 'PSD2_EU', 'AU_CDR'],
    impactMetric: '4 Business Invoices Auto-Matched (2.5 hrs bookkeeping saved)',
    features: [
      'Direct secure bank feed into general ledger',
      'Auto-matching of client invoices and supplier cloud receipts',
      'Real-time SME cash runway projection (8.5 months remaining)',
      'Automated VAT / Sales tax transaction tagging'
    ]
  },
  {
    id: 'service-robo-advisor',
    number: 7,
    name: 'Personalized Financial Advice / Robo-Advisors',
    category: 'Wealth & Advisory',
    iconName: 'Coins',
    tagline: 'Tailored investment allocations & insurance coverage gap analysis',
    description: 'Analyzes real spending patterns and surplus savings capacity to recommend personalized robo-investment portfolios and detect insurance coverage gaps.',
    realWorldExamples: ['Wealthify', 'Nutmeg (J.P. Morgan)', 'Betterment', 'Policygenius'],
    requiredScopes: ['accounts', 'balances', 'transactions'],
    targetFrameworks: ['UK_OBIE', 'PSD2_EU', 'AU_CDR'],
    impactMetric: 'Discretionary Surplus £455/mo -> Recommended 70/30 Index Allocation',
    features: [
      'Discretionary surplus cash flow quantification',
      'Tailored risk-adjusted investment portfolio allocation',
      'Insurance adequacy assessment vs real monthly commitments',
      'Automated recurring investment schedule setup'
    ]
  }
];

export function runTPPServicesAnalysis(accounts: BankAccount[], transactions: Transaction[]) {
  // 1. Aggregation
  const totalAssets = accounts.reduce((acc, a) => acc + (a.balances.current > 0 ? a.balances.current : 0), 0);
  const totalLiabilities = accounts.reduce((acc, a) => acc + (a.balances.current < 0 ? Math.abs(a.balances.current) : 0), 0);
  const netWorth = totalAssets - totalLiabilities;

  // 2. Budgeting
  const diningBudget = 200.0;
  const diningTransactions = transactions.filter(t => t.category === 'Dining' && t.creditDebitIndicator === 'Debit');
  const diningSpend = diningTransactions.reduce((acc, t) => acc + t.amount, 0);
  const diningPct = (diningSpend / diningBudget) * 100;
  const subscriptionTxs = transactions.filter(t => t.category === 'Subscriptions');
  const subscriptionMonthlyTotal = subscriptionTxs.reduce((acc, t) => acc + t.amount, 0);

  // 3. Alternative Credit Scoring
  const incomeTxs = transactions.filter(t => t.category === 'Income' || t.category === 'Freelance');
  const totalIncome = incomeTxs.reduce((acc, t) => acc + t.amount, 0);
  const totalDebits = transactions.filter(t => t.creditDebitIndicator === 'Debit').reduce((acc, t) => acc + t.amount, 0);
  const savingsBufferRatio = totalIncome > 0 ? (totalIncome - totalDebits) / totalIncome : 0;
  const alternativeScore = Math.min(850, Math.round(620 + (savingsBufferRatio * 180) + (incomeTxs.length * 15)));

  // 4. Affordability
  const monthlyFixedCommitments = transactions
    .filter(t => t.isRecurring && t.creditDebitIndicator === 'Debit')
    .reduce((acc, t) => acc + t.amount, 0);
  const discretionarySurplus = totalIncome - totalDebits;
  const hypotheticalMortgagePayment = 950.0;
  const debtToIncome = totalIncome > 0 ? (hypotheticalMortgagePayment / totalIncome) * 100 : 0;
  const mortgageStressPass = discretionarySurplus >= (hypotheticalMortgagePayment * 1.25);

  // 5. Savings & Wellness
  const debitPurchases = transactions.filter(t => t.creditDebitIndicator === 'Debit');
  const roundUps = debitPurchases.map(t => {
    const fraction = t.amount % 1;
    return fraction === 0 ? 0 : Number((1 - fraction).toFixed(2));
  });
  const totalRoundUpSaved = roundUps.reduce((acc, val) => acc + val, 0);

  // 6. SME Accounting
  const businessTxs = transactions.filter(t => t.accountId === 'acc-apex-004');
  const businessIncome = businessTxs.filter(t => t.creditDebitIndicator === 'Credit').reduce((acc, t) => acc + t.amount, 0);
  const businessExpenses = businessTxs.filter(t => t.creditDebitIndicator === 'Debit').reduce((acc, t) => acc + t.amount, 0);
  const netBusinessMargin = businessIncome - businessExpenses;

  // 7. Robo-Advisor
  const recommendedMonthlyInvest = Math.max(100, Math.round(discretionarySurplus * 0.4));

  return {
    aggregation: {
      totalAssets,
      totalLiabilities,
      netWorth,
      accountCount: accounts.length,
    },
    budgeting: {
      diningBudget,
      diningSpend,
      diningPct: Number(diningPct.toFixed(1)),
      alertTriggered: diningPct >= 80,
      subscriptions: subscriptionTxs,
      subscriptionMonthlyTotal,
      forgottenSubscription: subscriptionTxs.find(s => s.merchantName.includes('GymBox')),
    },
    alternativeCredit: {
      traditionalBureauScore: 685,
      alternativeCashFlowScore: alternativeScore,
      scoreLift: alternativeScore - 685,
      totalIncome,
      savingsBufferPercent: (savingsBufferRatio * 100).toFixed(1),
      decision: alternativeScore >= 720 ? 'INSTANT_APPROVAL' : 'REVIEW',
    },
    affordability: {
      monthlyFixedCommitments,
      discretionarySurplus,
      hypotheticalMortgagePayment,
      debtToIncome: debtToIncome.toFixed(1),
      mortgageStressPass,
      rentalCertificateStatus: 'CERTIFIED_VERIFIED',
    },
    savingsWellness: {
      totalRoundUpSaved: Number(totalRoundUpSaved.toFixed(2)),
      roundUpTransactionsCount: roundUps.filter(r => r > 0).length,
      cashFlowForecast: 'Comfortable buffer: +£1,250 projected before 1st of month',
      negotiatedBillSaving: 'Octopus Energy: £120/yr savings found on smart tariff',
    },
    smeAccounting: {
      businessAccountBalance: accounts.find(a => a.accountId === 'acc-apex-004')?.balances.current || 0,
      businessTxsCount: businessTxs.length,
      netBusinessMargin,
      autoReconciledCount: businessTxs.length,
      runwayMonths: 8.5,
    },
    roboAdvisor: {
      discretionarySurplus,
      recommendedMonthlyInvest,
      assetAllocation: [
        { asset: 'Global All-Cap Equity ETF', percentage: 65, color: 'emerald' },
        { asset: 'Government Green Bonds', percentage: 25, color: 'blue' },
        { asset: 'Liquid Short-Term Yield Fund', percentage: 10, color: 'amber' },
      ],
      insuranceCheck: 'Life cover adequate; Income protection recommended given freelance inflow.',
    }
  };
}
