import React from 'react';
import { MoreHorizontal, Edit2, Trash2, Shield } from 'lucide-react';
import { USER_DATA } from '../constants';

const UserTable: React.FC = () => {
  return (
    <div className="flex-1 bg-white rounded-3xl shadow-sm overflow-hidden flex flex-col border border-gray-100">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <h3 className="font-bold text-gray-900 text-lg">All Users</h3>
        <div className="flex gap-2">
            <button className="text-xs font-bold text-brand-lime-dark bg-brand-lime-bg px-3 py-2 rounded-xl hover:bg-brand-lime-light transition-colors">Export CSV</button>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto">
        <table className="w-full">
            <thead className="bg-gray-50/50">
                <tr className="text-left">
                    <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-wider pl-6">User</th>
                    <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Role</th>
                    <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Last Active</th>
                    <th className="p-5 text-xs font-bold text-gray-400 uppercase tracking-wider text-right pr-6">Actions</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
                {USER_DATA.map(user => (
                    <tr key={user.id} className="group hover:bg-gray-50/50 transition-colors">
                        <td className="p-5 pl-6">
                            <div className="flex items-center gap-3">
                                <img src={user.avatarUrl} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
                                <div>
                                    <p className="font-bold text-gray-900 text-sm">{user.name}</p>
                                    <p className="text-xs text-gray-500">{user.email}</p>
                                </div>
                            </div>
                        </td>
                        <td className="p-5">
                            <div className="flex items-center gap-2">
                                <Shield size={14} className="text-brand-lime-dark" />
                                <span className="text-sm font-medium text-gray-700">{user.role}</span>
                            </div>
                        </td>
                        <td className="p-5">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                user.status === 'Active' 
                                ? 'bg-brand-lime-bg text-brand-lime-dark' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                                {user.status}
                            </span>
                        </td>
                        <td className="p-5">
                            <span className="text-sm text-gray-500 font-medium">{user.lastActive}</span>
                        </td>
                        <td className="p-5 pr-6 text-right">
                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="p-2 text-gray-400 hover:text-brand-lime hover:bg-brand-lime-bg rounded-lg transition-colors">
                                    <Edit2 size={16} />
                                </button>
                                <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserTable;