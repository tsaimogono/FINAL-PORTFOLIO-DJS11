

const Episode = ({ episode }) => {
  return (
    <li className="episode-item">
      <div className="episode-details">
        <h4 className="episode-title">{episode.title}</h4>
        <p className="episode-duration">Duration: {episode.duration}</p>
        {/* Implement favorite toggle button and functionality here */}
      </div>
    </li>
  );
};

export default Episode;
