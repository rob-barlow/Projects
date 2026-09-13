import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";


export default function Callback() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const code = params.get("code");
    console.log("Exchanging code for token");

    if (!code) return;

    fetch("http://127.0.0.1:5000/auth/callback?code=" + code, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    })

    navigate("/");
  }, []);

  return <div>Authenticating…</div>;
}
