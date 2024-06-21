const BASE_URL =  "https://podcast-api.netlify.app";

// Function to fetch all previews (shows)
export const fetchPreviews = async () => {
  try {
    const response = await fetch(`${BASE_URL}/shows`);
    if (!response.ok) {
      throw new Error('Failed to fetch previews');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching previews:', error);
    throw error;
  }
};

// Function to fetch details of a specific show by show ID
export const fetchShow = async (showId) => {
  try {
    const response = await fetch(`${BASE_URL}/id/${showId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch show with ID ${showId}`);
    }
    const data = await response.json();

    // Assuming 'seasons' and 'episodes' are properties in the SHOW object
    const showDetails = {
      id: data.id,
      title: data.title,
      description: data.description,
      image: data.image,
      seasons: data.seasons.map(season => ({
        id: season.id,
        number: season.number,
        episodes: season.episodes.map(episode => ({
          id: episode.id,
          title: episode.title,
          duration: episode.duration,
          audioSrc: episode.file, // Assuming 'file' contains the audio URL
        })),
      })),
    };

    return showDetails;
  } catch (error) {
    console.error(`Error fetching show with ID ${showId}:`, error);
    throw error;
  }
};