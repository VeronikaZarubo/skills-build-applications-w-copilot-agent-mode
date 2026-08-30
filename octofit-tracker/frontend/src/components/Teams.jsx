import { useEffect, useState } from 'react';

const buildApiBaseUrl = () => {
  const codespaceName = import.meta.env.VITE_CODESPACE_NAME;

  if (typeof codespaceName === 'string' && codespaceName.trim() !== '') {
    return 'https://' + codespaceName.trim() + '-8000.app.github.dev';
  }

  return 'http://localhost:8000';
};

const normalizeRecords = (payload) => {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (!payload || typeof payload !== 'object') {
    return [];
  }

  if (Array.isArray(payload.data)) {
    return payload.data;
  }

  if (Array.isArray(payload.results)) {
    return payload.results;
  }

  if (Array.isArray(payload.items)) {
    return payload.items;
  }

  if (payload.data && typeof payload.data === 'object') {
    if (Array.isArray(payload.data.data)) {
      return payload.data.data;
    }

    if (Array.isArray(payload.data.results)) {
      return payload.data.results;
    }

    if (Array.isArray(payload.data.items)) {
      return payload.data.items;
    }
  }

  return [];
};

function Teams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const apiBaseUrl = buildApiBaseUrl();
  const apiUrl = apiBaseUrl + '/api/teams/';

  useEffect(() => {
    const controller = new AbortController();

    const fetchTeams = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await fetch(apiUrl, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const payload = await response.json();
        setTeams(normalizeRecords(payload));
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Unable to load teams.');
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchTeams();

    return () => controller.abort();
  }, [apiUrl]);

  return (
    <div className="card shadow-sm border-0">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="h4 mb-0">Teams</h2>
          <small className="text-muted">{apiUrl}</small>
        </div>

        {loading && <div className="alert alert-info mb-0">Loading teams...</div>}
        {error && <div className="alert alert-danger mb-0">{error}</div>}

        {!loading && !error && (
          <div className="table-responsive">
            <table className="table table-striped align-middle mb-0">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Focus</th>
                  <th>Members</th>
                </tr>
              </thead>
              <tbody>
                {teams.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="text-center text-muted">
                      No teams found.
                    </td>
                  </tr>
                ) : (
                  teams.map((team) => (
                    <tr key={team._id || team.name}>
                      <td>{team.name || 'Unnamed team'}</td>
                      <td>{team.focus || 'General fitness'}</td>
                      <td>{team.members?.length ?? 0}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Teams;
