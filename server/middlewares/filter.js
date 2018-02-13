const notAllowed = ["crap", "php", "jquery", "jQuery", "frick", "frack"];

module.exports = (req, res, next) => {
  while (notAllowed.find(word => req.body.text.includes(word))) {
    const badWord = notAllowed.find(word => req.body.text.includes(word));
    req.body.text = req.body.text.replace(badWord, "*".repeat(badWord.length));
  }
  next();
};
