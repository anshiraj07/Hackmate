import { useEffect, useState } from 'react';
import { LogOut, Users, Award, Loader2, PlusCircle, ClipboardList, UserCog } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { hackersAPI, Hacker, hackathonsAPI, usersAPI, Hackathon, UserPublic } from '../lib/api';
import { useToast } from '../hooks/useToast';
import { Toast } from '../components/Toast';
import { Modal } from '../components/Modal';

export function Dashboard() {
  const { user, signOut } = useAuth();
  const [hackers, setHackers] = useState<Hacker[]>([]);
  const [loading, setLoading] = useState(true);
  const [connections, setConnections] = useState<Set<number>>(new Set());
  const { toast, showToast, hideToast } = useToast();

  // Tabs: 'hackathons' | 'teammates' | 'profile'
  const [activeTab, setActiveTab] = useState<'hackathons' | 'teammates' | 'profile'>('hackathons');

  // Hackathons state
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [stats, setStats] = useState<{ createdCount: number; joinedCount: number } | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [newHackathon, setNewHackathon] = useState({ name: '', description: '', date: '', organizer: '' });

  // Teammates state
  const [users, setUsers] = useState<UserPublic[]>([]);

  // Profile state
  const [mySkills, setMySkills] = useState<string[]>([]);
  const availableSkills = [
    'React', 'Angular', 'Vue', 'Node.js', 'Express', 'Next.js', 'TypeScript', 'JavaScript',
    'Python', 'Django', 'Flask', 'FastAPI', 'Java', 'Spring', 'Go', 'Rust',
    'HTML', 'CSS', 'Tailwind', 'Sass', 'GraphQL', 'REST',
    'MongoDB', 'PostgreSQL', 'MySQL', 'Redis',
    'AWS', 'GCP', 'Azure', 'Docker', 'Kubernetes', 'CI/CD',
    'Machine Learning', 'Deep Learning', 'Data Science', 'NLP', 'Computer Vision',
    'Blockchain', 'Web3', 'Solidity',
    'Figma', 'UI/UX'
  ];
  const [customSkills, setCustomSkills] = useState<string[]>([]);
  const [skillsQuery, setSkillsQuery] = useState('');
  const [mySkillLevel, setMySkillLevel] = useState<'Beginner' | 'Intermediate' | 'Pro'>('Beginner');
  const [quizOpen, setQuizOpen] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});

  useEffect(() => {
    loadHackers();
    loadHackathons();
    loadStats();
    loadUsers();
  }, []);

  const loadHackers = async () => {
    try {
      const response = await hackersAPI.getHackers();
      setHackers(response.hackers);
    } catch (error: any) {
      console.error('Error loading hackers:', error);
      showToast(error.response?.data?.message || 'Failed to load hackers', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadHackathons = async () => {
    try {
      const res = await hackathonsAPI.list();
      setHackathons(res.hackathons);
    } catch (e: any) {
      showToast(e.response?.data?.message || 'Failed to load hackathons', 'error');
    }
  };

  const loadStats = async () => {
    try {
      const res = await hackathonsAPI.myStats();
      setStats(res);
    } catch (e) {}
  };

  const loadUsers = async () => {
    try {
      const res = await usersAPI.list();
      setUsers(res.users);
    } catch (e: any) {
      // silent, optional
    }
  };

  const handleConnect = (hackerId: number, hackerName: string) => {
    if (connections.has(hackerId)) {
      showToast('Already connected with this hacker', 'error');
      return;
    }

    // Mock connection - store locally
    setConnections(new Set([...connections, hackerId]));
    showToast(`Connection request sent to ${hackerName}!`, 'success');
  };

  const handleLogout = () => {
    signOut();
  };

  const handleCreateHackathon = async (e: React.FormEvent) => {
    e.preventDefault();
    const { name, description, date, organizer } = newHackathon;
    if (!name || !description || !date || !organizer) {
      showToast('All fields are required', 'error');
      return;
    }
    try {
      await hackathonsAPI.create({ name, description, date, organizer });
      setCreateOpen(false);
      setNewHackathon({ name: '', description: '', date: '', organizer: '' });
      await loadHackathons();
      showToast('Hackathon created', 'success');
    } catch (e: any) {
      showToast(e.response?.data?.message || 'Failed to create', 'error');
    }
  };

  const handleSaveSkills = async () => {
    try {
      await usersAPI.updateMySkills({ skills: mySkills, skillLevel: mySkillLevel });
      showToast('Profile updated', 'success');
    } catch (e: any) {
      showToast('Failed to update skills', 'error');
    }
  };

  const sharedSkill = (a: string[], b: string[]) => a.some((s) => b.includes(s));

  // no-op helpers removed for dropdown version

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading hackers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}

      <header className="bg-white border-b border-gray-200 shadow-sm dark:bg-gray-900 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">HackMate Finder</h1>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const root = document.documentElement;
                  const isDark = root.classList.toggle('dark');
                  localStorage.setItem('theme', isDark ? 'dark' : 'light');
                }}
                className="px-3 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-100 dark:hover:bg-gray-800"
                title="Toggle theme"
              >
                <span className="hidden sm:inline">Theme</span>
                <span className="sm:hidden">🌓</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors dark:text-gray-100 dark:hover:bg-gray-800"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gradient-to-r from-violet-700 via-fuchsia-600 to-purple-700 rounded-2xl p-8 mb-8 shadow-lg text-white">
          <h2 className="text-3xl font-bold text-white mb-2">
            Welcome back, {user?.name || 'Hacker'} 👋
          </h2>
          <p className="text-white/90 text-lg">
            Find your perfect hack mate and build something amazing together
          </p>
          {stats && (
            <div className="mt-4 grid grid-cols-2 gap-4 text-white/90">
              <div className="bg-white/10 rounded-lg p-3">
                <div className="text-sm">Hackathons Created</div>
                <div className="text-2xl font-bold">{stats.createdCount}</div>
              </div>
              <div className="bg-white/10 rounded-lg p-3">
                <div className="text-sm">Hackathons Joined</div>
                <div className="text-2xl font-bold">{stats.joinedCount}</div>
              </div>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-2">
          <button onClick={() => setActiveTab('hackathons')} className={`px-4 py-2 rounded-lg border ${activeTab==='hackathons' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-200'}`}>Hackathons</button>
          <button onClick={() => setActiveTab('teammates')} className={`px-4 py-2 rounded-lg border ${activeTab==='teammates' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-200'}`}>Find Teammates</button>
          <button onClick={() => setActiveTab('profile')} className={`px-4 py-2 rounded-lg border ${activeTab==='profile' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-200'}`}>Profile</button>
        </div>

        {activeTab === 'hackathons' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">Hackathons</h3>
                <p className="text-gray-600">Browse and create hackathons</p>
              </div>
              <button onClick={() => setCreateOpen(true)} className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                <PlusCircle className="w-5 h-5" /> Create
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
              {hackathons.map((h) => (
                <motion.div key={h._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="bg-white rounded-xl shadow-md border border-white/20 p-6 backdrop-blur-xl bg-white/60">
                  <h4 className="text-xl font-bold text-gray-900 mb-2">{h.name}</h4>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-3">{h.description}</p>
                  <div className="text-sm text-gray-500 mb-1">Organizer: <span className="font-medium text-gray-700">{h.organizer}</span></div>
                  <div className="text-sm text-gray-500 mb-4">Date: {new Date(h.date).toLocaleDateString()}</div>
                  <button
                    className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    onClick={async () => {
                      try {
                        await hackathonsAPI.enroll(h._id);
                        showToast('Enrolled successfully', 'success');
                      } catch (e: any) {
                        showToast(e.response?.data?.message || 'Failed to enroll', 'error');
                      }
                    }}
                  >
                    Enroll
                  </button>
                </motion.div>
              ))}
              </AnimatePresence>
            </div>
            {hackathons.length === 0 && (
              <div className="text-center py-12">
                <ClipboardList className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No hackathons yet. Create one!</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'teammates' && (
          <div>
            <div className="mb-4">
              <h3 className="text-2xl font-bold text-gray-900 mb-1">Find Teammates</h3>
              <p className="text-gray-600">People sharing at least one skill are marked as Potential Match</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
              {users.map((u) => {
                const match = sharedSkill(u.skills || [], mySkills || []);
                return (
                  <motion.div key={u._id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-lg font-bold text-gray-900">{u.name}</h4>
                      {match && <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">Potential Match</span>}
                    </div>
                    <div className="text-sm text-gray-600 mb-2">{u.email}</div>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {(u.skills || []).slice(0, 6).map((s) => (
                        <span key={s} className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-full">{s}</span>
                      ))}
                    </div>
                    <div className="text-xs text-gray-500 mb-3">Level: {u.skillLevel}</div>
                    <button
                      className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      onClick={async () => {
                        try {
                          await usersAPI.sendConnection(u._id);
                          showToast(`Connection request sent to ${u.name}`, 'success');
                        } catch (e: any) {
                          showToast(e.response?.data?.message || 'Failed to send request', 'error');
                        }
                      }}
                    >
                      Connect
                    </button>
                  </motion.div>
                );
              })}
              </AnimatePresence>
            </div>
            {users.length === 0 && (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No users yet.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'profile' && (
          <div>
            <div className="mb-4 flex items-center gap-2">
              <UserCog className="w-6 h-6 text-blue-600" />
              <h3 className="text-2xl font-bold text-gray-900">Profile</h3>
            </div>
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 mb-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Skills</label>
                <div className="w-full border border-gray-300 rounded-lg p-2">
                  <div className="flex flex-wrap gap-2 mb-2">
                    {mySkills.map((s) => (
                      <span key={s} className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-full">
                        {s}
                        <button
                          type="button"
                          className="text-blue-700 hover:text-blue-900"
                          onClick={() => setMySkills(mySkills.filter((x) => x !== s))}
                          aria-label={`Remove ${s}`}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                    {mySkills.length === 0 && (
                      <span className="text-xs text-gray-500">No skills selected</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <input
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm"
                      placeholder="Search skills..."
                      value={skillsQuery}
                      onChange={(e) => setSkillsQuery(e.target.value)}
                    />
                    <input
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm"
                      placeholder="Add custom skill and press Enter"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const val = (e.target as HTMLInputElement).value.trim();
                          if (val && !mySkills.includes(val)) {
                            setMySkills([...mySkills, val]);
                          }
                          (e.target as HTMLInputElement).value = '';
                        }
                      }}
                    />
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-48 overflow-auto">
                    {availableSkills
                      .filter((s) => s.toLowerCase().includes(skillsQuery.toLowerCase()))
                      .map((s) => {
                      const selected = mySkills.includes(s);
                      return (
                        <button
                          key={s}
                          type="button"
                          className={`text-left px-2 py-1 rounded border text-sm ${selected ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'}`}
                          onClick={() => {
                            setMySkills((prev) =>
                              prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
                            );
                          }}
                        >
                          {s}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Skill Level</label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  value={mySkillLevel}
                  onChange={(e) => setMySkillLevel(e.target.value as any)}
                >
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Pro</option>
                </select>
              </div>
              <div className="flex gap-2">
                <button onClick={handleSaveSkills} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Save</button>
                <button onClick={() => setQuizOpen(true)} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Take Skill Quiz</button>
              </div>
            </div>
          </div>
        )}

        {/* Create Hackathon Modal */}
        <Modal open={createOpen} title="Create Hackathon" onClose={() => setCreateOpen(false)}>
          <form onSubmit={handleCreateHackathon} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input className="w-full border border-gray-300 rounded-lg px-3 py-2" value={newHackathon.name} onChange={(e) => setNewHackathon({ ...newHackathon, name: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea className="w-full border border-gray-300 rounded-lg px-3 py-2" rows={4} value={newHackathon.description} onChange={(e) => setNewHackathon({ ...newHackathon, description: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input type="date" className="w-full border border-gray-300 rounded-lg px-3 py-2" value={newHackathon.date} onChange={(e) => setNewHackathon({ ...newHackathon, date: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Organizer</label>
              <input className="w-full border border-gray-300 rounded-lg px-3 py-2" value={newHackathon.organizer} onChange={(e) => setNewHackathon({ ...newHackathon, organizer: e.target.value })} />
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setCreateOpen(false)} className="px-4 py-2 border border-gray-300 rounded-lg">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg">Create</button>
            </div>
          </form>
        </Modal>

        {/* Skill Quiz Modal (placeholder) */}
        <Modal open={quizOpen} title="Skill Quiz" onClose={() => setQuizOpen(false)}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              // correct answers: Q1=B (React), Q2=B (MongoDB), Q3=A (Cascading Style Sheets)
              const correct: Record<number, string> = { 1: 'B', 2: 'B', 3: 'A' };
              let score = 0;
              [1, 2, 3].forEach((q) => {
                if (quizAnswers[q] === correct[q]) score += 1;
              });
              const level = score >= 3 ? 'Pro' : score === 2 ? 'Intermediate' : 'Beginner';
              setQuizOpen(false);
              showToast(`Skill Level: ${level}`, 'success');
            }}
            className="space-y-4"
          >
            <p className="text-gray-600 text-sm">Answer a few sample questions. This is a placeholder quiz.</p>
            <div className="space-y-4">
              <div>
                <div className="font-medium mb-2">1) Which is a frontend framework?</div>
                <div className="flex flex-col gap-1 text-sm">
                  {['A) Node.js', 'B) React', 'C) MongoDB'].map((label, idx) => {
                    const val = ['A', 'B', 'C'][idx];
                    return (
                      <label key={val} className="inline-flex items-center gap-2">
                        <input
                          type="radio"
                          name="q1"
                          value={val}
                          checked={quizAnswers[1] === val}
                          onChange={() => setQuizAnswers({ ...quizAnswers, 1: val })}
                        />
                        <span>{label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
              <div>
                <div className="font-medium mb-2">2) Which is a NoSQL database?</div>
                <div className="flex flex-col gap-1 text-sm">
                  {['A) PostgreSQL', 'B) MongoDB', 'C) MySQL'].map((label, idx) => {
                    const val = ['A', 'B', 'C'][idx];
                    return (
                      <label key={val} className="inline-flex items-center gap-2">
                        <input
                          type="radio"
                          name="q2"
                          value={val}
                          checked={quizAnswers[2] === val}
                          onChange={() => setQuizAnswers({ ...quizAnswers, 2: val })}
                        />
                        <span>{label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
              <div>
                <div className="font-medium mb-2">3) What does CSS stand for?</div>
                <div className="flex flex-col gap-1 text-sm">
                  {['A) Cascading Style Sheets', 'B) Computer Styled Sections', 'C) Creative Style System'].map((label, idx) => {
                    const val = ['A', 'B', 'C'][idx];
                    return (
                      <label key={val} className="inline-flex items-center gap-2">
                        <input
                          type="radio"
                          name="q3"
                          value={val}
                          checked={quizAnswers[3] === val}
                          onChange={() => setQuizAnswers({ ...quizAnswers, 3: val })}
                        />
                        <span>{label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg">Submit</button>
            </div>
          </form>
        </Modal>
      </main>
    </div>
  );
}
