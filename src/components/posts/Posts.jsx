import { makeRequest } from "../../axios";
import Post from "../post/Post";
import "./posts.scss";
import { useQuery } from '@tanstack/react-query';

const Posts = ({userId}) => {

const { isLoading, error, data } = useQuery({
    queryKey: ['posts'],
    queryFn: () => makeRequest.get("/posts?userId="+userId).then(res => {
      return res.data;
    })
  },
);

  return (
  <div className="posts">
    { error 
    ? "Something Went Wrong!" + error.message
    : isLoading 
    ? "Loading Please Wait..." 
    : data.map((post) => <Post post={post} key={post.id}/>)}
  </div>
  );
};

export default Posts;
