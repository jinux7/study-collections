import React, { useState, useEffect } from 'react'

const Home = ({ dispatch, goodsList }) => {
  // console.log(dispatch, goodsList);
  const [info, setInfo] = useState(0)
  useEffect(() => {
    console.log('effect');
  }, [info]);
  return (
    <div>
      <p>{info}</p>
      <button onClick={() => setInfo(info>7?info:info+1)}> 点击更改info</button>
      {goodsList.map(item=> {
        return (
          <p key={item}>{item}</p>
        );
      })}
    </div>
  )
}
export default Home