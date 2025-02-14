import Loader from "@/components/shared/Loader";
import PostCard from "@/components/shared/PostCard";
import { useUserContext } from "@/context/AuthContext";
import { useGetRecentPostsbyFollowing } from "@/lib/react-query/queriesAndMutations";
import { Models } from "appwrite";

const Home = () => {
  const { user } = useUserContext();
  const { data: posts, isLoading: isPostLoading } =
    useGetRecentPostsbyFollowing(user.id);

  if (isPostLoading) {
    return (
      <div className="pt-[100px]">
        <Loader />;
      </div>
    );
  }

  if (!posts?.documents.length) {
    return (
      <div className="flex flex-1">
        <div className="home-container h3-bold">No posts to show</div>
      </div>
    );
  }

  return (
    <div className="flex flex-1">
      <div className="home-container">
        <div className="home-posts">
          <h2 className="h3-bold md:h2-bold text-left w-full">Home Feed</h2>
          {isPostLoading && !posts ? (
            <Loader />
          ) : (
            <ul className="flex flex-col flex-1 gap-9 w-full">
              {posts?.documents.map((post: Models.Document) => (
                <PostCard key={post?.$id} post={post} />
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
