import React, { useState, useRef } from 'react'

const LikeButton: React.FC = () => {
  const [like, setLike] = useState(0)
  const likeRef = useRef(0)
  function handleClickAlert() {
    setTimeout(() => {
      alert('you click on' + likeRef.current)
    }, 3000)
  }
  return (
    <>
      <button onClick={() => { setLike(like + 1); likeRef.current++ }}>
        {like}👍
      </button>
      <button onClick={() => { handleClickAlert() }}>
        Alert!
      </button>
    </>
  )
}
export default LikeButton
