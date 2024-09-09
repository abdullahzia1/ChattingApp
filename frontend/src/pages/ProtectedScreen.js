import React, { useState, useEffect } from "react";

import useAxios from "../utils/useAxios";

const ProtectedScreen = () => {
  let [data, setData] = useState([]);

  let api = useAxios();

  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    let response = await api.get("/api/users/protected");
    console.log(response);
    setData(response.data);
    console.log(data);
    // setData(response.data);
  };
  return (
    <div>
      <p>You are logged to the PROTECTED page!</p>

      <ul>
        <div>Hi from PROTECTED Screen with some data from protected Route</div>
        {data ? (
          data.map((d) => <div> HI FROM DATA: {d}</div>)
        ) : (
          <p>OOPSIE, DATA RAN INTO PROBLEMS</p>
        )}
      </ul>
    </div>
  );
};

export default ProtectedScreen;
