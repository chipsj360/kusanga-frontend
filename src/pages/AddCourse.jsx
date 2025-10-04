import { useState,useEffect } from "react";
import API from "../api";
import "../assets/css/bootstrap.min.css";
import "../assets/css/adduser.css";

const AddCourse = ({ onClose, onSuccess }) => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    course_type: "",
    duration: "",
    created_by: "",
    created_at: "",
  });
  const [courseTypes, setCourseTypes] = useState([]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/api/courses/", form);
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Error adding Courses");
    }
  };
 useEffect(() =>{
    const fetchData= async () =>{
        try{
            const res = await API.get("api/course-types/");
            setCourseTypes(res.data);
        }catch(err){
            console.error("Error fetching users:", err);
        }
    }
fetchData();
 },[]);

  return (
    <div className="modal show d-block" tabIndex="-1">
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">Add New User</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body">
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label>Title</label>
                  <input type="text" name="title" className="form-control text-dark bg-white" onChange={handleChange} />
                </div>
                <div className="col-md-6 mb-3">
                  <label>Description</label>
                  <input type="text" name="description" className="form-control" onChange={handleChange} />
                </div>
                <div className="col-md-6 mb-3">
                  <label>Duration</label>
                  <input type="number" name="duration" className="form-control" onChange={handleChange} />
                </div>
                <div className="col-md-6 mb-3">
                  <label>Course Type</label>
                  <select name="course_type" className="form-select" onChange={handleChange}>
                        <option value="">Select Course Type</option>
                        {courseTypes.map((courseType) => (
                            <option key={courseType.value} value={courseType.value}>
                            {courseType.label}
                            </option>
                        ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="submit" className="btn btn-primary">Save</button>
              <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCourse;
