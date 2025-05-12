'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, Filter, Globe, AlertTriangle, Info } from 'lucide-react';

type Change = { date: string; change: string };
type Milestone = { date: string; event: string };

type Policy = {
  name: string;
  region: string;
  status: string;
  progress: number;
  recentChanges?: Change[];
  futureMilestones?: Milestone[];
  leader?: {
    name: string;
    role: string;
    organization: string;
  };
  impact: string;
  category?: string;
};

// Add tooltip descriptions
const metricDescriptions = {
  status: {
    Enacted: "The policy has been officially passed, adopted, or implemented.",
    "In Progress": "The policy is in an advanced draft, review, or partial implementation phase.",
    "In Development": "The policy is in early conceptual, exploratory, or pilot phase."
  },
  progress: {
    100: "Fully passed and enforced",
    70: "Adopted or signed but not yet enforced",
    50: "Being piloted or tested with active planning",
    40: "Public draft or early proposal",
    30: "Conceptual or high-level announcement only"
  },
  impact: {
    High: "Legally binding, widely adopted, or influential across jurisdictions",
    Medium: "Voluntary or regional, but with emerging legal/market implications",
    Low: "Narrow, early-stage, or advisory with limited practical effect"
  }
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

const PolicySenseTab = () => {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [filteredPolicies, setFilteredPolicies] = useState<Policy[]>([]);
  const [lastUpdated, setLastUpdated] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [regionFilter, setRegionFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [impactFilter, setImpactFilter] = useState('all');
  const [regions, setRegions] = useState<string[]>([]);
  const [expandedMilestones, setExpandedMilestones] = useState<Record<string, boolean>>({});
  const [showHelp, setShowHelp] = useState(false);
  const [openTooltip, setOpenTooltip] = useState<string | null>(null);

  useEffect(() => {
    fetch('http://localhost:3001/api/policies')
      .then(res => res.json())
      .then(data => {
        setPolicies(data.policies || []);
        setFilteredPolicies(data.policies || []);
        setLastUpdated(data.lastUpdated || '');

        const uniqueRegions = [...new Set<string>(data.policies.map((p: Policy) => p.region))];
        setRegions(uniqueRegions);
      })
      .catch(err => console.error('Failed to load policies:', err));
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, regionFilter, statusFilter, impactFilter, policies]);

  const applyFilters = () => {
    let result = [...policies];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(policy =>
        policy.name.toLowerCase().includes(term) ||
        policy.region.toLowerCase().includes(term) ||
        (policy.leader?.name && policy.leader.name.toLowerCase().includes(term))
      );
    }

    if (regionFilter !== 'all') {
      result = result.filter(policy => policy.region === regionFilter);
    }

    if (statusFilter !== 'all') {
      result = result.filter(policy => policy.status === statusFilter);
    }

    if (impactFilter !== 'all') {
      result = result.filter(policy => policy.impact === impactFilter);
    }

    setFilteredPolicies(result);
  };

  const getLastChangeDate = (changes: { date: string }[] = []) => {
    if (!changes.length) return 'N/A';
    const mostRecent = changes
      .map(c => new Date(c.date))
      .sort((a, b) => b.getTime() - a.getTime())[0];
    return mostRecent.toLocaleDateString();
  };

  const isRecentlyChanged = (changes: { date: string }[] = []) => {
    const mostRecent = changes
      .map(c => new Date(c.date))
      .sort((a, b) => b.getTime() - a.getTime())[0];
    if (!mostRecent) return false;
    const now = new Date();
    return now.getTime() - mostRecent.getTime() < 7 * 24 * 60 * 60 * 1000;
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Enacted': return 'bg-green-100 text-green-800';
      case 'In Progress': return 'bg-yellow-100 text-yellow-800';
      case 'In Development': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getImpactBadgeClass = (impact: string) => {
    switch (impact) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const toggleMilestones = (policyName: string) => {
    setExpandedMilestones(prev => ({
      ...prev,
      [policyName]: !prev[policyName]
    }));
  };

  const toggleTooltip = (metric: string) => {
    if (openTooltip === metric) {
      setOpenTooltip(null);
    } else {
      setOpenTooltip(metric);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Global AI Policy Monitor</h2>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowHelp(!showHelp)}
            className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            <Info className="h-4 w-4" />
            {showHelp ? 'Hide Field Guide' : 'View Field Guide'}
          </button>
          {lastUpdated && (
            <span className="text-sm text-gray-500">
              Last updated: {new Date(lastUpdated).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>

      {showHelp && (
        <Card className="border border-gray-200 mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Policy Field Guide</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Status</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li><span className="font-medium">Enacted</span> – The policy has been officially passed, adopted, or implemented.</li>
                  <li><span className="font-medium">In Progress</span> – The policy is in an advanced draft, review, or partial implementation phase.</li>
                  <li><span className="font-medium">In Development</span> – The policy is in early conceptual, exploratory, or pilot phase.</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Progress</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li><span className="font-medium">100%</span> – Fully passed and enforced</li>
                  <li><span className="font-medium">70%</span> – Adopted or signed but not yet enforced</li>
                  <li><span className="font-medium">50%</span> – Being piloted or tested with active planning</li>
                  <li><span className="font-medium">40%</span> – Public draft or early proposal</li>
                  <li><span className="font-medium">30% or lower</span> – Conceptual or high-level announcement only</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Impact</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li><span className="font-medium">High</span> – Legally binding, widely adopted, or influential across jurisdictions</li>
                  <li><span className="font-medium">Medium</span> – Voluntary or regional, but with emerging legal/market implications</li>
                  <li><span className="font-medium">Low</span> – Narrow, early-stage, or advisory with limited practical effect</li>
                </ul>
              </div>

              <div className="text-sm text-gray-600 italic">
                Note: These are human judgments informed by recent legal status, adoption trends, and relevance
                to AI builders, particularly those scaling or facing compliance risk (e.g. YC applicants).
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="border border-gray-200">
        <CardContent className="pt-4 pb-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-grow max-w-md">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search policies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center">
                <Globe className="h-4 w-4 text-gray-500 mr-1" />
                <select
                  className="p-2 border rounded-md text-sm"
                  value={regionFilter}
                  onChange={(e) => setRegionFilter(e.target.value)}
                >
                  <option value="all">All Regions</option>
                  {regions.map(region => (
                    <option key={region} value={region}>{region}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center">
                <Filter className="h-4 w-4 text-gray-500 mr-1" />
                <select
                  className="p-2 border rounded-md text-sm"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value="Enacted">Enacted</option>
                  <option value="In Progress">In Progress</option>
                  <option value="In Development">In Development</option>
                </select>
              </div>

              <div className="flex items-center">
                <AlertTriangle className="h-4 w-4 text-gray-500 mr-1" />
                <select
                  className="p-2 border rounded-md text-sm"
                  value={impactFilter}
                  onChange={(e) => setImpactFilter(e.target.value)}
                >
                  <option value="all">All Impacts</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
            </div>

            <div className="ml-auto text-sm text-gray-500">
              {filteredPolicies.length} of {policies.length}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {filteredPolicies.length === 0 ? (
          <Card>
            <CardContent className="py-6 text-center">
              <p className="text-gray-500">No policies match your current filters. Try adjusting your search criteria.</p>
            </CardContent>
          </Card>
        ) : (
          filteredPolicies.map((policy, index) => (
            <Card key={index} className="transition-all duration-200 hover:shadow-md">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl flex items-center gap-2">
                      {policy.name}
                      <div className="flex items-center">
                        <span className={`text-sm px-2 py-1 rounded ${getStatusBadgeClass(policy.status)}`}>
                          {policy.status}
                        </span>
                        <InfoTooltip 
                          description={metricDescriptions.status[policy.status as keyof typeof metricDescriptions.status]}
                          isOpen={openTooltip === `status-${index}`}
                          onClick={() => toggleTooltip(`status-${index}`)}
                        />
                      </div>
                    </CardTitle>
                    <p className="text-sm text-gray-500">{policy.region}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Progress:</span>
                    <div className="w-32 h-2 bg-gray-200 rounded">
                      <div
                        className="h-full bg-blue-500 rounded"
                        style={{ width: `${policy.progress}%` }}
                      />
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm font-medium">{policy.progress}%</span>
                      <InfoTooltip 
                        description={metricDescriptions.progress[Math.floor(policy.progress/10)*10 as keyof typeof metricDescriptions.progress]}
                        isOpen={openTooltip === `progress-${index}`}
                        onClick={() => toggleTooltip(`progress-${index}`)}
                      />
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-semibold mb-2">Recent Changes</h3>
                    <div className="space-y-2 text-sm">
                      {policy.recentChanges?.map((change, idx) => (
                        <div key={idx}>
                          <span className="text-gray-500">{change.date}:</span> {change.change}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-semibold mb-2">Policy Leadership</h3>
                      <div className="text-sm">
                        <p className="font-medium">{policy.leader?.name === 'unknown' ? '' : policy.leader?.name}</p>
                        <p className="text-gray-500">{policy.leader?.role === 'unknown' ? '' : policy.leader?.role}</p>
                        <p className="text-gray-500">{policy.leader?.organization === 'unknown' ? '' : policy.leader?.organization}</p>
                      </div>
                    </div>
                    {policy.futureMilestones?.length > 0 && (
                      <div>
                        <h3 className="text-sm font-semibold mb-2">Upcoming Milestones</h3>
                        <div className="space-y-2 text-sm">
                          {policy.futureMilestones
                            .slice(0, expandedMilestones[policy.name] ? undefined : 3)
                            .map((milestone, idx) => (
                              <div key={idx}>
                                <span className="text-gray-500">{milestone.date === 'unknown' ? '' : milestone.date}:</span> {milestone.event === 'unknown' ? '' : milestone.event}
                              </div>
                            ))}
                          {policy.futureMilestones.length > 3 && (
                            <button
                              onClick={() => toggleMilestones(policy.name)}
                              className="text-blue-500 hover:text-blue-700 text-sm mt-2"
                            >
                              {expandedMilestones[policy.name] ? 'Show Less' : 'Show More...'}
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">Impact Level:</span>
                    <div className="flex items-center">
                      <span className={`px-2 py-1 rounded text-sm ${getImpactBadgeClass(policy.impact)}`}>
                        {policy.impact === 'unknown' ? '' : policy.impact}
                      </span>
                      <InfoTooltip 
                        description={metricDescriptions.impact[policy.impact as keyof typeof metricDescriptions.impact]}
                        isOpen={openTooltip === `impact-${index}`}
                        onClick={() => toggleTooltip(`impact-${index}`)}
                      />
                    </div>
                  </div>
                  <div className="text-sm text-gray-400">
                    Last change: {getLastChangeDate(policy.recentChanges)}
                    {isRecentlyChanged(policy.recentChanges) && (
                      <span className="ml-2 text-red-600 font-semibold">Updated this week</span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default PolicySenseTab;