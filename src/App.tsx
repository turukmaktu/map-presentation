import { useState } from 'react'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import MapIcon from '@mui/icons-material/Map'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Box sx={{ minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <MapIcon sx={{ mr: 1 }} />
          <Typography variant="h6">Map Presentation</Typography>
        </Toolbar>
      </AppBar>
      <Container sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Vite + React + Material UI
        </Typography>
        <Button variant="contained" onClick={() => setCount((c) => c + 1)}>
          Count is {count}
        </Button>
      </Container>
    </Box>
  )
}

export default App
