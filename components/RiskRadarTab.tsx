'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { AlertTriangle, History, Shield, Scale, CheckCircle, Bot, TrendingUp, TrendingDown } from 'lucide-react';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Define TypeScript interfaces
interface Incident {
  month: string;
  incidents: number;
}

interface CasePrecedent {
  title: string;
  company: string;
  date: string;
  description: string;
  impact: string;
  resolution: string;
}

interface DeployedTool {
  id: number;
  name: string;
  category: string;
  vendor: string;
  deploymentDate: string;
  casePrecedents: CasePrecedent[];
  identifiedRisks: string[];
  mitigationStatus: string;
  riskLevel: string;
  monthlyIncidents: Incident[];
}

interface AggregateMonthData {
  month: string;
  total: number;
  high: number;
  medium: number;
  low: number;
}

interface RiskDistributionItem {
  name: string;
  value: number;
  color: string;
}

const RiskRadar = () => {
  const [deployedTools] = useState<{
    selectedTools: DeployedTool[];
  }>({
    selectedTools: [
      {
        id: 1,
        name: 'Anthropic',
        category: 'Foundation Model',
        vendor: 'Anthropic',
        deploymentDate: '2023-12',
        casePrecedents: [
          {
            title: 'AI Safety Implementation',
            company: 'YC Internal',
            date: '2024-01',
            description: 'Enhanced safety controls and monitoring systems',
            impact: 'Strengthened model safety protocols across all operations',
            resolution: 'Implemented advanced safety controls with 98% effectiveness'
          }
        ],
        identifiedRisks: [
          'AI Safety Monitoring',
          'Content Safety Controls',
          'Alignment Verification',
          'Output Quality Assurance'
        ],
        mitigationStatus: 'Resolved',
        riskLevel: 'Low',
        monthlyIncidents: [
          { month: 'Sep', incidents: 1 },
          { month: 'Oct', incidents: 1 },
          { month: 'Nov', incidents: 0 },
          { month: 'Dec', incidents: 0 },
          { month: 'Jan', incidents: 0 }
        ]
      },
      {
        id: 2,
        name: 'Scale AI',
        category: 'Data Operations',
        vendor: 'Scale AI',
        deploymentDate: '2023-12',
        casePrecedents: [
          {
            title: 'Data Quality Enhancement',
            company: 'YC Data Team',
            date: '2024-01',
            description: 'Improved data quality and validation processes',
            impact: 'Enhanced data operations with 92% accuracy',
            resolution: 'Implemented advanced quality controls and monitoring'
          }
        ],
        identifiedRisks: [
          'Data Quality Control',
          'Privacy Protection',
          'Accuracy Verification',
          'Process Efficiency'
        ],
        mitigationStatus: 'In Progress',
        riskLevel: 'Medium',
        monthlyIncidents: [
          { month: 'Sep', incidents: 5 },
          { month: 'Oct', incidents: 4 },
          { month: 'Nov', incidents: 3 },
          { month: 'Dec', incidents: 2 },
          { month: 'Jan', incidents: 1 }
        ]
      },
      {
        id: 3,
        name: 'Character.ai',
        category: 'Conversational AI',
        vendor: 'Character.ai',
        deploymentDate: '2024-01',
        casePrecedents: [
          {
            title: 'Content Safety Enhancement',
            company: 'YC Community',
            date: '2024-02',
            description: 'Improved content safety and moderation systems',
            impact: 'Enhanced safety for community interactions',
            resolution: 'Implemented advanced content safety protocols'
          },
          {
            title: 'User Privacy Enhancement',
            company: 'YC Community',
            date: '2024-01',
            description: 'Strengthened user privacy protections',
            impact: 'Protected user data for YC community',
            resolution: 'Implemented enhanced privacy controls'
          }
        ],
        identifiedRisks: [
          'Content Safety',
          'User Privacy',
          'Misuse Prevention',
          'Ethical Guidelines'
        ],
        mitigationStatus: 'In Progress',
        riskLevel: 'High',
        monthlyIncidents: [
          { month: 'Sep', incidents: 12 },
          { month: 'Oct', incidents: 10 },
          { month: 'Nov', incidents: 8 },
          { month: 'Dec', incidents: 6 },
          { month: 'Jan', incidents: 4 }
        ]
      }
    ]
  });

  // Track which tool is selected for detailed view
  const [selectedToolId, setSelectedToolId] = useState<number | null>(null);

  // Calculate aggregate metrics
  const calculateAggregateData = (): AggregateMonthData[] => {
    const monthlyAggregates: Record<string, AggregateMonthData> = {};

    // Initialize with all months
    deployedTools.selectedTools[0].monthlyIncidents.forEach(({ month }) => {
      monthlyAggregates[month] = {
        month,
        total: 0,
        high: 0,
        medium: 0,
        low: 0
      };
    });

    // Aggregate by risk level
    deployedTools.selectedTools.forEach(tool => {
      tool.monthlyIncidents.forEach(({ month, incidents }) => {
        monthlyAggregates[month].total += incidents;
        switch (tool.riskLevel.toLowerCase()) {
          case 'high':
            monthlyAggregates[month].high += incidents;
            break;
          case 'medium':
            monthlyAggregates[month].medium += incidents;
            break;
          case 'low':
            monthlyAggregates[month].low += incidents;
            break;
        }
      });
    });

    return Object.values(monthlyAggregates);
  };

  const aggregateData = calculateAggregateData();

  // Calculate month-over-month change for the latest month
  const latestMonthChange = (() => {
    const lastMonth = aggregateData[aggregateData.length - 1];
    const previousMonth = aggregateData[aggregateData.length - 2];
    const percentChange = ((lastMonth.total - previousMonth.total) / previousMonth.total) * 100;
    return {
      value: percentChange.toFixed(1),
      isPositive: percentChange > 0
    };
  })();

  // Helper functions
  const getRiskLevelColor = (level: string): string => {
    switch (level.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getMitigationStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'resolved':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'in progress':
        return <History className="w-4 h-4 text-yellow-600" />;
      case 'monitored':
        return <Shield className="w-4 h-4 text-blue-600" />;
      default:
        return null;
    }
  };

  const riskDistributionData: RiskDistributionItem[] = [
    { name: 'High Risk', value: deployedTools.selectedTools.filter(t => t.riskLevel === 'High').length, color: '#EF4444' },
    { name: 'Medium Risk', value: deployedTools.selectedTools.filter(t => t.riskLevel === 'Medium').length, color: '#F59E0B' },
    { name: 'Low Risk', value: deployedTools.selectedTools.filter(t => t.riskLevel === 'Low').length, color: '#10B981' }
  ];

  return (
    <Card className="w-full max-w-6xl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <Bot className="w-6 h-6 text-blue-600" />
          RiskRadar
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Risk Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={riskDistributionData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {riskDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                <span>Historical Risk Trend</span>
                <div className="flex items-center gap-2 text-sm">
                  {latestMonthChange.isPositive ? (
                    <TrendingUp className="w-4 h-4 text-red-600" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-green-600" />
                  )}
                  <span className={latestMonthChange.isPositive ? 'text-red-600' : 'text-green-600'}>
                    {latestMonthChange.value}%
                  </span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={aggregateData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="high"
                      name="High Risk Incidents"
                      stroke="#EF4444"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="medium"
                      name="Medium Risk Incidents"
                      stroke="#F59E0B"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="low"
                      name="Low Risk Incidents"
                      stroke="#10B981"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tool Selection Grid */}
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-3">Tool Details</h3>
          <div className="grid grid-cols-3 gap-3">
            {deployedTools.selectedTools.map((tool) => (
              <button
                key={tool.id}
                onClick={() => setSelectedToolId(selectedToolId === tool.id ? null : tool.id)}
                className={`p-3 rounded-lg border transition-colors ${selectedToolId === tool.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                  }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">{tool.name}</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${getRiskLevelColor(tool.riskLevel)}`}>
                    {tool.riskLevel}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{tool.category}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Show detailed view only for selected tool */}
        {selectedToolId && (
          <div className="space-y-6">
            {deployedTools.selectedTools
              .filter(tool => tool.id === selectedToolId)
              .map((tool) => (
                <div key={tool.id} className="border rounded-lg overflow-hidden">
                  <div className="bg-gray-50 p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h2 className="text-xl font-semibold">{tool.name}</h2>
                        <p className="text-gray-600">{tool.category} • {tool.vendor}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          {getMitigationStatusIcon(tool.mitigationStatus)}
                          <span className="text-sm">{tool.mitigationStatus}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 space-y-4">
                    <div>
                      <h3 className="text-lg font-medium flex items-center gap-2 mb-3">
                        <History className="w-5 h-5 text-blue-600" />
                        Case Precedents
                      </h3>
                      <div className="space-y-3">
                        {tool.casePrecedents.map((precedent, idx) => (
                          <div key={idx} className="bg-gray-50 rounded-lg p-3">
                            <div className="flex justify-between mb-2">
                              <h4 className="font-medium">{precedent.title}</h4>
                              <span className="text-sm text-gray-500">{precedent.date}</span>
                            </div>
                            <p className="text-sm text-gray-600 mb-1">{precedent.company}</p>
                            <p className="text-sm text-gray-600 mb-1">{precedent.description}</p>
                            <p className="text-sm text-red-600 mb-1">Impact: {precedent.impact}</p>
                            <p className="text-sm text-green-600">Resolution: {precedent.resolution}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium flex items-center gap-2 mb-3">
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                        Identified Risks
                      </h3>
                      <div className="grid grid-cols-2 gap-2">
                        {tool.identifiedRisks.map((risk, idx) => (
                          <div key={idx} className="bg-red-50 rounded-lg p-2">
                            <p className="text-sm text-gray-800">{risk}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RiskRadar;