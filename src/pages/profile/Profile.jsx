import "./profile.scss";
import FacebookTwoToneIcon from "@mui/icons-material/FacebookTwoTone";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import PinterestIcon from "@mui/icons-material/Pinterest";
import TwitterIcon from "@mui/icons-material/Twitter";
import PlaceIcon from "@mui/icons-material/Place";
import LanguageIcon from "@mui/icons-material/Language";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Posts from "../../components/posts/Posts"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { useLocation } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import Share from "../../components/share/Share";
import Update from "../../components/update/Update";

const Profile = () => {
  const [openUpdate, setOpenUpdate]= useState(false)
  const {currentUser} = useContext(AuthContext);
  const userId = parseInt(useLocation().pathname.split("/")[2], 10);

  const { isLoading, data } = useQuery({
    queryKey: ["users"],
    queryFn: () => makeRequest.get("/users/find/"+userId).then(res => {
      return res.data;
    })
  },
);
const {isLoading :relationLoading, data:relationshipData } = useQuery({
  queryKey: ['relatonships'],
  queryFn: () =>  makeRequest.get('/relationship?followedUserId='+ userId).then(res => {
    return res.data;
  })
},
);

const queryClient = useQueryClient();

const addRelation = (following) => {
  if(following) return makeRequest.delete("/relationship?userId="+userId);
  return makeRequest.post("/relationship",{userId})
}
const mutation = useMutation({
  mutationFn: addRelation,
  onSuccess: () => {
    // Invalidate and refetch
    queryClient.invalidateQueries({ queryKey: ['relatonships'] })
  },
});

const handleFollow = () => {
mutation.mutate(relationshipData.includes(currentUser.id));
};

  return (
    <div className="profile">
     { isLoading ? "Loading": <><div className="images">
        <img
          src={data.coverPic}
          alt=""
          className="cover"
        />
        <img
          src={data.profilePic}
          alt=""
          className="profilePic"
        />
      </div>
      <div className="profileContainer">
        <div className="uInfo">
          <div className="left">
            <a href="http://facebook.com">
              <FacebookTwoToneIcon fontSize="large" />
            </a>
            <a href="http://facebook.com">
              <InstagramIcon fontSize="large" />
            </a>
            <a href="http://facebook.com">
              <TwitterIcon fontSize="large" />
            </a>
            <a href="http://facebook.com">
              <LinkedInIcon fontSize="large" />
            </a>
            <a href="http://facebook.com">
              <PinterestIcon fontSize="large" />
            </a>
          </div>
          <div className="center">
            <span>{data.name}</span>
            <div className="info">
              <div className="item">
                <PlaceIcon />
                <span>{data.city}</span>
              </div>
              <div className="item">
                <LanguageIcon />
                <span>{data.website}</span>
              </div>
            </div>
            {relationLoading ? "Loading.." : userId === currentUser.id ? (
            <button onClick={()=>setOpenUpdate(true)}>Update</button>
            ) : (
            <button onClick={handleFollow}>
              {Array.isArray(relationshipData) && relationshipData.includes(currentUser.id) ? "Following" : "Follow" }</button>
              )}
          </div>
          <div className="right">
            <EmailOutlinedIcon />
            {isLoading ? "Loading.." : data.email}
            <MoreVertIcon />
          </div>
        </div>
        <Share/>
      <Posts userId={userId}/>
      </div>
      </>
      }
      {openUpdate && <Update setOpenUpdate={setOpenUpdate} user={data}/>}
    </div>
  );
};

export default Profile;
