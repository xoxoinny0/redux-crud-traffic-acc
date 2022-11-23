import React, { memo } from "react";
import { Routes, Route } from "react-router-dom";

import TrafficList from './pages/TrafficList';
import TrafficAdd from './pages/TrafficAdd'
import TrafficView from './pages/TrafficView';
import TrafficEdit from './pages/TrafficEdit';

const App = memo(() => {
  return (
    <div>
      <h1>Redux CRUD(3)-traffic-acc</h1>

      <hr />

      <Routes>
        <Route path='/' exapt={true} element={<TrafficList />} />
        <Route path='/traffic_add' element={<TrafficAdd />} />
        <Route path='/traffic_view/:id' element={<TrafficView />} />
        <Route path='/traffic_edit/:id' element={<TrafficEdit />} />
      </Routes>
    </div>
  );
});

export default App;
