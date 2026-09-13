import { useState } from "react";

const useSearch = (token: string) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);

    const searchSpotify = async () => {
        console.log('searching Spotify for', searchQuery);
        const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(searchQuery)}&type=track`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            console.error('Failed to search Spotify', response.status, response.statusText);
            return;
        }

        const data = await response.json();
        setSearchResults(data.tracks.items);
    };

    return { searchQuery, setSearchQuery, searchResults, searchSpotify };
}

export default useSearch;