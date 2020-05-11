import React, { useState, useEffect } from 'react'
import actioncable from 'actioncable'

import ActionCableContext from './Context'

const ActionCableProvider = ({ ws, children }) => {
  const [consumer, setConsumer] = useState(null)

  useEffect(() => {
    if (consumer == null) {
      setConsumer(
        actioncable.createConsumer(ws)
      )
    }
    return () => {
      if (consumer) {
        consumer.disconnect()
      }
    }
  }, [consumer, ws])

  return (
    <ActionCableContext.Provider value={consumer}>{children}</ActionCableContext.Provider>
  )
}

export default ActionCableProvider