import React, { useEffect, useMemo, useState } from 'react';

function Users() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);

  const endpoint = useMemo(() => {
    const codespaceName = process.env.REACT_APP_CODESPACE_NAME;
    return codespaceName
      ? `https://${codespaceName}-8000.app.github.dev/api/users/`
      : 'http://localhost:8000/api/users/';
  }, []);

  useEffect(() => {
    const fetchItems = async () => {
      console.log('[Users] REST endpoint:', endpoint);
      try {
        const response = await fetch(endpoint);
        if (!response.ok) throw new Error(`Request failed with status ${response.status}`);
        const payload = await response.json();
        console.log('[Users] Fetched data:', payload);
        setItems(Array.isArray(payload) ? payload : Array.isArray(payload?.results) ? payload.results : []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, [endpoint]);

  const filteredItems = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return term ? items.filter((i) => JSON.stringify(i).toLowerCase().includes(term)) : items;
  }, [items, searchTerm]);

  return (
    <section className="mb-4">
      <div className="card shadow-sm border-0 resource-card">
        <div className="card-header d-flex justify-content-between align-items-center flex-wrap gap-2">
          <h2 className="h4 mb-0">Users</h2>
          <a href={endpoint} target="_blank" rel="noreferrer" className="btn btn-light btn-sm">Open API Link</a>
        </div>
        <div className="card-body">
          <form className="row g-2 align-items-end mb-3" onSubmit={(e) => e.preventDefault()}>
            <div className="col-12 col-md-8">
              <label htmlFor="users-search" className="form-label fw-semibold">Search Users</label>
              <input id="users-search" type="text" className="form-control" placeholder="Filter by any value"
                value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <div className="col-12 col-md-4 d-flex gap-2">
              <button type="button" className="btn btn-outline-primary w-100" onClick={() => setSearchTerm('')}>Clear</button>
              <button type="button" className="btn btn-primary w-100" onClick={() => setSearchTerm(searchTerm.trim())}>Apply</button>
            </div>
          </form>
          {loading && <div className="alert alert-info mb-0">Loading users...</div>}
          {!loading && error && <div className="alert alert-danger mb-0">Error: {error}</div>}
          {!loading && !error && (
            <div className="table-responsive">
              <table className="table table-striped table-hover table-bordered align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>#</th>
                    <th>ID</th>
                    <th>Username</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Email</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.length === 0 ? (
                    <tr><td colSpan="7" className="text-center text-muted py-4">No users found.</td></tr>
                  ) : filteredItems.map((item, index) => (
                    <tr key={item.id ?? index}>
                      <td>{index + 1}</td>
                      <td>{item.id ?? 'N/A'}</td>
                      <td>{item.username}</td>
                      <td>{item.first_name}</td>
                      <td>{item.last_name}</td>
                      <td>{item.email}</td>
                      <td>
                        <button type="button" className="btn btn-sm btn-outline-secondary"
                          onClick={() => setSelectedItem(item)}>View JSON</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      {selectedItem && (
        <div className="modal d-block" tabIndex="-1" role="dialog" onClick={() => setSelectedItem(null)}>
          <div className="modal-dialog modal-lg modal-dialog-centered" role="document" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h3 className="modal-title h5 mb-0">User Details</h3>
                <button type="button" className="btn-close" aria-label="Close" onClick={() => setSelectedItem(null)} />
              </div>
              <div className="modal-body">
                <pre className="bg-light p-3 rounded mb-0">{JSON.stringify(selectedItem, null, 2)}</pre>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setSelectedItem(null)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default Users;
