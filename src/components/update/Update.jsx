import React, { useState } from 'react';
import "./update.scss";
import {useQueryClient,useQuery,useMutation} from "@tanstack/react-query"
import { makeRequest } from '../../axios';


const Update = ({setOpenUpdate,user}) => {
    const [cover,setCover]=useState(null)
    const[profilePic,setProfilePic]= useState(null)
    const [email, setEmail]= useState("");
    const [texts, setTexts] =useState({
        name:"",
        city:"",
        website:""
    });

    const handleChange = (e) => {
        setTexts((prev)=>({...prev,[e.target.name]:[e.target.value]}));
        
    };

    const upload = async (file) =>{
        try{
          const formData = new FormData();
          formData.append("profile", file)
          formData.append("cover", file)
          const res = await makeRequest.post("/upload",formData);
          return res.data;
        }catch(err){
          console.log(err);
        }
      };

      const queryClient = useQueryClient();

    const {isLoading} = useQuery({ queryKey: ['users'], queryFn: () => makeRequest.get("/users").then(res=> {
      return res.data;
    }) 
    });
    
    const update = (user) => {
      makeRequest.put("/users",user);
    }
    
      // Mutations
      const mutation = useMutation({
        mutationFn: update,
        onSuccess: () => {
          // Invalidate and refetch
          queryClient.invalidateQueries({ queryKey: ['users'] })
        },
      })
    
    
      const handleClick = async (e) => {
        e.preventDefault();

        let coverUrl= user.coverPic;
        let profileUrl=user.profilePic;
        coverUrl= cover ? await upload(cover) : user.coverPic;
        // profileUrl= profile && await upload(profile)

        mutation.mutate({...texts,coverPic:coverUrl,profilePic:profileUrl})
        setOpenUpdate(false)
      }



    
   
  return (
    <div className='update'>
        Update
        <form>
            {/* <input type='file' name='profile'/> */}
            <input type='file' name='cover'/>
            <input type='text' name='name' onChange={handleChange}/>
            <input type='email'name='email' onChange={handleChange}/>
            <input type='text' name='city' onChange={handleChange}/>
            <input type='text' name='website' onChange={handleChange}/>
            <button onClick={handleClick}>Update</button>
        </form>
      <button onClick={()=>setOpenUpdate(false)}>X</button>
    </div>
  )
}

export default Update
