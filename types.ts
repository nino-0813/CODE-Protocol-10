
import { ReactNode } from 'react';

export interface Equation {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  formula: string;
  description: string;
  icon: ReactNode;
  isAvailable: boolean;
}

export type AppView = 'dashboard' | 'bayesian-tool' | 'betting-tool' | 'confidence-tool' | 'markov-tool' | 'pagerank-tool' | 'market-tool' | 'correlation-tool' | 'qlearning-tool' | 'gradient-tool' | 'ifthen-tool';
