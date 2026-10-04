import React from 'react';
import { Layers, Server, Cpu, Cloud, Database, Activity, Lock, ArrowDown, ArrowRight } from 'lucide-react';

export const AwsArchitecturePage: React.FC = () => {
  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 space-y-2">
        <div className="flex items-center space-x-2 text-amber-400 font-bold text-xs">
          <Layers className="w-5 h-5" />
          <span>ENTERPRISE AWS HYBRID ARCHITECTURE</span>
        </div>
        <h1 className="text-2xl font-semibold text-slate-100">AWS Outposts & Cloud Infrastructure Map</h1>
        <p className="text-xs text-slate-400 max-w-3xl">
          Complete end-to-end data flow topology from on-premises plant sensors to AWS Outposts EC2 instances and AWS Region Cloud Services.
        </p>
      </div>

      {/* Visual Flowchart Diagram */}
      <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 space-y-8">
        <h2 className="text-base font-bold text-slate-100 text-center">
          End-to-End Low-Latency Pipeline & AWS Cloud Integration
        </h2>

        {/* Diagram Nodes Sequence */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 relative">
          
          {/* Node 1: Plant Sensors */}
          <div className="w-full lg:w-1/5 bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-center shadow-sm">
            <div className="p-2.5 bg-slate-900 text-cyan-400 rounded-lg w-10 h-10 mx-auto flex items-center justify-center font-bold">
              <Server className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-xs text-slate-100">1. Plant Sensors</h3>
            <p className="text-[10px] text-slate-400">PROFINET / OPC-UA Signals (Temp, Pressure, Vib)</p>
          </div>

          <ArrowRight className="w-5 h-5 text-slate-600 hidden lg:block" />
          <ArrowDown className="w-5 h-5 text-slate-600 lg:hidden" />

          {/* Node 2: Local Edge Gateway */}
          <div className="w-full lg:w-1/5 bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-center shadow-sm">
            <div className="p-2.5 bg-slate-900 text-cyan-400 rounded-lg w-10 h-10 mx-auto flex items-center justify-center font-bold">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-xs text-slate-100">2. Local Gateway</h3>
            <p className="text-[10px] text-slate-400">Industrial Ethernet Ingestion Layer</p>
          </div>

          <ArrowRight className="w-5 h-5 text-slate-600 hidden lg:block" />
          <ArrowDown className="w-5 h-5 text-slate-600 lg:hidden" />

          {/* Node 3: AWS Outposts Rack */}
          <div className="w-full lg:w-1/5 bg-slate-900 p-4 rounded-xl border border-cyan-500/50 space-y-2 text-center shadow-sm">
            <div className="p-2.5 bg-cyan-500 text-slate-950 rounded-lg w-10 h-10 mx-auto flex items-center justify-center font-bold">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-xs text-cyan-400">3. AWS Outposts Rack</h3>
            <p className="text-[10px] text-slate-300 font-bold">Local EC2 + VPC (&lt; 5ms)</p>
            <span className="inline-block bg-cyan-500/20 text-cyan-300 text-[9px] px-2 py-0.5 rounded font-mono">
              Local Rules Engine
            </span>
          </div>

          <ArrowRight className="w-5 h-5 text-slate-600 hidden lg:block" />
          <ArrowDown className="w-5 h-5 text-slate-600 lg:hidden" />

          {/* Node 4: AWS Region Cloud */}
          <div className="w-full lg:w-1/5 bg-slate-900 p-4 rounded-xl border border-amber-500/40 space-y-2 text-center shadow-sm">
            <div className="p-2.5 bg-amber-500 text-slate-950 rounded-lg w-10 h-10 mx-auto flex items-center justify-center font-bold">
              <Cloud className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-xs text-amber-400">4. AWS Region Cloud</h3>
            <p className="text-[10px] text-slate-300">Amazon S3 + CloudWatch</p>
            <span className="inline-block bg-amber-500/20 text-amber-300 text-[9px] px-2 py-0.5 rounded font-mono">
              Batch Telemetry Storage
            </span>
          </div>

        </div>
      </div>

      {/* AWS Component Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Outposts */}
        <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-2">
          <div className="flex items-center space-x-2 text-cyan-400 font-bold text-xs">
            <Cpu className="w-4 h-4" />
            <span>AWS Outposts</span>
          </div>
          <h3 className="font-bold text-sm text-slate-100">Fully Managed Infrastructure</h3>
          <p className="text-xs text-slate-400">
            Extends AWS infrastructure, services, APIs, and tools to virtually any data center or on-premises facility.
          </p>
        </div>

        {/* EC2 */}
        <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-2">
          <div className="flex items-center space-x-2 text-orange-400 font-bold text-xs">
            <Server className="w-4 h-4" />
            <span>Amazon EC2 on Outposts</span>
          </div>
          <h3 className="font-bold text-sm text-slate-100">Local Compute Instance</h3>
          <p className="text-xs text-slate-400">
            Runs local microservices, telemetry ingestion containers, and local rule evaluation algorithms.
          </p>
        </div>

        {/* S3 */}
        <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-2">
          <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs">
            <Database className="w-4 h-4" />
            <span>Amazon S3 on Outposts & Cloud</span>
          </div>
          <h3 className="font-bold text-sm text-slate-100">Object Storage Layer</h3>
          <p className="text-xs text-slate-400">
            Stores high-volume raw sensor telemetry archives locally and syncs long-term backups to AWS Region.
          </p>
        </div>

        {/* CloudWatch */}
        <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-2">
          <div className="flex items-center space-x-2 text-purple-400 font-bold text-xs">
            <Activity className="w-4 h-4" />
            <span>Amazon CloudWatch</span>
          </div>
          <h3 className="font-bold text-sm text-slate-100">Metrics & Alarm Monitoring</h3>
          <p className="text-xs text-slate-400">
            Provides observability dashboards, automated alarm triggers, and historical trend retention.
          </p>
        </div>

        {/* Amazon VPC */}
        <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-2">
          <div className="flex items-center space-x-2 text-cyan-400 font-bold text-xs">
            <Layers className="w-4 h-4" />
            <span>Amazon VPC (Subnets)</span>
          </div>
          <h3 className="font-bold text-sm text-slate-100">Virtual Private Cloud</h3>
          <p className="text-xs text-slate-400">
            Seamlessly extends the plant's cloud VPC to local Outposts subnets with seamless local gateway routing.
          </p>
        </div>

        {/* AWS IAM */}
        <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-2">
          <div className="flex items-center space-x-2 text-amber-400 font-bold text-xs">
            <Lock className="w-4 h-4" />
            <span>AWS IAM & Security</span>
          </div>
          <h3 className="font-bold text-sm text-slate-100">Identity & Access Management</h3>
          <p className="text-xs text-slate-400">
            Enforces strict role-based access control and hardware-based encryption for edge-to-cloud telemetry.
          </p>
        </div>

      </div>

    </div>
  );
};
