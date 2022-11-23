import React, { memo, useEffect, useCallback } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import Spinner from "../components/Spinner";
import ErrorView from "../components/ErrorView";
import Table from "../components/Table";

import { useSelector, useDispatch } from "react-redux";
import { getList, deleteItem } from "../slice/TrafficSlice";

import styled from "styled-components";

// 데이터 추가 박스
const AddContainer = styled.form`
  position: sticky;
  top: 0;
  background-color: #fff;
  border-top: 1px solid #eee;
  padding: 10px 0;

  .controll {
    margin-right: 5px;
    display: inline-block;
    font-size: 16px;
    padding: 7px 10px 5px 10px;
    border: 1px solid #ccc;
  }

  .clickable {
    background-color: #fff;
    color: #000;
    text-decoration: none;
    cursor: pointer;

    &:hover {
      background-color: #06f2;
    }

    &:active {
      transform: scale(0.9, 0.9);
    }
  }
`;

const TrafficList = memo(() => {
  /** 리덕스 관련 초기화 */
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state) => state.TrafficSlice);

  /** 최초 마운드 시 리덕스를 통해 목록을 조회한다. */
  useEffect(() => {
    dispatch(getList());
  }, []);

   /** 삭제 버튼에 대한 이벤트 리스너 */
   const onTrafficItemDelete = useCallback((e) => {
    e.preventDefault();

    const { id } = e.target.dataset;

    if (window.confirm(`정말 ${id}번건을 삭제하시겠습니까?`)) {
      dispatch(deleteItem({
        id: id
      }))
    }
  },[]);

  /** 페이지 강제이동 함수 생성 */
  const navigate = useNavigate();

   /** 수정 버튼에 대한 이벤트 리스너 */
  const onTrafficSubmit = useCallback((e) => {
    e.preventDefault();

    const { id } = e.target.dataset;

    navigate(`/traffic_view/${id}`);
  },[]);
   
  return (
    <div>
      {/* 로딩바 */}
      <Spinner loading={loading} />

      {/* 데이터 추가 폼 */}
      <AddContainer>
        <NavLink to='traffic_add' className="controll clickable">데이터 추가하기</NavLink>
      </AddContainer>

      {/* 조회 결과 표시하기 */}
      {error ? (
        <ErrorView error={error} />
      ) : (
        // Ajax 처리 결과가 존재하는 경우
        data && (
          <Table>
            <thead>
              <tr>
                <th>번호</th>
                <th>년도</th>
                <th>월</th>
                <th>교통사고 건수</th>
                <th>사망자수 </th>
                <th>부상자 수</th>
                <th>수정</th>
                <th>삭제</th>
              </tr>
            </thead>
            <tbody>
              {
                // 데이터 수가 0인 경우 구분해서 처리
                data.length > 0 ? (
                  data.map(
                    ({ id, year, month, accident, death, injury }, i) => {
                      return (
                        <tr key={id}>
                          <td>
                            <NavLink to={`/traffic_view/${id}`}>{id}</NavLink>
                          </td>
                          <td>{year}년</td>
                          <td>{month}월</td>
                          <td>{accident.toLocaleString()}건</td>
                          <td>{death.toLocaleString()}명</td>
                          <td>{injury.toLocaleString()}명</td>
                          <td>
                            <button type="button" onClick={onTrafficSubmit} data-id={id}>수정하기</button>
                          </td>
                          <td>
                            <button type="button" onClick={onTrafficItemDelete} data-id={id}>삭제하기</button>
                          </td>
                        </tr>
                      );
                    }
                  )
                ) : (
                  <tr>
                    <td colSpan="8" align="center">
                      데이터가 존재하지 않습니다.
                    </td>
                  </tr>
                )
              }
            </tbody>
          </Table>
        )
      )}
    </div>
  );
});

export default TrafficList;
