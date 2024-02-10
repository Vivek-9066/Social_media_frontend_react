import { useContext, useState } from "react";
import "./comments.scss";
import { AuthContext } from "../../context/authContext";
import { useMutation,useQueryClient,useQuery} from '@tanstack/react-query'
import {makeRequest} from '../../axios'
import moment from 'moment'

const Comments = ({postId}) => {
  const[desc,setDesc] = useState("");
  const { currentUser } = useContext(AuthContext);

  //tanstack-query-react

  const queryClient = useQueryClient();

  const { isLoading, data } = useQuery({
    queryKey: ['comments'],
    queryFn: () => makeRequest.get('/comments?postId='+ postId).then((res) => {
      return res.data;
    })

  },
);

const commentsAdd = (newComments) => {
  makeRequest.post('/comments', newComments);
}

  // Mutations
  const mutation = useMutation({
    mutationFn: commentsAdd,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["comments"] })
    },
  })


  const handleClick =  (e) => {
    e.preventDefault();
    mutation.mutate({desc,postId})
    setDesc("");
  }
  console.log(data)

  return (
    <div className="comments">
      <div className="write">
        <img src={currentUser.profilePic} alt="" />
        <input type="text" placeholder="write a comment" onChange={e => setDesc(e.target.value)} value={desc} />
        <button onClick={handleClick}>Send</button>
      </div>
      {isLoading ? "Loading Please wait..."
      :data.map((comment) => (
        <div className="comment">
          <img src={comment.profilePic} alt=""  />
          <div className="info">
            <span>{comment.name}</span>
            <p>{comment.desc}</p>
          </div>
          <span className="date">{moment(comment.createdAt).fromNow()}</span>
        </div>
      ))}
    </div>
  );
};

export default Comments;
