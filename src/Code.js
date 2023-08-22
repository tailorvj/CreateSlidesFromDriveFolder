function onOpen() {
  var ui = SlidesApp.getUi();
  ui.createAddonMenu()
      .addItem('Create Slides from Images', 'showSidebar')
      .addToUi();
}

function showSidebar() {
  var html = HtmlService.createHtmlOutputFromFile('Page')
      .setTitle('Select Folder')
      .setWidth(300);
  SlidesApp.getUi().showSidebar(html);
}

function getImages(folderId) {
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
