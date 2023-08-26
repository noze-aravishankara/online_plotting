import React, { useState, useRef } from 'react';
import Papa from 'papaparse';
import { useDropzone } from 'react-dropzone';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Plot from 'react-plotly.js';

function App() {
  const [csvData, setCsvData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [selectedColumn, setSelectedColumn] = useState(null);
  const [uploadedFileName, setUploadedFileName] = useState(null);
  const [isInputFocused, setInputFocused] = useState(false);
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
      },
      header: true,
    });
  }

  return (
    <div className="App">
      <div className="navbar navbar-expand-lg navbar-light bg-light custom-navbar">
        <a className="navbar-brand" href="#">
        <img src={process.env.PUBLIC_URL + '/logo.png'} alt="Logo" style={{ width: "60px", marginRight: "20px", verticalAlign: "middle" }} />

          Plots
        </a>
      </div>

      <div {...getRootProps()} style={{ border: '2px  gray', padding: '20px', cursor: 'pointer', marginTop: '20px' }}>
         <label className={`btn btn-primary mt-2 ${isInputFocused ? 'focused' : ''}`} {...getInputProps()}>
        Select a CSV File 
        <input id="csvFileInput" style={{ display: 'none' }} onFocus={() => setInputFocused(true)} onBlur={() => setInputFocused(false)} />
    </label>
        <input {...getInputProps()} id="csvFileInput" style={{ display: 'none', width: '200px' }} onFocus={() => setInputFocused(true)} onBlur={() => setInputFocused(false)} />
        <p>Upload your file</p>
      </div>

      {uploadedFileName && (
        <div className="alert alert-info">
          Uploaded File: {uploadedFileName}
        </div>
      )}

      {columns.length > 0 && (
        <div className="form-group">
          <label>Select Column: </label>
          <select onChange={e => setSelectedColumn(e.target.value)}>
            {columns.map(column => <option key={column} value={column}>{column}</option>)}
          </select>
        </div>
      )}

      {selectedColumn && csvData.length > 0 && (
        <div className="chart-container mt-4 mb-5" style={{ height: '500px', marginBottom: '20px' }}>

<Plot
    data={[
        {
            x: csvData.map((_, index) => index + 1),
            y: csvData.map(row => parseFloat(row[selectedColumn])),
            type: 'scatter',
            mode: 'lines',
            marker: { color: 'rgb(100, 10, 192)' },
            line: { color: 'rgba(6, 9, 91, 0.6)' },     //rgba(0, 4, 192, 0.2)
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
            tickpadding: 10  // Adjust as needed
        },
        yaxis: { 
            title: selectedColumn,
            tickpadding: 10  // Adjust as needed
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

        </div>
      )}
    </div>
  );
}

export default App;
