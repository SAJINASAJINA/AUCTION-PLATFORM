import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const API = "http://localhost:5000/api/v1/superadmin";

const SuperAdminDashboard = () => {
  const [users, setUsers] = useState({
    biddersArray: [],
    auctioneersArray: [],
  });

  const [revenue, setRevenue] = useState([]);

  const [paymentProofs, setPaymentProofs] = useState([]);

  const [loading, setLoading] = useState(true);

  const [selectedProof, setSelectedProof] = useState(null);

  const [editAmount, setEditAmount] = useState("");
  const [editStatus, setEditStatus] = useState("");

  // Fetch all dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const [usersResponse, revenueResponse, proofsResponse] =
        await Promise.all([
          axios.get(`${API}/users/getall`, {
            withCredentials: true,
          }),

          axios.get(`${API}/monthly-income`, {
            withCredentials: true,
          }),

          axios.get(`${API}/paymentproofs/getall`, {
            withCredentials: true,
          }),
        ]);

      setUsers({
        biddersArray: usersResponse.data.biddersArray || [],
        auctioneersArray: usersResponse.data.auctioneersArray || [],
      });

      setRevenue(revenueResponse.data.totalMonthlyRevenue || []);

      setPaymentProofs(proofsResponse.data.paymentProofs || []);
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message || "Failed to load Super Admin Dashboard",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Calculate total bidders
  const totalBidders = users.biddersArray.reduce(
    (total, value) => total + value,
    0,
  );

  // Calculate total auctioneers
  const totalAuctioneers = users.auctioneersArray.reduce(
    (total, value) => total + value,
    0,
  );

  // Calculate total revenue
  const totalRevenue = revenue.reduce(
    (total, value) => total + Number(value || 0),
    0,
  );

  // Open payment proof
  const openProof = (proof) => {
    setSelectedProof(proof);
    setEditAmount(proof.amount || "");
    setEditStatus(proof.status || "");
  };

  // Update payment proof
  const updateProof = async () => {
    if (!selectedProof) return;

    try {
      const response = await axios.put(
        `${API}/paymentproof/update/${selectedProof._id}`,
        {
          amount: Number(editAmount),
          status: editStatus,
        },
        {
          withCredentials: true,
        },
      );

      toast.success(response.data.message);

      setSelectedProof(null);

      fetchDashboardData();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update payment proof",
      );
    }
  };

  // Delete payment proof
  const deleteProof = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this payment proof?",
    );

    if (!confirmDelete) return;

    try {
      const response = await axios.put(
        `${API}/paymentproof/delete/${id}`,
        {},
        {
          withCredentials: true,
        },
      );

      toast.success(response.data.message);

      fetchDashboardData();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to delete payment proof",
      );
    }
  };

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  if (loading) {
    return (
      <div
        className="super-admin-dashboard"
        style={{
          marginLeft: "300px",
          width: "calc(100% - 300px)",
          minHeight: "100vh",
          padding: "35px",
          background: "#f7f7f7",
          color: "#171717",
          boxSizing: "border-box",
        }}
      >
        <h2>Loading Super Admin Dashboard...</h2>
      </div>
    );
  }
  console.log("SUPER ADMIN DASHBOARD RENDERED");
  console.log("Users:", users);
  console.log("Revenue:", revenue);
  console.log("Payment Proofs:", paymentProofs);

  return (
    <div className="super-admin-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1>Super Admin Dashboard</h1>
          <p>Manage users, payments and platform revenue</p>
        </div>

        <button className="refresh-btn" onClick={fetchDashboardData}>
          Refresh
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Bidders</h3>
          <p>{totalBidders}</p>
        </div>

        <div className="stat-card">
          <h3>Total Auctioneers</h3>
          <p>{totalAuctioneers}</p>
        </div>

        <div className="stat-card">
          <h3>Total Revenue</h3>
          <p>₹ {totalRevenue.toLocaleString("en-IN")}</p>
        </div>

        <div className="stat-card">
          <h3>Payment Proofs</h3>
          <p>{paymentProofs.length}</p>
        </div>
      </div>

      {/* Monthly Revenue */}
      <div className="dashboard-section">
        <h2>Monthly Revenue</h2>

        <div className="revenue-grid">
          {revenue.map((amount, index) => (
            <div className="revenue-item" key={index}>
              <span>{months[index]}</span>

              <strong>₹ {Number(amount || 0).toLocaleString("en-IN")}</strong>
            </div>
          ))}
        </div>
      </div>

      {/* Monthly Users */}
      <div className="dashboard-section">
        <h2>Monthly Users</h2>

        <div className="users-grid">
          {months.map((month, index) => (
            <div className="user-month-card" key={month}>
              <h4>{month}</h4>

              <p>
                Bidders: <strong>{users.biddersArray[index] || 0}</strong>
              </p>

              <p>
                Auctioneers:{" "}
                <strong>{users.auctioneersArray[index] || 0}</strong>
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Proofs */}
      <div className="dashboard-section">
        <div className="section-title">
          <h2>Payment Proofs</h2>
          <span>{paymentProofs.length} records</span>
        </div>

        {paymentProofs.length === 0 ? (
          <p className="empty-message">No payment proofs found.</p>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>ID</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {paymentProofs.map((proof, index) => (
                  <tr key={proof._id}>
                    <td>{index + 1}</td>

                    <td>{proof._id?.slice(-8)}</td>

                    <td>
                      ₹ {Number(proof.amount || 0).toLocaleString("en-IN")}
                    </td>

                    <td>
                      <span
                        className={`status ${String(
                          proof.status || "",
                        ).toLowerCase()}`}
                      >
                        {proof.status || "Pending"}
                      </span>
                    </td>

                    <td>
                      <button
                        className="view-btn"
                        onClick={() => openProof(proof)}
                      >
                        View / Edit
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() => deleteProof(proof._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Payment Proof Modal */}
      {selectedProof && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2>Update Payment Proof</h2>

            <div className="form-group">
              <label>Amount</label>

              <input
                type="number"
                value={editAmount}
                onChange={(e) => setEditAmount(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Status</label>

              <select
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value)}
              >
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
                <option value="Settled">Settled</option>
              </select>
            </div>

            <div className="modal-buttons">
              <button className="save-btn" onClick={updateProof}>
                Update
              </button>

              <button
                className="cancel-btn"
                onClick={() => setSelectedProof(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdminDashboard;
