import React, { useState } from 'react';
import { Search, Plus, ExternalLink, Edit3, Trash2, X } from 'lucide-react';
import { ResourceDoc } from '../types';

interface ResourceLibraryViewProps {
  resources: ResourceDoc[];
  canEdit: boolean;
  onSaveResource: (
    data: Omit<ResourceDoc, 'visibility' | 'updatedBy' | 'createdAt' | 'updatedAt'>
  ) => Promise<void>;
  onDeleteResource: (id: string) => Promise<void>;
}

const CATEGORIES = [
  'All',
  'Checklist',
  'Java',
  'DSA',
  'Tracking',
  'Git & Shell',
  'Web Dev',
  'Aptitude',
  'Handbook',
  'Patterns',
];

export const ResourceLibraryView: React.FC<ResourceLibraryViewProps> = ({
  resources,
  canEdit,
  onSaveResource,
  onDeleteResource,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedTier, setSelectedTier] = useState<'all' | 'primary' | 'reference' | 'parked'>('all');

  // Add / Edit Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState<string>('');
  const [category, setCategory] = useState<string>('DSA');
  const [typeFocus, setTypeFocus] = useState<string>('');
  const [priority, setPriority] = useState<ResourceDoc['priority']>('High');
  const [recommendedUse, setRecommendedUse] = useState<string>('');
  const [url, setUrl] = useState<string>('');
  const [status, setStatus] = useState<ResourceDoc['status']>('Not started');
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const openCreateModal = () => {
    setEditingId(null);
    setTitle('');
    setCategory('DSA');
    setTypeFocus('');
    setPriority('High');
    setRecommendedUse('');
    setUrl('');
    setStatus('Not started');
    setNotes('');
    setIsModalOpen(true);
  };

  const openEditModal = (res: ResourceDoc) => {
    setEditingId(res.id);
    setTitle(res.title);
    setCategory(res.category);
    setTypeFocus(res.typeFocus);
    setPriority(res.priority);
    setRecommendedUse(res.recommendedUse);
    setUrl(res.url);
    setStatus(res.status);
    setNotes(res.notes);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !url.trim()) return;
    setIsSubmitting(true);
    try {
      const resourceId =
        editingId ||
        `res_${title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '_')
          .slice(0, 40)}_${Date.now().toString(36)}`;
      await onSaveResource({
        id: resourceId,
        title: title.trim(),
        category: category.trim(),
        typeFocus: typeFocus.trim() || 'Study resource',
        priority,
        recommendedUse: recommendedUse.trim() || 'Use alongside current semester track',
        url: url.trim(),
        status,
        notes: notes.trim(),
      });
      setIsModalOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickStatusToggle = async (res: ResourceDoc, nextStatus: ResourceDoc['status']) => {
    if (!canEdit) return;
    await onSaveResource({
      id: res.id,
      title: res.title,
      category: res.category,
      typeFocus: res.typeFocus,
      priority: res.priority,
      recommendedUse: res.recommendedUse,
      url: res.url,
      status: nextStatus,
      notes: res.notes,
    });
  };

  const filteredResources = resources.filter((res) => {
    const matchesSearch =
      !searchQuery.trim() ||
      res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.typeFocus.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.recommendedUse.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.notes.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || res.category === selectedCategory;

    const matchesTier =
      selectedTier === 'all' ||
      (selectedTier === 'primary' && res.priority === 'High') ||
      (selectedTier === 'reference' && (res.priority === 'Reference' || res.priority === 'Optional')) ||
      (selectedTier === 'parked' && res.priority === 'Parked');

    return matchesSearch && matchesCategory && matchesTier;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-slate-800 pb-5 lg:flex-row lg:items-end">
        <div>
          <p className="text-xs font-medium text-indigo-400">
            Curated Resource Library · Quality Over Quantity
          </p>
          <h1 className="mt-1 text-2xl font-bold text-slate-100">
            Java, DSA, Tools & Interview Resource Directory
          </h1>
          <p className="mt-1 text-sm text-slate-400 max-w-3xl">
            Every sheet, course, and tracker from your Notion CSV and Roadmap PDFs. Primary Sem 1 resources are separated from Reference and Parked sheets so you never duplicate effort.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {canEdit ? (
            <button
              type="button"
              onClick={openCreateModal}
              className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500 transition-colors whitespace-nowrap shrink-0"
            >
              <Plus className="h-4 w-4" />
              Add Resource
            </button>
          ) : (
            <span className="text-xs text-slate-500">
              Read-only view · Ask Admin to enable Resource Edit access
            </span>
          )}
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="flex flex-col gap-4 rounded-xl border border-slate-800 bg-[#111827] p-4">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search resources by name, focus, category, or notes (e.g., MOOC.fi, Striver, Abdul Bari, Codolio)..."
              className="w-full rounded-lg border border-slate-800 bg-[#0B0F17] py-2 pl-9 pr-4 text-xs text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          {/* Segmented Priority Tier Filter */}
          <div className="flex items-center gap-1 rounded-lg bg-[#0B0F17] p-1 border border-slate-800 overflow-x-auto">
            {[
              { id: 'all', label: `All (${resources.length})` },
              {
                id: 'primary',
                label: `Primary High (${resources.filter((r) => r.priority === 'High').length})`,
              },
              {
                id: 'reference',
                label: `Reference & Optional (${
                  resources.filter((r) => r.priority === 'Reference' || r.priority === 'Optional').length
                })`,
              },
              {
                id: 'parked',
                label: `Parked Until M6 (${resources.filter((r) => r.priority === 'Parked').length})`,
              },
            ].map((tier) => (
              <button
                key={tier.id}
                type="button"
                onClick={() => setSelectedTier(tier.id as typeof selectedTier)}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                  selectedTier === tier.id
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tier.label}
              </button>
            ))}
          </div>
        </div>

        {/* Category Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                selectedCategory === cat
                  ? 'bg-slate-800 text-slate-100 border border-slate-700'
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* High-Density Data Grid */}
      <div className="overflow-hidden rounded-xl border border-slate-800 bg-[#111827]">
        {filteredResources.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-sm font-medium text-slate-300">No matching resources found</p>
            <p className="mt-1 text-xs text-slate-500">
              Try clearing your search query or switching category filters.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-[#0B0F17]/60 text-xs font-medium text-slate-400">
                  <th className="py-3 px-4">Resource & Metadata</th>
                  <th className="py-3 px-4">Recommended Use & Notes</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-xs">
                {filteredResources.map((res) => (
                  <tr
                    key={res.id}
                    className="hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="py-3.5 px-4 align-top max-w-xs">
                      <div className="flex items-center gap-2 text-slate-400 mb-1">
                        <span className="font-medium text-indigo-400">{res.category}</span>
                        <span aria-hidden="true">·</span>
                        <span
                          className={
                            res.priority === 'High'
                              ? 'text-emerald-400 font-medium'
                              : res.priority === 'Parked'
                              ? 'text-amber-400'
                              : 'text-slate-400'
                          }
                        >
                          {res.priority} Priority
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="truncate">{res.typeFocus}</span>
                      </div>
                      <a
                        href={res.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-100 hover:text-indigo-400 transition-colors"
                      >
                        <span>{res.title}</span>
                        <ExternalLink className="h-3.5 w-3.5 shrink-0 text-slate-500" />
                      </a>
                    </td>

                    <td className="py-3.5 px-4 align-top max-w-md">
                      <p className="text-slate-200 leading-relaxed">{res.recommendedUse}</p>
                      {res.notes && (
                        <p className="mt-1 text-slate-500 leading-relaxed">{res.notes}</p>
                      )}
                    </td>

                    <td className="py-3.5 px-4 align-top whitespace-nowrap">
                      {canEdit ? (
                        <select
                          value={res.status}
                          onChange={(e) =>
                            handleQuickStatusToggle(res, e.target.value as ResourceDoc['status'])
                          }
                          className="rounded-md border border-slate-800 bg-[#0B0F17] px-2.5 py-1 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
                        >
                          <option value="Not started">Not started</option>
                          <option value="In progress">In progress</option>
                          <option value="Completed">Completed</option>
                          <option value="Reference">Reference</option>
                        </select>
                      ) : (
                        <span className="text-slate-300">{res.status}</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 align-top text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-2">
                        <a
                          href={res.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-lg border border-slate-800 bg-[#0B0F17] px-3 py-1.5 text-xs font-medium text-slate-200 hover:border-slate-700 hover:text-white transition-colors whitespace-nowrap shrink-0"
                        >
                          Open Link
                        </a>
                        {canEdit && (
                          <>
                            <button
                              type="button"
                              onClick={() => openEditModal(res)}
                              className="rounded-lg border border-slate-800 bg-[#0B0F17] p-1.5 text-slate-400 hover:text-slate-100 transition-colors"
                              title="Edit resource"
                            >
                              <Edit3 className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => onDeleteResource(res.id)}
                              className="rounded-lg border border-slate-800 bg-[#0B0F17] p-1.5 text-slate-400 hover:text-rose-400 transition-colors"
                              title="Delete resource"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4">
          <div className="w-full max-w-lg rounded-xl border border-slate-800 bg-[#111827] p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h2 className="text-base font-semibold text-slate-100">
                {editingId ? 'Edit Study Resource' : 'Add New Study Resource'}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Resource Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Striver A2Z DSA Sheet"
                  className="w-full rounded-lg border border-slate-800 bg-[#0B0F17] px-3 py-2 text-xs text-slate-100 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-lg border border-slate-800 bg-[#0B0F17] px-3 py-2 text-xs text-slate-100 focus:border-indigo-500 focus:outline-none"
                  >
                    {CATEGORIES.filter((c) => c !== 'All').map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Priority Tier
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as ResourceDoc['priority'])}
                    className="w-full rounded-lg border border-slate-800 bg-[#0B0F17] px-3 py-2 text-xs text-slate-100 focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="High">High (Primary)</option>
                    <option value="Reference">Reference</option>
                    <option value="Optional">Optional</option>
                    <option value="Parked">Parked Until M6</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as ResourceDoc['status'])}
                    className="w-full rounded-lg border border-slate-800 bg-[#0B0F17] px-3 py-2 text-xs text-slate-100 focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="Not started">Not started</option>
                    <option value="In progress">In progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Reference">Reference</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Type / Focus
                  </label>
                  <input
                    type="text"
                    value={typeFocus}
                    onChange={(e) => setTypeFocus(e.target.value)}
                    placeholder="e.g., Pattern-based problem solving"
                    className="w-full rounded-lg border border-slate-800 bg-[#0B0F17] px-3 py-2 text-xs text-slate-100 focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Resource URL
                  </label>
                  <input
                    type="url"
                    required
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full rounded-lg border border-slate-800 bg-[#0B0F17] px-3 py-2 text-xs text-slate-100 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Recommended Use
                </label>
                <input
                  type="text"
                  value={recommendedUse}
                  onChange={(e) => setRecommendedUse(e.target.value)}
                  placeholder="e.g., Use for pattern explanations when stuck after 30 minutes"
                  className="w-full rounded-lg border border-slate-800 bg-[#0B0F17] px-3 py-2 text-xs text-slate-100 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Mentor / Study Notes
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Optional guidance or milestone notes..."
                  className="w-full rounded-lg border border-slate-800 bg-[#0B0F17] p-2.5 text-xs text-slate-100 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg border border-slate-700 px-4 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500 disabled:opacity-50 transition-colors whitespace-nowrap shrink-0"
                >
                  {isSubmitting ? 'Saving...' : editingId ? 'Save Changes' : 'Create Resource'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
