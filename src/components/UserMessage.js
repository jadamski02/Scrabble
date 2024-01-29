import React from 'react'

function UserMessage(props) {
  return (
    <div className='userMessage'>
      {props.mes.login}: {props.mes.message}
    </div>
  )
}

export default UserMessage