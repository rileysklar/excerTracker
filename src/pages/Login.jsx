import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

const Login = () => {
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setErrorMsg("");
      setLoading(true);
      if (!passwordRef.current.value || !emailRef.current.value) {
        setErrorMsg("Please fill in the fields");
        setLoading(false);
        return;
      }
      const { user, session, error } = await login(
        emailRef.current.value,
        passwordRef.current.value
      );
      console.log({ user, session, error });
      if (error) {
        setErrorMsg(error.message);
      } else if (user && session) {
        console.log("Successfully authenticated, navigating to home.");
        navigate("/");
      } else {
        console.log("Successfully authenticated, navigating to home.");
        navigate("/");
      }
    } catch (error) {
      setErrorMsg("Email or Password Incorrect");
    }
  };

  return (
    <div className="card">
      <div className="card-body">
        <h2 className="text-center mb-4">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group" id="email">
            <label>Email</label>
            <input
              type="email"
              ref={emailRef}
              required
              className="form-control"
            />
          </div>
          <div className="form-group" id="password">
            <label>Password</label>
            <input
              type="password"
              ref={passwordRef}
              required
              className="form-control"
            />
          </div>
          {errorMsg && (
            <div
              className="alert alert-danger"
              role="alert"
              onClick={() => setErrorMsg("")}
            >
              {errorMsg}
            </div>
          )}
          <div className="text-center mt-2">
            <button
              disabled={loading}
              type="submit"
              className="btn btn-primary w-50"
            >
              Login
            </button>
          </div>
        </form>
      </div>
      <div className="text-center mt-2">
        New User? <Link to={"/register"}>Register</Link>
      </div>
    </div>
  );
};

export default Login;
