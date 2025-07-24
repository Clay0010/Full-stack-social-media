import { useQuery } from "@tanstack/react-query";
import { getUser } from "../lib/api";

const useGetUser = ({ userId }) => {
  const user = useQuery({
    queryKey: ["GetUser"],
    queryFn: () => getUser(userId),
    retry: false,
  });

  return user;
};

export default useGetUser;
