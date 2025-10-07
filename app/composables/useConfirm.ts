const globalState = reactive({
  isOpen: false,
  title: "",
  description: "",
  confirmText: "Confirm",
  cancelText: "Cancel",
  resolveCallback: null as ((value: boolean) => void) | null,
});

export function useConfirm() {
  function confirm(options: {
    title?: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
  }): Promise<boolean> {
    return new Promise((resolve) => {
      globalState.title = options.title || "Are you sure?";
      globalState.description = options.description || "";
      globalState.confirmText = options.confirmText || "Confirm";
      globalState.cancelText = options.cancelText || "Cancel";
      globalState.resolveCallback = resolve;
      globalState.isOpen = true;
    });
  }

  function handleConfirm() {
    globalState.isOpen = false;
    globalState.resolveCallback?.(true);
    globalState.resolveCallback = null;
  }

  function handleCancel() {
    globalState.isOpen = false;
    globalState.resolveCallback?.(false);
    globalState.resolveCallback = null;
  }

  return {
    isOpen: toRef(globalState, "isOpen"),
    title: toRef(globalState, "title"),
    description: toRef(globalState, "description"),
    confirmText: toRef(globalState, "confirmText"),
    cancelText: toRef(globalState, "cancelText"),
    confirm,
    handleConfirm,
    handleCancel,
  };
}
