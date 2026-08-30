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

function Activities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const apiBaseUrl = buildApiBaseUrl();

  useEffect(() => {
    const controller = new AbortController();

    const fetchActivities = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await fetch(`${apiBaseUrl}/api/activities/`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const payload = await response.json();
        setActivities(normalizeRecords(payload));
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Unable to load activities.');
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchActivities();

    return () => controller.abort();
  }, [apiBaseUrl]);

  return (
    <div className="card shadow-sm border-0">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="h4 mb-0">Activities</h2>
          <small className="text-muted">{`${apiBaseUrl}/api/activities/`}</small>
        </div>

        {loading && <div className="alert alert-info mb-0">Loading activities...</div>}
        {error && <div className="alert alert-danger mb-0">{error}</div>}

        {!loading && !error && (
          <div className="table-responsive">
            <table className="table table-striped align-middle mb-0">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Duration</th>
                  <th>Calories</th>
                  <th>User</th>
                </tr>
              </thead>
              <tbody>
                {activities.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center text-muted">
                      No activities found.
                    </td>
                  </tr>
                ) : (
                  activities.map((activity) => (
                    <tr key={activity._id || `${activity.type}-${activity.date}`}>
                      <td>{activity.type || 'N/A'}</td>
                      <td>{activity.duration ? `${activity.duration} min` : 'N/A'}</td>
                      <td>{activity.calories ?? 'N/A'}</td>
                      <td>{activity.userId?.name || activity.userId || 'Unknown'}</td>
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

export default Activities;
