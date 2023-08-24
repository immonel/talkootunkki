"use client"
import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { adminSocket } from '../utils/socket';

const generateQR = (code: string) => {
  const canvas = document.getElementById('qr-code')
  QRCode.toCanvas(canvas, code);
}

const Code = () => {
  const [ code, setCode ] = useState('')

  useEffect(() => {
    adminSocket.on('UPDATE_CODE', (code: string) => {
      setCode(code)
      generateQR(code)
    })
    adminSocket.emit('UPDATE_CODE')

    return () => {
      adminSocket.off('UPDATE_CODE');
    };
  }, [])
  
  return (
    <div className="flex flex-col gap-5 items-center">
      <canvas id="qr-code" />
      <p className="text-3xl">{code}</p>
    </div>
  )
} 

export default Code;