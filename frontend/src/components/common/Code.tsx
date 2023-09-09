import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { socket } from '@/src/utils/socket';

const TG_URL = 'https://t.me/TalkooBot?code='

const generateQR = (code: string) => {
  const canvas = document.getElementById('qr-code')
  QRCode.toCanvas(canvas, code);
}

const Code = () => {
  // TODO: loading message
  const [ code, setCode ] = useState('')

  useEffect(() => {
    socket.on('UPDATE_CODE', (code: string) => {
      setCode(code)
      generateQR(`${TG_URL}${code}`)
    })
    socket.emit('UPDATE_CODE')

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