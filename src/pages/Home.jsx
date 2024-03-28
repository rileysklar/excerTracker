import { useAuth } from "../context/AuthProvider";
import Calendar from "../components/Calendar/Calendar";

const Home = () => {
  const { user } = useAuth();

  return (
    <>
      <div>You are logged in and your email address is {user.email}</div>
      <Calendar />
    </>
  );
};

export default Home;
