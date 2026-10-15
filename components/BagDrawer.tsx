"use client";

import { useBag } from "./BagContext";
import { AddDossier, BagFoot, BagLines } from "./BagContents";
import { useDialog } from "./useDialog";
import { pad2 } from "./Header";

export function BagDrawer({ dossierVariantId, dossierPrice }: { dossierVariantId: string | null; dossierPrice: string }) {
  const { bag, bagOpen, setBagOpen, say } = useBag();
  if (!bagOpen) return null;
  return (
    <Drawer onClose={() => setBagOpen(false)}>
      <div className="drawer__head">
        <div className="drawer__title">
          Bag <span className="bag-btn__count">{pad2(bag.count)}</span>
        </div>
        <button type="button" className="panel-close" onClick={() => setBagOpen(false)}>
          Close
        </button>
      </div>
      {bag.count === 0 ? (
        <div className="drawer__empty">
          <div className="drawer__empty-title">
            Nothing in the bag <em>yet.</em>
          </div>
          <p className="small">Four vials, letterbox-sized. The price is credited toward your first flacon.</p>
          <AddDossier variantId={dossierVariantId} label={`Add the Dossier — ${dossierPrice}`} />
        </div>
      ) : (
        <>
          <div className="drawer__lines">
            <BagLines bag={bag} />
          </div>
          <BagFoot bag={bag} onMessage={say} />
        </>
      )}
    </Drawer>
  );
}

function Drawer({ onClose, children }: { onClose: () => void; children: React.ReactNode }) {
  const ref = useDialog<HTMLElement>(true, onClose);
  return (
    <>
      <div className="overlay" onClick={onClose} aria-hidden="true" />
      <aside ref={ref} className="drawer" role="dialog" aria-modal="true" aria-label="Bag">
        {children}
      </aside>
    </>
  );
}
