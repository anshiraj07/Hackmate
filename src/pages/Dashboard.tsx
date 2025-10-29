import { useEffect, useState } from 'react';
import { LogOut, Users, Award, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase, Hacker } from '../lib/supabase';
import { useToast } from '../hooks/useToast';
import { Toast } from '../components/Toast';

export function Dashboard() {
  const { user, profile, signOut } = useAuth();
  const [hackers, setHackers] = useState<Hacker[]>([]);
  const [loading, setLoading] = useState(true);
  const [connections, setConnections] = useState<Set<string>>(new Set());
  const { toast, showToast, hideToast } = useToast();

  useEffect(() => {
    loadHackers();
    loadConnections();
  }, []);

  const loadHackers = async () => {
    try {
      const { data, error } = await supabase
        .from('hackers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setHackers(data || []);
    } catch (error) {
      console.error('Error loading hackers:', error);
      showToast('Failed to load hackers', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadConnections = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('connections')
        .select('hacker_id')
        .eq('user_id', user.id);

      if (error) throw error;
      setConnections(new Set(data?.map((c) => c.hacker_id) || []));
    } catch (error) {
      console.error('Error loading connections:', error);
    }
  };

  const handleConnect = async (hackerId: string, hackerName: string) => {
    if (!user) return;

    if (connections.has(hackerId)) {
      showToast('Already connected with this hacker', 'error');
      return;
    }

    try {
      const { error } = await supabase
        .from('connections')
        .insert([{ user_id: user.id, hacker_id: hackerId }]);

      if (error) throw error;

      setConnections(new Set([...connections, hackerId]));
      showToast(`Connection request sent to ${hackerName}!`, 'success');
    } catch (error: any) {
      if (error.message?.includes('duplicate')) {
        showToast('Already connected with this hacker', 'error');
      } else {
        showToast('Failed to send connection request', 'error');
      }
    }
  };

  const handleLogout = async () => {
    await signOut();
  };

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}

      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">HackMate Finder</h1>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-8 mb-8 shadow-lg">
          <h2 className="text-3xl font-bold text-white mb-2">
            Welcome, {profile?.name || 'Hacker'}!
          </h2>
          <p className="text-blue-50 text-lg">
            Find your perfect hack mate and build something amazing together
          </p>
        </div>

        <div className="mb-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Available Hackers</h3>
          <p className="text-gray-600">Connect with talented developers for your next project</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hackers.map((hacker) => {
            const isConnected = connections.has(hacker.id);
            return (
              <div
                key={hacker.id}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden"
              >
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-24"></div>
                <div className="p-6 -mt-8">
                  <div className="w-16 h-16 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center mb-4">
                    <span className="text-2xl font-bold text-blue-600">
                      {hacker.name.charAt(0)}
                    </span>
                  </div>

                  <h4 className="text-xl font-bold text-gray-900 mb-2">{hacker.name}</h4>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{hacker.bio}</p>

                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                    <Award className="w-4 h-4" />
                    <span className="font-medium">
                      {hacker.hackathon_experience} Hackathon
                      {hacker.hackathon_experience !== 1 ? 's' : ''}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {hacker.skills.slice(0, 4).map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => handleConnect(hacker.id, hacker.name)}
                    disabled={isConnected}
                    className={`w-full py-2.5 rounded-lg font-medium transition-all ${
                      isConnected
                        ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md'
                    }`}
                  >
                    {isConnected ? 'Connected' : 'Connect'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {hackers.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No hackers available at the moment</p>
          </div>
        )}
      </main>
    </div>
  );
}
