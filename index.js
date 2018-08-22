const htmlFormatter = require('./src/html-formatter');

module.exports = {
  formatHtml
};

function formatHtml(htmlString) {
  return htmlFormatter.formatHtml(htmlString);
}