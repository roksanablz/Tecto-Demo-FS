'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Eye, Scale, Shield, Lock, Bot, Star, Users, AlertTriangle, FileText, Info } from 'lucide-react';

type RiskLevel = 'low' | 'medium' | 'high';
type ModelType = 'fraud_detection' | 'credit_scoring' | 'trading_ai';
type AlertSeverity = 'high' | 'medium' | 'low';

interface ModelMetrics {
  transparency: number;
  bias: number;
  robustness: number;
  resilience: number;
  compliance: number;
}

interface ComplianceFramework {
  name: string;
  status: 'Compliant' | 'In Progress';
  score: number;
}

interface RiskAlert {
  severity: AlertSeverity;
  message: string;
  impact: string;
  action: string;
}

interface RiskFactor {
  factor: string;
  score: number;
}

interface MarketplaceAgent {
  name: string;
  category: string;
  rating: number;
  users: string;
  riskLevel: RiskLevel;
  riskFactors: RiskFactor[];
  description: string;
  weeklyTrend: string;
}

// Metric descriptions for info tooltips
const metricDescriptions = {
  transparency: "Transparency Score measures how well the financial AI model's decision-making process can be explained and understood by regulators and stakeholders. Higher scores indicate more explainable financial AI systems.",
  bias: "Bias Level indicates the degree to which the financial model exhibits unfair or preferential treatment in credit scoring and lending decisions. Lower percentages are better, showing less bias.",
  robustness: "Robustness Score measures the model's ability to maintain performance during market volatility and unexpected financial conditions. Higher scores indicate more robust systems.",
  resilience: "Resilience Score represents the model's capability to recover from market shocks and maintain operation under varied financial conditions. Higher scores indicate greater reliability."
};

const modelMetrics: Record<ModelType, ModelMetrics> = {
  fraud_detection: {
    transparency: 92,
    bias: 8,
    robustness: 95,
    resilience: 94,
    compliance: 95
  },
  credit_scoring: {
    transparency: 88,
    bias: 12,
    robustness: 90,
    resilience: 89,
    compliance: 94
  },
  trading_ai: {
    transparency: 85,
    bias: 15,
    robustness: 93,
    resilience: 91,
    compliance: 93
  }
};

const complianceFrameworks: ComplianceFramework[] = [
  { name: 'PCI DSS', status: 'Compliant', score: 94 },
  { name: 'ISO 27001', status: 'Compliant', score: 95 },
  { name: 'GDPR', status: 'In Progress', score: 88 },
  { name: 'SOC 2', status: 'Compliant', score: 92 }
];

const riskAlerts: RiskAlert[] = [
  {
    severity: 'high',
    message: 'Unusual trading pattern detected in high-frequency trading system',
    impact: 'Market Risk',
    action: 'Implement circuit breaker and review trading algorithms'
  },
  {
    severity: 'medium',
    message: 'Increased false positives in fraud detection system',
    impact: 'Customer Experience',
    action: 'Calibrate fraud detection thresholds'
  }
];

const marketplaceAgents: MarketplaceAgent[] = [
  {
    name: "Feedzai",
    category: "Fraud Detection",
    rating: 4.8,
    users: "100+ Banks",
    riskLevel: "low",
    riskFactors: [
      { factor: "Detection Accuracy", score: 97 },
      { factor: "False Positives", score: 94 },
      { factor: "Compliance", score: 96 }
    ],
    description: "Real-time fraud detection and prevention platform using machine learning to analyze transactions and identify suspicious patterns",
    weeklyTrend: "+18%"
  },
  {
    name: "Zest AI",
    category: "Credit Assessment",
    rating: 4.7,
    users: "40+ Lenders",
    riskLevel: "medium",
    riskFactors: [
      { factor: "Fair Lending", score: 95 },
      { factor: "Model Explainability", score: 93 },
      { factor: "Accuracy", score: 92 }
    ],
    description: "AI-powered credit underwriting platform that helps lenders make more accurate and fair credit decisions",
    weeklyTrend: "+22%"
  },
  {
    name: "Kavout",
    category: "Algorithmic Trading",
    rating: 4.6,
    users: "30+ Hedge Funds",
    riskLevel: "high",
    riskFactors: [
      { factor: "Market Analysis", score: 91 },
      { factor: "Risk Management", score: 89 },
      { factor: "Execution Speed", score: 96 }
    ],
    description: "AI-driven investment research and portfolio management platform using machine learning for market analysis",
    weeklyTrend: "+15%"
  }
];

const getRiskLevelColor = (level: RiskLevel): string => {
  const colors: Record<RiskLevel, string> = {
    low: "bg-green-100 text-green-800",
    medium: "bg-yellow-100 text-yellow-800",
    high: "bg-red-100 text-red-800"
  };
  return colors[level];
};

