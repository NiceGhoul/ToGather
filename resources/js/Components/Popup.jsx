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
    onConfirm,
    confirmColor,
    triggerClass,
    showCancel = true,
}) {
    const [open, setOpen] = useState(false);

    // kalau triggerText tidak ada → popup langsung terbuka otomatis
    useEffect(() => {
        if (!triggerText) setOpen(true);
    }, [triggerText]);

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            {/* Render tombol trigger hanya jika ada triggerText */}
            {triggerText && (
                <AlertDialogTrigger asChild>
                    <Button className={triggerClass}>{triggerText}</Button>
                </AlertDialogTrigger>
            )}

            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    {showCancel && (
                        <AlertDialogCancel> {cancelText} </AlertDialogCancel>
                    )}
                    <AlertDialogAction
                        onClick={() => {
                            onConfirm?.();
                            setOpen(false);
                        }}
                        className={confirmColor}
                    >
                        {confirmText}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
