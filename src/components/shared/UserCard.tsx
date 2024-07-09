import { Models } from "appwrite";
import { Link } from "react-router-dom";

import { Button } from "../ui/button";
import {
  useFolowerUser,
  UseunFolowerUser,
} from "@/lib/react-query/queriesAndMutations";
import { useUserContext } from "@/context/AuthContext";
import Loader from "./Loader";

type UserCardProps = {
  user: Models.Document;
};

const UserCard = ({ user }: UserCardProps) => {
  const { user: currentUser } = useUserContext();

  let isfollowing = false;
  for (let i = 0; i < user?.followers.length; i++) {
    if (user?.followers[i] === currentUser.id) {
      isfollowing = true;
      break;
    }
  }
  const { mutate: follow, isPending: isLoading1 } = useFolowerUser();
  const { mutate: unfollow, isPending: isLoading2 } = UseunFolowerUser();
  function handleClick() {
    if (!isfollowing) {
      console.log("follow");
      follow({ userId: currentUser.id, followingId: user.$id });
    } else {
      console.log("unfollow");
      unfollow({ userId: currentUser.id, followingId: user.$id });
    }
  }
  if (user.$id === currentUser.id) return null;
  return (
    <Link to={`/profile/${user.$id}`} className="user-card">
      <img
        src={user.imageUrl || "/assets/icons/profile-placeholder.svg"}
        alt="creator"
        className="rounded-full w-14 h-14"
      />

      <div className="flex-center flex-col gap-1">
        <p className="base-medium text-light-1 text-center line-clamp-1">
          {user.name}
        </p>
        <p className="small-regular text-light-3 text-center line-clamp-1">
          @{user.username}
        </p>
      </div>

      <Button
        type="button"
        size="sm"
        className="shad-button_primary px-5"
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
    </Link>
  );
};

export default UserCard;
