import { ref } from 'vue';

export function useConfirmDialog () {
  const isConfirmDialogVisible = ref(false);
  const confirmTitle = ref('');
  const confirmMessage = ref('');
  const confirmButtonText = ref('Confirm');
  const cancelButtonText = ref('Cancel');
  let onConfirm = null;

  const showConfirm = (options) => {
    confirmTitle.value = options.title || 'Confirm';
    confirmMessage.value = options.message || 'Are you sure?';
    confirmButtonText.value = options.confirmButtonText || 'Confirm';
    cancelButtonText.value = options.cancelButtonText || 'Cancel';
    onConfirm = options.onConfirm; // Set the callback
    isConfirmDialogVisible.value = true;
  };

  const confirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    isConfirmDialogVisible.value = false;
  };

  const cancel = () => {
    isConfirmDialogVisible.value = false;
  };

  return {
    isConfirmDialogVisible,
    confirmTitle,
    confirmMessage,
    confirmButtonText,
    cancelButtonText,
    showConfirm,
    confirm,
    cancel,
  };
}
