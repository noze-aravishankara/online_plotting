import React, { useState, useRef } from 'react';
import Papa from 'papaparse';
import { useDropzone } from 'react-dropzone';
import { Container, AppBar, Toolbar, Typography, Box, Button, Select, MenuItem, Alert, CssBaseline, ThemeProvider, createTheme, Grid } from '@mui/material';
import { UploadFile } from '@mui/icons-material';
import Plot from 'react-plotly.js';
import './App.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  const [csvData, setCsvData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [selectedColumn, setSelectedColumn] = useState(null);
  const [plotAll, setPlotAll] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState(null);
  const chartRef = useRef(null);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: '.csv',
    maxFiles: 1,
  });

  function onDrop(acceptedFiles) {
    const file = acceptedFiles[0];
    setUploadedFileName(file.name);
    Papa.parse(file, {
      complete: (result) => {
        setColumns(result.meta.fields);
        setCsvData(result.data);
        setPlotAll(true); // This line ensures all plots are shown by default upon CSV upload
      },
      header: true,
    });
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App">
        <AppBar position="sticky" color="default">
          <Toolbar>
            <img src={process.env.PUBLIC_URL + '/logo2.png'} alt="Logo" className="logo" />
            <Typography variant="h6" className="title">
              Plots
            </Typography>
          </Toolbar>
        </AppBar>
        <Box display="flex" flexDirection="column" alignItems="center" mt={3}>
            <Box className="main-content" sx={{ mt: 2, flexGrow: 4 }}>
              <Box {...getRootProps()} className="dropzone" sx={{ my: 3 }}>
              <img src={process.env.PUBLIC_URL + '/myLogo1.png'} alt="Your Logo" className="logo" />
                <Button variant="contained" color="primary" {...getInputProps()}>
                  <UploadFile />
                  Select a CSV File 
                </Button>
                <Typography variant="body1"   sx={{
                  mt: 1,
                  backgroundColor: '#53c27e',   // Set the background color
                      color: 'white',         // Set the text color
                        fontWeight: 'bold',
                      padding: '10px 20px', // Add some padding for spacing
                    borderRadius: '10px', // Round the corners
                  cursor: 'pointer', // Show a pointer cursor on hover
           }} className="custom-button">Upload your file</Typography>
              </Box>
              {uploadedFileName && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  Uploaded File: {uploadedFileName}
                </Alert>
              )}
              {columns.length > 0 && (
                <Box className="form-group" sx={{ mt: 2 } }>
                  <Typography variant="body1">Select Column:</Typography>
                  <Select
                    value={selectedColumn || 'plot-all'}
                    onChange={e => {
                      if (e.target.value === 'plot-all') {
                        setPlotAll(true);
                        setSelectedColumn(null);
                      } else {
                        setPlotAll(false);
                        setSelectedColumn(e.target.value);
                      }
                    }}
                    sx={{ mt: 1 }}
                  >
                    {columns.map(column => <MenuItem key={column} value={column}>{column}</MenuItem>)}
                    <MenuItem value="plot-all">Plot All</MenuItem>
                  </Select>
                </Box>
              )}

{selectedColumn && !plotAll && csvData.length > 0 && (
    <Box className="chart-container" display="flex"
    flexDirection="column"  alignItems="center" sx={{ mt: 4, height: '500px', mb: 3 }}>
        <Plot
            data={[
                {
                    x: csvData.map((_, index) => index + 1),
                    y: csvData.map(row => parseFloat(row[selectedColumn])),
                    type: 'scatter',
                    mode: 'lines',
                    marker: { color: 'rgb(100, 10, 192)' },
                    line: { color: 'rgba(6, 9, 91, 0.6)' },
                    name: selectedColumn, 
                },
            ]}
            layout={{
                autosize: true,
                margin: { l: 60, r: 10, t: 10, b: 40 },
                showlegend: true,
                legend: { x: 1, y: 1 },
                xaxis: { 
                    title: 'Time[s]',
                    tickpadding: 10
                },
                yaxis: { 
                    title: selectedColumn,
                    tickpadding: 10
                },
                responsive: true,
                shapes: [
                    {
                        type: 'rect',
                        xref: 'paper',
                        yref: 'paper',
                        x0: 0,
                        y0: 0,
                        x1: 1,
                        y1: 1,
                        fillcolor: 'none',
                        line: {
                            color: 'lightgreen',
                            width: 2
                        }
                    }
                ]
            
            
              }}

            


        />
    </Box>
)}

              {plotAll && csvData.length > 0 && (
                <Box 
                display="flex" 
                flexDirection="column" 
                justifyContent="center" 
                alignItems="center"
                sx={{ mt: 4, height: '100%', mb: 3, width: '100%' }}
            >
                 <Container className="customContainer"  maxWidth="xl" >
                <Grid container spacing={3} sx={{ mt: 1, padding: 0, justifyContent: 'center' }  }>
                  {columns.map(column => (
                    <Grid item xs={12} md={4} key={column} sx={{ 
                      border: '1.5px solid lightgreen',  // This adds a 2px solid border
                      borderRadius: '8px',         // This rounds the corners (optional)
                      padding: 0.1,                  // Internal padding so the plot doesn't touch the border
                      margin: 0.1,                   // Increases the margin around the plot container
                      backgroundColor: '#fff',     // Ensures that the padded area is white (or any color you prefer)
                     
                    }} >
                      <Plot
                        data={[
                          {
                            x: csvData.map((_, index) => index + 1),
                            y: csvData.map(row => parseFloat(row[column])),
                            type: 'scatter',
                            mode: 'lines',
                            marker: { color: 'rgb(100, 10, 192)' },
                            line: { color: '#9C27B0' },
                            name: column,
                          },
                        ]}
                        layout={{
                          title: column,
                          autosize: true,
                          margin: { l: 50, r: 10, t: 50, b:  40 },
                          xaxis: { title: 'Time[s]' , tickpadding: 1, }, // dtick:1 for  

                          yaxis: { title: column,  tickpadding: 1,  },
                          plot_bgcolor: '#ECECEC', // Color for the plotting area
                          margin: {
                            l: 60,  // Add 10 to your original value
                            r: 60,  // Add 10 to your original value
                            t: 60,  // Add 10 to your original value
                            b: 60   // Add 10 to your original value
                        },
                        shapes: [
                          {
                              type: 'rect',
                              xref: 'paper',
                              yref: 'paper',
                              x0: 0,
                              y0: 0,
                              x1: 1,
                              y1: 1,
                              line: {
                                  color: '#a6b0f5',  // Border color
                                  width: 1  // Border thickness
                              }
                          }
                      ]
                          
                        }}
                      style={{ width: '100%', height: '350px' }}
                      />
                    </Grid>
                  ))}
                </Grid>
                </Container>
                </Box>
              )}
            </Box>
          </Box>
      </div>
    </ThemeProvider>
  );
}

export default App;
