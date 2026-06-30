import React from 'react';
import { IoMdClose } from 'react-icons/io';

const VideoModal = ({ trailerUrl, onClose }) => {
  if (!trailerUrl) return null;

  // Determine if it's a YouTube URL
  const isYouTube = trailerUrl.includes('youtube.com') || trailerUrl.includes('youtu.be');
  
  // Extract YouTube Video ID
  let youtubeId = '';
  if (isYouTube) {
    if (trailerUrl.includes('youtu.be/')) {
      youtubeId = trailerUrl.split('youtu.be/')[1].split('?')[0];
    } else if (trailerUrl.includes('watch?v=')) {
      youtubeId = trailerUrl.split('watch?v=')[1].split('&')[0];
    }
  }

  return (
    <div className="video-modal-overlay" onClick={onClose}>
      <div className="video-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="video-modal-close" onClick={onClose}>
          <IoMdClose size={30} />
        </button>
        <div className="player-wrapper">
          {isYouTube ? (
            <iframe
              className="react-player"
              src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&controls=1`}
              width="100%"
              height="100%"
              style={{ border: 'none' }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="Trailer"
            ></iframe>
          ) : (
            <video
              className="react-player"
              src={trailerUrl}
              width="100%"
              height="100%"
              controls
              autoPlay
            ></video>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoModal;
