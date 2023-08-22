## CreateSlidesFromDriveFolder

A Google Slides Editor Add-on that reads all images in a Google Drive folder and creates a slide for each image in the current presentation

## Updates

### Version 0.0.2

- Sidebar updated with status and with each image
- Image slides are created one at a time
- Script picks up both PNG and JPG files
- Sidebar styling improved a bit (Using Google Workspace standard CSS)


### Version 0.0.1

- Editor add-on
- Sidebar menu item
- Type Drive folder id and submit
- Logging to Script console
- Creates image slides from PNGs

### Develop

Clone this repo. This goes without saying, right?!

Make sure you have node.js (and npm naturally installed on your development system)

You are going to need the Clasp CLI in order to work with this project. 

**Install Clasp globally**

```bash
$ npm install -g @google/clasp
```

**Create a Clasp project**

Pay attention, the project must be in the src folder, not the root!

```bash
$ cd src
$ clasp login
$ clasp create CreateSlidesFromDriveFolder
$ clasp push
$ clasp open
```

This will open your browser and you should see the code from the src folder in the Google Script editor

**IMPORTANT: Never edit the code in the online editor, only in your local development environment**. We will be using Clasp to push code modifications from local development environmnent to the online testing environment. 

#### Test your code in Google Script & Slides

Before you begin, create a new Slides docuemnt for testing purposes on https://slides.new . Name your presenation for easy identification

Now that your code is online, you have to create a test in the online editor

- Press the arrow on the Deploy button
- Select Text Deployments
- Press the settings icon next to Select type (top left of the dialog)
- Select Editor Add-on
- Use the default settings, select the presentation you created for testing purposes
- Approve your settings
- Select the test from the list and press Execute. The presentation will open
- Open the Extensions menu. Your add-on should have a subment on it. 
- Test

**How to get a folder id**

Each folder in Google Drive has a unique ID. Just copy the id after the /folders/ part of the URL. For example, if the folder URL is https://drive.google.com/drive/folders/1I19gYQ8US-jVSFogbs_q8BZjcCu4PkCC, the id is 1I19gYQ8US-jVSFogbs_q8BZjcCu4PkCC

#### Add features and use Clasp to push to your testing environment

You coding is done in the local development machine from now on. Testing is done online though, so here is how to push your code and test.

- Edit the code in the src folder
- Save
- Open a terminal in the src folder

```bash
$ clasp push
$ clasp open
```

- Run your test deployment
- Test
- Close the Slides editor
- Repeat