import { createSupabaseClient } from "@/lib/client"
import { BACKEND_URL } from "@/lib/config";
import type { User } from "@supabase/supabase-js"
import axios from "axios";
import { useEffect, useState } from "react"
import { useNavigate } from "react-router";

const supabase = createSupabaseClient()

export default function Dashboard() {
    const [user, setUser] = useState<User | null>(null);
    const navigate = useNavigate()
    useEffect(() => {
        async function getInfo() {
            const { data, error } = await supabase.auth.getUser()
            if (data.user) {
                setUser(data.user)
            }
        }
        getInfo()
    }, [])

    useEffect(()=>{
        async function getExisitingConversations(){
            if(user){
                const {data:{session}} = await supabase.auth.getSession()
                const token = session?.access_token
                const res = await axios.get(`${BACKEND_URL}/conversations`,{
                    headers:{
                        Authorization:token
                    }
                })
                console.log(res.data)
            }
        }
        getExisitingConversations()
    },[user])

    return <>
        {!user && <button className="m-2 px-4 py-2 border bg-blue-200 rounded-xl" onClick={() => { (navigate("/auth")) }}>Signin</button>}
        {user && <div>
            {user?.email}
            <button className="m-2 px-4 py-2 border bg-blue-200 rounded-xl" onClick={() => { 
                supabase.auth.signOut() 
                setUser(null)
                }}>Logout</button>
        </div>}
    </>
}