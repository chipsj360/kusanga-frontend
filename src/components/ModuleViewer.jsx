// src/components/ModuleViewer.jsx
import React, { useEffect, useRef, useState } from "react";

const ModuleViewer = ({ module }) => {
  const scormContainerRef = useRef(null);
  const videoRef = useRef(null);
  const lastAllowedVideoTimeRef = useRef(0);
  const ignoreNextVideoSeekRef = useRef(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [videoVolume, setVideoVolume] = useState(1);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [blockedVideoSeek, setBlockedVideoSeek] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement === scormContainerRef.current);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape" && isExpanded) setIsExpanded(false);
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isExpanded]);

  useEffect(() => {
    lastAllowedVideoTimeRef.current = 0;
    ignoreNextVideoSeekRef.current = false;
    setBlockedVideoSeek(false);
    setIsVideoPlaying(false);
  }, [module?.id]);

  if (!module) return <p>No module selected.</p>;

  const isMaximized = isFullscreen || isExpanded;

  const toggleScormSize = async () => {
    const container = scormContainerRef.current;
    if (!container) return;

    if (document.fullscreenElement === container) {
      await document.exitFullscreen();
      return;
    }

    if (isExpanded) {
      setIsExpanded(false);
      return;
    }

    if (container.requestFullscreen) {
      try {
        await container.requestFullscreen();
        return;
      } catch (error) {
        console.warn("Fullscreen unavailable; using expanded view.", error);
      }
    }

    setIsExpanded(true);
  };

  const toggleVideoPlayback = async () => {
    const video = videoRef.current;
    if (!video) return;

    try {
      if (video.paused) await video.play();
      else video.pause();
    } catch (error) {
      console.error("Video playback error:", error);
    }
  };

  const rewindVideo = () => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = Math.max(0, video.currentTime - 10);
  };

  const handleVideoTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.currentTime > lastAllowedVideoTimeRef.current) {
      lastAllowedVideoTimeRef.current = video.currentTime;
    }
  };

  const handleVideoSeeking = () => {
    const video = videoRef.current;
    if (!video) return;

    if (ignoreNextVideoSeekRef.current) {
      ignoreNextVideoSeekRef.current = false;
      return;
    }

    if (video.currentTime > lastAllowedVideoTimeRef.current + 0.2) {
      setBlockedVideoSeek(true);
      ignoreNextVideoSeekRef.current = true;
      video.currentTime = lastAllowedVideoTimeRef.current;
    }
  };

  const handleVideoVolumeChange = (event) => {
    const nextVolume = Number(event.target.value);
    const video = videoRef.current;
    setVideoVolume(nextVolume);
    setIsVideoMuted(nextVolume === 0);

    if (video) {
      video.volume = nextVolume;
      video.muted = nextVolume === 0;
    }
  };

  const toggleVideoMute = () => {
    const video = videoRef.current;
    if (!video) return;

    const nextMuted = !video.muted;
    video.muted = nextMuted;
    if (!nextMuted && video.volume === 0) {
      video.volume = 1;
      setVideoVolume(1);
    }
    setIsVideoMuted(nextMuted);
  };

  const renderContent = () => {
    switch (module.content_type) {
      case "video":
        return (
          <div>
            {blockedVideoSeek && (
              <div className="alert alert-warning py-2">
                Skipping forward is not allowed. You can replay previously watched sections.
              </div>
            )}
            <video
              ref={videoRef}
              controls={false}
              disablePictureInPicture
              playsInline
              src={module.file || module.video_url}
              className="w-100 rounded shadow"
              style={{ maxHeight: "500px", backgroundColor: "#000" }}
              onTimeUpdate={handleVideoTimeUpdate}
              onSeeking={handleVideoSeeking}
              onPlay={() => setIsVideoPlaying(true)}
              onPause={() => setIsVideoPlaying(false)}
              onVolumeChange={(event) => {
                setVideoVolume(event.currentTarget.volume);
                setIsVideoMuted(
                  event.currentTarget.muted || event.currentTarget.volume === 0,
                );
              }}
            />
            <div className="d-flex flex-wrap align-items-center gap-3 mt-2">
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={toggleVideoPlayback}
              >
                {isVideoPlaying ? "Pause" : "Play"}
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                onClick={rewindVideo}
              >
                Back 10 seconds
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                onClick={toggleVideoMute}
              >
                {isVideoMuted ? "Unmute" : "Mute"}
              </button>
              <label className="d-flex align-items-center gap-2 mb-0">
                <span>Volume</span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isVideoMuted ? 0 : videoVolume}
                  onChange={handleVideoVolumeChange}
                  aria-label="Video volume"
                />
              </label>
            </div>
          </div>
        );

      case "pdf":
        return (
          <iframe
            src={module.file}
            width="100%"
            height="600px"
            title="PDF Viewer"
            style={{ border: "none" }}
          />
        );

      case "scorm":
        return (
          <div
            ref={scormContainerRef}
            style={{
              display: "flex",
              flexDirection: "column",
              backgroundColor: "#fff",
              ...(isExpanded
                ? {
                    position: "fixed",
                    inset: 0,
                    zIndex: 2000,
                    padding: "0.75rem",
                  }
                : {}),
            }}
          >
            <div className="d-flex justify-content-end mb-2">
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                onClick={toggleScormSize}
                title={isMaximized ? "Restore SCORM player" : "Maximize SCORM player"}
                aria-label={isMaximized ? "Restore SCORM player" : "Maximize SCORM player"}
              >
                {isMaximized ? "Minimize" : "Maximize"}
              </button>
            </div>
            <iframe
              src={`/scorm/player/?module_id=${module.id}`}
              width="100%"
              title="SCORM Player"
              style={{
                border: "none",
                height: isMaximized ? "100%" : "600px",
                flex: isMaximized ? "1 1 auto" : undefined,
                minHeight: 0,
              }}
              allow="fullscreen"
            />
          </div>
        );

      default:
        return <p>Unsupported module type.</p>;
    }
  };

  return (
    <div>
      <h5 className="fw-bold mb-3">{module.title}</h5>
      <p className="text-muted">{module.description}</p>
      {renderContent()}
    </div>
  );
};

export default ModuleViewer;