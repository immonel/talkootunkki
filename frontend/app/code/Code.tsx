"use client"
import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import QRCode from 'qrcode';

const WS_URL = process.env.NEXT_PUBLIC_BACKEND_URL || '';
const token = 'admin';

const generateQR = (code: string) => {
  const canvas = document.getElementById('qr-code')
  QRCode.toCanvas(canvas, code);
}

const Code = () => {
  const [ code, setCode ] = useState('')

  useEffect(() => {
    const socket = io(WS_URL, {
      query: {token}
    });

    socket.on('UPDATE_CODE', (code: string) => {
      setCode(code)
      generateQR(code)
    })

    return () => {
      socket.off('UPDATE_CODE');
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