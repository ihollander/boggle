import { useContext, useEffect } from 'react'
import ActionCableContext from './Context'

const useActionCable = (channel, { received, initialized, connected, disconnected, rejected }) => {
  const cable = useContext(ActionCableContext)

  const params = JSON.stringify(channel)

  useEffect(() => {
    if (cable) {
      const subscription = cable.subscriptions.create(JSON.parse(params), {
        received,
        initialized,
        connected,
        disconnected,
        rejected
      })

      return () => {
        subscription.unsubscribe()
      }
    }
  }, [cable, params])

  return { cable }
}

export default useActionCable