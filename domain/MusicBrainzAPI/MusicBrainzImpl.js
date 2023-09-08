

  const searchSongByTitleAndArtist = async (songName, artistName) => {
  const encodedSongName = encodeURIComponent(songName);
  const encodedArtistName = encodeURIComponent(artistName);
  const url = `https://musicbrainz.org/ws/2/recording/?query=recording:${encodedSongName}%20AND%20artist:${encodedArtistName}&limit=5&fmt=json`;

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'react-native-SoundBox/1.0 (jones73@sheridancollege.ca)', // User- Agent contact
      },
    });

    const data = await response.json();

    if (data.recordings && data.recordings.length > 0) {
      const releaseId = data.recordings[0].releases[0].id;
      return releaseId;
    } else {
      console.log('Song not found on MusicBrainz.');
      return null;
    }
  } catch (error) {
    console.error('Error searching for song:', error);
    return null;
  }
};

const fetchCoverArt = async (releaseId) => {
  const url = `https://coverartarchive.org/release/${releaseId}`;

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'react-native-SoundBox/1.0 (jones73@sheridancollege.ca)', // User- Agent contact
      },
    });

    const data = await response.json();

    if (data.images && data.images.length > 0) {
      const imageUrl = data.images[0].thumbnails.large;
      console.log('Cover Art URL:', imageUrl);
      // Use the imageUrl to display the cover art in your application
    } else {
      console.log('No cover art found for this song.');
    }
  } catch (error) {
    console.error('Error fetching cover art:', error);
  }
};

const searchAndFetchSongCoverArt = async (songName, artistName) => {
    const releaseId = await searchSongByTitleAndArtist(songName, artistName);
    if (releaseId) {
      const imageUrl = await fetchCoverArt(releaseId);
      if (imageUrl) {
        return imageUrl;
      } else {
        throw new Error('No cover art found for this song.');
      }
    } else {
      throw new Error('Song not found on MusicBrainz.');
    }
  };
  


