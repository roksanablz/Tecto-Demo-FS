import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { 
  Shield, 
  Bot, 
  Star, 
  X,
  BarChart2,
  PieChart,
  LineChart,
  LayoutDashboard,
  ShoppingCart,
  Truck,
  PackageSearch,
  Megaphone,
  Mail,
  PenTool,
  Factory,
  Settings,
  Clock,
  Brain,
  FileText,
  Users,
  Code,
  Database,
  Building2,
  Calculator,
  Ruler,
  Image,
  MessageSquare,
  GanttChart,
  Workflow,
  Search,
  LucideIcon
} from 'lucide-react';

// Define the Agent type for type safety
interface Agent {
  id: number;
  name: string;
  type: string;
  category: string;
  subCategory: string | null;
  icon: LucideIcon;
  compliance: number;
  trust: number;
  risks: string[];
  certifications: string[];
  lastAudit: string;
}

const ExploreAITools: React.FC = () => {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const generateAgent = (
    id: number, 
    name: string, 
    type: string, 
    category: string, 
    subCategory: string | null, 
    icon: LucideIcon
  ): Agent => ({
    id,
    name,
    type,
    category,
    subCategory,
    icon,
    compliance: 85 + Math.floor(Math.random() * 12),
    trust: 82 + Math.floor(Math.random() * 13),
    risks: [
      ["Data Privacy", "Output Accuracy", "Model Bias", "Security"][Math.floor(Math.random() * 4)],
      ["Dependencies", "Integration", "Performance", "Reliability"][Math.floor(Math.random() * 4)]
    ],
    certifications: [
      ["ISO 27001", "GDPR Compliant", "SOC 2", "HIPAA Compliant"][Math.floor(Math.random() * 4)],
      ["AI Ethics Certified", "Content Safety", "ML Ops Certified", "Data Quality"][Math.floor(Math.random() * 4)]
    ],
    lastAudit: "2024-12-" + (Math.floor(Math.random() * 28) + 1).toString().padStart(2, '0')
  });

  const filterAgents = (agents: Agent[]) => {
    if (!searchQuery) return agents;
    return agents.filter(agent => 
      agent.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.subCategory?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const agentsList: Agent[] = [
    // Explore More agents
    generateAgent(101, "IntelliDoc AI", "Document Analysis", "explore", null, FileText),
    generateAgent(102, "HR Assistant Pro", "Human Resources", "explore", null, Users),
    generateAgent(103, "CodeAssist AI", "Development", "explore", null, Code),
    generateAgent(104, "DataSage", "Data Analysis", "explore", null, Database),
    generateAgent(105, "RealtyAI", "Real Estate", "explore", null, Building2),
    generateAgent(106, "FinanceGenius", "Financial Analysis", "explore", null, Calculator),
    generateAgent(107, "DesignMind", "Design", "explore", null, Ruler),
    generateAgent(108, "ImageMaster", "Image Processing", "explore", null, Image),
    generateAgent(109, "ChatExpert", "Customer Service", "explore", null, MessageSquare),
    generateAgent(110, "ProjectPro AI", "Project Management", "explore", null, GanttChart),
    generateAgent(111, "ProcessFlow AI", "Process Automation", "explore", null, Workflow),
    generateAgent(112, "BrainBoost ML", "Machine Learning", "explore", null, Brain),

    // Sponsored agents with unique icons
    generateAgent(1, "MarketInsight AI", "Analytics", "sponsored", null, BarChart2),
    generateAgent(2, "PredictivePro", "Forecasting", "sponsored", null, LineChart),
    generateAgent(3, "DataViz Elite", "Visualization", "sponsored", null, PieChart),
    generateAgent(4, "OptiFlow AI", "Optimization", "sponsored", null, LayoutDashboard),
    
    // Marketing tools
    generateAgent(5, "CampaignGenius", "Marketing", "recommended", "marketing", Megaphone),
    generateAgent(6, "EmailMaster AI", "Marketing", "recommended", "marketing", Mail),
    generateAgent(7, "CreativeEngine", "Marketing", "recommended", "marketing", PenTool),
    
    // Operations tools
    generateAgent(8, "ProcessOptimizer", "Operations", "recommended", "operations", Factory),
    generateAgent(9, "WorkflowAI", "Operations", "recommended", "operations", Settings),
    generateAgent(10, "TimeManageAI", "Operations", "recommended", "operations", Clock),
    
    // Supply Chain tools
    generateAgent(11, "SupplyChainGenius", "Supply Chain", "recommended", "supply_chain", Truck),
    generateAgent(12, "InventoryAI", "Supply Chain", "recommended", "supply_chain", PackageSearch),
    generateAgent(13, "ProcurementPro", "Supply Chain", "recommended", "supply_chain", ShoppingCart)
  ];

  const renderAgentCard = (agent: Agent) => {
    const IconComponent = agent.icon;
    return (
      <div key={agent.id} className="relative">
        <div
          className={`cursor-pointer transition-all duration-300 ${
            selectedAgent?.id === agent.id ? 'scale-105 z-10' : 'hover:scale-105'
          }`}
          onClick={() => setSelectedAgent(selectedAgent?.id === agent.id ? null : agent)}
        >
          <div className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center">
            <div className="relative w-16 h-16 mb-2 flex items-center justify-center">
              <IconComponent className="w-10 h-10 text-blue-500" />
            </div>
            <span className="text-sm font-medium text-center">{agent.name}</span>
          </div>
        </div>

        {selectedAgent?.id === agent.id && (
          <div className="absolute top-0 left-0 w-72 bg-white rounded-lg shadow-xl z-20 p-4">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-bold">{agent.name}</h3>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedAgent(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Type: {agent.type}</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Compliance Score</span>
                  <span className="text-sm font-bold text-green-600">{agent.compliance}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Trust Score</span>
                  <span className="text-sm font-bold text-blue-600">{agent.trust}%</span>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Risk Factors:</h4>
                <div className="flex flex-wrap gap-2">
                  {agent.risks.map((risk, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs"
                    >
                      {risk}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Certifications:</h4>
                <div className="flex flex-wrap gap-2">
                  {agent.certifications.map((cert, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs"
                    >
                      {cert}
                    </span>
                  ))}
                </div>
              </div>

              <div className="text-xs text-gray-500">
                Last Audited: {agent.lastAudit}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Explore AI Tools</h1>
        <p className="text-gray-500">Discover and evaluate safe AI tools for maximum ROI</p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <div className="relative max-w-xl mx-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search AI tools by category (e.g., Marketing, Analytics, Supply Chain)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 py-6"
          />
        </div>
      </div>

      <div className="space-y-8">
        {/* Sponsored Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-700 flex items-center">
            <Star className="w-5 h-5 text-yellow-400 mr-2" />
            Sponsored
          </h2>
          <div className="grid grid-cols-4 gap-4">
            {filterAgents(agentsList.filter(agent => agent.category === 'sponsored')).map(renderAgentCard)}
          </div>
        </div>

        {/* Recommended Section with subcategories */}
        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-gray-700 flex items-center">
            <Shield className="w-5 h-5 text-blue-500 mr-2" />
            Recommended
          </h2>
          
          {/* Marketing Subcategory */}
          <div className="space-y-4">
            <h3 className="text-md font-medium text-gray-600 ml-4">Marketing</h3>
            <div className="grid grid-cols-4 gap-4">
              {filterAgents(agentsList.filter(agent => agent.subCategory === 'marketing')).map(renderAgentCard)}
            </div>
          </div>

          {/* Operations Subcategory */}
          <div className="space-y-4">
            <h3 className="text-md font-medium text-gray-600 ml-4">Operations</h3>
            <div className="grid grid-cols-4 gap-4">
              {filterAgents(agentsList.filter(agent => agent.subCategory === 'operations')).map(renderAgentCard)}
            </div>
          </div>

          {/* Supply Chain Subcategory */}
          <div className="space-y-4">
            <h3 className="text-md font-medium text-gray-600 ml-4">Supply Chain</h3>
            <div className="grid grid-cols-4 gap-4">
              {filterAgents(agentsList.filter(agent => agent.subCategory === 'supply_chain')).map(renderAgentCard)}
            </div>
          </div>
        </div>

        {/* Explore More Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-700 flex items-center">
            <Bot className="w-5 h-5 text-gray-500 mr-2" />
            Explore More
          </h2>
          <div className="grid grid-cols-4 gap-4">
            {filterAgents(agentsList.filter(agent => agent.category === 'explore')).map(renderAgentCard)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExploreAITools;