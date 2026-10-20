import React from 'react';
import { Shield, Eye, Edit3, Users } from 'lucide-react';
import { UserProfile } from '../types';
import { SUPER_ADMIN_EMAIL } from '../firebase';

interface AdminConsoleViewProps {
  currentUserProfile: UserProfile;
  allUsers: UserProfile[];
  inspectedUserId: string;
  onSelectInspectedUser: (uid: string) => void;
  onToggleUserResourcePermission: (targetUser: UserProfile) => Promise<void>;
  onToggleUserAdminRole: (targetUser: UserProfile) => Promise<void>;
  onToggleUserExamMode: (targetUser: UserProfile) => Promise<void>;
}

export const AdminConsoleView: React.FC<AdminConsoleViewProps> = ({
  currentUserProfile,
  allUsers,
  inspectedUserId,
  onSelectInspectedUser,
  onToggleUserResourcePermission,
  onToggleUserAdminRole,
  onToggleUserExamMode,
}) => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-slate-800 pb-5 lg:flex-row lg:items-end">
        <div>
          <p className="text-xs font-medium text-indigo-400">
            Super Admin & Mentorship Console · {SUPER_ADMIN_EMAIL}
          </p>
          <h1 className="mt-1 text-2xl font-bold text-slate-100">
            User Management, Edit Permissions & Student Progress Inspector
          </h1>
          <p className="mt-1 text-sm text-slate-400 max-w-3xl">
            Manage everyone who signs into the platform, grant or revoke permission to edit the Resource Library, toggle Exam Light Mode, and inspect any learner’s live dashboard and DSA logs.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-300 font-mono-tabular">
          <Users className="h-4 w-4 text-indigo-400" />
          <span>Registered Workspace Users: {allUsers.length}</span>
        </div>
      </div>

      {/* User Directory Table */}
      <div className="overflow-hidden rounded-xl border border-slate-800 bg-[#111827]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-[#0B0F17]/60 text-xs font-medium text-slate-400">
                <th className="py-3.5 px-4">Learner / User</th>
                <th className="py-3.5 px-4">Progress Telemetry</th>
                <th className="py-3.5 px-4">Resource Edit Access</th>
                <th className="py-3.5 px-4">Exam Light Mode</th>
                <th className="py-3.5 px-4 text-right">Mentorship Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-xs">
              {allUsers.map((u) => {
                const isInspected = u.uid === inspectedUserId;
                const isSelf = u.uid === currentUserProfile.uid;

                return (
                  <tr
                    key={u.uid}
                    className={`transition-colors ${
                      isInspected ? 'bg-indigo-950/25' : 'hover:bg-slate-800/30'
                    }`}
                  >
                    <td className="py-4 px-4 align-middle">
                      <div className="flex items-center gap-2 text-slate-400 mb-0.5">
                        <span
                          className={
                            u.role === 'admin'
                              ? 'font-semibold text-indigo-400'
                              : 'text-slate-400'
                          }
                        >
                          {u.role === 'admin' ? 'Admin' : 'Learner'}
                        </span>
                        {isSelf && (
                          <>
                            <span>·</span>
                            <span className="text-emerald-400">You</span>
                          </>
                        )}
                        {isInspected && (
                          <>
                            <span>·</span>
                            <span className="text-amber-400 font-medium">
                              Currently Inspecting
                            </span>
                          </>
                        )}
                      </div>
                      <div className="text-sm font-semibold text-slate-100">
                        {u.displayName}
                      </div>
                      <div className="font-mono-tabular text-[11px] text-slate-500">
                        UID: {u.uid.slice(0, 14)}...
                      </div>
                    </td>

                    <td className="py-4 px-4 align-middle font-mono-tabular">
                      <div className="flex flex-wrap items-center gap-2 text-slate-300">
                        <span>
                          Solved: <strong className="text-slate-100">{u.solvedCount}</strong>
                        </span>
                        <span>·</span>
                        <span>
                          Cold Re-Solved:{' '}
                          <strong className="text-emerald-400">{u.masteredCount}</strong>
                        </span>
                        <span>·</span>
                        <span>
                          Spoken: <strong className="text-indigo-400">{u.spokenCount}</strong>
                        </span>
                        <span>·</span>
                        <span>
                          Roadmap: <strong>{u.roadmapDoneCount}</strong>
                        </span>
                      </div>
                    </td>

                    <td className="py-4 px-4 align-middle">
                      <button
                        type="button"
                        onClick={() => onToggleUserResourcePermission(u)}
                        className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                          u.canEditResources || u.role === 'admin'
                            ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/25'
                            : 'bg-slate-800 text-slate-400 border border-slate-700 hover:text-slate-200'
                        }`}
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                        {u.canEditResources || u.role === 'admin'
                          ? 'Can Edit Resources'
                          : 'View Only (Click to Grant)'}
                      </button>
                    </td>

                    <td className="py-4 px-4 align-middle">
                      <button
                        type="button"
                        onClick={() => onToggleUserExamMode(u)}
                        className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                          u.examLightMode
                            ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                            : 'bg-[#0B0F17] text-slate-400 border border-slate-800 hover:text-slate-200'
                        }`}
                      >
                        {u.examLightMode ? 'Light Mode (30–45m)' : 'Standard Mode'}
                      </button>
                    </td>

                    <td className="py-4 px-4 align-middle text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => onSelectInspectedUser(u.uid)}
                          className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                            isInspected
                              ? 'bg-indigo-600 text-white'
                              : 'border border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700'
                          }`}
                        >
                          <Eye className="h-3.5 w-3.5" />
                          {isInspected ? 'Viewing Workspace' : 'Inspect Progress'}
                        </button>

                        {!isSelf && (
                          <button
                            type="button"
                            onClick={() => onToggleUserAdminRole(u)}
                            className="inline-flex items-center gap-1 rounded-lg border border-slate-800 bg-[#0B0F17] px-2.5 py-1.5 text-xs text-slate-400 hover:border-slate-700 hover:text-slate-200 transition-colors whitespace-nowrap shrink-0"
                            title="Toggle Admin Role"
                          >
                            <Shield className="h-3.5 w-3.5" />
                            {u.role === 'admin' ? 'Demote to Learner' : 'Promote to Admin'}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
