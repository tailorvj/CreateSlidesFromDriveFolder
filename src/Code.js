/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
function onOpen() {
    var ui = SlidesApp.getUi();
    ui.createAddonMenu()
        .addItem('Create Slides from Images', 'showSidebar')
        .addToUi();
}

// eslint-disable-next-line no-unused-vars
function showSidebar() {
    Logger.log('Showing sidebar...');
    var html = HtmlService.createHtmlOutputFromFile('Page')
        .setTitle('Select Folder')
        .setWidth(300);
    SlidesApp.getUi().showSidebar(html);
}

function createSlidesFromImages(folderId) {
    if (!folderId) {
        Logger.log('Folder ID not provided.');
        return;
    }
  
    Logger.log('Folder ID: ' + folderId);
  
    // Get the folder and its files
    var folder = DriveApp.getFolderById(folderId);
    var filesIterator = folder.getFilesByType(MimeType.JPEG); // Adjusted to JPG
  
    // Count the total number of files
    var files = [];
    while (filesIterator.hasNext()) {
        files.push(filesIterator.next());
    }
    Logger.log('Total PNG files found: ' + files.length);
  
    // Get the current Slides presentation
    var presentation = SlidesApp.getActivePresentation();
    var slideWidth = presentation.getPageWidth();
    var slideHeight = presentation.getPageHeight();
  
    // Iterate through the files and add them to the Slides
    for (var i = 0; i < files.length; i++) {
        var file = files[i];
        Logger.log('Processing image: ' + file.getName());
    
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
    }
  
    Logger.log('Total images processed: ' + files.length);
}
