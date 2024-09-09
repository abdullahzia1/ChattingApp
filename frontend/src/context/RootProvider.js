import { AuthProvider } from "./AuthContext";
import { PostProvider } from "./PostContext";

const RootProvider = ({ children }) => {
  return (
    <AuthProvider>
      <PostProvider>{children}</PostProvider>
    </AuthProvider>
  );
};

export default RootProvider;
