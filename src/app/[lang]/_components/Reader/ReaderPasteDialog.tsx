import {
  useDeferredValue,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type RefObject,
} from "react";
import { ClipboardPaste, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { pasteLimit, pasteShortcuts } from "@/constants";
import type { Locale } from "@/i18n/config";
import { interpolate } from "@/lib/interpolate";
import { formatDuration, parseText, remainingTime } from "@/lib/rsvp";
import type { ReaderPasteStrings } from "./Reader.types";

interface ReaderPasteDialogProps {
  open: boolean;
  initialText: string;
  wpm: number;
  locale: Locale;
  strings: ReaderPasteStrings;
  getReturnFocus: () => HTMLElement | null;
  onCancel: () => void;
  onSubmit: (text: string) => void;
}

type FormProps = Omit<ReaderPasteDialogProps, "open" | "getReturnFocus"> & {
  textareaRef: RefObject<HTMLTextAreaElement | null>;
};

// Mounted only while the dialog is open, so the draft starts fresh each time.
const ReaderPasteDialogForm = ({
  initialText,
  wpm,
  locale,
  strings,
  textareaRef,
  onSubmit,
}: FormProps) => {
  const [draft, setDraft] = useState(initialText);
  const [clipboardDenied, setClipboardDenied] = useState(false);
  const parsed = useDeferredValue(useMemo(() => parseText(draft), [draft]));
  const numbers = new Intl.NumberFormat(locale);
  const canReadClipboard = Boolean(navigator.clipboard?.readText);

  const pasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setDraft(text.slice(0, pasteLimit));
      setClipboardDenied(false);
    } catch {
      setClipboardDenied(true);
    }
    textareaRef.current?.focus();
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (draft.trim()) onSubmit(draft);
  };

  return (
    <form onSubmit={submit} className="grid gap-4">
      <DialogHeader className="pr-8">
        <DialogTitle>{strings.title}</DialogTitle>
        <DialogDescription>{strings.description}</DialogDescription>
      </DialogHeader>
      <DialogClose
        aria-label={strings.close}
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            className="absolute top-2 right-2"
          />
        }
      >
        <X />
      </DialogClose>
      <Textarea
        ref={textareaRef}
        aria-label={strings.title}
        placeholder={strings.placeholder}
        value={draft}
        maxLength={pasteLimit}
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
            event.currentTarget.form?.requestSubmit();
          }
        }}
        className="max-h-dialog-field min-h-48 resize-y"
      />
      <div
        className="grid gap-1 text-xs text-muted-foreground"
        aria-live="polite"
      >
        <p className="tabular-nums">
          {interpolate(strings.stats, {
            count: numbers.format(parsed.words.length),
            time: formatDuration(remainingTime(parsed, 0, wpm)),
            wpm,
          })}
        </p>
        {draft.length >= pasteLimit && (
          <p>
            {interpolate(strings.limit, { count: numbers.format(pasteLimit) })}
          </p>
        )}
        {clipboardDenied && (
          <p>
            {interpolate(strings.clipboardDenied, {
              shortcut: /Mac|iPhone|iPad/.test(navigator.userAgent)
                ? pasteShortcuts.apple
                : pasteShortcuts.other,
            })}
          </p>
        )}
      </div>
      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-between">
        {canReadClipboard ? (
          <Button variant="outline" size="lg" onClick={pasteFromClipboard}>
            <ClipboardPaste data-icon="inline-start" />
            {strings.fromClipboard}
          </Button>
        ) : (
          <span />
        )}
        <div className="flex flex-col-reverse gap-2 sm:flex-row">
          <DialogClose render={<Button variant="ghost" size="lg" />}>
            {strings.cancel}
          </DialogClose>
          <Button type="submit" size="lg" disabled={!draft.trim()}>
            {strings.submit}
          </Button>
        </div>
      </div>
      <p className="text-xs text-muted-foreground">{strings.privacy}</p>
    </form>
  );
};

export const ReaderPasteDialog = ({
  open,
  getReturnFocus,
  onCancel,
  ...form
}: ReaderPasteDialogProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) onCancel();
      }}
    >
      <DialogContent
        showCloseButton={false}
        initialFocus={textareaRef}
        finalFocus={getReturnFocus}
        className="sm:max-w-xl"
      >
        <ReaderPasteDialogForm
          {...form}
          onCancel={onCancel}
          textareaRef={textareaRef}
        />
      </DialogContent>
    </Dialog>
  );
};
