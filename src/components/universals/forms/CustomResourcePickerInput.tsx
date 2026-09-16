import React, { useCallback, useEffect, useRef, useState } from 'react';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { useOpenDialog } from "@/components/universals/dialog/DialogProvider.context";
import SelectCustomResourceDialog, {
  getInstanceLabel,
} from "@/components/universals/dialogs/select-custom-resource/SelectCustomResourceDialog.component";
import { getCustomResourceInstanceByIdAction } from "@/components/universals/dialogs/select-custom-resource/SelectCustomResourceDialog.server-action";
import Loader from "@/components/universals/loader/Loader";
import LinkCard from "@/components/universals/link-card/LinkCard.component";
import { useFormikContext } from "formik";
import { DialogResult } from "@/components/universals/dialog/dialog.enum";
import styles from './CustomResourcePickerInput.module.scss';

type CustomResourcePickerInputProps = {
  id?: string;
  name: string;
  serviceId: string;
  resourceId: string;
  refValues?: Record<string, string>;
};

// Selbe LinkCard-Optik wie die Part->Part-Type-Querverweis-Karte
// (GeneratedFormLinkCardInput), nur mit Stift- statt Chevron-Icon: hier führt
// der Klick zu keiner Navigation, sondern öffnet den Auswahl-Dialog.
const CustomResourcePickerInput: React.FunctionComponent<CustomResourcePickerInputProps> = ({
  id,
  name,
  serviceId,
  resourceId,
  refValues,
}) => {
  const openDialog = useOpenDialog();

  const formik = useFormikContext<Record<string, unknown>>();
  const currentValue = formik.values[name];
  const currentId = typeof currentValue === 'string' ? currentValue : '';

  const [label, setLabel] = useState<string | null>(null);
  // Lazy init statt false: ist bereits eine id gesetzt (z. B. beim Öffnen
  // des Bearbeiten-Formulars), soll schon der Server-Render die
  // Ladeanimation zeigen, statt kurz die rohe id aufblitzen zu lassen, bis
  // der Effekt unten (erst nach der Hydration) das Nachladen startet.
  const [loadingLabel, setLoadingLabel] = useState(() => Boolean(currentId));
  // id, für die label bereits bekannt ist (per Nachladen oder direkt aus
  // einer Dialog-Auswahl in handleClick) - verhindert, dass der Effekt
  // unten nach einer frischen Auswahl nochmal (redundant) nachlädt und dabei
  // kurz die Ladeanimation über das schon bekannte Label blendet.
  const resolvedForIdRef = useRef<string | null>(null);

  // Zeigt für die aktuell gesetzte id den passenden Namen an, statt nur der
  // rohen id - z. B. beim Öffnen des Bearbeiten-Formulars mit bereits
  // vorbelegtem Feld.
  useEffect(() => {
    if (!currentId) {
      setLabel(null);
      resolvedForIdRef.current = null;
      return;
    }
    if (resolvedForIdRef.current === currentId) {
      return;
    }
    let cancelled = false;
    setLoadingLabel(true);
    getCustomResourceInstanceByIdAction(serviceId, resourceId, currentId, refValues)
      .then((instance) => {
        if (cancelled) return;
        setLabel(getInstanceLabel(instance));
        resolvedForIdRef.current = currentId;
      })
      .catch(() => {
        // Instanz evtl. gelöscht/nicht erreichbar - Fallback auf die rohe id.
        if (!cancelled) setLabel(null);
      })
      .finally(() => {
        if (!cancelled) setLoadingLabel(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serviceId, resourceId, currentId]);

  const handleClick = useCallback(async () => {
    const dialog = openDialog(SelectCustomResourceDialog, {
      serviceId,
      resourceId,
      refValues,
    });

    const result = await dialog.result;
    if (result.status !== DialogResult.SUCCESS) {
      return;
    }

    const instance = result.value as { id?: string } | null;
    const instanceId = instance?.id ?? '';
    await formik.setFieldValue(name, instanceId);
    setLabel(instance ? getInstanceLabel(instance) : null);
    resolvedForIdRef.current = instanceId || null;
  }, [openDialog, serviceId, resourceId, refValues, formik, name]);

  return (
    <div>
      {/* Bewusst kein Formik-Field, sondern ein einfaches kontrolliertes
          Hidden-Input: der Wert kommt bereits über currentId, das immer als
          String vorliegt (nie null) - unabhängig davon, ob das initialValues-
          jsonata des jeweiligen Formulars null selbst schon abfängt. */}
      <input
        id={id}
        type="hidden"
        name={name}
        value={currentId}
        readOnly
      />
      <LinkCard onClick={handleClick} icon={faPen}>
        <span className={styles.value}>
          {loadingLabel ? (
            <Loader size={14} />
          ) : (
            currentId ? (label ?? currentId) : 'Kein Eintrag ausgewählt'
          )}
        </span>
      </LinkCard>
    </div>
  );
};

export default CustomResourcePickerInput;
