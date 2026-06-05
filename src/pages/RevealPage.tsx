import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { decodeRevealParams } from '../lib/params';
import { ParadiseScene } from '../components/ParadiseScene';

/**
 * Reveal page — decodes the message from the URL and hands it to the immersive
 * ParadiseScene. Portrait-optimised and full-screen; everything it needs comes
 * from the query string, so it works straight from a scanned QR with no backend.
 */
export function RevealPage() {
  const location = useLocation();
  const params = useMemo(
    () => decodeRevealParams(location.search),
    [location.search],
  );

  return (
    <div className="no-scrollbar h-[100dvh] w-full overflow-hidden">
      <ParadiseScene params={params} />
    </div>
  );
}
