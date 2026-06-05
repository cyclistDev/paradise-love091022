import QRCode from 'qrcode';

/**
 * Render a QR code onto a canvas with a warm, printable look: deep-wine modules
 * on a cream background, high error-correction (so a logo/centre could survive)
 * and a generous quiet zone for reliable scanning when printed.
 */
export async function drawQrToCanvas(
  canvas: HTMLCanvasElement,
  data: string,
  size = 1024,
): Promise<void> {
  await QRCode.toCanvas(canvas, data, {
    width: size,
    margin: 3,
    errorCorrectionLevel: 'H',
    color: {
      dark: '#2c1525', // wine-900 modules
      light: '#fff9f0', // cream-50 background
    },
  });
}

/** Produce a PNG data URL for the given data, suitable for download. */
export async function qrToDataUrl(data: string, size = 1024): Promise<string> {
  return QRCode.toDataURL(data, {
    width: size,
    margin: 3,
    errorCorrectionLevel: 'H',
    color: {
      dark: '#2c1525',
      light: '#fff9f0',
    },
  });
}

/** Trigger a browser download of a data URL under the given filename. */
export function downloadDataUrl(dataUrl: string, filename: string): void {
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
