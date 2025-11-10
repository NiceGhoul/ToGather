import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

export default function Popup({
    triggerText = null,
    title = "Are you sure?",
    description = "This action cannot be undone.",
    confirmText = "Confirm",
    cancelText = "Cancel",
    disabledValue = false,
    confirmDisabled = false,
    onConfirm,
    confirmColor,
    triggerClass,
    showCancel = true,
    open: controlledOpen, // new prop for programmatic control
    onClose, // new callback when dialog is closed
    children, // ✅ tambahkan ini!
}) {
    const [open, setOpen] = useState(false);

    // if parent controls open, mirror it into local state
    useEffect(() => {
        if (typeof controlledOpen === "boolean") {
            setOpen(controlledOpen);
        }
    }, [controlledOpen]);

    // if no triggerText and parent doesn't control open -> open automatically
    useEffect(() => {
        if (!triggerText && typeof controlledOpen === "undefined") {
            setOpen(true);
        }
    }, [triggerText, controlledOpen]);

    // handle open changes from AlertDialog (trigger/cancel)
    const handleOpenChange = (val) => {
        // uncontrolled: keep local state
        if (typeof controlledOpen === "undefined") {
            setOpen(val);
            if (!val && onClose) onClose();
            return;
        }

        // controlled: only notify parent when closing
        if (!val && onClose) onClose();
        // do not set local state because it is driven by controlledOpen
    };

    const handleConfirm = () => {
        onConfirm?.();
        // close: if uncontrolled, update local state; if controlled, notify parent
        if (typeof controlledOpen === "undefined") {
            setOpen(false);
            if (onClose) onClose();
        } else {
            if (onClose) onClose();
        }
    };

    return (
        <AlertDialog open={open} onOpenChange={handleOpenChange}>
            {/* Render tombol trigger hanya jika ada triggerText */}
            {triggerText && (
                <AlertDialogTrigger asChild>
                    <Button className={triggerClass} disabled={disabledValue}>
                        {triggerText}
                    </Button>
                </AlertDialogTrigger>
            )}

            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {Array.isArray(description) ? (
                            <div className="text-sm text-muted-foreground text-left space-y-1">
                                <ul className="list-disc list-inside space-y-1 text-left">
                                    {description.map((msg, i) => (
                                        <li key={i}>{msg}</li>
                                    ))}
                                </ul>
                            </div>
                        ) : (
                             description
                        )}
                    </AlertDialogDescription>
                </AlertDialogHeader>

                {/* ✅ Tambahan children agar konten custom (misalnya textarea) muncul */}
                {typeof children !== "undefined" && (
                    <div className="py-2">{children}</div>
                )}

                <AlertDialogFooter>
                    {showCancel && (
                        <AlertDialogCancel disabled={confirmDisabled}>{cancelText}</AlertDialogCancel>
                    )}
                    <AlertDialogAction
                        onClick={handleConfirm}
                        className={confirmColor}
                        disabled={confirmDisabled}
                    >
                        {confirmText}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
