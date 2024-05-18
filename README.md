# L5X Routine Replicator

The L5X Routine Replicator is a Flask application designed to work with Rockwell Automation's Studio 5000 program files. It enables users to upload a routine exported from Studio 5000 and apply a list of user-defined replacements to create a modified L5X file that can be imported back into Studio 5000 as a program.

## Features

- **File Conversion:** Converts an uploaded L5X file into a JSON representation for easy viewing and verification.
- **File Modification:** Applies bulk modifications based on user-provided replacement pairs and exports the modified L5X file.
- **Secure Parsing:** XML parsing is done with security in mind to prevent XXE (XML External Entity) attacks.
- **Rate Limiting:** Ensures that the service cannot be overwhelmed by too many requests using Flask-Limiter.
- **Pretty Printing:** Outputs the modified XML in a neatly formatted manner for better readability.

## Getting Started

To get started with the L5X Routine Replicator, clone the repository and follow the installation instructions below.

### Prerequisites

Make sure you have Docker and Docker Compose installed on your system.

### Installation with Docker Compose

Clone the repository:

```bash
git clone https://github.com/DMDuFresne/L5x_Replicator.git
```

Navigate into the project directory:

```bash
cd l5x-replicator
```

Build and run the application using Docker Compose:

```bash
docker-compose up --build -d
```

The application will be available at `http://localhost:8000`.

## User Guide

The L5X Routine Replicator is a web tool designed to make it easy to modify L5X files exported from Rockwell Automation's Studio 5000. Follow this guide to learn how to use the tool for modifying and duplicating your routines.

### Accessing the Application

Once you’ve set up the L5X Routine Replicator, open your web browser and go to:

```markdown
http://localhost:8000
```

### Exporting a Routine from Studio 5000

Before using the L5X Routine Replicator, you need to export a routine from Studio 5000:

1. **Open Studio 5000**: Launch your Studio 5000 Logix Designer software.
2. **Select the Routine**: Navigate to the routine you want to export in the Controller Organizer.
3. **Export Routine**:
   - Right-click on the routine.
   - Select "Export Routine".
   - Choose a location to save the file and click "Save".

You now have an L5X file that you can upload to the L5X Routine Replicator.

### Uploading an L5X File

1. **Select an L5X file**: Click on the "Select an L5X file" button and choose the L5X file you want to upload from your computer.

2. **Optional: Program Name**: If you want to give your modified file a custom program name, enter it in the "Program Name" field.

### Managing Replacements

You can define replacements to be applied to the uploaded L5X file using the replacement table.

1. **Add Columns**: Click the "Column" button to add columns to the replacement table. Each column represents a field you want to replace in the L5X file.

2. **Add Rows**: Click the "Row" button to add rows to the replacement table. Each row represents a set of replacements you want to make.

3. **Editing Cells**: Type the replacement values in the cells. You can add multiple replacements by adding more rows.

4. **Context Menu**: Right-click on headers or rows to rename or delete them.

### Importing and Exporting CSV

1. **Import CSV**: Click the "Import" button to load a CSV file with your replacement definitions. Make sure the CSV structure matches your table.

2. **Export CSV**: Click the "Export" button to save your current replacement table as a CSV file for reuse or backup.

### Converting the L5X File

1. **Convert**: Click the "View" button to convert the uploaded L5X file into a JSON format. The JSON tree will be shown in the "Data Viewer" section, so you can inspect the file structure and contents.

### Modifying the L5X File

1. **Modify**: Click the "Modify" button to apply your defined replacements to the uploaded L5X file. The modified file will automatically be downloaded to your computer.

### Data Viewer Controls

1. **Expand All**: Click "Expand All" to expand all nodes in the JSON tree view and see the entire structure.

2. **Collapse All**: Click "Collapse All" to collapse all nodes in the JSON tree view, making it easier to navigate large files.

### Loading and Downloading Files

- The application shows a spinner overlay while processing files to let you know when the operation is in progress. Once it is complete, the new L5X file will be downloaded.

### Limitations

1. **File Size**: The application can handle files up to 10 MB. Larger files won’t be accepted.
2. **Replacement Complexity**: The tool uses simple string replacements. For more complex changes, additional processing might be needed.
3. **Browser Support**: Use a modern web browser for the best experience. Some features might not work on older browsers.
4. **Security**: The tool uses secure methods to prevent XML External Entity (XXE) attacks, but always be careful about the source of your L5X files.

### Conclusion

The L5X Routine Replicator makes it easy to modify Studio 5000 L5X files. By following this guide, you can effectively use the tool to streamline your workflow. If you have any issues or questions, refer to the [README](README.md) or visit the project’s [GitHub repository](https://github.com/DMDuFresne/L5x_Replicator) for more information.

## Acknowledgments

- Rockwell Automation for the RSLogix 5000 L5X format.
- The Flask community for their comprehensive documentation and examples.

## Built With

- [Flask](https://flask.palletsprojects.com/en/2.0.x/) - The web framework used.
- [Gunicorn](https://gunicorn.org/) - WSGI server for UNIX.
- [lxml](https://lxml.de/) - Library for processing XML and HTML in Python.
- [Flask-Limiter](https://flask-limiter.readthedocs.io/en/stable/) - For rate limiting.
- [Docker](https://www.docker.com/) - To containerize the application.
- [Docker Compose](https://docs.docker.com/compose/) - To manage multi-container Docker applications.

## Authors

- **Dylan DuFresne** - Initial work - [DMDuFresne](https://github.com/DMDuFresne)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
