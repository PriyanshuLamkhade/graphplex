import { createSupabaseClient } from "@/lib/client"

const supabase = createSupabaseClient()
export default function Auth(){
    async function login(provider: "google" | "github"){
        const {data,error} = await supabase.auth.signInWithOAuth({
            provider:provider
        })
        
    }
    return <div>
        <button onClick={()=>{login("google")}} className="m-2 px-4 py-2 border bg-blue-200 rounded-xl">Google Login</button>
        <button onClick={()=>{login("github")}} className="m-2  px-4 py-2 border bg-blue-200 rounded-xl">Github Login</button>
    </div>
}