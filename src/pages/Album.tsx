import { useParams } from "react-router-dom"
import Layout from "../components/Layout"
import { useSongData, type Song } from "../context/SongContext"
import { useEffect } from "react"
import Loading from "../components/Loading"
import { FaBookmark, FaPlay } from "react-icons/fa"
import { useUserData } from "../context/UserContext"

const Album = () => {
    const { fetchAlbumSongs, albumSong, albumData, setIsPlaying, setSelectedSong, loading } = useSongData()
    const { isAuth, addToPlaylist } = useUserData()
    const params = useParams<{ id: string }>()
    useEffect(() => {
        if (params.id) {
            fetchAlbumSongs(params.id)

        }
    }, [params.id])
    return (
        <div>
            <Layout>
                {albumData && (
                    <>{loading ? (<Loading />) :
                        (<>
                            <div className="mt-10 flex gap-8 flex-col md:flex-row md:items-center ">
                                {
                                    albumData.thumbnail && (
                                        <img src={albumData.thumbnail} className="w-48 rounded" alt="" />
                                    )
                                }
                                <div className="flex flex-col">
                                    <p>Playlist</p>
                                    <h2 className="text-3xl font-bold md-4 md:text-5xl">
                                        {albumData.title} Playlist
                                    </h2>
                                    <h4 >{albumData.description}</h4>
                                    <p className="mt-1">
                                        <img src="/logo.png" className="inline-block w-6" alt="" />
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 sm:grid-cols-4 mt-10 mb-4 pl-2 text-[#a7a7a7]">
                                <p>
                                    <b className="mr-4">#</b>
                                </p>
                                <p className="hidden sm:block ">Description</p>
                                <p className="text-center">Actions</p>
                            </div>
                            <hr />
                            {
                                albumSong && albumSong.map((song:Song, index:number) => {
                                    return (
                                        <div className="grid grid-cols-3 sm:grid-cols-4 mt-10 mb-4 pl-2 text-[#a7a7a7] hover:bg-[#ffffff2b] cursor-pointer" key={index}>
                                            <p className="text-white">
                                                <b className="mr-4 text-[#a7a7a7]">{index + 1}</b>
                                                <img className="inline w-10 mr-5" src={song.thumbnail ? song.thumbnail : "/music-icon.jpg"} alt="" />{""}{song.title}
                                            </p>
                                            <p className="text-[15px] hidden sm:block">{song.description.slice(0, 30)}...</p>
                                            <div className="flex justify-center items-center gap-5">
                                                {isAuth && <button className="text-[15px] text-center" onClick={() => { addToPlaylist(song.id) }}><FaBookmark /></button>}
                                                <button onClick={() => { setSelectedSong(song.id); setIsPlaying(true) }} className="text-[15px] text-center"><FaPlay /></button>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </>
                        )}
                    </>
                )}
            </Layout>
        </div>
    )
}

export default Album
