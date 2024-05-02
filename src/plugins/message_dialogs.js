import { ref } from 'vue';

export function useMessageDialog() {
  const isMessageDialogVisible = ref(false);
  const messageTitle = ref('');
  const messageText = ref('');
  const messageType = ref('');

  const showInfo = (text, heading = 'Info') => {
    messageTitle.value = heading;
    messageText.value = text;
    messageType.value = 'info';
    isMessageDialogVisible.value = true;
  };

  const showWarning = (text, heading = 'Warning') => {
    messageTitle.value = heading;
    messageText.value = text;
    messageType.value = 'warning';
    isMessageDialogVisible.value = true;
  };

  const showError = (text, heading = 'Error') => {
    messageTitle.value = heading;
    messageText.value = text;
    messageType.value = 'error';
    isMessageDialogVisible.value = true;
  };

  return { isMessageDialogVisible, messageTitle, messageText, messageType, showInfo, showWarning, showError };
}
