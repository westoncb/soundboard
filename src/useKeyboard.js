import { useEffect } from 'react'

export default function useKeyboard(callback) {
  useEffect(() => {
    function down(e) {
      const key = e.key
      const shift = e.shiftKey
      callback(key, shift)
    }
    window.addEventListener('keydown', down)
    return () => window.removeEventListener('keydown', down)
  }, [callback])
}
