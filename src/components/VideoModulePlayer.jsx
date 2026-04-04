import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api";

const VideoModulePlayer = () => {
  const { moduleId } = useParams();
  const videoRef = useRef(null);
  const lastAllowedTimeRef = useRef(0);
  const durationRef = useRef(0);
  const hasCompletedRef = useRef(false);
  const [module, setModule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [blockedSeek, setBlockedSeek] = useState(false);

  useEffect(() => {
    const fetchModule = async () => {
      try {
        const res = await API.get(`/api/modules/${moduleId}/`);
        setModule(res.data);
        await API.post(`/api/modules/${moduleId}/start/`);
      } catch (err) {
        console.error("Failed to load module:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchModule();
  }, [moduleId]);

  const getVideoUrl = () => {
    if (!module) return null;
    if (module.video_url) return module.video_url;
    if (module.file) {
      if (module.file.startsWith("http")) return module.file;
      return `${API.defaults.baseURL}${module.file}`;
    }
    return null;
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      durationRef.current = videoRef.current.duration || 0;
    }
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.currentTime > lastAllowedTimeRef.current) {
      lastAllowedTimeRef.current = video.currentTime;
    }

    const duration = durationRef.current || video.duration || 0;
    const reachedEnd = duration > 0 && video.currentTime >= duration - 1;

    if (reachedEnd && !hasCompletedRef.current) {
      hasCompletedRef.current = true;
      completeModule();
    }
  };

  const handleSeeking = () => {
    const video = videoRef.current;
    if (!video) return;

    // Allow tiny differences caused by browser buffering
    const allowed = lastAllowedTimeRef.current + 1.5;

    if (video.currentTime > allowed) {
      setBlockedSeek(true);
      video.currentTime = lastAllowedTimeRef.current;
    }
  };

  const completeModule = async () => {
    try {
      await API.post(`/api/modules/${moduleId}/complete/`, {
        watched_to_end: true,
        final_position: lastAllowedTimeRef.current,
        duration: durationRef.current,
        seek_blocked: blockedSeek,
      });
    } catch (err) {
      console.error("Failed to complete module:", err?.response?.data || err);
    }
  };

  if (loading) return <div className="p-4">Loading video...</div>;
  if (!module) return <div className="p-4">Module not found.</div>;

  return (
    <div className="container py-4">
      <h3>{module.title}</h3>
      <p>{module.description}</p>

      {blockedSeek && (
        <div className="alert alert-warning">
          Skipping forward is not allowed. Please watch the video normally.
        </div>
      )}

      <video
        ref={videoRef}
        src={getVideoUrl()}
        controls
        controlsList="nodownload noplaybackrate"
        style={{ width: "100%", maxHeight: "75vh" }}
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        onSeeking={handleSeeking}
      />
    </div>
  );
};

export default VideoModulePlayer;