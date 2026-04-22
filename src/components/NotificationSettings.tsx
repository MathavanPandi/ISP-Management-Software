import React from 'react';
import { 
  Mail, 
  MessageSquare, 
  Bell, 
  Edit2, 
  Save, 
  RotateCcw,
  Info,
  ChevronRight
} from 'lucide-react';
import { MOCK_TEMPLATES } from '../mockData';
import { cn } from '../lib/utils';
import { NotificationTemplate } from '../types';

export function NotificationSettings() {
  const [templates, setTemplates] = React.useState<NotificationTemplate[]>(MOCK_TEMPLATES);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [editForm, setEditForm] = React.useState<NotificationTemplate | null>(null);

  const handleEdit = (template: NotificationTemplate) => {
    setEditingId(template.id);
    setEditForm({ ...template });
  };

  const handleSave = () => {
    if (editForm) {
      setTemplates(prev => prev.map(t => t.id === editForm.id ? editForm : t));
      setEditingId(null);
      setEditForm(null);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 italic serif">Notification Templates</h2>
          <p className="text-sm text-slate-500">Customize Email, WhatsApp, and Push notification content</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {templates.map((template) => {
          const isEditing = editingId === template.id;
          const Icon = template.type === 'Email' ? Mail : template.type === 'WhatsApp' ? MessageSquare : Bell;

          return (
            <div key={template.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center",
                      template.type === 'Email' ? "bg-blue-50 text-blue-600" :
                      template.type === 'WhatsApp' ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                    )}>
                      <Icon size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">{template.trigger}</h4>
                      <p className="text-xs text-slate-500">{template.type} Template • Last updated {template.lastUpdated}</p>
                    </div>
                  </div>
                  {!isEditing && (
                    <button 
                      onClick={() => handleEdit(template)}
                      className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-100 transition-colors"
                    >
                      <Edit2 size={14} />
                      Edit Template
                    </button>
                  )}
                </div>

                {isEditing ? (
                  <div className="space-y-4">
                    {template.type === 'Email' && (
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Subject Line</label>
                        <input 
                          type="text"
                          className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20"
                          value={editForm?.subject || ''}
                          onChange={(e) => setEditForm(prev => prev ? { ...prev, subject: e.target.value } : null)}
                        />
                      </div>
                    )}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Message Body</label>
                      <textarea 
                        rows={5}
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20 font-mono"
                        value={editForm?.body || ''}
                        onChange={(e) => setEditForm(prev => prev ? { ...prev, body: e.target.value } : null)}
                      />
                    </div>

                    <div className="bg-slate-50 p-4 rounded-lg flex items-start gap-3">
                      <Info size={16} className="text-slate-400 mt-0.5" />
                      <div>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Available Variables</p>
                        <div className="flex flex-wrap gap-2">
                          {template.variables.map(v => (
                            <code key={v} className="px-2 py-1 bg-white border border-slate-200 rounded text-[10px] text-[#007AFF] font-bold">
                              {`{${v}}`}
                            </code>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                      <button 
                        onClick={handleCancel}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-50 transition-colors"
                      >
                        <RotateCcw size={14} />
                        Cancel
                      </button>
                      <button 
                        onClick={handleSave}
                        className="flex items-center gap-2 px-4 py-2 bg-[#007AFF] text-white rounded-lg text-xs font-bold hover:bg-[#0066CC] transition-colors shadow-sm"
                      >
                        <Save size={14} />
                        Save Changes
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {template.subject && (
                      <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Subject</span>
                        <p className="text-sm text-slate-700 font-medium">{template.subject}</p>
                      </div>
                    )}
                    <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 whitespace-pre-wrap font-mono text-sm text-slate-600 leading-relaxed">
                      {template.body}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
