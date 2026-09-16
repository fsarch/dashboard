import React, { useCallback, useEffect, useRef, useState } from 'react';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { useOpenDialog } from "@/components/universals/dialog/DialogProvider.context";
import SelectCustomResourceDialog, {
  getInstanceLabel,
} from "@/components/universals/dialogs/select-custom-resource/SelectCustomResourceDialog.component";
import {
  getCustomResourceInstanceByIdAction,
  getCustomResourceLinkHrefAction,
} from "@/components/universals/dialogs/select-custom-resource/SelectCustomResourceDialog.server-action";
import Loader from "@/components/universals/loader/Loader";
import LinkCard, { LinkCardGroup } from "@/components/universals/link-card/LinkCard.component";
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
  // Link zur Detailseite der aktuell gesetzten Instanz (z. B. der
  // product-Item-Seite), sofern deren App eine Route dafür registriert hat
  // (siehe AppRouteCustomResourceProvider) - steuert den zusätzlichen
  // Sprung-Chevron neben dem Stift. null = kein Link (Route nicht
  // registriert oder ausstehend aufgelöst).
  const [href, setHref] = useState<string | null>(null);
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
      setHref(null);
      resolvedForIdRef.current = null;
      return;
    }
    if (resolvedForIdRef.current === currentId) {
      return;
    }
    let cancelled = false;
    setLoadingLabel(true);
    getCustomResourceInstanceByIdAction(serviceId, resourceId, currentId, refValues)
      .then(async (instance) => {
        if (cancelled) return;
        setLabel(getInstanceLabel(instance));
        resolvedForIdRef.current = currentId;
        // Eigener try/catch statt .catch am Gesamt-Promise: ein fehlender
        // Link soll nicht den bereits erfolgreich geladenen Namen verwerfen.
        try {
          const resolvedHref = await getCustomResourceLinkHrefAction(serviceId, resourceId, instance, refValues);
          if (!cancelled) setHref(resolvedHref ?? null);
        } catch {
          if (!cancelled) setHref(null);
        }
      })
      .catch(() => {
        // Instanz evtl. gelöscht/nicht erreichbar - Fallback auf die rohe id.
        if (!cancelled) {
          setLabel(null);
          setHref(null);
        }
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
    setHref(null);
    if (instance) {
      // Wie im Nachlade-Effekt: Link erst nach der Auswahl separat auflösen,
      // damit ein Fehlschlag hier nicht Name/id der frischen Auswahl verwirft.
      try {
        setHref(await getCustomResourceLinkHrefAction(serviceId, resourceId, instance, refValues) ?? null);
      } catch {
        setHref(null);
      }
    }
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
      {/* Stift- und Sprung-Aktion als ein gemeinsames LinkCardGroup, statt
          als zwei einzelne Karten - die Trennung zwischen beiden wird erst
          beim Hover eines der beiden Segmente sichtbar (siehe
          LinkCard.module.scss .segment/.group), im Ruhezustand wirken sie
          wie eine einzelne Karte. */}
      <LinkCardGroup>
        <LinkCard variant="segment" onClick={handleClick} icon={faPen} className={styles.picker}>
          <span className={styles.value}>
            {loadingLabel ? (
              <Loader size={14} />
            ) : (
              currentId ? (label ?? currentId) : 'Kein Eintrag ausgewählt'
            )}
          </span>
        </LinkCard>
        {/* Rücksprung zur Detailseite der referenzierten Instanz (z. B. vom
            material-tracing-PartType auf den product-server-Eintrag). Wie der
            Stift daneben immer sichtbar - solange kein Link aufgelöst ist
            (noch am Laden, kein Eintrag gewählt oder dessen App hat keine
            passende Route registriert, siehe AppRouteCustomResourceProvider)
            bleibt die Karte einfach abgeblendet/inaktiv statt zu verschwinden. */}
        <LinkCard variant="segment" href={href ?? undefined} disabled={loadingLabel || !href} className={styles.jump} />
      </LinkCardGroup>
    </div>
  );
};

export default CustomResourcePickerInput;
