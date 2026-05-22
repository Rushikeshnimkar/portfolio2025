import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCode, FaGithub, FaRoad, FaCogs, FaClipboardList, FaUserCheck, FaChevronRight } from "react-icons/fa";
import { MdOutlinePayments, MdDashboard, MdAirlineSeatReclineExtra } from "react-icons/md";
import { BsCheckCircleFill } from "react-icons/bs";

export interface WorkflowStep {
  step: number;
  title: string;
  desc: string;
}

export interface FleetManagementProject {
  title: string;
  description: string;
  technologies: string[];
  link: string;
  hubs: string;
  overview: string;
  bookingFlow: WorkflowStep[];
  staffWorkflow: WorkflowStep[];
  adminWorkflow: WorkflowStep[];
}

interface FleetManagementCardProps {
  data: FleetManagementProject[];
}

type TabType = "overview" | "workflows" | "specs";
type WorkflowType = "booking" | "staff" | "admin";

export const FleetManagementCard: React.FC<FleetManagementCardProps> = ({ data }) => {
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [activeWorkflow, setActiveWorkflow] = useState<WorkflowType>("booking");

  const project = data[0];
  if (!project) return null;

  const workflows = {
    booking: {
      title: "Customer Booking Flow",
      icon: <MdAirlineSeatReclineExtra className="w-5 h-5 text-indigo-400" />,
      steps: project.bookingFlow,
    },
    staff: {
      title: "Staff Hub Handover",
      icon: <FaUserCheck className="w-5 h-5 text-emerald-400" />,
      steps: project.staffWorkflow,
    },
    admin: {
      title: "Admin Dashboard Control",
      icon: <MdDashboard className="w-5 h-5 text-violet-400" />,
      steps: project.adminWorkflow,
    },
  };

  return (
    <div className="mt-3 w-full">
      <div 
        className="rounded-2xl p-4 sm:p-6 transition-all duration-300 relative overflow-hidden backdrop-blur-xl border border-indigo-500/20"
        style={{
          background: "rgba(12, 12, 22, 0.6)",
          boxShadow: "0 8px 32px 0 rgba(99, 102, 241, 0.05), inset 0 0 40px rgba(255, 255, 255, 0.01)",
        }}
      >
        {/* Glow Effects */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Card Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-white/5 pb-4 mb-4 gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center flex-shrink-0">
              <FaRoad className="text-indigo-400 w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-base sm:text-lg tracking-wide">{project.title}</h3>
              <span className="text-[10px] sm:text-xs text-indigo-400 font-mono tracking-widest uppercase">Signature Project • CDAC SDE-1</span>
            </div>
          </div>
          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all hover:scale-105"
            >
              <FaGithub className="w-3.5 h-3.5" />
              Source Code
            </a>
          )}
        </div>

        {/* Tabs Selectors */}
        <div className="flex bg-neutral-950/40 p-1 rounded-xl border border-white/5 mb-5 select-none">
          {(["overview", "workflows", "specs"] as TabType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 text-xs sm:text-sm rounded-lg font-medium capitalize transition-all duration-300 ${
                activeTab === tab
                  ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 shadow-lg"
                  : "text-white/40 hover:text-white/80 border border-transparent"
              }`}
            >
              {tab === "specs" ? "⚙️ Tech Specs" : tab === "workflows" ? "🔄 Workflows" : "📋 Overview"}
            </button>
          ))}
        </div>

        {/* Tab Contents */}
        <div className="min-h-[220px]">
          <AnimatePresence mode="wait">
            {activeTab === "overview" && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-normal">
                  {project.overview}
                </p>

                <div className="grid grid-cols-2 gap-3 sm:gap-4 bg-white/5 p-3 sm:p-4 rounded-xl border border-white/5">
                  <div>
                    <span className="text-[10px] sm:text-xs text-white/40 uppercase block mb-0.5">Operating Capacity</span>
                    <span className="text-xs sm:text-sm font-semibold text-indigo-300">{project.hubs}</span>
                  </div>
                  <div>
                    <span className="text-[10px] sm:text-xs text-white/40 uppercase block mb-0.5">Architecture</span>
                    <span className="text-xs sm:text-sm font-semibold text-purple-300">Layered RESTful Micro</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] sm:text-xs text-white/40 uppercase block">Engineered Tech Stack</span>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-xs font-mono text-indigo-300/90 shadow-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "workflows" && (
              <motion.div
                key="workflows"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                {/* Workflow Selectors */}
                <div className="flex flex-wrap gap-2 mb-2">
                  {(["booking", "staff", "admin"] as WorkflowType[]).map((wf) => (
                    <button
                      key={wf}
                      onClick={() => setActiveWorkflow(wf)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                        activeWorkflow === wf
                          ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-300 shadow-sm"
                          : "bg-transparent border-white/5 text-white/40 hover:text-white/80"
                      }`}
                    >
                      {wf === "booking" ? "Customer" : wf === "staff" ? "Staff" : "Admin"}
                    </button>
                  ))}
                </div>

                {/* Vertical Stepper Timeline */}
                <div className="border border-white/5 bg-neutral-950/20 rounded-xl p-4 space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    {workflows[activeWorkflow].icon}
                    <h4 className="text-xs sm:text-sm font-semibold text-white/90">{workflows[activeWorkflow].title}</h4>
                  </div>

                  <div className="relative pl-6 sm:pl-8 border-l border-white/10 ml-3 space-y-5">
                    {workflows[activeWorkflow].steps.map((step, idx) => (
                      <div key={idx} className="relative group">
                        {/* Node bullet */}
                        <div className="absolute -left-[31px] sm:-left-[39px] top-0.5 w-4 h-4 rounded-full bg-neutral-900 border-2 border-indigo-500 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                          <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                        </div>
                        
                        <div className="space-y-0.5">
                          <span className="text-[10px] font-mono text-indigo-400 block font-semibold">STEP 0{step.step}</span>
                          <h5 className="text-xs sm:text-sm font-medium text-white group-hover:text-indigo-200 transition-colors">{step.title}</h5>
                          <p className="text-[11px] sm:text-xs text-white/60 leading-relaxed font-light">{step.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "specs" && (
              <motion.div
                key="specs"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-4 text-xs sm:text-sm text-white/70 leading-relaxed font-normal"
              >
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <BsCheckCircleFill className="w-4 h-4 text-indigo-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong className="text-white">Layered Clean Architecture:</strong> Structured meticulously with a decoupled Controllers, Service Layer, Repository, and Model Entity layer for absolute code maintainability.
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <BsCheckCircleFill className="w-4 h-4 text-indigo-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong className="text-white">Normalized Relational Model:</strong> Optimized schema with 10+ relational tables incorporating Hub Locations, Multi-tier Roles, Vehicle States, Bookings, and transactional Invoices.
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <BsCheckCircleFill className="w-4 h-4 text-indigo-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong className="text-white">Secure Authorization Engine:</strong> Dual-layer authentication combining JSON Web Tokens (JWT) for custom client sessions and robust Google OAuth2 integration with Layout-based client route guards.
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <BsCheckCircleFill className="w-4 h-4 text-indigo-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong className="text-white">Enterprise Highlights:</strong> Features cross-hub transfers coordination, automated dynamic cost metrics, REST API logging using AOP, and Razorpay integration.
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default FleetManagementCard;
