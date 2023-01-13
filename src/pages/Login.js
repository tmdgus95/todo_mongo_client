import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginDiv from "../styles/loginCss";

// firebase 로그인
import firebase from "../firebase.js";

const Login = () => {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const navigate = useNavigate();

  // 로그인 처리
  const signInFunc = (event) => {
    event.preventDefault();
    if (!email) {
      return alert("이메일을 입력하세요.");
    }
    if (!pw) {
      return alert("비밀번호를 입력하세요.");
    }
    // https://firebase.google.com/docs/auth/web/start
    const tempUser = firebase.auth();
    tempUser
      .signInWithEmailAndPassword(email, pw)
      .then((userCredential) => {
        // 로그인 성공
        const user = userCredential.user;
        console.log(user);
        navigate("/todo");
        // Redux 를 이용한 App 의 store 관리 시작
        // component 의 state 로 관리하기는 복잡하다.
      })
      .catch((error) => {
        // 로그인 실패
        const errorCode = error.code;
        const errorMessage = error.message;
        // console.log(errorCode, errorMessage);
        if (errorCode === "auth/wrong-password") {
          setErrMsg("비밀번호를 확인하세요.");
        } else if (errorCode === "auth/user-not-found") {
          setErrMsg("이메일을 확인하세요.");
        } else {
          setErrMsg("로그인에 실패하였습니다.");
        }
      });
  };

  return (
    <div className="p-6 m-4 shadow">
      <h2>Login</h2>
      <LoginDiv>
        <form>
          <label>이메일</label>
          <input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <label>비밀번호</label>
          <input
            type="password"
            required
            maxLength={8}
            value={pw}
            onChange={(event) => setPw(event.target.value)}
          />
          {errMsg != "" && <p style={{ color: "red" }}>{errMsg}</p>}
          <button onClick={(e) => signInFunc(e)}>로그인</button>
          <button
            onClick={(event) => {
              event.preventDefault();
              navigate("/signup");
            }}
          >
            회원가입
          </button>
        </form>
      </LoginDiv>
    </div>
  );
};

export default Login;
