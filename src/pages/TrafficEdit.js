import React, { memo, useCallback, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { getItem, putItem, getCurrentData } from "../slice/TrafficSlice";

import Spinner from "../components/Spinner";
import ErrorView from "../components/ErrorView";
import TableEx from "../components/TableEx";

import RegexHelper from '../helper/RegexHelper';

const TrafficEdit = memo(() => {
  // path 파라미터 받기
  const { id } = useParams();

  /** 리덕스 관련 초기화  */
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state) => state.TrafficSlice);

  /** 데이터 가져오기 */
  useEffect(() => {
    dispatch(getCurrentData());
  }, []);

  /** data값의 변경에 따른 사이드 이펙트 처리 */
  const item = useMemo(() => {
    if (data) {
      return data.find((v, i) => v.id == id);
    } else {
      // 새로고침 시 현재 데이트만 다시 로드
      dispatch(getItem({ id: id }));
    }
  }, [data]);

  /** 페이지 강제이동 함수 생성 */
  const navigate = useNavigate();

  /** <form>의 submit 버튼이 눌러졌을 때 호출될 이벤트 리스너 */
  const onTrafficSubmit = useCallback((e) => {
    e.preventDefault();

    // 이벤트가 발생한 폼 객체
    const current = e.target;

     // 입력값에 대한 유효성 검사
     const regexHelper = RegexHelper.getInstance();

     try {
       regexHelper.value(document.querySelector('.year'), '년도를 입력하세요.')
       regexHelper.value(document.querySelector('.month'), '월을 입력하세요.')
       regexHelper.num(document.querySelector('.accident'), '교통사고 건수는 숫자로만 입력 가능합니다.')
       regexHelper.num(document.querySelector('.death'), '사망자 수는 숫자로만 입력 가능합니다.')
       regexHelper.num(document.querySelector('.injury'), '부상자 수느 숫자로만 입력 가능합니다.')
     } catch(e) {
       alert(e.message);
       return;
     }

    // 리덕스를 통한 데이터 수정 요청
    dispatch(putItem({
      id: current.id.value,
      year: current.year.value,
      month: current.month.value,
      accident: current.accident.value,
      death: current.death.value,
      injury: current.injury.value,
    })).then((result) => {
      console.log(result);

      // 처리 완료 시 상세 페이지로 이동
      navigate(`/traffic_view/${result.payload.id}`);
    })
  },[]);


  return (
    <div>
      {/* 로딩바 */}
      <Spinner loading={loading} />

      {error ? (
        <ErrorView error={error} />
      ) : (
        <form onSubmit={onTrafficSubmit}>
          <input type="hidden" name="id" defaultValue={item?.id} />
          <TableEx>
            <colgroup>
              <col width="120" />
              <col />
            </colgroup>
            <tbody>
              <tr>
                <th>년도</th>
                <td className="inputWrapper">
                  <input type="number" className="field year" name="year" defaultValue={item?.year} />
                </td>
              </tr>
              <tr>
                <th>월</th>
                <td className="inputWrapper">
                  <input type="number" className="field month" name="month" defaultValue={item?.month} />
                </td>
              </tr>
              <tr>
                <th>교통사고 건수</th>
                <td className="inputWrapper">
                  <input type="number" className="field accident" name="accident" defaultValue={item?.accident} />
                </td>
              </tr>
              <tr>
                <th>사망자 수</th>
                <td className="inputWrapper">
                  <input type="number" className="field death" name="death" defaultValue={item?.death}/>
                </td>
              </tr>
              <tr>
                <th>부상자 수</th>
                <td className="inputWrapper">
                  <input type="number" className="field injury" name="injury" defaultValue={item?.injury} />
                </td>
              </tr>
            </tbody>
          </TableEx>

          <div style={{ textAlign: "center" }}>
            <button type="submit">저장하기</button>
          </div>
        </form>
      )}
    </div>
  );
});

export default TrafficEdit;
