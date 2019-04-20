CKEDITOR.dialog.add("mediauploadDialog", function(editor) {
  return {
    title: "File Upload",
    minWidth: 400,
    minHeight: 200,
    contents: [
      {
        id: "upload_image_dialog",
        label: "Image",
        elements: [
          {
            type: "html",
            html: '<input type="file" id="imagefileuploadinput" />'
          },
          {
            type: "text",
            id: "image_alt_text",
            label: "Alternative text"
          },
          {
            type: "text",
            id: "image_width",
            label: "Width"
          },
          {
            type: "text",
            id: "image_height",
            label: "Height"
          }
        ]
      },
      {
        id: "upload_video_dialog",
        label: "Video",
        elements: [
          {
            type: "html",
            html: '<input type="file" id="videofileuploadinput" />'
          },
          {
            type: "text",
            id: "video_width",
            label: "Width"
          },
          {
            type: "text",
            id: "video_height",
            label: "Height"
          }
        ]
      },
      {
        id: "upload_pdf_dialog",
        label: "PDF",
        elements: [
          {
            type: "html",
            html: '<input type="file" id="pdffileuploadinput" />'
          },
          {
            type: "text",
            id: "pdf_alt_text",
            label: "Text"
          },
          {
            type: "radio",
            id: "pdf_target",
            label: "Open PDF on Tab?",
            items: [["Self", "_self"], ["New Tab", "_blank"]],
            default: "_blank"
          }
        ]
      }
    ],
    onOk: function() {
      let tabid = CKEDITOR.dialog.getCurrent().definition.dialog._.currentTabId;
      console.log(tabid);
      dialogbox = this;
      dialogElement = dialogbox.getElement();

      if (tabid === "upload_image_dialog") {
        let formData = new FormData();
        formData.append("_csrf", document.getElementById("csrftocken").value);
        formData.append(
          "fileToUpload",
          document.getElementById("imagefileuploadinput").files[0]
        );
        let alt = dialogbox.getValueOf("upload_image_dialog", "image_alt_text");
        let width = dialogbox.getValueOf("upload_image_dialog", "image_width");
        let height = dialogbox.getValueOf(
          "upload_image_dialog",
          "image_height"
        );

        $.ajax({
          type: "POST",
          url: "/social-post/image_upload",
          data: formData,
          processData: false,
          contentType: false,
          success: r => {
            if (r.state) {
              var abbr = editor.document.createElement("img");
              abbr.setAttribute("src", r.src);
              alt.length > 0 ? abbr.setAttribute("alt", alt) : "";
              width.length > 0 ? abbr.setAttribute("width", width + "") : "";
              height.length > 0 ? abbr.setAttribute("height", height + "") : "";
              editor.insertElement(abbr);
            } else {
              console.log(r.msg);
            }
          }
        });
      }
      if (tabid === "upload_video_dialog") {
        var formData = new FormData();
        formData.append("_csrf", document.getElementById("csrftocken").value);
        formData.append(
          "fileToUpload",
          document.getElementById("videofileuploadinput").files[0]
        );
        let width = dialogbox.getValueOf("upload_video_dialog", "video_width");
        let height = dialogbox.getValueOf(
          "upload_video_dialog",
          "video_height"
        );
        $.ajax({
          type: "POST",
          url: "/social-post/video_upload",
          data: formData,
          processData: false,
          contentType: false,
          success: function(r) {
            if (r.state) {
              let addattr = "";
              addattr += width.length > 0 ? ' width="' + width + '"' : "";
              addattr += height.length > 0 ? ' height="' + height + '"' : "";
              editor.insertHtml(
                "<p><video " +
                  addattr +
                  ' controls><source src="' +
                  r.src +
                  '" type="video/mp4"> Video uploaded.</video></p>'
              );
            } else {
              console.log(r.msg);
            }
          }
        });
      } else if (tabid === "upload_pdf_dialog") {
        var formData = new FormData();
        formData.append("_csrf", document.getElementById("csrftocken").value);
        formData.append(
          "fileToUpload",
          document.getElementById("pdffileuploadinput").files[0]
        );
        let text = dialogbox.getValueOf("upload_pdf_dialog", "pdf_alt_text");
        let filename = document.getElementById("pdffileuploadinput").files[0]
          .name;
        let target = dialogbox.getValueOf("upload_pdf_dialog", "pdf_target");
        $.ajax({
          type: "POST",
          url: "/social-post/pdf_upload",
          data: formData,
          processData: false,
          contentType: false,
          success: function(r) {
            if (r.state) {
              let attr = target.length > 0 ? 'target="' + target + '"' : "";

              // if any name added for pdf link
              if (text.length > 0) {
                editor.insertHtml(
                  '<object data="' +
                    r.src +
                    '" type="application/pdf" width="100%" height="100%"><a ' +
                    attr +
                    ' href = "' +
                    r.src +
                    '">' +
                    text +
                    "</a></object>"
                );
              } else {
                editor.insertHtml(
                  '<object data="' +
                    r.src +
                    '" type="application/pdf" width="100%" height="100%"><a ' +
                    attr +
                    ' href = "' +
                    r.src +
                    '">' +
                    filename +
                    "</a></object>"
                );
              }
            } else {
              console.log(r.msg);
            }
          }
        });
      }
    }
  };
});
