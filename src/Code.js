      /**
       * 
       * This software is licensed under the AGPLv3 open-source license attached to this repo. It uses the Intercom.js library, which is licensed under the Apache 2.0 open-source license
       *
       * CreateSlidesFromDriveFolder - A Google Slides Editor Add-on that reads all images in a Google Drive folder and creates a slide for each image in the current presentation
       * Copyright (C) 2023  Asaf Prihadash TailorVJ.com
       * 
       * */



/**
 * Function to run when the Google Slides document is opened.
 */
function onOpen() {
  var ui = SlidesApp.getUi();
  ui.createAddonMenu()
      .addItem('Create Slides from Images', 'showSidebar')
      .addToUi();
}


/**
 * Gets the OAuth token for the current user.
 * @returns {string} The OAuth token.
 */
function getOAuthToken() {
  DriveApp.getRootFolder();
  return ScriptApp.getOAuthToken();
}


/**
 * Sets the selected folder ID.
 * @param {string} folderId - The ID of the selected folder.
 */
function setFolderId(folderId) {
  Logger.log('setFolderId: ' + folderId);
  PropertiesService.getUserProperties().setProperty('selectedFolderId', folderId);
}


/**
 * Gets the selected folder ID.
 * @returns {string} The selected folder ID.
 */
function getSelectedFolderId() {
  return PropertiesService.getUserProperties().getProperty('selectedFolderId');
}


/**
 * Clears the selected folder ID.
 */
function clearSelectedFolderId() {
  PropertiesService.getUserProperties().deleteProperty('selectedFolderId');
}


/**
 * Gets the details of a folder by its ID.
 * @param {string} folderId - The ID of the folder.
 * @returns {Object} An object containing the folder ID and name.
 */
function getFolderDetails(folderId) {
  var folder = DriveApp.getFolderById(folderId);
  return {
    id: folderId,
    name: folder.getName()
  };
}


/**
 * Gets the Drive service for OAuth2.
 * @returns {Object} The OAuth2 service for Google Drive.
 */
function getDriveService_() {
  return OAuth2.createService('drive')
      .setAuthorizationBaseUrl('https://accounts.google.com/o/oauth2/auth')
      .setTokenUrl('https://accounts.google.com/o/oauth2/token')
      .setClientId(PropertiesService.getScriptProperties().getProperty('CLIENT_ID'))
      .setClientSecret(PropertiesService.getScriptProperties().getProperty('CLIENT_SECRET'))
      .setCallbackFunction('authCallback')
      .setPropertyStore(PropertiesService.getUserProperties())
      .setScope(['https://www.googleapis.com/auth/drive'])
      .setParam('access_type', 'offline')
      .setParam('prompt', 'consent');
}


/**
 * Callback function for OAuth2 authorization.
 * @param {Object} request - The request object from the OAuth2 callback.
 * @returns {Object} An HTML output object to be displayed to the user.
 */
function authCallback(request) {
  var driveService = getDriveService_();
  var isAuthorized = driveService.handleCallback(request);
  if (isAuthorized) {
    return HtmlService.createHtmlOutput('Success! You can close this tab.');
  } else {
    return HtmlService.createHtmlOutput('Denied. You can close this tab');
  }
}


/**
 * Logs out the user from the OAuth2 service.
 */
function logout() {
  var service = getDriveService_();
  service.reset();
}


/**
 * Shows the sidebar for selecting a folder.
 */
function showSidebar() {
  var driveService = getDriveService_();
  if (!driveService.hasAccess()) {
    var authorizationUrl = driveService.getAuthorizationUrl();
    var template = HtmlService.createTemplate(
        '<a href="<?= authorizationUrl ?>" target="_blank">Authorize</a>. ' +
        'Reopen the sidebar when the authorization is complete.');
    template.authorizationUrl = authorizationUrl;
    var page = template.evaluate();
    clearSelectedFolderId();
    SlidesApp.getUi().showSidebar(page);
  } else {
    var html = HtmlService.createHtmlOutputFromFile('Sidebar')
        .setTitle('Select Folder')
        .setWidth(300);
    SlidesApp.getUi().showSidebar(html);
  }
}


/**
 * Gets the API key.
 * @returns {string} The API key.
 */
function getApiKey() {
  var apiKey = PropertiesService.getScriptProperties().getProperty('API_KEY');
  Logger.log('getApiKey(): ' + apiKey);
  return apiKey;
}


/**
 * Gets the keys for the API and client.
 * @returns {Object} An object containing the API key and client ID.
 */
function getKeys() {
  return {
    apiKey: getApiKey(),
    clientId: getClientId()
  };
}


/**
 * Gets the authentication details.
 * @returns {Object} An object containing the OAuth token and API key.
 */
function getAuthDetails() {
  return {
    oauthToken: getOAuthToken(),
    apiKey: getApiKey()
  };
}


/**
 * Shows the picker dialog to select a folder.
 */
function showPicker() {
  var html = HtmlService.createHtmlOutputFromFile('Picker')
      .setWidth(650)
      .setHeight(750)
      .setSandboxMode(HtmlService.SandboxMode.IFRAME);
  SlidesApp.getUi().showModalDialog(html, 'Select a folder');
}


/**
 * Gets the images from a folder by its ID.
 * @param {string} folderId - The ID of the folder.
 * @returns {string[]} An array of image file IDs.
 */
function getImages(folderId) {
  Logger.log('getImages() Received folderId: ' + folderId);
  var driveService = getDriveService_();
  if (!driveService.hasAccess()) {
    Logger.log('No access to Drive. Authorization required.');
    return [];
  }

  if (!folderId) {
    Logger.log('Folder ID not provided.');
    return [];
  }
  
  Logger.log('Folder ID: ' + folderId);
  
  // Get the folder and its files
  var folder = DriveApp.getFolderById(folderId);
  var pngFilesIterator = folder.getFilesByType(MimeType.PNG);
  var jpgFilesIterator = folder.getFilesByType(MimeType.JPEG);
  
  // Collect the file IDs for both PNG and JPG files
  var fileIds = [];
  while (pngFilesIterator.hasNext()) {
    var file = pngFilesIterator.next();
    fileIds.push(file.getId());
  }
  while (jpgFilesIterator.hasNext()) {
    var file = jpgFilesIterator.next();
    fileIds.push(file.getId());
  }
  
  Logger.log('Total PNG and JPG files found: ' + fileIds.length);
  return fileIds;
}


/**
 * Creates a slide with an image by its ID.
 * @param {string} imageId - The ID of the image.
 */
function createSlide(imageId) {
  Logger.log('Processing image ID: ' + imageId);
  
  // Get the image file
  var file = DriveApp.getFileById(imageId);
  
  // Get the current Slides presentation
  var presentation = SlidesApp.getActivePresentation();
  var slideWidth = presentation.getPageWidth();
  var slideHeight = presentation.getPageHeight();
  
  // Add the image to a new slide
  var slide = presentation.appendSlide(SlidesApp.PredefinedLayout.BLANK);
  var image = slide.insertImage(file);
  
  // Center and stretch the image to fill the height of the Slides document
  var originalWidth = image.getWidth();
  var originalHeight = image.getHeight();
  var newHeight = slideHeight;
  var newWidth = originalWidth * (newHeight / originalHeight);
  
  image.setWidth(newWidth);
  image.setHeight(newHeight);
  image.setLeft((slideWidth - newWidth) / 2);
  image.setTop(0);
  
  Logger.log('Image processed successfully.');
}

