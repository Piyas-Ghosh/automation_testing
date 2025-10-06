import React, { useState, useEffect } from 'react';
import api from '../api/axios';

export default function Crud() {
    const [viewMode, setViewMode] = useState('view');
    const [bugReports, setBugReports] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [isPrepopulated, setIsPrepopulated] = useState(false);

    const [createFormData, setCreateFormData] = useState({
        testCaseId: '', module: '', section: '',
        testScenario: '', testSteps: '', expectedResult: '',
    });

    const [updateFormData, setUpdateFormData] = useState({
        testCaseId: '', module: '', section: '',
        testScenario: '', testSteps: '', expectedResult: '',
    });

    const [deleteTestCaseId, setDeleteTestCaseId] = useState('');

    // Function to fetch bug reports from the backend
    const fetchBugReports = async (query = '') => {
        setLoading(true);
        // Only clear message if no success message is set
        if (!message.includes('successfully')) {
            setMessage('');
        }
        try {
            const endpoint = query ? `/bugs/get-all${query}` : '/bugs/get-all';
            const res = await api.get(endpoint);
            const data = Array.isArray(res.data) ? res.data : (res.data && Object.keys(res.data).length > 0) ? [res.data] : [];
            setBugReports(data);
            if (data.length === 0 && !message.includes('successfully')) {
                setMessage('No bug reports found.');
            }
        } catch (err) {
            console.error(err);
            if (!message.includes('successfully')) {
                setMessage('There is not any matching Test Case ID.');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBugReports();
    }, []);

    // Handle the creation of a new bug report
    const handleCreateSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        try {
            const res = await api.post('/api/bugs/create', createFormData);
            setMessage(res.data.message);
            setCreateFormData({
                testCaseId: '', module: '', section: '',
                testScenario: '', testSteps: '', expectedResult: '',
            });
            setTimeout(() => {
                setViewMode('view');
                fetchBugReports();
            }, 2000); // Delay to show message
        } catch (err) {
            console.error(err);
            setMessage('Something went wrong!');
        } finally {
            setLoading(false);
        }
    };

    // Handle the update of an existing bug report
    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        if (!updateFormData.testCaseId) {
            setMessage('Test Case ID is required to update a bug report.');
            setLoading(false);
            return;
        }
        const filteredUpdateData = Object.fromEntries(
            Object.entries(updateFormData).filter(([, value]) => value !== '')
        );
        try {
            const res = await api.put('/api/bugs/update', filteredUpdateData);
            setMessage(res.data.message || `Bug report ${updateFormData.testCaseId} updated successfully!`);
            setUpdateFormData({
                testCaseId: '', module: '', section: '',
                testScenario: '', testSteps: '', expectedResult: '',
            });
            setIsPrepopulated(false);
            setTimeout(() => {
                setViewMode('view');
                fetchBugReports();
            }, 2000); // Delay to show message
        } catch (err) {
            console.error(err);
            setMessage(err.response?.data?.message || 'Failed to update bug report.');
        } finally {
            setLoading(false);
        }
    };

    // Handle the deletion of a bug report
    const handleDeleteSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        try {
            const res = await api.delete(`/api/delete/${deleteTestCaseId}`);
            const successMessage = res.data.message || `Bug report for ${deleteTestCaseId} deleted successfully!`;
            setMessage(successMessage);
            setDeleteTestCaseId('');
            console.log('Delete response:', res.data); // Debug log
            setTimeout(() => {
                setViewMode('view');
                fetchBugReports();
            }, 2000); // Delay to show message
        } catch (err) {
            console.error('Delete error:', err);
            setMessage('Failed to delete bug report.');
        } finally {
            setLoading(false);
        }
    };

    // Handle search by test case ID
    const handleSearch = (e) => {
        e.preventDefault();
        fetchBugReports(searchQuery);
    };

    // Handle showing all bug reports
    const handleShowAll = () => {
        setSearchQuery('');
        fetchBugReports();
    };

    // Handle pre-populating the update form
    const handlePrepopulateUpdate = (report) => {
        setUpdateFormData({
            testCaseId: report.testCaseId || '',
            module: report.module || '',
            section: report.section || '',
            testScenario: report.testScenario || '',
            testSteps: report.testSteps || '',
            expectedResult: report.expectedResult || '',
        });
        setIsPrepopulated(true);
        setViewMode('update');
    };

    // Handle clicking the top "Update" button
    const handleUpdateButtonClick = () => {
        setUpdateFormData({
            testCaseId: '', module: '', section: '',
            testScenario: '', testSteps: '', expectedResult: '',
        });
        setIsPrepopulated(false);
        setViewMode('update');
    };

    // Renders the correct content based on the view mode
    const renderContent = () => {
        switch (viewMode) {
            case 'create':
                return (
                    <div className="form-container">
                        <h2>Create Bug Report</h2>
                        {message && <p className="status-message">{message}</p>}
                        <form onSubmit={handleCreateSubmit} className="bug-form">
                            <input
                                type="text" name="testCaseId" value={createFormData.testCaseId}
                                onChange={(e) => setCreateFormData({ ...createFormData, testCaseId: e.target.value })}
                                placeholder="Test Case ID" required />
                            <input
                                type="text" name="module" value={createFormData.module}
                                onChange={(e) => setCreateFormData({ ...createFormData, module: e.target.value })}
                                placeholder="Module" required />
                            <input
                                type="text" name="section" value={createFormData.section}
                                onChange={(e) => setCreateFormData({ ...createFormData, section: e.target.value })}
                                placeholder="Section" required />
                            <input
                                type="text" name="testScenario" value={createFormData.testScenario}
                                onChange={(e) => setCreateFormData({ ...createFormData, testScenario: e.target.value })}
                                placeholder="Test Scenario" required />
                            <textarea
                                name="testSteps" value={createFormData.testSteps}
                                onChange={(e) => setCreateFormData({ ...createFormData, testSteps: e.target.value })}
                                placeholder="Test Steps" rows="4" required />
                            <input
                                type="text" name="expectedResult" value={createFormData.expectedResult}
                                onChange={(e) => setCreateFormData({ ...createFormData, expectedResult: e.target.value })}
                                placeholder="Expected Result" required />
                            <button type="submit" className="submit-btn create" disabled={loading}>
                                {loading ? 'Creating...' : 'Create'}
                            </button>
                        </form>
                    </div>
                );
            case 'update':
                return (
                    <div className="form-container">
                        <h2>Update Bug Report</h2>
                        {message && <p className="status-message">{message}</p>}
                        <form onSubmit={handleUpdateSubmit} className="bug-form">
                            <input
                                type="text"
                                name="testCaseId"
                                value={updateFormData.testCaseId}
                                onChange={
                                    !isPrepopulated
                                        ? (e) => setUpdateFormData({ ...updateFormData, testCaseId: e.target.value })
                                        : undefined
                                }
                                placeholder="Test Case ID to Update"
                                required
                                readOnly={isPrepopulated}
                                className={isPrepopulated ? 'read-only-input' : ''}
                            />
                            <input
                                type="text"
                                name="module"
                                value={updateFormData.module}
                                onChange={(e) => setUpdateFormData({ ...updateFormData, module: e.target.value })}
                                placeholder="Module"
                            />
                            <input
                                type="text"
                                name="section"
                                value={updateFormData.section}
                                onChange={(e) => setUpdateFormData({ ...updateFormData, section: e.target.value })}
                                placeholder="Section"
                            />
                            <input
                                type="text"
                                name="testScenario"
                                value={updateFormData.testScenario}
                                onChange={(e) => setUpdateFormData({ ...updateFormData, testScenario: e.target.value })}
                                placeholder="Test Scenario"
                            />
                            <textarea
                                name="testSteps"
                                value={updateFormData.testSteps}
                                onChange={(e) => setUpdateFormData({ ...updateFormData, testSteps: e.target.value })}
                                placeholder="Test Steps"
                                rows="4"
                            />
                            <input
                                type="text"
                                name="expectedResult"
                                value={updateFormData.expectedResult}
                                onChange={(e) => setUpdateFormData({ ...updateFormData, expectedResult: e.target.value })}
                                placeholder="Expected Result"
                            />
                            <button type="submit" className="submit-btn update" disabled={loading}>
                                {loading ? 'Updating...' : 'Update'}
                            </button>
                        </form>
                    </div>
                );
            case 'delete':
                return (
                    <div className="form-container">
                        <h2>Delete Bug Report</h2>
                        {message && <p className="status-message">{message}</p>} {/* Add message display */}
                        <form onSubmit={handleDeleteSubmit} className="bug-form">
                            <input
                                type="text"
                                value={deleteTestCaseId}
                                onChange={(e) => setDeleteTestCaseId(e.target.value)}
                                placeholder="Enter Test Case ID to Delete"
                                required
                            />
                            <button type="submit" className="submit-btn delete" disabled={loading}>
                                {loading ? 'Deleting...' : 'Delete'}
                            </button>
                        </form>
                    </div>
                );
            case 'view':
            default:
                return (
                    <>
                        <header className="view-header">
                            <h1>View Bug Reports</h1>
                            <div className="search-bar">
                                <form onSubmit={handleSearch}>
                                    <input
                                        type="text"
                                        placeholder="Search by Test Case ID"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="search-input"
                                    />
                                    <button type="submit" className="search-btn">Search</button>
                                </form>
                                <button onClick={handleShowAll} className="show-all-btn">Show All</button>
                            </div>
                        </header>

                        {loading && <p className="status-message">Loading...</p>}
                        {message && <p className="status-message">{message}</p>}

                        {!loading && bugReports.length > 0 && (
                            <div className="reports-table-container">
                                <table className="reports-table">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Test Case ID</th>
                                            <th>Module</th>
                                            <th>Section</th>
                                            <th>Test Scenario</th>
                                            <th>Test Steps</th>
                                            <th>Expected Result</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {bugReports.map((report) => (
                                            <tr key={report.id}>
                                                <td>{report.id}</td>
                                                <td>{report.testCaseId}</td>
                                                <td>{report.module}</td>
                                                <td>{report.section}</td>
                                                <td>{report.testScenario}</td>
                                                <td>{report.testSteps}</td>
                                                <td>{report.expectedResult}</td>
                                                <td>
                                                    <button
                                                        onClick={() => handlePrepopulateUpdate(report)}
                                                        className="text-blue-600 hover:underline font-bold"
                                                    >
                                                        Update
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </>
                );
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="app-container">
                <div className="button-group">
                    <button className={`nav-btn ${viewMode === 'create' ? 'active' : ''}`} onClick={() => setViewMode('create')}>Create</button>
                    <button className={`nav-btn ${viewMode === 'view' ? 'active' : ''}`} onClick={() => setViewMode('view')}>View</button>
                    <button className={`nav-btn ${viewMode === 'update' ? 'active' : ''}`} onClick={handleUpdateButtonClick}>Update</button>
                    <button className={`nav-btn ${viewMode === 'delete' ? 'active' : ''}`} onClick={() => setViewMode('delete')}>Delete</button>
                </div>
                {renderContent()}
            </div>

            <style>
                {`
          .app-container {
            max-width: 1200px;
            margin: auto;
            background-color: #fff;
            padding: 30px;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            display: flex;
            flex-direction: column;
            gap: 20px;
            width: 100%;
          }

          .button-group {
            display: flex;
            gap: 10px;
            justify-content: center;
            flex-wrap: wrap;
          }

          .nav-btn {
            background-color: #e2e8f0;
            color: #4a5568;
            padding: 10px 20px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 16px;
            font-weight: bold;
            transition: all 0.3s ease;
          }

          .nav-btn:hover {
            background-color: #cbd5e0;
          }
          
          .nav-btn.active {
            background-color: #4c51bf;
            color: white;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }

          .form-container {
            max-width: 600px;
            margin: auto;
            width: 100%;
          }
          
          h2 {
            text-align: center;
            margin-bottom: 25px;
            color: #1a202c;
            font-size: 1.5em;
          }
          
          .bug-form {
            display: flex;
            flex-direction: column;
            gap: 15px;
          }
          
          .bug-form input,
          .bug-form textarea {
            width: 100%;
            padding: 10px;
            border-radius: 8px;
            border: 1px solid #e2e8f0;
            box-sizing: border-box;
            outline: none;
            transition: border-color 0.2s;
          }
          
          .bug-form input:focus,
          .bug-form textarea:focus {
            border-color: #4a5568;
          }
          
          .bug-form input.read-only-input {
            background-color: #e2e8f0;
            cursor: not-allowed;
          }
          
          .submit-btn {
            padding: 12px 20px;
            border: none;
            border-radius: 8px;
            color: white;
            cursor: pointer;
            font-size: 16px;
            font-weight: bold;
            transition: all 0.3s ease;
          }
          
          .submit-btn.create { background-color: #48bb78; }
          .submit-btn.create:hover { background-color: #38a169; }
          .submit-btn.update { background-color: #ff9800; }
          .submit-btn.update:hover { background-color: #e68900; }
          .submit-btn.delete { background-color: #f44336; }
          .submit-btn.delete:hover { background-color: #d32f2f; }
          
          .submit-btn:disabled {
            background-color: #ccc;
            cursor: not-allowed;
          }

          .view-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 25px;
            flex-wrap: wrap;
            gap: 15px;
          }

          .view-header h1 {
            margin: 0;
            font-size: 2em;
            color: #1a202c;
          }

          .search-bar {
            display: flex;
            gap: 10px;
            align-items: center;
            flex-wrap: wrap;
          }

          .search-bar input {
            padding: 10px 15px;
            border-radius: 8px;
            border: 1px solid #e2e8f0;
            flex-grow: 1;
            min-width: 200px;
            outline: none;
            transition: border-color 0.2s;
          }

          .search-bar input:focus {
            border-color: #4a5568;
          }

          .search-btn, .show-all-btn {
            padding: 10px 20px;
            border: none;
            border-radius: 8px;
            color: #fff;
            cursor: pointer;
            font-weight: bold;
            transition: transform 0.2s, background-color 0.2s;
          }

          .search-btn {
            background-color: #4299e1;
          }

          .search-btn:hover {
            background-color: #3182ce;
            transform: translateY(-2px);
          }

          .show-all-btn {
            background-color: #48bb78;
          }

          .show-all-btn:hover {
            background-color: #38a169;
            transform: translateY(-2px);
          }

          .status-message {
            text-align: center;
            margin: 20px 0;
            font-style: italic;
            color: #718096;
            font-size: 1.1em;
          }

          .reports-table-container {
            overflow-x: auto;
          }

          .reports-table {
            width: 100%;
            border-collapse: collapse;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
          }

          .reports-table th, .reports-table td {
            padding: 12px 15px;
            text-align: left;
          }

          .reports-table th {
            background-color: #1a202c;
            color: #fff;
            font-weight: bold;
            text-transform: uppercase;
            font-size: 0.9em;
          }

          .reports-table tr:nth-child(even) {
            background-color: #f7fafc;
          }

          .reports-table tr:hover {
            background-color: #e2e8f0;
            transition: background-color 0.2s;
          }
        `}
            </style>
        </div>
    );
}