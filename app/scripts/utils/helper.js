class Helper {
  static containsKeywords(word, keyword) {
    return (word.toString().toLowerCase().indexOf(
      keyword.toString().toLowerCase()) != -1);
  }
}

export default Helper;
