import { useEffect, useState } from 'react';

const buildApiBaseUrl = () => {
  const codespaceName = import.meta.env.VITE_CODESPACE_NAME;

  if (typeof codespaceName === 'string' && codespaceName.trim() !== '') {
    return `https://${codespaceName.trim()}-8000.app.github.dev`;
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

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const apiBaseUrl = buildApiBaseUrl();

  useEffect(() => {
    const controller = new AbortController();

    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await fetch(`${apiBaseUrl}/api/users/`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const payload = await response.json();
        setUsers(normalizeRecords(payload));
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Unable to load users.');
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchUsers();

    return () => controller.abort();
  }, [apiBaseUrl]);

  return (
    <div className="card shadow-sm border-0">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="h4 mb-0">Users</h2>
          <small className="text-muted">{`${apiBaseUrl}/api/users/`}</small>
        </div>

        {loading && <div className="alert alert-info mb-0">Loading users...</div>}
        {error && <div className="alert alert-danger mb-0">{error}</div>}

        {!loading && !error && (
          <div className="table-responsive">
            <table className="table table-striped align-middle mb-0">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Fitness Level</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="text-center text-muted">
                      No users found.
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user._id || user.email}>
                      <td>{user.name || 'Unknown user'}</td>
                      <td>{user.email || 'N/A'}</td>
                      <td>{user.fitnessLevel || 'N/A'}</td>
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

export default Users;
