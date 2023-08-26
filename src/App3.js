import React, { useState, useEffect, useRef } from 'react';
import Papa from 'papaparse';
import { Line } from 'react-chartjs-2';
import { useDropzone } from 'react-dropzone';
import 'bootstrap/dist/css/bootstrap.min.css';
import zoomPlugin from 'chartjs-plugin-zoom';
import './App.css';

// Import the Chart object from chart.js
import { Chart, registerables } from 'chart.js';

// Register the plugin with Chart.js
Chart.register(...registerables);

// ... (rest of your code)



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
        ////const validData = result.data.filter(row => row[selectedColumn] !== undefined && row[selectedColumn] !== "");
        setColumns(result.meta.fields);
        setCsvData(result.data);
      },
      header: true,
    });
  };


  const generateChartData = () => {
    // Destroy previous chart instance if it exists
    if (chartRef.current && chartRef.current.chartInstance) {
        chartRef.current.chartInstance.destroy();
    }

    if (!selectedColumn || csvData.length === 0) return;

    const labels = csvData.map((_, index) => index + 1); 
    const dataPoints = csvData.map(row => parseFloat(row[selectedColumn])); 
  
    return {
        labels: labels,
        datasets: [{
            label: selectedColumn,
            data: dataPoints,
            fill: false,
            backgroundColor: 'rgb(100, 10, 192)',
            borderColor: 'rgba(0, 4, 192, 0.2)',
            tension: 0 // This will ensure the lines are straight and not smoothed
        }],
    };
};


  return (
    <div className="App">
  
      {/* Navbar */}
      <div className="navbar navbar-expand-lg navbar-light bg-light custom-navbar">
        <a className="navbar-brand" href="#">
          <img src="/logo.png" alt="Logo" style={{ width: "80px", marginRight: "20px", verticalAlign: "middle" }} />
          Plot
        </a>
  
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
  
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item active">
              <a className="nav-link" href="#">Home</a>
            </li>
            {/* You can add more nav-items here as per your requirement */}
          </ul>
        </div>
      </div>
  
      {/* File Dropzone */}
      <div {...getRootProps()} style={{ border: '2px dashed gray', padding: '20px', cursor: 'pointer', marginTop: '20px' }}>
       
      <label htmlFor="csvFileInput" className={`btn btn-primary mt-2 ${isInputFocused ? 'focused' : ''}`}>Select a CSV File </label>
        <input {...getInputProps()} id="csvFileInput" style={{ display: 'none' }} onFocus={() => setInputFocused(true)} onBlur={() => setInputFocused(false)}/>
        <p>or drag & drop here</p>
      </div>
  
      {/* Uploaded File Info */}
      {uploadedFileName && (
        <div className="alert alert-info">
          Uploaded File: {uploadedFileName}
        </div>
      )}
  
      {/* Column Selection Dropdown */}
      {columns.length > 0 && (
        <div className="form-group">
          <label>Select Column: </label>
          <select onChange={e => setSelectedColumn(e.target.value)}>
            {columns.map(column => <option key={column} value={column}>{column}</option>)}
          </select>
        </div>
      )}
  

 
  

{/* Chart Display */}
{/* Chart Display */}
{selectedColumn && csvData.length > 0 && 
  <div className="chart-container mt-4 mb-5" style={{ height: '300px', marginBottom: '20px' }}>
    <Line 
      ref={chartRef}
      data={{
        labels: csvData.map((_, index) => index + 1),
        datasets: [{
          label: selectedColumn,
          data: csvData.map(row => parseFloat(row[selectedColumn])),
          fill: false,
          backgroundColor: 'rgb(100, 10, 192)',
          borderColor: 'rgba(0, 4, 192, 0.2)',
          tension: 0 // This will ensure the lines are straight and not smoothed
        }],
      }}
      key={selectedColumn + Date.now()}  // ensure unique key for each render
      options={{ responsive: true, aspectRatio: 1 }}
    />
  </div>
}


      {/* Footer */}


    </div>
  );
  

}

export default App;
