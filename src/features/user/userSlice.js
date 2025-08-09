import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { showToastMessage } from "../common/uiSlice";
import api from "../../utils/api";
import { initialCart } from "../cart/cartSlice";

export const loginWithEmail = createAsyncThunk(
  "user/loginWithEmail",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });
      sessionStorage.setItem("token", response.data.token);

      // 성공
      // 로그인페이지에서  네비게이트
      return response.data;
    } catch (error) {
      // 실패
      // 실패 에러값 reducer 에 저장

      return rejectWithValue(error.error);
    }
  }
);

export const loginWithGoogle = createAsyncThunk(
  "user/loginWithGoogle",
  async (token, { rejectWithValue }) => {}
);

export const logout = () => (dispatch) => {
  // 로컬스토리지에서 토큰 제거
  sessionStorage.removeItem("token");
  dispatch(initialCart());

  // Redux store에서 사용자 정보 제거
  dispatch(logoutAction());
};
export const registerUser = createAsyncThunk(
  "user/registerUser",
  async (
    { email, name, password, navigate },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const response = await api.post("/user", {
        email,
        name,
        password,
      });

      dispatch(
        showToastMessage({
          message: "회원가입을 축하드립니다 🎉",
          status: "success",
        })
      );
      console.log("회원가입 성공", response);
      navigate("/login");

      return response.data.data;
    } catch (error) {
      console.log("회원가입 에러", error);
      dispatch(
        showToastMessage({
          status: "error",
          message:
            error.message || "회원가입에 실패했습니다. 다시 시도해주세요.",
        })
      );
      return rejectWithValue(error.error);
    }
  }
);

export const loginWithToken = createAsyncThunk(
  "user/loginWithToken",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/user/me");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.error);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    loading: false,
    loginError: null,
    registrationError: null,
    success: false,
  },
  reducers: {
    clearErrors: (state) => {
      state.loginError = null;
      state.registrationError = null;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.loginError = null;
      state.registrationError = null;
      state.loading = false;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.registrationError = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.registrationError = action.payload;
      })
      .addCase(loginWithEmail.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginWithEmail.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.loginError = null;
      })
      .addCase(loginWithEmail.rejected, (state, action) => {
        state.loginError = action.payload;
        state.loading = false;
      })
      .addCase(loginWithToken.fulfilled, (state, action) => {
        state.user = action.payload.user;
      });
  },
});
export const { clearErrors, logout: logoutAction } = userSlice.actions;
export default userSlice.reducer;
