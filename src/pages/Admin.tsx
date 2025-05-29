import { Link, useNavigate } from "react-router-dom"
import { useUserData } from "../context/UserContext"
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react"
import { useSongData } from "../context/SongContext"
import toast from "react-hot-toast"
import axios from "axios"
import { MdDelete } from "react-icons/md"

const Admin = () => {
    const server = "http://15.206.212.210:5678"
    const navigate = useNavigate()
    const { user } = useUserData()
    const { albums, songs, fetchSongs, fetchAlbums } = useSongData()
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [album, setAlbum] = useState<string>("");
    const [file, setFile] = useState<File | null>(null)
    const [btnLoading, setBtnLoading] = useState<boolean>(false);
    const fileChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0] || null
        setFile(selectedFile)
    }
    const addAlbumHandler = async (e: FormEvent) => {
        e.preventDefault()
        if (!file) return
        const formData = new FormData()
        formData.append("title", title)
        formData.append("description", description)
        formData.append("file", file)
        setBtnLoading(true)
        try {
            const { data } = await axios.post(`${server}/api/v1/album/new`, formData, {
                headers: {
                    token: localStorage.getItem("token")
                }
            })
            toast.success(data.message)
            fetchAlbums()
            setBtnLoading(false)
            setTitle("")
            setDescription("")
            setFile(null)

        } catch (error: any) {
            toast.error(error.response?.data?.message || "An Error Occured")
        }
    }
    const addSongHandler = async (e: FormEvent) => {
        e.preventDefault()
        if (!file) return
        const formData = new FormData()
        formData.append("title", title)
        formData.append("description", description)
        formData.append("file", file)
        formData.append("album", album)


        setBtnLoading(true)
        try {
            const { data } = await axios.post(`${server}/api/v1/song/new`, formData, {
                headers: {
                    token: localStorage.getItem("token")
                }
            })
            toast.success(data.message)
            fetchSongs()
            setBtnLoading(false)
            setTitle("")
            setDescription("")
            setFile(null)
            setAlbum("")

        } catch (error: any) {
            toast.error(error.response?.data?.message || "An Error Occured")
        }
    }

    const addThumbnailHandler = async (id: string) => {
        if (!file) return;
    
        const formData = new FormData();
        formData.append("file", file);
        
        setBtnLoading(true);
    
        try {
          const { data } = await axios.post(
            `${server}/api/v1/song/${id}`,
            formData,
            {
              headers: {
                token: localStorage.getItem("token"),
              },
            }
          );
    
          toast.success(data.message);
          fetchSongs();
          setBtnLoading(false);
          setFile(null);
        } catch (error: any) {
          toast.error(error.response?.data?.message || "An error occured");
          setBtnLoading(false);
        }
    };
    const deleteAlbum=async(id:string)=>{
        if(confirm("Are You Sure You Want to delete This Album?")){
            setBtnLoading(true)
        }
        try {
            const {data}=await axios.delete(`${server}/api/v1/album/${id}`,{
                headers:{
                    token:localStorage.getItem("token")
                }
            })
            toast.success(data.message)
            fetchSongs()
            fetchAlbums()
            setBtnLoading(false)
        } catch (error:any) {
          toast.error(error.response?.data?.message || "An error occured");

            setBtnLoading(false)
        }
    }

    const deleteSong=async(id:string)=>{
        if(confirm("Are You Sure You Want to delete This Song?")){
            setBtnLoading(true)
        }
        try {
            const {data}=await axios.delete(`${server}/api/v1/song/${id}`,{
                headers:{
                    token:localStorage.getItem("token")
                }
            })
            toast.success(data.message)
            fetchSongs()
            setBtnLoading(false)
        } catch (error:any) {
          toast.error(error.response?.data?.message || "An error occured");
            setBtnLoading(false)
        }
    }

    useEffect(() => {
        if (user && user.role !== 'admin') {
            navigate("/")
        }
    }, [user, navigate])

    return (
        <div className="min-h-screen bg-[#212121] text-white p-8">
            <Link to={"/"} className="bg-green-500 text-white font-bold py-2 px-4 rounded-full">GO to HomePage</Link>
            <h2 className="text-2xl font-bold mb-6 mt-6">Add Albums</h2>
            <form onSubmit={addAlbumHandler} className="bg-[#181818] p-6 rounded-lg shadow-lg flex flex-col items-center justify-center gap-4">
                <input type="text" placeholder="Title" className="auth-input" onChange={(e) => setTitle(e.target.value)} value={title} required />

                <input type="text" placeholder="Description" className="auth-input" onChange={(e) => setDescription(e.target.value)} value={description} required />

                {/* accepts all types of image */}
                <input type="file" placeholder="Choose Thumbnail" onChange={fileChangeHandler} required className="auth-input" accept="image/*" />

                <button className="auth-btn" style={{ width: "100px" }} disabled={btnLoading}>{btnLoading ? "Please Wait" : "Add"}</button>

            </form>


            <h2 className="text-2xl font-bold mb-6 mt-6">Add Songs</h2>
            <form onSubmit={addSongHandler} className="bg-[#181818] p-6 rounded-lg shadow-lg flex flex-col items-center justify-center gap-4">
                <input type="text" placeholder="Title" className="auth-input" onChange={(e) => setTitle(e.target.value)} value={title} required />

                <input type="text" placeholder="Description" className="auth-input" onChange={(e) => setDescription(e.target.value)} value={description} required />

                {/* accepts all types of image */}
                <input type="file" placeholder="Choose Audio" onChange={fileChangeHandler} required className="auth-input" accept="audio/*" />

                <select className="auth-input" value={album} onChange={e => setAlbum(e.target.value)} required>
                    <option value="">ChooseAlbum</option>
                    {albums.map((e: any, i: number) => {
                        return <option value={e.id} key={i}>{e.title}</option>
                    })}
                </select>

                <button className="auth-btn" style={{ width: "100px" }} disabled={btnLoading}>{btnLoading ? "Please Wait" : "Add"}</button>

            </form>

            <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4">Added Albums</h3>
                <div className="flex justify-center md:justify-start gap-2 items-center flex-wrap">
                    {
                        albums?.map((e, i) => {
                            return <div className="bg-[#1818181] p-4 rounded-lg shadow-md" key={i}>
                                <img src={e.thumbnail} className="mr-1 w-52 h-52" alt="" />
                                <h4 className="text-lg font-bold">{e.title.slice(0, 20)}</h4>
                                <h4 className="text-lg font-bold">{e.description.slice(0, 20)}...</h4>
                                <button onClick={()=>{deleteAlbum(e.id)}} disabled={btnLoading} className="px-3 py-1 bg-red-500 text-white rounded"><MdDelete /></button>
                            </div>
                        })
                    }
                </div>

            </div>

            <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4">Added Songs</h3>
                <div className="flex justify-center md:justify-start  gap-2 items-center flex-wrap">{songs?.map((e, i) => {
                    return (
                        <div className="bg-[#181818] p-4 rounded-lg shadow-md" key={i}>
                            {e.thumbnail ? (<img src={e.thumbnail} className="mr-1 w-52 h-52" alt="" />) :
                            (<div className="flex flex-col justify-center items-center gap-2 w-[250px]">
                                <input type="file" onChange={fileChangeHandler} />
                                <button className="auth-btn" style={{ width: "200px" }} disabled={btnLoading} onClick={()=>addThumbnailHandler(e.id)}>
                                    {btnLoading ? "Please Wait..." : "Add Thumbnail"}
                                </button>
                            </div>
                            )}
                            <h4 className="text-lg font-bold">{e.title.slice(0, 20)}</h4>
                            <h4 className="text-lg font-bold">{e.description.slice(0, 20)}...</h4>
                            <button onClick={()=>{
                                deleteSong(e.id)
                            }} disabled={btnLoading} className="px-3 py-1 bg-red-500 text-white rounded"><MdDelete /></button>
                        </div>)
                    })
                }</div>
            </div>
        </div>
    )
}

export default Admin;
