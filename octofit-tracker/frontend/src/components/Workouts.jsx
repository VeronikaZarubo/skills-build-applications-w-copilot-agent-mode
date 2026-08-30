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

function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const apiBaseUrl = buildApiBaseUrl();

  useEffect(() => {
    const controller = new AbortController();

    const fetchWorkouts = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await fetch(`${apiBaseUrl}/api/workouts/`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const payload = await response.json();
        setWorkouts(normalizeRecords(payload));
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Unable to load workouts.');
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchWorkouts();

    return () => controller.abort();
  }, [apiBaseUrl]);

  return (
    <div className="card shadow-sm border-0">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="h4 mb-0">Workouts</h2>
          <small className="text-muted">{`${apiBaseUrl}/api/workouts/`}</small>
        </div>

        {loading && <div className="alert alert-info mb-0">Loading workouts...</div>}
        {error && <div className="alert alert-danger mb-0">{error}</div>}

        {!loading && !error && (
          <div className="row g-3">
            {workouts.length === 0 ? (
              <div className="col-12">
                <div className="text-center text-muted py-3">No workouts found.</div>
              </div>
            ) : (
              workouts.map((workout) => (
                <div className="col-md-6" key={workout._id || workout.title}>
                  <div className="border rounded p-3 h-100">
                    <h3 className="h5 mb-2">{workout.title || 'Workout'}</h3>
                    <p className="mb-1"><strong>Duration:</strong> {workout.duration || 'N/A'}</p>
                    <p className="mb-1"><strong>Difficulty:</strong> {workout.difficulty || 'N/A'}</p>
                    <p className="mb-0"><strong>Focus:</strong> {workout.focus || 'General fitness'}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Workouts;
