import GridPostList from "@/components/shared/GridPostList";
import Loader from "@/components/shared/Loader";
import { Button } from "@/components/ui/button";
import { useUserContext } from "@/context/AuthContext";
import {
  Route,
  Routes,
  Link,
  Outlet,
  useParams,
  useLocation,
} from "react-router-dom";
import { LikedPosts } from ".";
import {
  useFolowerUser,
  useGetUserById,
  UseunFolowerUser,
} from "@/lib/react-query/queriesAndMutations";

interface StabBlockProps {
  value: string | number;
  label: string;
}

const StatBlock = ({ value, label }: StabBlockProps) => (
  <div className="flex-center gap-2">
    <p className="small-semibold lg:body-bold text-primary-500">{value}</p>
    <p className="small-medium lg:base-medium text-light-2">{label}</p>
  </div>
);

const Profile = () => {
  const { id } = useParams();
  const { user } = useUserContext();
  const { pathname } = useLocation();
  console.log(user);
  const { data: currentUser } = useGetUserById(id || "");
  console.log(currentUser);
  let isfollowing = false;
  for (let i = 0; i < currentUser?.followers.length; i++) {
    if (currentUser?.followers[i] === user.id) {
      isfollowing = true;
      break;
    }
  }

  const { mutate: follow, isPending: isLoading1 } = useFolowerUser();
  const { mutate: unfollow, isPending: isLoading2 } = UseunFolowerUser();
  const { data: userdata, isPending } = useGetUserById(id || "");
  function handleClick() {
    if (!isfollowing) {
      console.log("follow");
      follow({ userId: user.id, followingId: currentUser?.$id });
    } else {
      console.log("unfollow");
      unfollow({ userId: user.id, followingId: currentUser?.$id });
    }
  }

  if (!currentUser || isPending)
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );

  return (
    <div className="profile-container">
      <div className="profile-inner_container">
        <div className="flex xl:flex-row flex-col max-xl:items-center flex-1 gap-7">
          <img
            src={
              currentUser.imageUrl || "/assets/icons/profile-placeholder.svg"
            }
            alt="profile"
            className="w-28 h-28 lg:h-36 lg:w-36 rounded-full"
          />
          <div className="flex flex-col flex-1 justify-between md:mt-2">
            <div className="flex flex-col w-full">
              <h1 className="text-center xl:text-left h3-bold md:h1-semibold w-full">
                {currentUser.name}
              </h1>
              <p className="small-regular md:body-medium text-light-3 text-center xl:text-left">
                @{currentUser.username}
              </p>
            </div>

            <div className="flex gap-8 mt-10 items-center justify-center xl:justify-start flex-wrap z-20">
              <StatBlock value={currentUser.posts.length} label="Posts" />
              <StatBlock value={userdata?.followers.length} label="Followers" />
              <StatBlock value={userdata?.following.length} label="Following" />
            </div>

            <p className="small-medium md:base-medium text-center xl:text-left mt-7 max-w-screen-sm">
              {currentUser.bio}
            </p>
          </div>

          <div className="flex justify-center gap-4">
            <div className={`${user.id !== currentUser.$id && "hidden"}`}>
              <Link
                to={`/update-profile/${currentUser.$id}`}
                className={`h-12 bg-dark-4 px-5 text-light-1 flex-center gap-2 rounded-lg ${
                  user.id !== currentUser.$id && "hidden"
                }`}
              >
                <img
                  src={"/assets/icons/edit.svg"}
                  alt="edit"
                  width={20}
                  height={20}
                />
                <p className="flex whitespace-nowrap small-medium">
                  Edit Profile
                </p>
              </Link>
            </div>
            <div className={`${user.id === id && "hidden"}`}>
              <Button
                type="button"
                className="shad-button_primary px-8"
                onClick={handleClick}
              >
                {isLoading1 || isLoading2 ? (
                  <Loader />
                ) : isfollowing ? (
                  "Unfollow"
                ) : (
                  "Follow"
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex max-w-5xl w-full">
        <Link
          to={`/profile/${id}`}
          className={`profile-tab rounded-l-lg ${
            pathname === `/profile/${id}` && "!bg-dark-3"
          }`}
        >
          <img
            src={"/assets/icons/posts.svg"}
            alt="posts"
            width={20}
            height={20}
          />
          Posts
        </Link>
        {currentUser.$id === user.id && (
          <Link
            to={`/profile/${id}/liked-posts`}
            className={`profile-tab rounded-r-lg ${
              pathname === `/profile/${id}/liked-posts` && "!bg-dark-3"
            }`}
          >
            <img
              src={"/assets/icons/like.svg"}
              alt="like"
              width={20}
              height={20}
            />
            Liked Posts
          </Link>
        )}
      </div>
      <Routes>
        <Route
          index
          element={<GridPostList posts={currentUser.posts} showUser={false} />}
        />
        {currentUser.$id === user.id && (
          <Route path="/liked-posts" element={<LikedPosts />} />
        )}
      </Routes>
      <Outlet />
    </div>
  );
};

export default Profile;
