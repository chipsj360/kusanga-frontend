import { useEffect, useState } from "react";
import API from "../api";

const TrainingRecords = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRecords = async () => {
    try {
      const res = await API.get("/api/training-records/");
      setRecords(res.data);
    } catch (err) {
      console.error("Error fetching training records:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  return (
    <div className="container py-4">
      <h4 className="mb-4">Training Records</h4>

      {loading ? (
        <p>Loading training records...</p>
      ) : records.length === 0 ? (
        <div className="alert alert-info">No training records found.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-striped align-middle">
            <thead>
              <tr>
                <th>#</th>
                <th>Full Name</th>
                <th>Username</th>
                <th>Course</th>
                <th>Record Type</th>
                <th>Status</th>
                <th>Achieved On</th>
                <th>Expires On</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record, index) => (
                <tr key={record.id}>
                  <td style={{ color: "#000", backgroundColor: "#fff" }}>{index + 1}</td>
                  <td style={{ color: "#000", backgroundColor: "#fff" }}>{record.full_name || "-"}</td>
                  <td style={{ color: "#000", backgroundColor: "#fff" }}>{record.username}</td>
                  <td style={{ color: "#000", backgroundColor: "#fff" }}>{record.course_title}</td>
                  <td style={{ color: "#000", backgroundColor: "#fff" }}>
                    {record.course_record_type === "compliance"
                      ? "Compliance"
                      : "Competence"}
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        record.status === "compliant" || record.status === "competent"
                          ? "bg-success"
                          : "bg-secondary"
                      }`}
                    >
                      {record.status}
                    </span>
                  </td>
                  <td style={{ color: "#000", backgroundColor: "#fff" }}>
                    {record.achieved_on
                      ? new Date(record.achieved_on).toLocaleString()
                      : "-"}
                  </td>
                  <td style={{ color: "#000", backgroundColor: "#fff" }}>
                    {record.expires_on
                      ? new Date(record.expires_on).toLocaleString()
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TrainingRecords;