// Info Tooltip component
const InfoTooltip = ({ 
  description, 
  isOpen, 
  onClick 
}: { 
  description: string, 
  isOpen: boolean, 
  onClick: () => void 
}) => (
  <div className="relative">
    <button 
      onClick={onClick}
      className="ml-2 text-gray-400 hover:text-gray-600 focus:outline-none"
    >
      <Info className="h-4 w-4" />
    </button>
    
    {isOpen && (
      <div className="absolute z-10 w-64 p-3 text-sm bg-white border rounded-md shadow-lg top-6 left-0">
        <p>{description}</p>
      </div>
    )}
  </div>
);

const DashboardTab = () => {
  const [selectedModel] = useState<ModelType>('fraud_detection');
  const [openTooltip, setOpenTooltip] = useState<string | null>(null);

  const toggleTooltip = (metric: string) => {
    if (openTooltip === metric) {
      setOpenTooltip(null);
    } else {
      setOpenTooltip(metric);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center">
                <Eye className="h-8 w-8 text-blue-500 mr-2" />
                <div>
                  <div className="flex items-center">
                    <p className="text-sm font-medium">Transparency Score</p>
                    <InfoTooltip 
                      description={metricDescriptions.transparency}
                      isOpen={openTooltip === 'transparency'}
                      onClick={() => toggleTooltip('transparency')}
                    />
                  </div>
                  <h3 className="text-2xl font-bold">{modelMetrics[selectedModel].transparency}%</h3>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center">
                <Scale className="h-8 w-8 text-yellow-500 mr-2" />
                <div>
                  <div className="flex items-center">
                    <p className="text-sm font-medium">Bias Level</p>
                    <InfoTooltip 
                      description={metricDescriptions.bias}
                      isOpen={openTooltip === 'bias'}
                      onClick={() => toggleTooltip('bias')}
                    />
                  </div>
                  <h3 className="text-2xl font-bold">{modelMetrics[selectedModel].bias}%</h3>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center">
                <Shield className="h-8 w-8 text-green-500 mr-2" />
                <div>
                  <div className="flex items-center">
                    <p className="text-sm font-medium">Robustness Score</p>
                    <InfoTooltip 
                      description={metricDescriptions.robustness}
                      isOpen={openTooltip === 'robustness'}
                      onClick={() => toggleTooltip('robustness')}
                    />
                  </div>
                  <h3 className="text-2xl font-bold">{modelMetrics[selectedModel].robustness}%</h3>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center">
                <Lock className="h-8 w-8 text-purple-500 mr-2" />
                <div>
                  <div className="flex items-center">
                    <p className="text-sm font-medium">Resilience Score</p>
                    <InfoTooltip 
                      description={metricDescriptions.resilience}
                      isOpen={openTooltip === 'resilience'}
                      onClick={() => toggleTooltip('resilience')}
                    />
                  </div>
                  <h3 className="text-2xl font-bold">{modelMetrics[selectedModel].resilience}%</h3>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Compliance Framework Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {complianceFrameworks.map((framework, index) => (
                <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="font-medium">{framework.name}</span>
                  <div className="flex items-center">
                    <span className={`px-2 py-1 rounded text-sm ${
                      framework.status === 'Compliant' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {framework.status}
                    </span>
                    <span className="ml-4 font-bold">{framework.score}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Risk Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {riskAlerts.map((alert, index) => (
                <Alert key={index} variant={alert.severity === 'high' ? 'destructive' : 'warning'}>
                  <AlertTitle className="flex items-center">
                    {alert.severity === 'high' ? 'High Risk Alert' : 'Medium Risk Alert'}
                  </AlertTitle>
                  <AlertDescription>
                    <p className="mt-1">{alert.message}</p>
                    <div className="mt-2 flex justify-between text-sm">
                      <span>Impact: {alert.impact}</span>
                      <span>Action: {alert.action}</span>
                    </div>
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bot className="h-5 w-5 mr-2" />
            Financial AI Tools Deployed
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {marketplaceAgents.map((agent, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex flex-col space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-4">
                      <Bot className="h-8 w-8 text-blue-500" />
                      <div>
                        <h3 className="text-xl font-bold">{agent.name}</h3>
                        <p className="text-gray-500">{agent.category}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <Star className="h-5 w-5 text-yellow-400" />
                        <span className="ml-1 font-medium">{agent.rating}</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="h-5 w-5 text-gray-400" />
                        <span className="ml-1">{agent.users}</span>
                      </div>
                      <span className={`px-2 py-1 rounded text-sm ${getRiskLevelColor(agent.riskLevel)}`}>
                        {agent.riskLevel.toUpperCase()} RISK
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-600">{agent.description}</p>

                  <div className="grid grid-cols-3 gap-4">
                    {agent.riskFactors.map((factor, idx) => (
                      <div key={idx} className="p-3 bg-white rounded">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">{factor.factor}</span>
                          <span className={`text-sm font-bold ${
                            factor.score >= 90 ? 'text-green-600' : 
                            factor.score >= 80 ? 'text-yellow-600' : 
                            'text-red-600'
                          }`}>
                            {factor.score}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>Weekly Trend: <span className="text-green-600">{agent.weeklyTrend}</span></span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardTab; 