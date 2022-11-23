import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { pending, fulfilled, rejected} from '../helper/ReduxHelper';
import { cloneDeep } from "lodash";

/** 다중행 데이터 조회를 위한 비동기 함수 */
export const getList = createAsyncThunk(
  "TrafficSlice/getList",
  async (payload, { rejectWithValue }) => {
    let result = null;
    const URL = process.env.REACT_APP_API_TRAFFIC_LIST;

    try {
      const response = await axios.get(URL);
      result = response.data;
    } catch (err) {
      result = rejectWithValue(err.response);
    }

    return result;
  }
);

/** 단일행 데이터 조회를 위한 비동기 함수 */
export const getItem = createAsyncThunk(
  "TrafficSlice/getItem",
  async (payload, { rejectWithValue }) => {
    let result = null;
    const URL = process.env.REACT_APP_API_TRAFFIC_ITEM.replace(':id', payload.id);

    try {
      const response = await axios.get(URL);
      result = response.data;
    } catch (err) {
      result = rejectWithValue(err.response);
    }

    return result;
  }
);

/** 데이터 저장을 위한 비동기 함수 */
export const postItem = createAsyncThunk(
  "TrafficSlice/postItem",
  async (payload, { rejectWithValue }) => {
    let result = null;
    const URL = process.env.REACT_APP_API_TRAFFIC_LIST;

    try {
      const response = await axios.post(URL, {
        year: payload.year,
        month: payload.month,
        accident: payload.accident,
        death: payload.death,
        injury: payload.injury
      });
      result = response.data;
    } catch (err) {
      result = rejectWithValue(err.response);
    }

    return result;
  }
);

/** 데이터 수정을 위한 비동기 함수 */
export const putItem = createAsyncThunk(
  "TrafficSlice/putItem",
  async (payload, { rejectWithValue }) => {
    let result = null;
    const URL = process.env.REACT_APP_API_TRAFFIC_ITEM.replace(':id', payload.id);

    try {
      const response = await axios.put(URL, {
        year: payload.year,
        month: payload.month,
        accident: payload.accident,
        death: payload.death,
        injury: payload.injury
      });
      result = response.data;
    } catch (err) {
      result = rejectWithValue(err.response);
    }

    return result;
  }
);

/** 데이터 삭제를 위한 비동기 함수 */
export const deleteItem = createAsyncThunk(
  "TrafficSlice/deleteItem",
  async (payload, { rejectWithValue }) => {
    let result = null;
    const URL = process.env.REACT_APP_API_TRAFFIC_ITEM.replace(':id', payload.id);

    try {
      const response = await axios.delete(URL);
      result = response.data;
    } catch (err) {
      result = rejectWithValue(err.response);
    }

    return result;
  }
);

const TrafficSlice = createSlice({
  name: "TrafficSlice",
  // 이 모듈이 관리하고자하는 상태값들을 명시
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {
    getCurrentData: (state, action) => {
      return state
    }
  },
  extraReducers: {
    /** 다중행 데이터 조회를 위한 액션함수 */
    [getList.pending]: pending,
    [getList.fulfilled]: fulfilled,
    [getList.rejected]: rejected,

    /** 단행 데이터 조회를 위한 액션함수 */
    [getItem.pending]: pending,
    [getItem.fulfilled]: (state, { meta, payload }) => {
      return {
        data: [payload],
        loading: false,
        error: null
      }
    },
    [getItem.rejected]: rejected,

    /** 데이터 저장을 위한 액션함수 */
    [postItem.pending]: pending,
    [postItem.fulfilled]: (state, {meta, payload}) => {
      // 기존 상태값 깊은 복사 처리
      const data = cloneDeep(state.data);
      console.log(data);

      // 새로 저장한 결과를 기존 상태값 배열에 추가
      data.push(payload);

      return {
        data: data,
        loading: false,
        error: null
      }
    },
    [postItem.rejected]: rejected,

    /** 데이터 수정을 위한 액션함수 */
    [putItem.pending]: pending,
    [putItem.fulfilled]: (state, { meta, payload} ) => {
      // 기존 상태값 깊은 복사 처리
      const data = cloneDeep(state.data);
      console.log(data);

      // id값이 일치하는 항목의 배열 인덱스를 찾는다.
      const targetId = data.findIndex((v, i) => v.id == meta.arg.id);
      console.log(targetId);

      // 해당 인덱스의 원소를 백엔드의 응답 결과로 교체한다.
      data.splice(targetId, 1, payload);

      return {
        data: data,
        loading: false,
        error: null
      }
    },
    [putItem.rejected]: rejected,
    
    /** 데이터 삭제를 위한 액션함수 */
    [deleteItem.pending]: pending,
    [deleteItem.fulfilled]: (state, {meta, payload}) => {
      // 기존 상태값 깊은 복사 처리
      const data = cloneDeep(state.data);
      console.log(data);

      // id값이 일치하는 항목의 배열 인덱스를 찾는다.
      const targetId = data.findIndex((v, i) => v.id == meta.arg.id);
      console.log(targetId);

      // 해당 인덱스의 원소를 삭제한다.
      data.splice(targetId, 1);

      return {
        data: data,
        loading: false,
        error: null
      }
    },
    [deleteItem.rejected]: rejected,
  },
});

export const {getCurrentData} = TrafficSlice.actions;
export default TrafficSlice.reducer;
