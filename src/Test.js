import React, { memo, useEffect } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { getList, getItem, postItem, putItem, deleteItem } from './slice/TrafficSlice';

const Test = memo(() => {
    const dispatch = useDispatch();
    const { data, loading, error} = useSelector((state) => state.TrafficSlice);

    useEffect(() => {
        // dispatch(getList());
        
        // dispatch(getItem({id : 1}));

        // dispatch(postItem({name: 'test', userid: 'test'}));

        // dispatch(putItem({id: 169, year: '수정test', month: 'test'}));

        // dispatch(deleteItem({id: 169}));
    }, [dispatch]);

    return (

        loading ? "loading..." : (
            error ? JSON.stringify(error) : (
                <>
                    {JSON.stringify(data)}
                </>
            )
        )
    )
});

export default Test;