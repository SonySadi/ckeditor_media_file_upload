CKEDITOR.plugins.add("mediaupload", {
  init: function(editor) {
    CKEDITOR.dialog.add(
      "mediauploadDialog",
      this.path + "dialogs/mediaupload.js"
    );
    editor.addCommand(
      "mediaupload",
      new CKEDITOR.dialogCommand("mediauploadDialog")
    );
    editor.ui.addButton("mediaupload", {
      label: "Photo\\Video",
      command: "mediaupload",
      toolbar: "insert",
      icon: "plugins/mediaupload/icons/mediaupload.png"
    });
  }
});
