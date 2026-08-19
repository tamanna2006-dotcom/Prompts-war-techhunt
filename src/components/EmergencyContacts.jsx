import { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Trash2, 
  X, 
  Star 
} from 'lucide-react';

export default function EmergencyContacts({
  isOpen,
  onClose,
  contacts,
  onSaveContacts
}) {
  const [contactList, setContactList] = useState(contacts || []);
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [relationship, setRelationship] = useState('Family');

  if (!isOpen) return null;

  const handleAdd = (e) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    const newContact = {
      id: `c-${Date.now()}`,
      name: name.trim(),
      phone: phone.trim(),
      relationship,
      isPrimary: contactList.length === 0,
      autoNotify: true
    };

    const updated = [...contactList, newContact];
    setContactList(updated);
    onSaveContacts(updated);
    setName('');
    setPhone('');
    setIsAdding(false);
  };

  const handleDelete = (id) => {
    const updated = contactList.filter((c) => c.id !== id);
    setContactList(updated);
    onSaveContacts(updated);
  };

  const handleSetPrimary = (id) => {
    const updated = contactList.map((c) => ({
      ...c,
      isPrimary: c.id === id
    }));
    setContactList(updated);
    onSaveContacts(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5 text-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Emergency Contacts Book</h3>
              <p className="text-xs text-slate-400">Auto-notified during One-Tap SOS triggers.</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Contacts List */}
        <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
          {contactList.map((contact) => (
            <div
              key={contact.id}
              className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between gap-3"
            >
              <div className="space-y-0.5 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">{contact.name}</span>
                  <span className="text-[10px] px-2 py-0.2 rounded-full bg-slate-800 text-cyan-300 border border-slate-700">
                    {contact.relationship}
                  </span>
                  {contact.isPrimary && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-950 text-amber-300 border border-amber-500/40 font-bold flex items-center gap-0.5">
                      <Star className="w-2.5 h-2.5 fill-amber-300" />
                      Primary
                    </span>
                  )}
                </div>
                <div className="text-xs font-mono text-slate-400">{contact.phone}</div>
              </div>

              <div className="flex items-center gap-1.5">
                {!contact.isPrimary && (
                  <button
                    onClick={() => handleSetPrimary(contact.id)}
                    title="Set as Primary SOS Contact"
                    className="p-1.5 text-xs text-slate-400 hover:text-amber-300 rounded-lg hover:bg-slate-800"
                  >
                    <Star className="w-4 h-4" />
                  </button>
                )}

                <button
                  onClick={() => handleDelete(contact.id)}
                  title="Remove Contact"
                  className="p-1.5 text-xs text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add Contact Form */}
        {isAdding ? (
          <form onSubmit={handleAdd} className="p-4 rounded-2xl bg-slate-950 border border-cyan-500/40 space-y-3">
            <h4 className="text-xs font-bold text-cyan-300">Add New Contact</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name (e.g. Dad)"
                required
                className="p-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
              />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone Number (+1 555-0000)"
                required
                className="p-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
              />
            </div>
            <div>
              <select
                value={relationship}
                onChange={(e) => setRelationship(e.target.value)}
                className="w-full p-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
              >
                <option value="Family">Family</option>
                <option value="Friend">Friend / Roommate</option>
                <option value="Security">Campus Security / Police</option>
                <option value="Colleague">Colleague</option>
              </select>
            </div>
            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl shadow-md"
              >
                Save Contact
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setIsAdding(true)}
            className="w-full py-2.5 px-4 rounded-xl border border-dashed border-slate-700 hover:border-cyan-500 text-xs font-bold text-slate-300 hover:text-cyan-300 flex items-center justify-center gap-2 transition-all"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add New Emergency Contact</span>
          </button>
        )}

      </div>
    </div>
  );
}
