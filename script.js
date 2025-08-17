// Function to extract the file ID from the Google Drive URL
function extractFileId(url) {
  var matches = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)\/view|\/d\/([a-zA-Z0-9_-]+)|id=([a-zA-Z0-9_-]+)/);
  return matches[1] || matches[2] || matches[3];
}

// Function to clear all result boxes and input field
function clearBoxes() {
  document.getElementById('sourceLink').textContent = '#';
  document.getElementById('visitButton').href = '#';
  document.getElementById('temporaryVisitButton').href = '#';
  document.getElementById('sourceLinkBox').classList.remove('animate-in');
  document.getElementById('resultBox').classList.remove('animate-in');
  document.getElementById('temporaryResultBox').classList.remove('animate-in');

  // Clear the input field and restore the placeholder
  document.getElementById('inputUrl').value = '';
  restorePlaceholder();
}

// Function to copy the permanent link to the clipboard
function copyPermanentLink() {
  var permanentLink = document.getElementById('visitButton').href;
  navigator.clipboard.writeText(permanentLink).then(function () {
    alert('Permanent link copied to clipboard!');
  }, function (err) {
    console.error('Unable to copy the permanent link: ', err);
  });
}

// Function to copy the temporary link to the clipboard
function copyTemporaryLink() {
  var temporaryLink = document.getElementById('temporaryVisitButton').href;
  navigator.clipboard.writeText(temporaryLink).then(function () {
    alert('Temporary link copied to clipboard!');
  }, function (err) {
    console.error('Unable to copy the temporary link: ', err);
  });
}

// Function to restore the placeholder when input loses focus
function restorePlaceholder() {
  var input = document.getElementById('inputUrl');
  if (!input.value) {
    input.placeholder = "Google Drive File Link";
  }
}

// Function to generate links and update result boxes
function generateLinks() {
  var inputUrl = document.getElementById('inputUrl').value;
  var fileId = extractFileId(inputUrl);
  var temporaryUrl = 'https://index-dl.ace-ml.eu.org/generate.aspx?id=' + fileId;

  // Send a request to the generate URL to get the JSON response for the temporary link
  fetch(temporaryUrl)
    .then(function (response) {
      if (!response.ok) {
        throw new Error('Failed to retrieve the temporary link');
      }
      return response.json();
    })
    .then(function (data) {
      var temporaryLink = data.link;
      if (data.mac) {
        temporaryLink += '&mac=' + data.mac;
      }

      // Update source link
      var sourceUrl = inputUrl;
      document.getElementById('sourceLink').textContent = sourceUrl;

      // Update permanent link
      var permanentUrl = 'https://index-dl.ace-ml.eu.org/direct.aspx?id=' + fileId;
      document.getElementById('visitButton').href = permanentUrl;

      // Update temporary link
      document.getElementById('temporaryVisitButton').href = temporaryLink;

      // Animate result boxes
      document.getElementById('sourceLinkBox').classList.add('animate-in');
      document.getElementById('resultBox').classList.add('animate-in');
      document.getElementById('temporaryResultBox').classList.add('animate-in');
    })
    .catch(function (error) {
      console.error('Error:', error);
      alert('Failed to generate links. Please check the URL and try again.');
    });
}
