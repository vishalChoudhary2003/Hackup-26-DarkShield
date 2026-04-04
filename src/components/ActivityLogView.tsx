import React, { useState, useMemo } from 'react';
import { 
  Activity, 
  Search, 
  Filter, 
  Download, 
  ShieldCheck, 
  ShieldAlert, 
  User as UserIcon, 
  Settings, 
  Key,
  Database,
  Calendar,
  Clock
} from 'lucide-react';
import { ActivityLog } from '../types';

interface ActivityLogViewProps {
  logs: ActivityLog[];
}

const ActivityLogView: React.FC<ActivityLogViewProps> = ({ logs }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  const filteredLogs = useMemo(() => {
    return logs
      .filter(log => {
        const matchesSearch = 
          log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.details.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesCategory = categoryFilter === 'all' || log.category === categoryFilter;
        const matchesRole = roleFilter === 'all' || log.userRole === roleFilter;

        return matchesSearch && matchesCategory && matchesRole;
      })
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }, [logs, searchTerm, categoryFilter, roleFilter]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'auth': return <Key className="w-4 h-4" />;
      case 'system': return <Settings className="w-4 h-4" />;
      case 'threat': return <ShieldAlert className="w-4 h-4" />;
      case 'config': return <Database className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      case 'warning': return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
      case 'error': return 'text-rose-400 bg-rose-400/10 border-rose-400/20';
      default: return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
    }
  };

  const exportLogs = () => {
    const csvContent = [
      ['Timestamp', 'User', 'Role', 'Action', 'Category', 'Status', 'Details'],
      ...filteredLogs.map(log => [
        log.timestamp.toISOString(),
        log.userName,
        log.userRole,
        log.action,
        log.category,
        log.status,
        log.details
      ])
    ].map(e => e.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `activity_logs_${new Date().toISOString()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Activity className="w-6 h-6 text-[#00FF9F]" />
            System Activity Audit Trail
          </h2>
          <p className="text-slate-400 text-sm">Comprehensive log of all administrative and analyst actions.</p>
        </div>
        
        <button 
          onClick={exportLogs}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-sm transition-colors text-white"
        >
          <Download className="w-4 h-4" />
          Export Audit Trail
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-2 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search audit trail..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900/50 border border-slate-800 rounded-lg py-2 pl-10 pr-4 text-sm text-slate-200 focus:outline-none focus:border-[#00FF9F]/50 transition-colors"
          />
        </div>

        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full bg-slate-900/50 border border-slate-800 rounded-lg py-2 pl-10 pr-4 text-sm text-slate-200 focus:outline-none focus:border-[#00FF9F]/50 appearance-none"
          >
            <option value="all">All Categories</option>
            <option value="auth">Authentication</option>
            <option value="system">System Events</option>
            <option value="threat">Threat Actions</option>
            <option value="config">Configuration</option>
          </select>
        </div>

        <div className="relative">
          <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full bg-slate-900/50 border border-slate-800 rounded-lg py-2 pl-10 pr-4 text-sm text-slate-200 focus:outline-none focus:border-[#00FF9F]/50 appearance-none"
          >
            <option value="all">All Roles</option>
            <option value="admin">Administrator</option>
            <option value="user">Analyst</option>
          </select>
        </div>
      </div>

      <div className="bg-slate-900/40 border border-slate-800 rounded-xl overflow-hidden backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-800/50 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                <th className="px-6 py-4">Timestamp</th>
                <th className="px-6 py-4">User Entity</th>
                <th className="px-6 py-4">Action Event</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/30 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-slate-200 text-sm font-medium flex items-center gap-2">
                          <Calendar className="w-3 h-3 text-slate-500" />
                          {log.timestamp.toLocaleDateString()}
                        </span>
                        <span className="text-slate-500 text-xs flex items-center gap-2">
                          <Clock className="w-3 h-3" />
                          {log.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${log.userRole === 'admin' ? 'bg-[#00FF9F]/10 text-[#00FF9F]' : 'bg-slate-700/50 text-slate-400'}`}>
                          <UserIcon className="w-4 h-4" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-slate-200 text-sm">{log.userName}</span>
                          <span className={`text-[10px] uppercase tracking-wider font-bold ${log.userRole === 'admin' ? 'text-[#00FF9F]' : 'text-slate-500'}`}>
                            {log.userRole}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-slate-200 text-sm font-medium">{log.action}</span>
                        <span className="text-slate-500 text-xs truncate max-w-xs">{log.details}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 px-2 py-1 rounded-md bg-slate-800 text-slate-300 text-xs border border-slate-700">
                        {getCategoryIcon(log.category)}
                        <span className="capitalize">{log.category}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusColor(log.status)}`}>
                        {log.status === 'success' && <ShieldCheck className="w-3 h-3" />}
                        {log.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center space-y-3 opacity-50">
                      <Activity className="w-12 h-12 text-slate-600" />
                      <p className="text-slate-400">No activity records found matching your filters.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ActivityLogView;