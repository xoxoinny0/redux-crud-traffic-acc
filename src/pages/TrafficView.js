import React, { memo, useEffect, useMemo, useCallback } from "react";
import { NavLink, useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getItem, getCurrentData, deleteItem } from "../slice/TrafficSlice";

import Spinner from "../components/Spinner";
import ErrorView from "../components/ErrorView";
import Table from "../components/Table";

const TrafficView = memo(() => {
  /** path 파라미터 받기 */
  const { id } = useParams();

  /** 리덕스 관련 초기화 */
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state) => state.TrafficSlice);

  /** 데이터 가져오기 */
  useEffect(() => {
    dispatch(getCurrentData());
  },[]);

  /** data값의 변경에 따른 사이드 이펙트 처리 */
  const item = useMemo(() => {
    if (data) {
      return data.find((v, i) => v.id == id);
    } else {
      // 새로 고침시 현재 데이터만 다시 로드함
      dispatch(getItem({id: id}));
    }
  },[data]);

  /** 페이지 강제이동 함수 생성 */
  const navigate = useNavigate();

  /** 삭제 버튼에 대한 이벤트 리스너 */
  const onTrafficItemDelete = useCallback((e) => {
    e.preventDefault();

    const { id } = e.target.dataset;

    if (window.confirm(`정말 ${id}번건을 삭제하시겠습니까?`)) {
      dispatch(deleteItem({
        id: id
      })).then(({ meta, payload }) => {
        // 삭제 후 목록페이지로 이동
        navigate('/');
      })
    }
  },[]);

  return (
    <div>
      {/* 로딩바 */}
      <Spinner loading={loading}/>

      {error? (
        <ErrorView error={error} />
      ): (
        item && (
          <div>
            <Table>
              <colgroup>
                <col width='120'/>
                <col />
              </colgroup>
              <tbody>
                <tr>
                  <th>번호</th>
                  <td>{item.id}</td>
                </tr>
                <tr>
                  <th>년도</th>
                  <td>{item.year}년</td>
                </tr>
                <tr>
                  <th>월</th>
                  <td>{item.month}월</td>
                </tr>
                <tr>
                  <th>교통사고 건수</th>
                  <td>{item.accident.toLocaleString()}건</td>
                </tr>
                <tr>
                  <th>사망자 수</th>
                  <td>{item.death.toLocaleString()}명</td>
                </tr>
                <tr>
                  <th>부상자 수</th>
                  <td>{item.injury.toLocaleString()}명</td>
                </tr>
              </tbody>
            </Table>

            <div style={{ textAlign: "center ", padding: "10px" }}>
              <NavLink to="/">목록</NavLink>
              &nbsp; | &nbsp;
              <NavLink to="/traffic_add">등록</NavLink>
              &nbsp; | &nbsp;
              <NavLink to={`/traffic_edit/${item.id}`}>수정</NavLink>
              &nbsp; | &nbsp;
              <NavLink to="#!" onClick={onTrafficItemDelete} data-id={item.id}>삭제</NavLink>
            </div>


          </div>
        )
      )}
    </div>
  )
});

export default TrafficView;