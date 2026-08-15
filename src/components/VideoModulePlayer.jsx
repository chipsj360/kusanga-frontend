import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api";

const formatTime = (seconds) => {
  if (!Number.isFinite(seconds)) return "00:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
};

const VideoModulePlayer = () => {
  const { moduleId } = useParams();

  const videoRef = useRef(null);
  const playerWrapperRef = useRef(null);
  const lastAllowedTimeRef = useRef(0);
  const durationRef = useRef(0);
  const hasCompletedRef = useRef(false);
  const ignoreNextSeekRef = useRef(false);

  const [module, setModule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [blockedSeek, setBlockedSeek] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const fetchModule = async () => {
      lastAllowedTimeRef.current = 0;
      durationRef.current = 0;
      hasCompletedRef.current = false;
      ignoreNextSeekRef.current = false;
      setBlockedSeek(false);
      setCurrentTime(0);
      setDuration(0);

      try {
        const res = await API.get(`/api/modules/${moduleId}/`);
        setModule(res.data);
        await API.post(`/api/modules/${moduleId}/start/`);
      } catch (err) {
        console.error("Failed to load module:", err?.response?.data || err);
      } finally {
        setLoading(false);
      }
    };

    fetchModule();
  }, [moduleId]);

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", onFullscreenChange);
    };
  }, []);

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
    const video = videoRef.current;
    if (!video) return;

    durationRef.current = video.duration || 0;
    setDuration(video.duration || 0);
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;

    setCurrentTime(video.currentTime);

    if (video.currentTime > lastAllowedTimeRef.current) {
      lastAllowedTimeRef.current = video.currentTime;
    }

    const fullDuration = durationRef.current || video.duration || 0;
    const reachedEnd = fullDuration > 0 && video.currentTime >= fullDuration - 1;

    if (reachedEnd && !hasCompletedRef.current) {
      hasCompletedRef.current = true;
      completeModule();
    }
  };

  const handleSeeking = () => {
    const video = videoRef.current;
    if (!video) return;

    if (ignoreNextSeekRef.current) {
      ignoreNextSeekRef.current = false;
      return;
    }

    const allowed = lastAllowedTimeRef.current + 0.2;

    if (video.currentTime > allowed) {
      setBlockedSeek(true);
      ignoreNextSeekRef.current = true;
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

  const togglePlayPause = async () => {
    const video = videoRef.current;
    if (!video) return;

    try {
      if (video.paused) {
        await video.play();
      } else {
        video.pause();
      }
    } catch (err) {
      console.error("Play/pause error:", err);
    }
  };

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        if (playerWrapperRef.current?.requestFullscreen) {
          await playerWrapperRef.current.requestFullscreen();
        }
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.error("Fullscreen error:", err);
    }
  };

  const rewindTenSeconds = () => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = Math.max(0, video.currentTime - 10);
    setCurrentTime(video.currentTime);
  };

  const handleVolumeChange = (event) => {
    const nextVolume = Number(event.target.value);
    const video = videoRef.current;
    setVolume(nextVolume);
    setIsMuted(nextVolume === 0);

    if (video) {
      video.volume = nextVolume;
      video.muted = nextVolume === 0;
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    const nextMuted = !video.muted;
    video.muted = nextMuted;
    if (!nextMuted && video.volume === 0) {
      video.volume = 1;
      setVolume(1);
    }
    setIsMuted(nextMuted);
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

      <div
        ref={playerWrapperRef}
        className="card shadow-sm"
        style={{
          backgroundColor: "#111",
          color: "#fff",
          padding: isFullscreen ? "16px" : "0px",
          height: isFullscreen ? "100vh" : "auto",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div className="card-body w-100 d-flex flex-column justify-content-center">
          <video
            ref={videoRef}
            src={getVideoUrl()}
            controls={false}
            disablePictureInPicture
            playsInline
            style={{
              width: "100%",
              maxHeight: isFullscreen ? "80vh" : "75vh",
              backgroundColor: "#000",
            }}
            onLoadedMetadata={handleLoadedMetadata}
            onTimeUpdate={handleTimeUpdate}
            onSeeking={handleSeeking}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />

          <div className="d-flex align-items-center justify-content-between mt-3 flex-wrap gap-2">
            <div className="d-flex flex-wrap align-items-center gap-2">
              <button type="button" className="btn btn-primary" onClick={togglePlayPause}>
                {isPlaying ? "Pause" : "Play"}
              </button>

              <button
                type="button"
                className="btn btn-outline-light"
                onClick={rewindTenSeconds}
              >
                Back 10 seconds
              </button>

              <button type="button" className="btn btn-outline-light" onClick={toggleMute}>
                {isMuted ? "Unmute" : "Mute"}
              </button>

              <label className="d-flex align-items-center gap-2 mb-0">
                <span>Volume</span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  aria-label="Video volume"
                />
              </label>

              <button type="button" className="btn btn-outline-light" onClick={toggleFullscreen}>
                {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
              </button>
            </div>

            <div className="fw-semibold">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>

          <div className="mt-3">
            <div className="progress" style={{ height: "10px" }}>
              <div
                className="progress-bar"
                role="progressbar"
                style={{
                  width: duration ? `${(currentTime / duration) * 100}%` : "0%",
                }}
                aria-valuenow={duration ? (currentTime / duration) * 100 : 0}
                aria-valuemin="0"
                aria-valuemax="100"
              />
            </div>
            <small className="text-light">
              You can go back to replay watched content. Seeking forward is disabled.
            </small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoModulePlayer;