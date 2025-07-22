import React from 'react'
import AppRoutes from "./routes/AppRoutes"
import { LiveblocksProvider } from "@liveblocks/react"

const App = () => {
  return (
    <LiveblocksProvider publicApiKey={"pk_dev_hcuF-yVqgy31Xmt0-KijqIJ0xUTsqt8vXTUdPX2yRhcimqY_7nFjqN7UZB4-rWDZ"}>
      <AppRoutes></AppRoutes>
    </LiveblocksProvider>
  )
}

export default App