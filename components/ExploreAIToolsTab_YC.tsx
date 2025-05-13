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
  Info
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
    // Sponsored agents (YC alumni highlighted)
    {
      id: 1,
      name: "Stability AI",
      type: "Image Generation",
      category: "sponsored",
      subCategory: null,
      icon: Image,
      compliance: 88,
      trust: 85,
      risks: ["Content Safety", "Copyright"],
      certifications: ["SOC 2"],
      lastAudit: "2024-02-28"
    },
    {
      id: 2,
      name: "Replit",
      type: "Cloud IDE",
      category: "sponsored",
      subCategory: null,
      icon: Code,
      compliance: 93,
      trust: 90,
      risks: ["Security", "Performance", "Code Quality"],
      certifications: ["SOC 2"],
      lastAudit: "2024-03-01"
    },
    {
      id: 3,
      name: "Together AI",
      type: "AI Infrastructure",
      category: "sponsored",
      subCategory: null,
      icon: Cloud,
      compliance: 93,
      trust: 90,
      risks: ["Infrastructure", "Security"],
      certifications: ["SOC 2"],
      lastAudit: "2024-03-15"
    },
    {
      id: 4,
      name: "Pinecone",
      type: "Vector Database",
      category: "sponsored",
      subCategory: null,
      icon: Database,
      compliance: 95,
      trust: 92,
      risks: ["Data Security", "Performance", "Data Quality"],
      certifications: ["SOC 2"],
      lastAudit: "2024-03-14"
    },

    // Recommended - AI Development Tools
    {
      id: 14,
      name: "Vercel",
      type: "Deployment Platform",
      category: "recommended",
      subCategory: "development",
      icon: Cloud,
      compliance: 96,
      trust: 94,
      risks: ["Infrastructure", "Security"],
      certifications: ["SOC 2", "ISO 27001", "GDPR Compliant"],
      lastAudit: "2024-03-10"
    },
    {
      id: 15,
      name: "Hugging Face",
      type: "Model Hub",
      category: "recommended",
      subCategory: "development",
      icon: Database,
      compliance: 91,
      trust: 89,
      risks: ["Model Safety", "Data Privacy", "Model Bias"],
      certifications: [],
      lastAudit: "2024-02-20"
    },
    {
      id: 16,
      name: "Cursor",
      type: "AI Code Editor",
      category: "recommended",
      subCategory: "development",
      icon: Code,
      compliance: 92,
      trust: 91,
      risks: ["Code Security"],
      certifications: ["SOC 2"],
      lastAudit: "2024-03-05"
    },
    {
      id: 17,
      name: "LangChain",
      type: "LLM Framework",
      category: "recommended",
      subCategory: "development",
      icon: Workflow,
      compliance: 90,
      trust: 88,
      risks: ["Dependencies", "Security"],
      certifications: [],
      lastAudit: "2024-02-25"
    },

    // Recommended - AI Research & Data
    {
      id: 18,
      name: "Weights & Biases",
      type: "ML Experimentation",
      category: "recommended",
      subCategory: "research",
      icon: LineChart,
      compliance: 93,
      trust: 92,
      risks: ["Data Security", "Performance"],
      certifications: ["SOC 2"],
      lastAudit: "2024-02-28"
    },
    {
      id: 19,
      name: "Cohere",
      type: "Language Models",
      category: "recommended",
      subCategory: "research",
      icon: Brain,
      compliance: 94,
      trust: 91,
      risks: ["Model Safety", "Data Privacy"],
      certifications: ["SOC 2"],
      lastAudit: "2024-03-13"
    },
    {
      id: 20,
      name: "Gradient",
      type: "ML Infrastructure",
      category: "recommended",
      subCategory: "research",
      icon: Cloud,
      compliance: 92,
      trust: 91,
      risks: ["Infrastructure"],
      certifications: ["SOC 2"],
      lastAudit: "2024-03-01"
    },

    // Recommended - AI Business Tools
    {
      id: 21,
      name: "Notion AI",
      type: "Productivity",
      category: "recommended",
      subCategory: "business",
      icon: FileText,
      compliance: 95,
      trust: 94,
      risks: ["Data Privacy", "Content Safety"],
      certifications: ["SOC 2", "GDPR Compliant"],
      lastAudit: "2024-03-10"
    },
    {
      id: 22,
      name: "Glean",
      type: "Enterprise Search",
      category: "recommended",
      subCategory: "business",
      icon: Search,
      compliance: 95,
      trust: 93,
      risks: ["Data Security", "Privacy", "Data Quality"],
      certifications: ["SOC 2"],
      lastAudit: "2024-03-01"
    },
    {
      id: 23,
      name: "Runway",
      type: "Video Editing",
      category: "recommended",
      subCategory: "business",
      icon: Image,
      compliance: 91,
      trust: 90,
      risks: ["Content Safety"],
      certifications: ["SOC 2"],
      lastAudit: "2024-03-01"
    },
    {
      id: 24,
      name: "Mem",
      type: "Knowledge Management",
      category: "recommended",
      subCategory: "business",
      icon: Database,
      compliance: 93,
      trust: 92,
      risks: ["Data Privacy", "Security"],
      certifications: ["SOC 2", "GDPR Compliant"],
      lastAudit: "2024-02-28"
    },

    // Explore More section - YC-backed AI startups
    {
      id: 123,
      name: "Luma AI",
      type: "3D Generation",
      category: "explore",
      subCategory: null,
      icon: Image,
      compliance: 92,
      trust: 89,
      risks: ["Model Accuracy", "Content Safety"],
      certifications: ["SOC 2"],
      lastAudit: "2024-03-10"
    },
    {
      id: 124,
      name: "Harvey AI",
      type: "Legal AI",
      category: "explore",
      subCategory: null,
      icon: FileText,
      compliance: 96,
      trust: 93,
      risks: ["Legal Accuracy", "Data Security"],
      certifications: ["SOC 2"],
      lastAudit: "2024-03-12"
    },
    {
      id: 125,
      name: "Cognition AI",
      type: "Code Generation",
      category: "explore",
      subCategory: null,
      icon: Code,
      compliance: 93,
      trust: 90,
      risks: ["Code Security", "Code Quality"],
      certifications: ["SOC 2"],
      lastAudit: "2024-03-08"
    },
    {
      id: 126,
      name: "Elicit",
      type: "Research Assistant",
      category: "explore",
      subCategory: null,
      icon: Search,
      compliance: 91,
      trust: 88,
      risks: ["Output Accuracy", "Data Privacy"],
      certifications: ["GDPR Compliant"],
      lastAudit: "2024-03-01"
    },
    {
      id: 127,
      name: "Mintlify",
      type: "Documentation AI",
      category: "explore",
      subCategory: null,
      icon: FileText,
      compliance: 95,
      trust: 92,
      risks: ["Content Accuracy"],
      certifications: ["SOC 2"],
      lastAudit: "2024-03-05"
    },
    {
      id: 128,
      name: "Dust",
      type: "AI Agent Platform",
      category: "explore",
      subCategory: null,
      icon: Bot,
      compliance: 94,
      trust: 91,
      risks: ["Security", "Agent Safety"],
      certifications: ["SOC 2"],
      lastAudit: "2024-03-07"
    },
    {
      id: 129,
      name: "Grit",
      type: "Code Maintenance",
      category: "explore",
      subCategory: null,
      icon: Code,
      compliance: 93,
      trust: 90,
      risks: ["Code Quality", "Security"],
      certifications: ["SOC 2"],
      lastAudit: "2024-03-03"
    },
    {
      id: 130,
      name: "Lindy AI",
      type: "AI Assistant",
      category: "explore",
      subCategory: null,
      icon: Bot,
      compliance: 92,
      trust: 89,
      risks: ["Data Privacy", "Output Accuracy"],
      certifications: ["GDPR Compliant"],
      lastAudit: "2024-03-02"
    },
    {
      id: 131,
      name: "Mintplex",
      type: "AI Content Platform",
      category: "explore",
      subCategory: null,
      icon: FileText,
      compliance: 91,
      trust: 88,
      risks: ["Content Safety", "Data Privacy"],
      certifications: ["GDPR Compliant"],
      lastAudit: "2024-03-04"
    },
    {
      id: 132,
      name: "Sweep",
      type: "Code Review",
      category: "explore",
      subCategory: null,
      icon: Code,
      compliance: 94,
      trust: 91,
      risks: ["Code Security"],
      certifications: ["SOC 2"],
      lastAudit: "2024-03-06"
    },
    {
      id: 133,
      name: "Assembly AI",
      type: "Speech Recognition",
      category: "explore",
      subCategory: null,
      icon: MessageSquare,
      compliance: 92,
      trust: 89,
      risks: ["Accuracy", "Data Privacy"],
      certifications: ["GDPR Compliant", "SOC 2"],
      lastAudit: "2024-03-12"
    },
    {
      id: 134,
      name: "Mistral AI",
      type: "Open Source LLMs",
      category: "explore",
      subCategory: null,
      icon: Brain,
      compliance: 91,
      trust: 88,
      risks: ["Model Safety", "Security"],
      certifications: [],
      lastAudit: "2024-03-11"
    },
    {
      id: 135,
      name: "Perplexity AI",
      type: "Search Engine",
      category: "explore",
      subCategory: null,
      icon: Search,
      compliance: 93,
      trust: 90,
      risks: ["Output Accuracy", "Data Privacy"],
      certifications: ["GDPR Compliant", "SOC 2"],
      lastAudit: "2024-03-10"
    },
    {
      id: 136,
      name: "Inflection AI",
      type: "Personal AI",
      category: "explore",
      subCategory: null,
      icon: Bot,
      compliance: 96,
      trust: 93,
      risks: ["Privacy", "Content Safety"],
      certifications: ["GDPR Compliant", "SOC 2"],
      lastAudit: "2024-03-09"
    },
    {
      id: 137,
      name: "Adept AI",
      type: "AI Agents",
      category: "explore",
      subCategory: null,
      icon: Bot,
      compliance: 92,
      trust: 89,
      risks: ["Agent Safety"],
      certifications: ["SOC 2"],
      lastAudit: "2024-03-08"
    },
    {
      id: 138,
      name: "Imbue",
      type: "Reasoning AI",
      category: "explore",
      subCategory: null,
      icon: Brain,
      compliance: 94,
      trust: 91,
      risks: ["Reasoning Accuracy", "Safety"],
      certifications: [],
      lastAudit: "2024-03-07"
    },
    {
      id: 139,
      name: "Contextual AI",
      type: "Enterprise AI",
      category: "explore",
      subCategory: null,
      icon: Building2,
      compliance: 95,
      trust: 92,
      risks: ["Data Security"],
      certifications: ["SOC 2"],
      lastAudit: "2024-03-06"
    },
    {
      id: 140,
      name: "Tome AI",
      type: "Presentation AI",
      category: "explore",
      subCategory: null,
      icon: FileText,
      compliance: 93,
      trust: 90,
      risks: ["Content Safety", "Data Privacy"],
      certifications: ["GDPR Compliant"],
      lastAudit: "2024-03-05"
    },
    {
      id: 141,
      name: "Mem AI",
      type: "Knowledge Management",
      category: "explore",
      subCategory: null,
      icon: Database,
      compliance: 94,
      trust: 91,
      risks: ["Data Privacy", "Security"],
      certifications: ["SOC 2", "GDPR Compliant"],
      lastAudit: "2024-03-04"
    },
    {
      id: 142,
      name: "Runway AI",
      type: "Video Generation",
      category: "explore",
      subCategory: null,
      icon: Image,
      compliance: 92,
      trust: 89,
      risks: ["Content Safety"],
      certifications: ["SOC 2"],
      lastAudit: "2024-03-03"
    },
    {
      id: 143,
      name: "Descript",
      type: "Audio/Video Editing",
      category: "explore",
      subCategory: null,
      icon: MessageSquare,
      compliance: 91,
      trust: 88,
      risks: ["Content Safety", "Data Privacy"],
      certifications: ["GDPR Compliant"],
      lastAudit: "2024-03-02"
    },
    {
      id: 144,
      name: "Loom",
      type: "Video Communication",
      category: "explore",
      subCategory: null,
      icon: MessageSquare,
      compliance: 94,
      trust: 92,
      risks: ["Content Safety", "Data Privacy"],
      certifications: ["SOC 2", "GDPR Compliant"],
      lastAudit: "2024-02-29"
    },
    {
      id: 145,
      name: "Coda",
      type: "Document Collaboration",
      category: "explore",
      subCategory: null,
      icon: FileText,
      compliance: 93,
      trust: 91,
      risks: ["Data Security"],
      certifications: ["SOC 2"],
      lastAudit: "2024-02-27"
    }
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
            placeholder="Search AI tools ..."
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
              description="Curated selection of AI tools that meet our high standards for security, compliance, and performance. These tools are also tailored to your specific needs and preferences."
              isOpen={openTooltip === 'recommended'}
              onClick={() => toggleTooltip('recommended')}
            />
          </h2>
          
          {/* Development Tools Subcategory */}
          <div className="space-y-4">
            <h3 className="text-md font-medium text-gray-600 ml-4">Development Tools</h3>
            <div className="grid grid-cols-4 gap-4">
              {filterAgents(agentsList.filter(agent => agent.subCategory === 'development')).map(renderAgentCard)}
            </div>
          </div>

          {/* Research & Data Subcategory */}
          <div className="space-y-4">
            <h3 className="text-md font-medium text-gray-600 ml-4">Research & Data</h3>
            <div className="grid grid-cols-4 gap-4">
              {filterAgents(agentsList.filter(agent => agent.subCategory === 'research')).map(renderAgentCard)}
            </div>
          </div>

          {/* Business Tools Subcategory */}
          <div className="space-y-4">
            <h3 className="text-md font-medium text-gray-600 ml-4">Business Tools</h3>
            <div className="grid grid-cols-4 gap-4">
              {filterAgents(agentsList.filter(agent => agent.subCategory === 'business')).map(renderAgentCard)}
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