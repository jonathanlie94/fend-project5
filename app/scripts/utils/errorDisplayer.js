const errorDisplayTimeout = 5000;

class ErrorDisplayer {
  static setErrorMessage(message) {
    let $errorMessage = document.getElementById('nbm-error-message');
    console.log($errorMessage.childNodes);
    $errorMessage.childNodes[1].innerHTML = message;
    ErrorDisplayer.showErrorMessage();
  }

  static showErrorMessage() {
    let $errorMessage = document.getElementById('nbm-error-message');
    $errorMessage.style.visibility = 'visible';
    $errorMessage.style.display = 'block';
    setTimeout(() => ErrorDisplayer.hideErrorMessage(), 5000);
  }

  static hideErrorMessage() {
    let $errorMessage = document.getElementById('nbm-error-message');
    $errorMessage.style.visibility = 'hidden';
    $errorMessage.style.display = 'none';
  }
}

export default ErrorDisplayer;
