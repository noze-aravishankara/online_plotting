import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { useDropzone } from 'react-dropzone';

function App() {
  const [data, setData] = useState(null);

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const lines = event.target.result.split("\n").map(line => line.split(","));
      const labels = lines.map(line => line[0]);
      const dataPoints = lines.map(line => line[1]);

      setData({
        labels: labels,
        datasets: [
          {
            label: 'Time Series Data',
            data: dataPoints,
            fill: false,
            backgroundColor: 'rgb(75, 192, 192)',
            borderColor: 'rgba(75, 192, 192, 0.2)',
          },
        ],
      });
    };

    reader.readAsText(file);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: ".csv"
  });

  return (
    <div className="App">
      <div {...getRootProps()} style={{ border: '2px dashed gray', padding: '20px', cursor: 'pointer' }}>
        <input {...getInputProps()} />
        <p>Drag & drop a CSV file here, or click to select one</p>
      </div>
      {data && <Line data={data} />}
    </div>
  );
}

export default App;
