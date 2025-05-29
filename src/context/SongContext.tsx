// ✅ Import React hooks, types, and axios for API requests
import axios from "axios";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

// ✅ Base URL of the backend server
const server = "http://15.206.212.210:8000";

// ✅ Interface: Defines the structure of a Song object
export interface Song {
  id: string;
  title: string;
  description: string;
  album: string;
  audio: string;
  thumbnail: string;
}

// ✅ Interface: Defines the structure of an Album object
export interface Album {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
}

// ✅ Interface: Describes the shape of the SongContext value
interface SongContextType {
  songs: Song[];                      // List of all songs
  song: Song | null;
  isPlaying: boolean;                 // Playback state
  setIsPlaying: (value: boolean) => void; // Function to update playback state
  loading: boolean;                   // Loading state during API calls
  selectedSong: string | null;       // Currently selected song ID
  setSelectedSong: (id: string) => void; // Function to select a song
  albums: Album[];                   // List of albums
  fetchSingleSong:()=>Promise<void>;
  nextSong:()=>void;
  prevSong:()=>void;
  albumSong:Song;
  albumData:Album|null;
  fetchAlbumSongs:(id:string)=>Promise<void>;
  fetchSongs:()=>Promise<void>
  fetchAlbums:()=>Promise<void>

}

// ✅ Create a Context for songs — initialized with undefined
//    It will be provided with actual values in <SongProvider>
const SongContext = createContext<SongContextType | undefined>(undefined);

// ✅ Interface: Props for the SongProvider component
interface SongProviderProps {
  children: ReactNode; // Any valid React elements/components
}

// ✅ SongProvider: Wraps children with SongContext.Provider
export const SongProvider: React.FC<SongProviderProps> = ({ children }) => {
  // ✅ State declarations
  const [songs, setSongs] = useState<Song[]>([]);               // List of songs
  const [albums, setAlbums] = useState<Album[]>([]);            // List of albums
  const [loading, setLoading] = useState<boolean>(true);        // Loading indicator
  const [selectedSong, setSelectedSong] = useState<string | null>(null); // Selected song ID
  const [isPlaying, setIsPlaying] = useState<boolean>(false);   // Whether a song is currently playing
  const [song, setSong] = useState<Song|null>(null);
  
  const fetchSingleSong=useCallback(async()=>{
    if(!selectedSong)return;
    try {
      const {data}= await axios.get<Song>(`${server}/api/v1/song/${selectedSong}`)
      setSong(data)
    } catch (error) {
      console.log(error)
    }
  },[selectedSong])
  // ✅ Fetch all songs from the API
  const fetchSongs = useCallback(async () => {
    setLoading(true); // Show loading indicator while fetching

    try {
      const { data } = await axios.get<Song[]>(`${server}/api/v1/song/all`);

      if (data.length > 0) {
        // Select the first song by default
        setSelectedSong(data[0].id.toString());
      }

      setSongs(data);     // Store songs in state
      setIsPlaying(false); // Stop playback initially
    } catch (error) {
      console.error("Error fetching songs:", error);
    } finally {
      setLoading(false); // Hide loading indicator
    }
  }, []);

  // ✅ Fetch all albums from the API
  const fetchAlbums = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await axios.get<Album[]>(`${server}/api/v1/album/all`);
      setAlbums(data); // Store albums in state
    } catch (error) {
      console.error("Error fetching albums:", error);
    }finally{
      setLoading(false)
    }
  }, []);
  const [index, setIndex] = useState<number>(0);
  
  const nextSong=useCallback(()=>{
    if(index===songs.length-1){
      setIndex(0)
      setSelectedSong(songs[0]?.id.toString())
    }else{
      setIndex((prevIndex)=>prevIndex+1);
      setSelectedSong(songs[index+1]?.id.toString())
    }
  },[index,songs])

  const prevSong=useCallback(()=>{
    if(index>0){
      setIndex((prev)=>prev-1)
      setSelectedSong(songs[index-1]?.id.toString())
    }
  },[index,songs])

  const [albumSong, setAlbumSong] = useState<Song[]>([]);
  const [albumData, setAlbumData] = useState<Album|null>(null);
  const fetchAlbumSongs=useCallback(async(id:string)=>{
    setLoading(true)
    try {
      const {data}= await axios.get<{songs:Song[];album:Album}>(`${server}/api/v1/album/${id}`)
      setAlbumData(data.album)
      setAlbumSong(data.songs)
    } catch (error) {
      console.log(error)
    }finally{
      setLoading(false)
    }
  },[])
  
  

  // ✅ Fetch songs and albums on initial render (component mount)
  useEffect(() => {
    fetchSongs();
    fetchAlbums();
  }, [fetchSongs, fetchAlbums]);

  // ✅ Provide context value to all children components
  return (
    <SongContext.Provider
      value={{
        songs,
        isPlaying,
        setIsPlaying,
        loading,
        selectedSong,
        setSelectedSong,
        albums,
        fetchSingleSong,
        song,
        nextSong,
        prevSong,
        fetchAlbumSongs,
        albumData,
        albumSong,
        fetchAlbums,
        fetchSongs,
      }}
    >
      {children}
    </SongContext.Provider>
  );
};

// ✅ Custom hook to access SongContext from components
export const useSongData = (): SongContextType => {
  const context = useContext(SongContext);

  // ✅ Guard clause: Ensures hook is used within a SongProvider
  if (!context) {
    throw new Error("useSongData must be used within a SongProvider");
  }

  return context;
};
