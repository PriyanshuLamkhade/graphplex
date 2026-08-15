import { createClient } from "@/lib/client"
import type { User } from "@supabase/supabase-js"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router";

const supabase = createClient()

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