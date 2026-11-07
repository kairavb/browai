export interface Fund {
  id: string;
  name: string;
  category: string;
  nav: number;
  r1y: number;
  r3y: number;
  r5y: number;
  aum: number; // in Cr
  risk: 'Low' | 'Moderate' | 'High';
  rating: number; // 1-5
}

export const funds: Fund[] = [
  { id: 'f1', name: 'Parag Parikh Flexi Cap', category: 'Flexi Cap', nav: 78.42, r1y: 24.1, r3y: 21.8, r5y: 23.4, aum: 82400, risk: 'Moderate', rating: 5 },
  { id: 'f2', name: 'Quant Small Cap', category: 'Small Cap', nav: 268.9, r1y: 31.6, r3y: 28.2, r5y: 34.1, aum: 26800, risk: 'High', rating: 5 },
  { id: 'f3', name: 'HDFC Mid-Cap Opportunities', category: 'Mid Cap', nav: 184.3, r1y: 26.4, r3y: 24.1, r5y: 25.8, aum: 73200, risk: 'High', rating: 4 },
  { id: 'f4', name: 'ICICI Pru Bluechip', category: 'Large Cap', nav: 112.7, r1y: 18.2, r3y: 16.4, r5y: 17.9, aum: 63400, risk: 'Moderate', rating: 4 },
  { id: 'f5', name: 'SBI Contra', category: 'Contra', nav: 392.1, r1y: 22.8, r3y: 25.6, r5y: 26.2, aum: 41200, risk: 'Moderate', rating: 5 },
  { id: 'f6', name: 'Axis Nifty 50 Index', category: 'Index', nav: 24.6, r1y: 15.1, r3y: 14.2, r5y: 15.6, aum: 18600, risk: 'Low', rating: 4 },
  { id: 'f7', name: 'Nippon India Liquid', category: 'Liquid', nav: 6120.4, r1y: 7.2, r3y: 6.1, r5y: 5.4, aum: 32800, risk: 'Low', rating: 4 },
  { id: 'f8', name: 'Mirae Asset Large & Midcap', category: 'Large & Mid', nav: 148.9, r1y: 20.4, r3y: 18.7, r5y: 21.3, aum: 38900, risk: 'Moderate', rating: 4 },
];
