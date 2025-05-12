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
    // Sponsored agents (YC alumni highlighted) - keeping only 4
    {
      id: 1,
      name: "Anthropic",
      type: "Foundation Model",
      category: "sponsored",
      subCategory: null,
      icon: Brain,
      compliance: 95,
      trust: 92,
      risks: ["Model Safety", "Alignment"],
      certifications: ["AI Safety Certified", "SOC 2"],
      lastAudit: "2024-03-15"
    },
    {
      id: 2,
      name: "Stability AI",
      type: "Image Generation",
      category: "sponsored",
      subCategory: null,
      icon: Image,
      compliance: 88,
      trust: 85,
      risks: ["Content Safety", "Copyright"],
      certifications: ["Content Safety", "Fair Use"],
      lastAudit: "2024-02-28"
    },
    {
      id: 3,
      name: "Replit",
      type: "Cloud IDE",
      category: "sponsored",
      subCategory: null,
      icon: Code,
      compliance: 93,
      trust: 90,
      risks: ["Security", "Performance"],
      certifications: ["SOC 2", "ISO 27001"],
      lastAudit: "2024-03-01"
    },
    {
      id: 4,
      name: "Character.ai",
      type: "Conversational AI",
      category: "sponsored",
      subCategory: null,
      icon: MessageSquare,
      compliance: 89,
      trust: 87,
      risks: ["Content Safety", "User Privacy"],
      certifications: ["Content Safety", "GDPR Compliant"],
      lastAudit: "2024-02-15"
    },

    // Recommended - AI Development Tools
    {
      id: 14,
      name: "Vercel",
      type: "Deployment Platform",
      category: "recommended",
      subCategory: "development",
      icon: Code,
      compliance: 96,
      trust: 94,
      risks: ["Infrastructure", "Security"],
      certifications: ["SOC 2", "ISO 27001"],
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
      risks: ["Model Safety", "Data Privacy"],
      certifications: ["AI Safety", "GDPR Compliant"],
      lastAudit: "2024-02-20"
    },
    {
      id: 16,
      name: "LangChain",
      type: "LLM Framework",
      category: "recommended",
      subCategory: "development",
      icon: Workflow,
      compliance: 90,
      trust: 88,
      risks: ["Dependencies", "Security"],
      certifications: ["Open Source", "Security Audit"],
      lastAudit: "2024-02-25"
    },
    {
      id: 17,
      name: "Cursor",
      type: "AI Code Editor",
      category: "recommended",
      subCategory: "development",
      icon: Code,
      compliance: 92,
      trust: 91,
      risks: ["Code Security", "Performance"],
      certifications: ["SOC 2", "Security Audit"],
      lastAudit: "2024-03-05"
    },

    // Recommended - AI Research & Data
    {
      id: 18,
      name: "Scale AI",
      type: "Data Labeling",
      category: "recommended",
      subCategory: "research",
      icon: Database,
      compliance: 94,
      trust: 93,
      risks: ["Data Quality", "Privacy"],
      certifications: ["SOC 2", "GDPR Compliant"],
      lastAudit: "2024-03-01"
    },
    {
      id: 19,
      name: "Weights & Biases",
      type: "ML Experimentation",
      category: "recommended",
      subCategory: "research",
      icon: LineChart,
      compliance: 93,
      trust: 92,
      risks: ["Data Security", "Performance"],
      certifications: ["SOC 2", "ISO 27001"],
      lastAudit: "2024-02-28"
    },
    {
      id: 20,
      name: "Determined AI",
      type: "ML Training",
      category: "recommended",
      subCategory: "research",
      icon: Brain,
      compliance: 91,
      trust: 90,
      risks: ["Resource Usage", "Security"],
      certifications: ["SOC 2", "Security Audit"],
      lastAudit: "2024-02-15"
    },
    {
      id: 21,
      name: "Gradient",
      type: "ML Infrastructure",
      category: "recommended",
      subCategory: "research",
      icon: Cloud,
      compliance: 92,
      trust: 91,
      risks: ["Infrastructure", "Security"],
      certifications: ["SOC 2", "ISO 27001"],
      lastAudit: "2024-03-01"
    },

    // Recommended - AI Business Tools
    {
      id: 22,
      name: "Notion AI",
      type: "Productivity",
      category: "recommended",
      subCategory: "business",
      icon: FileText,
      compliance: 95,
      trust: 94,
      risks: ["Data Privacy", "Security"],
      certifications: ["SOC 2", "GDPR Compliant"],
      lastAudit: "2024-03-10"
    },
    {
      id: 23,
      name: "Tome",
      type: "Presentation AI",
      category: "recommended",
      subCategory: "business",
      icon: FileText,
      compliance: 90,
      trust: 89,
      risks: ["Content Safety", "Privacy"],
      certifications: ["Content Safety", "GDPR Compliant"],
      lastAudit: "2024-02-20"
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
    {
      id: 25,
      name: "Runway",
      type: "Video Editing",
      category: "recommended",
      subCategory: "business",
      icon: Image,
      compliance: 91,
      trust: 90,
      risks: ["Content Safety", "Performance"],
      certifications: ["Content Safety", "SOC 2"],
      lastAudit: "2024-03-01"
    },

    // Explore More section
    {
      id: 100,
      name: "Rewind",
      type: "Personal Memory",
      category: "explore",
      subCategory: null,
      icon: Clock,
      compliance: 91,
      trust: 86,
      risks: ["Data Privacy", "Security"],
      certifications: ["GDPR Compliant", "ISO 27001"],
      lastAudit: "2024-12-11"
    },
    {
      id: 101,
      name: "Humata",
      type: "Document Q&A",
      category: "explore",
      subCategory: null,
      icon: FileText,
      compliance: 91,
      trust: 88,
      risks: ["Output Accuracy", "Model Bias"],
      certifications: ["SOC 2", "Data Quality"],
      lastAudit: "2024-12-24"
    },
    {
      id: 102,
      name: "Magic.dev",
      type: "Code Generation",
      category: "explore",
      subCategory: null,
      icon: Code,
      compliance: 94,
      trust: 87,
      risks: ["Model Bias", "Performance"],
      certifications: ["ML Ops Certified", "ISO 27001"],
      lastAudit: "2024-12-23"
    },
    {
      id: 103,
      name: "Dust.tt",
      type: "AI Agent Builder",
      category: "explore",
      subCategory: null,
      icon: Bot,
      compliance: 92,
      trust: 92,
      risks: ["Security", "Integration"],
      certifications: ["SOC 2", "Content Safety"],
      lastAudit: "2024-12-10"
    },
    {
      id: 104,
      name: "Vellum.ai",
      type: "LLM Ops",
      category: "explore",
      subCategory: null,
      icon: Workflow,
      compliance: 87,
      trust: 83,
      risks: ["Dependencies", "Performance"],
      certifications: ["ISO 27001", "ML Ops Certified"],
      lastAudit: "2024-12-17"
    },
    {
      id: 105,
      name: "Regie.ai",
      type: "Sales Enablement",
      category: "explore",
      subCategory: null,
      icon: Megaphone,
      compliance: 95,
      trust: 86,
      risks: ["Output Accuracy", "Reliability"],
      certifications: ["GDPR Compliant", "Content Safety"],
      lastAudit: "2024-12-26"
    },
    {
      id: 106,
      name: "Spellbrush",
      type: "Game Asset Generation",
      category: "explore",
      subCategory: null,
      icon: Image,
      compliance: 86,
      trust: 84,
      risks: ["Model Bias", "Data Privacy"],
      certifications: ["AI Ethics Certified", "Data Quality"],
      lastAudit: "2024-12-01"
    },
    {
      id: 107,
      name: "Jasper",
      type: "Content Creation",
      category: "explore",
      subCategory: null,
      icon: PenTool,
      compliance: 97,
      trust: 80,
      risks: ["Output Accuracy", "Dependencies"],
      certifications: ["GDPR Compliant", "ISO 27001"],
      lastAudit: "2024-12-28"
    },
    {
      id: 108,
      name: "Writer",
      type: "Enterprise Writing",
      category: "explore",
      subCategory: null,
      icon: FileText,
      compliance: 89,
      trust: 93,
      risks: ["Model Bias", "Integration"],
      certifications: ["SOC 2", "AI Ethics Certified"],
      lastAudit: "2024-12-02"
    },
    {
      id: 109,
      name: "OpenAI",
      type: "Foundation Model",
      category: "explore",
      subCategory: null,
      icon: Brain,
      compliance: 94,
      trust: 82,
      risks: ["Model Bias", "Security"],
      certifications: ["ISO 27001", "Content Safety"],
      lastAudit: "2024-12-19"
    },
    {
      id: 110,
      name: "Scale AI",
      type: "Data Labeling",
      category: "explore",
      subCategory: null,
      icon: Database,
      compliance: 91,
      trust: 87,
      risks: ["Data Privacy", "Performance"],
      certifications: ["GDPR Compliant", "Data Quality"],
      lastAudit: "2024-12-24"
    },
    {
      id: 111,
      name: "Synthesia",
      type: "AI Video",
      category: "explore",
      subCategory: null,
      icon: Image,
      compliance: 91,
      trust: 90,
      risks: ["Output Accuracy", "Content Misuse"],
      certifications: ["AI Ethics Certified", "Content Safety"],
      lastAudit: "2024-12-06"
    },
    // Additional explore apps
    {
      id: 5,
      name: "Descript",
      type: "Audio/Video Editing",
      category: "explore",
      subCategory: null,
      icon: Image,
      compliance: 89,
      trust: 88,
      risks: ["Content Safety", "Performance"],
      certifications: ["Content Safety", "SOC 2"],
      lastAudit: "2024-02-15"
    },
    {
      id: 6,
      name: "Midjourney",
      type: "Image Generation",
      category: "explore",
      subCategory: null,
      icon: Image,
      compliance: 87,
      trust: 86,
      risks: ["Content Safety", "Copyright"],
      certifications: ["Content Safety", "Fair Use"],
      lastAudit: "2024-02-20"
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