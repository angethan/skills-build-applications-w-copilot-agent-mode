import React, { useEffect, useMemo, useState } from 'react';

function ResourceTableView({ title, endpointPath }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);

  const codespaceName = process.env.REACT_APP_CODESPACE_NAME;
  const endpoint = codespaceName
    ? `https://${codespaceName}-8000.app.github.dev/api/${endpointPath}/`
    : `http://localhost:8000/api/${endpointPath}/`;

  useEffect(() => {
    const fetchItems = async () => {
      console.log(`[${title}] REST endpoint:`, endpoint);

      try {
        const response = await fetch(endpoint);

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const payload = await response.json();
        console.log(`[${title}] Fetched data:`, payload);

        const normalizedData = Array.isArray(payload)
          ? payload
          : Array.isArray(payload?.results)
            ? payload.results
            : [];

        setItems(normalizedData);
      } catch (fetchError) {
        setError(fetchError.message);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [endpoint, title]);

  const filteredItems = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    if (!normalizedSearch) {
      return items;
    }

    return items.filter((item) => JSON.stringify(item).toLowerCase().includes(normalizedSearch));
  }, [items, searchTerm]);

  const getSummary = (item) => {
    const entries = Object.entries(item).slice(0, 3);

    if (entries.length === 0) {
      return 'No fields available';
    }

    return entries
      .map(([key, value]) => `${key}: ${typeof value === 'object' ? JSON.stringify(value) : value}`)
      .join(' | ');
  };

  return (
    <section className="mb-4">
      <div className="card shadow-sm border-0 resource-card">
        <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center flex-wrap gap-2">
          <h2 className="h4 mb-0">{title}</h2>
          <a href={endpoint} target="_blank" rel="noreferrer" className="btn btn-light btn-sm">
            Open API Link
          </a>
        </div>

        <div className="card-body">
          <form className="row g-2 align-items-end mb-3" onSubmit={(event) => event.preventDefault()}>
            <div className="col-12 col-md-8">
              <label htmlFor={`${endpointPath}-search`} className="form-label fw-semibold">
                Search {title}
              </label>
              <input
                id={`${endpointPath}-search`}
                type="text"
                className="form-control"
                placeholder="Filter rows by any value"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>
            <div className="col-12 col-md-4 d-flex gap-2">
              <button
                type="button"
                className="btn btn-outline-primary w-100"
                onClick={() => setSearchTerm('')}
              >
                Clear
              </button>
              <button
                type="button"
                className="btn btn-primary w-100"
                onClick={() => setSearchTerm(searchTerm.trim())}
              >
                Apply
              </button>
            </div>
          </form>

          {loading && <div className="alert alert-info mb-0">Loading {title.toLowerCase()}...</div>}
          {!loading && error && <div className="alert alert-danger mb-0">Error: {error}</div>}

          {!loading && !error && (
            <div className="table-responsive">
              <table className="table table-striped table-hover table-bordered align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th style={{ width: '80px' }}>#</th>
                    <th style={{ width: '120px' }}>ID</th>
                    <th>Summary</th>
                    <th style={{ width: '140px' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center text-muted py-4">
                        No {title.toLowerCase()} found.
                      </td>
                    </tr>
                  ) : (
                    filteredItems.map((item, index) => (
                      <tr key={item.id ?? `${endpointPath}-${index}`}>
                        <td>{index + 1}</td>
                        <td>{item.id ?? 'N/A'}</td>
                        <td>{getSummary(item)}</td>
                        <td>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => setSelectedItem(item)}
                          >
                            View JSON
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {selectedItem && (
        <div className="modal d-block" tabIndex="-1" role="dialog" onClick={() => setSelectedItem(null)}>
          <div className="modal-dialog modal-lg modal-dialog-centered" role="document" onClick={(event) => event.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h3 className="modal-title h5 mb-0">{title} Details</h3>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={() => setSelectedItem(null)}
                />
              </div>
              <div className="modal-body">
                <pre className="bg-light p-3 rounded mb-0">{JSON.stringify(selectedItem, null, 2)}</pre>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setSelectedItem(null)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default ResourceTableView;
