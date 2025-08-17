// src/components/shared/QRScanner.js
import React, { useState } from 'react';

const QRScanner = ({ onScan }) => {
  const [isScanning, setIsScanning] = useState(false);

  const handleScan = () => {
    setIsScanning(true);
    // Simulate scanning a QR code after a 2-second delay
    setTimeout(() => {
      const deskId = `desk_${Math.floor(Math.random() * 50) + 1}`;
      onScan(deskId);
      setIsScanning(false);
    }, 2000);
  };

  return (
    <div style={{ border: '1px solid black', padding: '1rem', textAlign: 'center' }}>
      <h3>Scan Desk QR Code</h3>
      <div style={{ width: '200px', height: '200px', background: '#eee', margin: '1rem auto' }}>
        {isScanning ? <p>Scanning...</p> : <p>(Camera View)</p>}
      </div>
      <button onClick={handleScan} disabled={isScanning}>
        {isScanning ? 'Scanning...' : 'Simulate Scan'}
      </button>
      <p><small>This is a simulated scanner.</small></p>
    </div>
  );
};

export default QRScanner;