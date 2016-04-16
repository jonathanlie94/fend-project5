const errorDisplayTimeout = 5000;

class ErrorDisplayer() {
  static setErrorMessage(message) {
    let $errorMessage = document.getElementById('nbm-error-message');
    $errorMessage.childNodes[0].innerHTML.text = message;
    setTimeout(() => ErrorDisplayer.hideErrorMessage(), 5000);
  }

  static hideErrorMessage() {
    ErrorDisplayer.setErrorMessage('');
    $errorMessage.visibility = 'hidden';
  }
}

export default ErrorDisplayer;
