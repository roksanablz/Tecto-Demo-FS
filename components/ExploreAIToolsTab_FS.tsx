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
  Cloud,
  LucideIcon,
  Info,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Lock,
  Scale,
  Briefcase,
  Wallet,
  CreditCard,
  Banknote
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

const ExploreAITools: React.FC = () => {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [openTooltip, setOpenTooltip] = useState<string | null>(null);

  const toggleTooltip = (metric: string) => {
    if (openTooltip === metric) {
      setOpenTooltip(null);
    } else {
      setOpenTooltip(metric);
    }
  };

  const agentsList: Agent[] = [
    // Sponsored agents (Enterprise Financial Services)
    {
      id: 1,
      name: "Palantir Foundry",
      type: "Financial Analytics",
      category: "sponsored",
      subCategory: null,
      icon: BarChart2,
      compliance: 99,
      trust: 98,
      risks: ["Data Security", "Regulatory Compliance"],
      certifications: ["SOC 2", "ISO 27001", "GDPR Compliant", "PCI DSS", "FedRAMP"],
      lastAudit: "2024-03-15"
    },
    {
      id: 2,
      name: "Bloomberg AI",
      type: "Market Analysis",
      category: "sponsored",
      subCategory: null,
      icon: TrendingUp,
      compliance: 98,
      trust: 97,
      risks: ["Market Impact", "Data Accuracy"],
      certifications: ["SOC 2", "ISO 27001", "GDPR Compliant"],
      lastAudit: "2024-03-14"
    },
    {
      id: 3,
      name: "Refinitiv AI",
      type: "Financial Data",
      category: "sponsored",
      subCategory: null,
      icon: Database,
      compliance: 98,
      trust: 96,
      risks: ["Data Quality", "Real-time Processing"],
      certifications: ["SOC 2", "ISO 27001", "GDPR Compliant"],
      lastAudit: "2024-03-13"
    },
    {
      id: 4,
      name: "FactSet AI",
      type: "Portfolio Analytics",
      category: "sponsored",
      subCategory: null,
      icon: PieChart,
      compliance: 97,
      trust: 96,
      risks: ["Model Risk", "Data Accuracy"],
      certifications: ["SOC 2", "ISO 27001", "GDPR Compliant"],
      lastAudit: "2024-03-12"
    },

    // Recommended - Marketing
    {
      id: 14,
      name: "Persado",
      type: "Marketing Language AI",
      category: "recommended",
      subCategory: "marketing",
      icon: Megaphone,
      compliance: 96,
      trust: 94,
      risks: ["Content Compliance", "Brand Voice"],
      certifications: ["SOC 2", "GDPR Compliant", "ISO 27001"],
      lastAudit: "2024-03-10"
    },
    {
      id: 15,
      name: "Gong",
      type: "Sales Intelligence",
      category: "recommended",
      subCategory: "marketing",
      icon: MessageSquare,
      compliance: 97,
      trust: 95,
      risks: ["Data Privacy", "Call Recording"],
      certifications: ["SOC 2", "GDPR Compliant", "ISO 27001"],
      lastAudit: "2024-03-09"
    },
    {
      id: 16,
      name: "Drift",
      type: "Conversational Marketing",
      category: "recommended",
      subCategory: "marketing",
      icon: Bot,
      compliance: 96,
      trust: 94,
      risks: ["Response Accuracy", "Data Privacy"],
      certifications: ["SOC 2", "GDPR Compliant"],
      lastAudit: "2024-03-08"
    },
    {
      id: 17,
      name: "Seismic",
      type: "Content Intelligence",
      category: "recommended",
      subCategory: "marketing",
      icon: FileText,
      compliance: 97,
      trust: 95,
      risks: ["Content Security", "Data Privacy"],
      certifications: ["SOC 2", "ISO 27001", "GDPR Compliant"],
      lastAudit: "2024-03-07"
    },

    // Recommended - Trading & Investment
    {
      id: 18,
      name: "Kensho",
      type: "Investment Analytics",
      category: "recommended",
      subCategory: "trading",
      icon: TrendingUp,
      compliance: 97,
      trust: 96,
      risks: ["Market Impact", "Model Risk"],
      certifications: ["SOC 2", "ISO 27001", "GDPR Compliant"],
      lastAudit: "2024-03-06"
    },
    {
      id: 19,
      name: "Numerai",
      type: "Quantitative Trading",
      category: "recommended",
      subCategory: "trading",
      icon: Calculator,
      compliance: 95,
      trust: 93,
      risks: ["Model Risk", "Market Volatility"],
      certifications: ["SOC 2", "ISO 27001"],
      lastAudit: "2024-03-05"
    },
    {
      id: 20,
      name: "Alpaca AI",
      type: "Algorithmic Trading",
      category: "recommended",
      subCategory: "trading",
      icon: LineChart,
      compliance: 96,
      trust: 94,
      risks: ["Execution Risk", "Market Impact"],
      certifications: ["SOC 2", "ISO 27001"],
      lastAudit: "2024-03-04"
    },
    {
      id: 137,
      name: "Calypso",
      type: "Trading Platform",
      category: "recommended",
      subCategory: "trading",
      icon: TrendingUp,
      compliance: 98,
      trust: 96,
      risks: ["Trading Risk", "System Performance"],
      certifications: ["SOC 2", "ISO 27001", "PCI DSS"],
      lastAudit: "2024-02-15"
    },

    // Recommended - Enterprise Solutions
    {
      id: 21,
      name: "Kasisto",
      type: "Banking Assistant",
      category: "recommended",
      subCategory: "service",
      icon: Bot,
      compliance: 97,
      trust: 95,
      risks: ["Data Privacy", "Response Accuracy"],
      certifications: ["SOC 2", "GDPR Compliant", "ISO 27001"],
      lastAudit: "2024-03-03"
    },
    {
      id: 27,
      name: "Eightfold AI",
      type: "Talent Intelligence",
      category: "recommended",
      subCategory: "hr",
      icon: Users,
      compliance: 96,
      trust: 94,
      risks: ["Bias Detection", "Data Privacy"],
      certifications: ["SOC 2", "GDPR Compliant", "ISO 27001"],
      lastAudit: "2024-03-12"
    },
    {
      id: 30,
      name: "UiPath",
      type: "Process Automation",
      category: "recommended",
      subCategory: "automation",
      icon: Workflow,
      compliance: 98,
      trust: 96,
      risks: ["Process Accuracy", "System Integration"],
      certifications: ["SOC 2", "ISO 27001", "GDPR Compliant"],
      lastAudit: "2024-03-09"
    },
    {
      id: 133,
      name: "Thought Machine",
      type: "Core Banking",
      category: "recommended",
      subCategory: "automation",
      icon: Banknote,
      compliance: 99,
      trust: 97,
      risks: ["System Integration", "Data Migration"],
      certifications: ["SOC 2", "ISO 27001", "PCI DSS"],
      lastAudit: "2024-02-19"
    },

    // Explore More section - Emerging FS AI Tools
    {
      id: 123,
      name: "Trovata",
      type: "Cash Management",
      category: "explore",
      subCategory: null,
      icon: Wallet,
      compliance: 95,
      trust: 93,
      risks: ["Data Security", "Integration"],
      certifications: ["SOC 2", "ISO 27001"],
      lastAudit: "2024-02-29"
    },
    {
      id: 124,
      name: "Plaid",
      type: "Financial Data API",
      category: "explore",
      subCategory: null,
      icon: Database,
      compliance: 97,
      trust: 95,
      risks: ["Data Privacy", "API Security"],
      certifications: ["SOC 2", "GDPR Compliant", "ISO 27001"],
      lastAudit: "2024-02-28"
    },
    {
      id: 125,
      name: "Stripe Radar",
      type: "Payment Fraud",
      category: "explore",
      subCategory: null,
      icon: CreditCard,
      compliance: 98,
      trust: 96,
      risks: ["False Positives", "Payment Security"],
      certifications: ["SOC 2", "PCI DSS", "ISO 27001"],
      lastAudit: "2024-02-27"
    },
    {
      id: 126,
      name: "Chainalysis",
      type: "Crypto Analytics",
      category: "explore",
      subCategory: null,
      icon: Banknote,
      compliance: 96,
      trust: 94,
      risks: ["Crypto Volatility", "Regulatory Changes"],
      certifications: ["SOC 2", "ISO 27001"],
      lastAudit: "2024-02-26"
    },
    {
      id: 127,
      name: "Addepar",
      type: "Wealth Management",
      category: "explore",
      subCategory: null,
      icon: Briefcase,
      compliance: 97,
      trust: 95,
      risks: ["Data Privacy", "Portfolio Risk"],
      certifications: ["SOC 2", "GDPR Compliant", "ISO 27001"],
      lastAudit: "2024-02-25"
    },
    {
      id: 128,
      name: "AlphaSense",
      type: "Market Intelligence",
      category: "explore",
      subCategory: null,
      icon: Search,
      compliance: 96,
      trust: 94,
      risks: ["Data Accuracy", "Information Security"],
      certifications: ["SOC 2", "ISO 27001"],
      lastAudit: "2024-02-24"
    },
    {
      id: 129,
      name: "Behavox",
      type: "Conduct Risk",
      category: "explore",
      subCategory: null,
      icon: AlertTriangle,
      compliance: 97,
      trust: 95,
      risks: ["Privacy", "False Positives"],
      certifications: ["SOC 2", "GDPR Compliant", "ISO 27001"],
      lastAudit: "2024-02-23"
    },
    {
      id: 130,
      name: "Dataminr",
      type: "Risk Intelligence",
      category: "explore",
      subCategory: null,
      icon: AlertTriangle,
      compliance: 96,
      trust: 94,
      risks: ["Data Quality", "False Alerts"],
      certifications: ["SOC 2", "ISO 27001"],
      lastAudit: "2024-02-22"
    },
    {
      id: 131,
      name: "Mambu",
      type: "Cloud Banking",
      category: "explore",
      subCategory: null,
      icon: Cloud,
      compliance: 98,
      trust: 96,
      risks: ["Cloud Security", "System Availability"],
      certifications: ["SOC 2", "ISO 27001", "PCI DSS"],
      lastAudit: "2024-02-21"
    },
    {
      id: 132,
      name: "Fenergo",
      type: "Client Lifecycle",
      category: "explore",
      subCategory: null,
      icon: Users,
      compliance: 97,
      trust: 95,
      risks: ["Data Privacy", "Regulatory Compliance"],
      certifications: ["SOC 2", "ISO 27001", "GDPR Compliant"],
      lastAudit: "2024-02-20"
    },
    {
      id: 134,
      name: "Temenos",
      type: "Banking Platform",
      category: "explore",
      subCategory: null,
      icon: Building2,
      compliance: 99,
      trust: 97,
      risks: ["System Integration", "Data Security"],
      certifications: ["SOC 2", "ISO 27001", "PCI DSS"],
      lastAudit: "2024-02-18"
    },
    {
      id: 135,
      name: "Personetics",
      type: "Financial Guidance",
      category: "explore",
      subCategory: null,
      icon: Brain,
      compliance: 96,
      trust: 94,
      risks: ["Advice Accuracy", "Data Privacy"],
      certifications: ["SOC 2", "GDPR Compliant", "ISO 27001"],
      lastAudit: "2024-02-17"
    },
    {
      id: 136,
      name: "Clinc",
      type: "Voice Banking",
      category: "explore",
      subCategory: null,
      icon: MessageSquare,
      compliance: 95,
      trust: 93,
      risks: ["Voice Recognition", "Security"],
      certifications: ["SOC 2", "ISO 27001"],
      lastAudit: "2024-02-16"
    },
    {
      id: 138,
      name: "Pymetrics",
      type: "Recruitment AI",
      category: "explore",
      subCategory: null,
      icon: Brain,
      compliance: 96,
      trust: 94,
      risks: ["Algorithm Bias", "Data Privacy"],
      certifications: ["SOC 2", "GDPR Compliant", "ISO 27001"],
      lastAudit: "2024-02-14"
    },
    {
      id: 139,
      name: "Workday AI",
      type: "HR Analytics",
      category: "explore",
      subCategory: null,
      icon: GanttChart,
      compliance: 98,
      trust: 96,
      risks: ["Data Security", "Model Accuracy"],
      certifications: ["SOC 2", "ISO 27001", "GDPR Compliant"],
      lastAudit: "2024-02-13"
    },
    {
      id: 140,
      name: "Automation Anywhere",
      type: "RPA Platform",
      category: "explore",
      subCategory: null,
      icon: Settings,
      compliance: 97,
      trust: 95,
      risks: ["Process Security", "System Stability"],
      certifications: ["SOC 2", "ISO 27001", "GDPR Compliant"],
      lastAudit: "2024-02-12"
    },
    {
      id: 141,
      name: "Blue Prism",
      type: "Intelligent Automation",
      category: "explore",
      subCategory: null,
      icon: Factory,
      compliance: 98,
      trust: 96,
      risks: ["Process Accuracy", "System Integration"],
      certifications: ["SOC 2", "ISO 27001", "GDPR Compliant"],
      lastAudit: "2024-02-11"
    }
  ];

  const filterAgents = (agents: Agent[]) => {
    if (!searchQuery) return agents;
    return agents.filter(agent => 
      agent.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.subCategory?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

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
              <IconComponent className={`w-10 h-10 ${agent.category === 'explore' ? 'text-gray-300' : 'text-blue-500'}`} />
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
      {/* Search Bar */}
      <div className="relative">
        <div className="relative max-w-xl mx-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search Financial Services AI tools ..."
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
            <InfoTooltip 
              description="Curated selection of AI tools that meet our high standards for security, compliance, and performance in financial services. These tools are also tailored to your specific needs and preferences."
              isOpen={openTooltip === 'recommended'}
              onClick={() => toggleTooltip('recommended')}
            />
          </h2>
          
          {/* Marketing Subcategory */}
          <div className="space-y-4">
            <h3 className="text-md font-medium text-gray-600 ml-4">Marketing</h3>
            <div className="grid grid-cols-4 gap-4">
              {filterAgents(agentsList.filter(agent => agent.subCategory === 'marketing')).map(renderAgentCard)}
            </div>
          </div>

          {/* Trading & Investment Subcategory */}
          <div className="space-y-4">
            <h3 className="text-md font-medium text-gray-600 ml-4">Trading & Investment</h3>
            <div className="grid grid-cols-4 gap-4">
              {filterAgents(agentsList.filter(agent => agent.subCategory === 'trading')).map(renderAgentCard)}
            </div>
          </div>

          {/* Enterprise Solutions Subcategory */}
          <div className="space-y-4">
            <h3 className="text-md font-medium text-gray-600 ml-4">Enterprise Solutions</h3>
            <div className="grid grid-cols-4 gap-4">
              {filterAgents(agentsList.filter(agent => 
                agent.subCategory === 'service' || 
                agent.subCategory === 'hr' || 
                agent.subCategory === 'automation'
              )).map(renderAgentCard)}
            </div>
          </div>
        </div>

        {/* Explore More Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-700 flex items-center">
            <Bot className="w-5 h-5 text-blue-500 mr-2" />
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