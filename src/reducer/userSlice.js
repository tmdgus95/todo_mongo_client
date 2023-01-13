// 작은 store 역할의 slice
// 사용자 정보 저장 내용이라서 파일명을 userSlice
import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    nickName: "", // 사용자 닉네임
    uid: "", // firebase 연동을 위한 고유식별자
    accessToken: "", // firebase 에서 임시로 생성해줌. 로그아웃하면 없어짐
    email: "", // 사용자 이메일
  },
  reducers: {
    // 로그인 되면 user 스토어 state 업데이트,
    loginUser: (state, action) => {
      // action.payload 로 담겨옴.
      state.nickName = action.payload.displayName;
      state.uid = action.payload.uid;
      state.accessToken = action.payload.accessToken;
      state.email = action.payload.email;
    },
    // 로그아웃 하면 user 스토어 state 비우기.
    clearUser: (state, action) => {
      state.nickName = "";
      state.uid = "";
      state.accessToken = "";
      state.email = "";
    },
  },
});
// 비구조화(destructuring)
export const { loginUser, clearUser } = userSlice.actions;
export default userSlice;
