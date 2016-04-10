class Helper {
  static containsKeywords(word, keyword) {
    return (word.toString().toLowerCase().indexOf(
      keyword.toString().toLowerCase()) != -1);
  }

  static isNullOrUndefined(object) {
    return typeof object === 'null' || typeof object === 'undefined';
  }
}

export default Helper;
