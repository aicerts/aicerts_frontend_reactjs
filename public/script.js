
const apiUrl = "http://10.2.3.55:7039";
const apiUrl_Admin = "http://10.2.3.55:6049";
let canvas;
let textObjects = [];
let shapeObjects = [];
let activeTextIndex = -1;
let activerShapeIndex = -1;


$(document).ready(function () {
  var isDataUnsaved = true;
  // fetchFonts();
  canvas = new fabric.Canvas("canvas");
  setCanvasSize(1324, 550);

  // new shapes

  // Add a rectangle
  $("#addSquare").click(function () {
    var rect = new fabric.Rect({
      left: 100,
      top: 100,
      fill: "red",
      width: 100,
      height: 100,
    });
    canvas.add(rect);
    canvas.renderAll();
  });

  // Add a circle
  $("#addCircle").click(function () {
    var circle = new fabric.Circle({
      left: 150,
      top: 150,
      fill: "blue",
      radius: 50,
    });
    canvas.add(circle);
    canvas.renderAll();
  });

  // Add a triangle
  $("#addTriangle").click(function () {
    var triangle = new fabric.Triangle({
      left: 200,
      top: 200,
      fill: "green",
      width: 100,
      height: 100,
    });
    canvas.add(triangle);
    canvas.renderAll();
  });

  // Add a line
  $("#addLine").click(function () {
    var line = new fabric.Line([50, 100, 200, 200], {
      left: 100,
      top: 100,
      stroke: "black",
      strokeWidth: 5,
    });
    canvas.add(line);
    canvas.renderAll();
  });

  // add arrow
  $("#addArrow").click(function () {
    // Create an arrow shape using fabric.Path
    var arrow = new fabric.Path(
      "M4.5 0H0.5C0.223858 0 0 0.223858 0 0.5V4.5C0 4.70223 0.121821 4.88455 0.308658 4.96194C0.495495 5.03933 0.710554 4.99655 0.853553 4.85355L2.5 3.20711L14.1464 14.8536L14.8536 14.1464L3.20711 2.5L4.85355 0.853553C4.99655 0.710554 5.03933 0.495495 4.96194 0.308658C4.88455 0.121821 4.70223 0 4.5 0Z",
      {
        left: 100, // Position on canvas (x-axis)
        top: 100, // Position on canvas (y-axis)
        fill: "#000000", // Fill color of the path
        strokeWidth: 0, // Stroke width (if any)
      }
    );

    // Add the arrow to the canvas
    canvas.add(arrow);
    canvas.renderAll();
  });

  $("#addTextBtn").click(function () {
    var left = canvas.width / 2;
    var top = canvas.height / 2;
    var text = new fabric.Textbox("Default Text", {
      left: left,
      top: top,
      fontSize: 20,
      fontFamily: "Arial",
      fill: "#000",
      shadow: {
        color: "#000",
        offsetX: 0,
        offsetY: 0,
        blur: 0,
      },
      editable: true,
      textAlign: "center",
      backgroundColor: "transparent",
    });
    textObjects.push(text);
    canvas.add(text);
    canvas.setActiveObject(text);
    activeShapeIndex = textObjects.length - 1;
    updateTextEditorValues(text);
    $("#textEditor").show();
    canvas.renderAll();
  });

  // // Handle font hover (preview)
  // $('#fontSelect').on('mouseover', 'option', function () {
  //   if (activeText) {
  //     var fontPreview = $(this).val();
  //     activeText.set('fontFamily', fontPreview); // Temporarily apply font on hover
  //     canvas.renderAll();
  //   }
  // });

  // // Revert to the previously selected font on mouseleave
  // $('#fontSelect').on('mouseleave', function () {
  //   if (activeText) {
  //     activeText.set('fontFamily', previousFont); // Revert to previous font if not clicked
  //     canvas.renderAll();
  //   }
  // });

  // // Handle font selection (apply the font permanently)
  // $('#fontSelect').change(function () {
  //   if (activeText) {
  //     var selectedFont = $(this).val();
  //     previousFont = selectedFont; // Update previousFont to the new selected font
  //     activeText.set('fontFamily', selectedFont); // Apply font permanently on selection
  //     canvas.renderAll();
  //   }
  // });

  $("#addImageBtn").click(function () {
    $("#imageInput").click();
  });

  $("#addRectBtn").click(function () {
    var left = canvas.width / 2;
    var top = canvas.height / 2;
    var rect = new fabric.Rect({
      left: left,
      top: top,
      width: 100,
      height: 50,
      fill: "#ff0000",
      strokeWidth: 0,
      stroke: "#000",
    });

    shapeObjects.push(rect);
    canvas.add(rect);
    canvas.setActiveObject(rect);
    activeShapeIndex = shapeObjects.length - 1;
    updateShapeEditorValues(rect);
    $("#rectControls").show();
    canvas.renderAll();
  });

  // add bg image
  // $("#addBackgroundImageBtn").click(function () {
  //   $("#bgImageInput").click(); // Trigger the file input click
  // });

  // $('#bgImageInput').change(function(event) {
  //   var file = event.target.files[0];
  //   if (file) {
  //     var reader = new FileReader();
  //     reader.onload = function(e) {
  //       var img = new Image();
  //       img.onload = function() {
  //         canvas.backgroundColor = null;
  //         canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
  //         setCanvasSize(img.width, img.height);
  //         canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
  //           // scaleX: canvas.width / img.width,
  //           // scaleY: canvas.height / img.height
  //         });
  //       };
  //       img.src = e.target.result;
  //     };
  //     reader.readAsDataURL(file);
  //   };
  // });
  // $("#bgImageInput").change(function (event) {
  //   var file = event.target.files[0];
  //   if (file) {
  //     var reader = new FileReader();
  //     reader.onload = function (e) {
  //       fabric.Image.fromURL(e.target.result, function (img) {
  //         // img.scaleToWidth(canvas.width);
  //         // img.scaleToHeight(canvas.height);
  //         setCanvasSize(img.width, img.height);

  //         canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
  //           scaleX: canvas.width / img.width,
  //           scaleY: canvas.height / img.height,
  //         });
  //       });
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // });

  // background image dropdown
  $("#addFromDevice").click(function (event) {
    $("#bgImageInput1").click();
  });
  $("#bgImageInput1").change(function (event) {
    var file = event.target.files[0];
    if (file) {
      var reader = new FileReader();
      reader.onload = function (e) {
        fabric.Image.fromURL(e.target.result, function (img) {
          // img.scaleToWidth(canvas.width);
          // img.scaleToHeight(canvas.height);
          setCanvasSize(img.width, img.height);

          canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
            scaleX: canvas.width / img.width,
            scaleY: canvas.height / img.height,
          });
        });
      };
      reader.readAsDataURL(file);
    }
  });

  var targetId = "";

  // badges 
  $(".dropdown-content-badge").on(
    "click", "> div", function (event) {
      var target = event.target;
      var url = $(target).attr("src");
      fabric.Image.fromURL(
        url,
        function (img) {
          img.set({
            left: 100,
            top: 100,
            angle: 0,
            // padding: 10,
            cornersize: 10,
            hasRotatingPoint: false,
          });
          img.scaleToWidth(100);
          img.scaleToHeight(100);
          canvas.add(img);
          canvas.renderAll();
        }
      );
    }
  );

  $(".dropdown-content-bg").on(
    "click",
    "> div",
    // "> div:not(#addFromDevice)",
    function (event) {
      var target = event.target;
       targetId = target.id;
      var designFields = target.dataset.designFields;
      if (designFields) {
        var designFieldsObj = JSON.parse(designFields);
        canvas.loadFromJSON(designFieldsObj, function () {
          // text-wont-modify , codechk
          canvas.forEachObject(function (obj) {
            if (obj.type === "textbox") {
              textObjects.push(obj);
              obj.on("selected", function () {
                activeTextIndex = textObjects.indexOf(obj); // Set active text index when selected
                updateTextEditorValues(obj); // Update text editor values based on the selected text
                $("#textEditor").show();
              });
            }
          });
          canvas.renderAll();
          setCanvasSize(
            designFieldsObj.backgroundImage.width,
            designFieldsObj.backgroundImage.height
          );
          // alert("Template loaded successfully!");
          // $("#exampleModal").modal('show');
          showAlert('Success', 'Template loaded successfully!', 'OK');
        });
      } else if (target.tagName === "IMG") {
        fabric.Image.fromURL(target.src, function (img) {
          setCanvasSize(img.width, img.height);
          canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
            scaleX: canvas.width / img.width,
            scaleY: canvas.height / img.height,
          });
        });
      }
    }
  );

  $("#exportBtn").click(function () {
    var exportFormat = $("#exportFormat").val();

    var imageData;
    switch (exportFormat) {
      case "png":
        imageData = canvas.toDataURL({
          format: "png",
        });
        saveAs(imageData, "canvas_image.png");
        break;
      case "webp":
        imageData = canvas.toDataURL({
          format: "webp",
          quality: 0.8,
        });
        saveAs(imageData, "canvas_image.webp");
        break;
      case "s3": // s3 upload
        uploadCanvasToS3();
        break;
    }

    setCanvasSize(canvas.originalWidth, canvas.originalHeight);
  });

  // Function to handle uploading and updating state
  async function uploadCanvasToS3() {
    // Convert the Fabric.js canvas to a data URL
    const dataURL = canvas.toDataURL({
      format: "png",
    });

    // Convert data URL to a Blob
    const blob = dataURLToBlob(dataURL);

    // Create a FormData object and append the Blob
    const fd = new FormData();
    const date = new Date().getTime();
    const filename = `${fileUrl.split('/').pop()}${date}.png`;
    fd.append("file", blob, filename);


    try {
      const response = await fetch(
        `${apiUrl_Admin}/api/upload`,
        {
          // const response = await fetch(`${apiUrl}/api/upload`, {
          method: "POST",
          body: fd,
        }
      );

      if (response.ok) {

        const data = await response.json();

        const fileUrl = data.fileUrl;
        sessionStorage.setItem("customTemplate", fileUrl);
        sessionStorage.setItem("cerf", "true");
        const tab = sessionStorage.getItem("tab") || 0;
        window.location.href = `/certificate?tab=${tab}`;
      } else {
        console.error("Failed to upload image:", response.statusText);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  }

  // Utility function to convert data URL to Blob
  function dataURLToBlob(dataURL) {
    var byteString = atob(dataURL.split(",")[1]);
    var mimeString = dataURL.split(",")[0].split(":")[1].split(";")[0];
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  }

  $("#addExport").click(function () {
    // uploadCanvasToS3(0);
    uploadCanvasToS3();
  });

  // back button
  $(".back").click(function () {
    const tab = sessionStorage.getItem("tab") || 0;
    window.location.href = `/certificate?tab=${tab}`;
  });

  // $("#addExporttab1").click(function () {
  //   uploadCanvasToS3(1);
  // });

  // $("#addTemplate").click(function () {
  //   var templateData = canvas.toJSON();
  //   console.log(templateData); //clg
  //   console.log(typeof(templateData)); //clg

  //   // Save the temp in LS
  //   var templateNumber = localStorage.getItem('templateNumber') || 0;
  //   templateNumber++;
  //   localStorage.setItem('templateNumber', templateNumber);
  //   localStorage.setItem(`template${templateNumber}`, JSON.stringify(templateData));
  //   alert('Template made successfully!');

  //   // Add the image of made template in the dropdown
  //   var templateNumber = localStorage.getItem('templateNumber');
  //   templateNumber = parseInt(templateNumber) || 0;
  //   templateNumber++;
  //   localStorage.setItem('templateNumber', templateNumber);

  //   var templateId = 'template' + templateNumber;
  //   var templateImg = `<div id="${templateId}"><img id="${templateId}" src="${canvas.toDataURL()}" width="80" height="80" /></div>`;
  //   $('.dropdown-content-bg').append(templateImg);

  // });

  //add template to s3 vua api
  let fileUrl = ""; // gets image url from uploadtos3 func, this will be used in below func. 

  $("#addTemplate").click(async function () {

    // get email
    var storedUser = JSON.parse(localStorage.getItem("user") ?? "null");
    var userEmail;
    if (storedUser && storedUser.JWTToken) {
      userEmail = storedUser.email.toLowerCase();
    }


    var templateData = canvas.toJSON();

   
    
    // image url,  almost same to uploadtos3 func
    // Convert data URL to a Blob
    const dataURL = canvas.toDataURL({
      format: "png",
    });
    const blob = dataURLToBlob(dataURL);
    const fd = new FormData();
    const date = new Date().getTime();
    const filename = `${fileUrl.split('/').pop()}${date}.png`;
    fd.append("file", blob, filename);

    try {
      const response = await fetch(
        `${apiUrl_Admin}/api/upload`,
        {
          // const response = await fetch(`${apiUrl}/api/upload`, {
          method: "POST",
          body: fd,
        }
      );

      if (response.ok) {
        const data = await response.json();
        // console.log(response);
        // console.log(response.json());
         fileUrl = data.fileUrl;
        //  console.log(fileUrl)
      } else {
        console.error("Failed to upload template:", response.statusText);
      }
    } catch (error) {
      console.error("Error uploading template:", error);
    }


    try {
      const response = await fetch(
        `${apiUrl}/api/add-certificate-template`,
        {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
        },
          body: JSON.stringify({
            email: userEmail,
            url: fileUrl,
            designFields: templateData
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        // console.log(data);
        showAlert('Success', 'Template saved successfully!', 'OK');
        isDataUnsaved = false;
      } else {
        console.error("Failed to Save template", response.statusText);
      }
    } catch (error) {
      console.error("Error saving template:", error);
    }
  });

    
   // Function to handle updating the certificate template
async function updateCertificateTemplate(id, fileUrl, templateData) {
  try {
    const response = await fetch(
      `${apiUrl}/api/update-certificate-template`,
      {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: id,
          url: fileUrl,
          designFields: templateData
        }),
      }
    );

    if (response.ok) {
      const data = await response.json();
      showAlert('Success', 'Template updated successfully!', 'OK');
      isDataUnsaved = false;
      return data;
    } else {
      console.error("Failed to save existing template", response.statusText);
    }
  } catch (error) {
    console.error("Error saving existing template:", error);
  }
}

// Main click handler
$("#addinexistingTemplate").click(async function () {
  
  var templateData = canvas.toJSON();
  
  // Image URL, almost the same as upload to S3
  // Convert data URL to a Blob
  const dataURL = canvas.toDataURL({
    format: "png",
  });
  const blob = dataURLToBlob(dataURL);
  const fd = new FormData();
  const date = new Date().getTime();
  const filename = `${fileUrl.split('/').pop()}${date}.png`;
  fd.append("file", blob, filename);

  try {
    const uploadResponse = await fetch(
      `${apiUrl_Admin}/api/upload`,
      {
        method: "POST",
        body: fd,
      }
    );

    if (uploadResponse.ok) {
      const data = await uploadResponse.json();
      fileUrl = data.fileUrl;

      // Extract the ID of the present canvas
      var id = targetId.split("template")[1];
      
      // Call the new function for updating the certificate template
      await updateCertificateTemplate(id, fileUrl, templateData);
    } else {
      console.error("Failed to upload template:", uploadResponse.statusText);
    }
  } catch (error) {
    console.error("Error uploading template:", error);
  }
});


// setInterval(function() {
//   var templateData = canvas.toJSON();
//   var id = targetId.split("template")[1];
//   updateCertificateTemplate(id, fileUrl, templateData)
// }, 5000);

  $("#useTemplate").click(function () {
    var templateData = localStorage.getItem("template1");
    let data = JSON.parse(templateData);
    // console.log(JSON.parse(templateData));
    // console.log(data.backgroundImage.width);

    if (templateData) {
      // Clear the current canvas
      canvas.clear();

      // Load the template into the canvas (this is a copy)
      canvas.loadFromJSON(JSON.parse(templateData), function (obj) {
        // const parsedTemplateData = JSON.parse(templateData);
        // canvas.setWidth(parsedTemplateData.BackgroundImage.width);
        // canvas.setHeight(parsedTemplateData.BackgroundImage.height);
        canvas.renderAll();
        setCanvasSize(data.backgroundImage.width, data.backgroundImage.height);
        // alert("Template loaded successfully!");
        showAlert('Success', 'Template loaded successfully!', 'OK');

      });
    } else {
      // alert("Template not found!");
      showAlert('Warning', 'Template not found', 'OK');
      
    }
  });

  $("#imageInput").change(function (e) {
    var file = e.target.files[0];
    var reader = new FileReader();
    reader.onload = function (f) {
      var data = f.target.result;
      fabric.Image.fromURL(data, function (img) {
        canvas.add(img);
        canvas.renderAll();
      });
    };
    reader.readAsDataURL(file);
  });

  $("#bgColorPicker").change(function () {
    var newBgColor = $(this).val();
    canvas.setBackgroundColor(newBgColor);
    canvas.renderAll();
  });

  $(".canvasSizeSelect").change(function () {
    var selectedSize = $(this).val();
    switch (selectedSize) {
      case "youtube":
        setCanvasSize(1280, 720);
        break;
      case "facebook":
        setCanvasSize(1200, 630);
        break;
      case "instagram":
        setCanvasSize(1080, 1080);
        break;
      case "twitter":
        setCanvasSize(1024, 512);
        break;
      case "pinterest":
        setCanvasSize(1000, 1500);
        break;
      case "tumblr":
        setCanvasSize(540, 810);
        break;
      case "custom":
        $("#customSizeFields").show();
        break;
    }
  });
  // custom size changes
  var customWidth = null;
  var customHeight = null;
  $("#customWidth").change(function () {
    customWidth = parseInt($("#customWidth").val());
    if (customHeight !== null) {
      setCanvasSize(customWidth, customHeight);
      customWidth = null;
      customHeight = null;
    }
  });
  $("#customHeight").change(function () {
    customHeight = parseInt($("#customHeight").val());
    if (customWidth !== null) {
      setCanvasSize(customWidth, customHeight);
      customWidth = null;
      customHeight = null;
    }
    //   $("#customWidth, #customHeight").change(function () {
    //     var customWidth = parseInt($("#customWidth").val());
    //     var customHeight = parseInt($("#customHeight").val());
    //     setCanvasSize(customWidth, customHeight);
  });

  function setCanvasSize(width, height) {
    $("#canvas-wrapper").css("width", width);
    $("#canvas-wrapper").css("height", height);
    // $("#canvasContainer").css("width", width);
    // $("#canvasContainer").css("height", height);
    $("#canvas").attr("width", width);
    $("#canvas").attr("height", height);
    canvas.setWidth(width);
    canvas.setHeight(height);
    $("#customSizeFields").hide();
    canvas.renderAll();
  }

  canvas.on("mouse:down", function (event) {
    if (event.target && event.target.type === "textbox") {
      activeTextIndex = textObjects.indexOf(event.target);
      $("#textEditor").show();
    } else {
      $("#textEditor").hide();
    }
  });

  $(
    "#rectColorInput, #rectWidthInput, #rectHeightInput, #outlineSizeInput, #outlineColorInput"
  ).change(function () {
    var newRectColor = $("#rectColorInput").val();
    var newRectWidth = parseInt($("#rectWidthInput").val());
    var newRectHeight = parseInt($("#rectHeightInput").val());
    var newOutlineSize = parseInt($("#outlineSizeInput").val());
    var newOutlineColor = $("#outlineColorInput").val();

    if (activeShape) {
      activeShape.set({
        fill: newRectColor,
        width: newRectWidth,
        height: newRectHeight,
        strokeWidth: newOutlineSize,
        stroke: newOutlineColor,
      });
      canvas.renderAll();
    }
  });

  // Text Input Change Handler
  $("#textInput").change(function () {
    var newText = $(this).val();
    // console.log("newText: ", newText);
    var activeText = textObjects[activeTextIndex];

    if (activeText) {
      activeText.set({
        text: newText,
      });
      canvas.renderAll();
    }
  });

  // Text Color Change Handler
  $("#colorInput").change(function () {
    var newColor = $(this).val();
    // console.log("newColor: ", newColor);
    var activeText = textObjects[activeTextIndex];

    if (activeText) {
      activeText.set({
        fill: newColor,
      });
      canvas.renderAll();
    }
  });

  // Text Shadow Color Change Handler
  // $("#shadowColorInput").change(function () {
  //   var newShadowColor = $(this).val();
  //   console.log("newShadowColor: ", newShadowColor);
  //   var activeText = textObjects[activeTextIndex];

  //   if (activeText) {
  //     activeText.set({
  //       shadow: {
  //         color: newShadowColor,
  //       },
  //     });
  //     canvas.renderAll();
  //   }
  // });

  // Text Shadow Size Change Handler
  $("#shadowSizeInput").change(function () {
    var newShadowSize = parseInt($(this).val());
    var activeText = textObjects[activeTextIndex];

    if (activeText) {
      activeText.set({
        shadow: {
          offsetX: newShadowSize,
          offsetY: newShadowSize,
          blur: newShadowSize,
        },
      });
      canvas.renderAll();
    }
  });

  // Text Font Change Handler
  $("#fontSelect").change(function () {
    var newFont = $(this).val();
    // console.log("newFont: ", newFont);
    var activeText = textObjects[activeTextIndex];
    // console.log(activeText);

    if (activeText) {
      activeText.set({
        fontFamily: newFont,
      });
      canvas.renderAll();
    }
  });

  // Text Size Change Handler
  $("#sizeInput").change(function () {
    var newSize = parseInt($(this).val());
    // console.log("newSize: ", newSize);

    var activeText = textObjects[activeTextIndex];

    if (activeText) {
      activeText.set({
        fontSize: newSize,
      });
      canvas.renderAll();
    }
  });

  // Text Align Change Handler
  $("#textAlignLeft").click(function () {
    var newTextAlign = "left";
    console.log("newTextAlign: ", newTextAlign);
    var activeText = textObjects[activeTextIndex];

    if (activeText) {
      activeText.set({
        textAlign: newTextAlign,
      });
      canvas.renderAll();
    }
  });
  $("#textAlignCenter").click(function () {
    var newTextAlign = "center";
    // console.log("newTextAlign: ", newTextAlign);
    var activeText = textObjects[activeTextIndex];

    if (activeText) {
      activeText.set({
        textAlign: newTextAlign,
      });
      canvas.renderAll();
    }
  });
  $("#textAlignRight").click(function () {
    // var newTextAlign = $(this).val();
    var newTextAlign = "right";

    // console.log("newTextAlign: ", newTextAlign);
    var activeText = textObjects[activeTextIndex];

    if (activeText) {
      activeText.set({
        textAlign: newTextAlign,
      });
      canvas.renderAll();
    }
  });

  $("#bgColorInput").change(function () {
    var newBgColor = $("#bgColorInput").val() || "transparent";
    // console.log("newBgColor: ", newBgColor);
    var activeText = textObjects[activeTextIndex];

    if (activeText) {
      activeText.set({
        backgroundColor: newBgColor,
      });
      canvas.renderAll();
    }
  });

  // $("#deleteBtn").click(function () {
  //   var activeObject = canvas.getActiveObject();
  //   if (activeObject) {
  //     canvas.remove(activeObject);
  //     var index = textObjects.indexOf(activeObject);
  //     if (index !== -1) {
  //       textObjects.splice(index, 1);
  //     }
  //     canvas.discardActiveObject();
  //     canvas.renderAll();
  //   }
  // });

  function updateTextEditorValues(textObject) {
    $("#textInput").val(textObject.text);
    $("#colorInput").val(textObject.fill);
    // $("#shadowColorInput").val(textObject.shadow.color);
    $("#shadowSizeInput").val(textObject.shadow.offsetX);
    $("#bgColorInput").val(textObject.backgroundColor);
    $("#fontSelect").val(textObject.fontFamily);
    $("#sizeInput").val(textObject.fontSize);
    $("#textAlignLeft").val(textObject.textAlign);
    $("#textAlignCenter").val(textObject.textAlign);
    $("#textAlignRight").val(textObject.textAlign);
  }

  function updateShapeEditorValues(shapeObject) {
    $("#rectColorInput").val(shapeObject.fill);
    $("#rectWidthInput").val(shapeObject.width);
    $("#rectHeightInput").val(shapeObject.height);
    $("#outlineSizeInput").val(shapeObject.strokeWidth);
    $("#outlineColorInput").val(shapeObject.stroke);
  }

  $("#canvas-wrapper").resizable({
    resize: function (event, ui) {
      var newWidth = ui.size.width;
      var newHeight = ui.size.height;
      $("#canvas").attr("width", newWidth);
      $("#canvas").attr("height", newHeight);
      canvas.setWidth(newWidth);
      canvas.setHeight(newHeight);
      canvas.renderAll();
    },
  });
  // $("#canvasContainer").resizable({
  //   resize: function (event, ui) {
  //     var newWidth = ui.size.width;
  //     var newHeight = ui.size.height;
  //     $("#canvas").attr("width", newWidth);
  //     $("#canvas").attr("height", newHeight);
  //     canvas.setWidth(newWidth);
  //     canvas.setHeight(newHeight);
  //     canvas.renderAll();
  //   },
  // });

  // for font
  const fontList = [
    "Agency FB",
    "Andalé Mono",
    "Andale Mono",
    "Antique Olive",
    "Arial",
    "Avant Garde",
    "Baskerville",
    "Berlin Sans FB",
    "Book Antiqua",
    "Bookman",
    "Bradley Hand",
    "Broadway",
    "Brush Script MT",
    "Calabri",
    "Candara",
    "Castellar",
    "Century Gothic",
    "Comic Sans MS",
    "Consolas",
    "Constantia",
    "Corbel",
    "Courier",
    "Courier New",
    "Copperplate",
    "Estrangelo Edessa",
    "Elephant",
    "Eurostile",
    "Fixed",
    "Franklin Gothic",
    "Franklin Gothic Medium",
    "Futura",
    "Garamond",
    "Gautami",
    "Geneva",
    "Georgia",
    "Gill Sans",
    "Goudy Old Style",
    "Haettenschweiler",
    "Helvetica",
    "Impact",
    "Inconsolata",
    "Latha",
    "Lucida",
    "Lucida Bright",
    "Lucida Console",
    "Lucida Fax",
    "Lucida Grande",
    "Lucida Handwriting",
    "Lucida Sans",
    "Luminari",
    "Mangal",
    "Matura MT Script Capitals",
    "Microsoft Sans Serif",
    "Monaco",
    "MS Sans Serif",
    "MS Serif",
    "Old English Text MT",
    "Onyx",
    "Optima",
    "Palatino",
    "Palatino Linotype",
    "Papyrus",
    "Perpetua",
    "Playbill",
    "Raavi",
    "Rockwell",
    "Segoe UI",
    "Shruti",
    "Stencil",
    "Sylfaen",
    "Tahoma",
    "Times New Roman",
    "Trebuchet MS",
    "Tunga",
    "Univers",
    "Verdana",
    "Wide Latin",
  ];

  const $selectElement = $("#fontSelect");
  const $selectsizeElement = $("#sizeSelect");

  fontList.forEach((font) => {
    $selectElement.append(
      $("<option>", {
        value: font,
        text: font,
        style: `font-family: ${font};`,
      })
    );
  });

  // for text size
  const sizeList = [
    2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48,
    72, 96,
  ];
  $selectsizeElement.change(function () {
    var activeText = textObjects[activeTextIndex];
    if (activeText) {
      var newSize = parseInt($(this).val());
      activeText.set({
        fontSize: newSize,
      });
      canvas.renderAll();
    }
  });
  sizeList.forEach((size) => {
    $selectsizeElement.append(
      $("<option>", {
        value: size,
        text: size,
      })
    );
  });


  // on rleoad, get cerfs.
  (async function () {
    var storedUser = JSON.parse(localStorage.getItem("user") ?? "null");
    var userEmail;
    if (storedUser && storedUser.JWTToken) {
      userEmail = storedUser.email.toLowerCase();
    }
    // console.log(userEmail);
    // get the temp from s3
    try {
        const response = await fetch(
          `${apiUrl}/api/get-certificate-templates`,
          {
            method: "POST",
            headers: {
              'Content-Type': 'application/json',
          },
            body: JSON.stringify({
              email: userEmail,
            }),
          }
        );
  
        if (response.ok) {
          const data = await response.json();
          // console.log(data);  
          
          if (data.status === "SUCCESS" && data.data.length > 0) {
            // Remove all templates loaded from API
            $(".templatefromapi").remove();
            
            data.data.forEach((template, index) => {
            
                // Create template image in the dropdown using the URL and _id
                createTemplateImage(template);
            });

        } else {
            console.error("No templates found.");
        }

        } else {
          console.error("Can't fetch template", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching template:", error);
      }
  })();

  function createTemplateImage(template) {
    const templateId = 'template' + template._id; // Use _id from the template
    const templateImg = `
        <div id="${templateId}" class="grid-box templatefromapi">
            <img id="${templateId}" src="${template.url}" width="80" height="80" data-design-fields='${JSON.stringify(template.designFields)}' />
        </div>`;
    
    $('#designed').append(templateImg); // Append to dropdown
}

  // $(window).on('beforeunload', function(event) {
  //   if (isDataUnsaved) {
  //       var message = "You have unsaved changes. Do you really want to leave?";
  //       event.preventDefault(); 
  //       event.returnValue = message; 
  //       return message; 
  //   }
  // });

  // Show the modal dialog instead of the default prompt
  $(window).on('beforeunload', function(event) {
    if (isDataUnsaved) {
        showUnsavedChangesModal(); 
        event.preventDefault(); 
        event.returnValue = '';
    }
  })

  function showUnsavedChangesModal() {
    $('#unsavedChangesModal').show();

    
    $('#saveButton').off('click').on('click', function(event) {
        // event.preventDefault();
        saveChanges();
        $('#unsavedChangesModal').hide(); 
        isDataUnsaved = false; 

    });

    $('#leaveButton').off('click').on('click', function() {
      $('#unsavedChangesModal').hide(); // Hide the modal
      isDataUnsaved = false; // Reset the unsaved changes flag
      // window.location.href = 'your-desired-url'; // Replace with the URL to navigate to
  });
  }

  function saveChanges() {
    if(targetId.length > 0){
      $("#addinexistingTemplate").click();
    }else{
      $("#addTemplate").click();
    }
  }



  // guide lines code
  canvas.on('object:moving', function (e) {
    const obj = e.target;
    clearGuidelines(); // Clear previous guidelines

    const tolerance = 10; // Adjust for how close objects should be to snap
    const snapRange = 5; // How far objects need to be to automatically snap

    // Get the center of the canvas
    const canvasCenterX = canvas.width / 2;
    const canvasCenterY = canvas.height / 2;

    // Loop through all objects to find nearby ones
    canvas.getObjects().forEach(function(target) {
        if (target !== obj) {
            // Get target object edges (left, right, top, bottom)
            const targetLeft = target.left;
            const targetRight = target.left + target.width * target.scaleX;
            const targetTop = target.top;
            const targetBottom = target.top + target.height * target.scaleY;

            // Get the moving object edges
            const objRight = obj.left + obj.width * obj.scaleX;
            const objBottom = obj.top + obj.height * obj.scaleY;

            // Get the center of the target object
            const targetCenterX = targetLeft + (target.width * target.scaleX) / 2;
            const targetCenterY = targetTop + (target.height * target.scaleY) / 2;

            // Check for vertical alignment (left and right)
            if (Math.abs(obj.left - targetLeft) < tolerance) {
                drawGuideline(targetLeft, 0, targetLeft, canvas.height, 'red'); // Draw guideline
                if (Math.abs(obj.left - targetLeft) < snapRange) {
                    obj.left = targetLeft; // Snap to the left
                }
            }
            if (Math.abs(objRight - targetRight) < tolerance) {
                drawGuideline(targetRight, 0, targetRight, canvas.height, 'red'); // Draw guideline
                if (Math.abs(objRight - targetRight) < snapRange) {
                    obj.left = targetRight - obj.width * obj.scaleX; // Snap to the right
                }
            }

            // Check for horizontal alignment (top and bottom)
            if (Math.abs(obj.top - targetTop) < tolerance) {
                drawGuideline(0, targetTop, canvas.width, targetTop, 'blue'); // Draw guideline
                if (Math.abs(obj.top - targetTop) < snapRange) {
                    obj.top = targetTop; // Snap to the top
                }
            }
            if (Math.abs(objBottom - targetBottom) < tolerance) {
                drawGuideline(0, targetBottom, canvas.width, targetBottom, 'blue'); // Draw guideline
                if (Math.abs(objBottom - targetBottom) < snapRange) {
                    obj.top = targetBottom - obj.height * obj.scaleY; // Snap to the bottom
                }
            }

            // Check for center alignment (both vertical and horizontal)
            if (Math.abs(obj.left + (obj.width * obj.scaleX) / 2 - targetCenterX) < tolerance) {
                drawGuideline(targetCenterX, 0, targetCenterX, canvas.height, 'green'); // Draw guideline
                if (Math.abs(obj.left + (obj.width * obj.scaleX) / 2 - targetCenterX) < snapRange) {
                    obj.left = targetCenterX - (obj.width * obj.scaleX) / 2; // Snap to center horizontally
                }
            }
            if (Math.abs(obj.top + (obj.height * obj.scaleY) / 2 - targetCenterY) < tolerance) {
                drawGuideline(0, targetCenterY, canvas.width, targetCenterY, 'yellow'); // Draw guideline
                if (Math.abs(obj.top + (obj.height * obj.scaleY) / 2 - targetCenterY) < snapRange) {
                    obj.top = targetCenterY - (obj.height * obj.scaleY) / 2; // Snap to center vertically
                }
            }
        }
    });

    // Check for canvas center alignment
    if (Math.abs(obj.left + (obj.width * obj.scaleX) / 2 - canvasCenterX) < tolerance) {
        drawGuideline(canvasCenterX, 0, canvasCenterX, canvas.height, 'green'); // Draw guideline
        if (Math.abs(obj.left + (obj.width * obj.scaleX) / 2 - canvasCenterX) < snapRange) {
            obj.left = canvasCenterX - (obj.width * obj.scaleX) / 2; // Snap to canvas center horizontally
        }
    }
    if (Math.abs(obj.top + (obj.height * obj.scaleY) / 2 - canvasCenterY) < tolerance) {
        drawGuideline(0, canvasCenterY, canvas.width, canvasCenterY, 'yellow'); // Draw guideline
        if (Math.abs(obj.top + (obj.height * obj.scaleY) / 2 - canvasCenterY) < snapRange) {
            obj.top = canvasCenterY - (obj.height * obj.scaleY) / 2; // Snap to canvas center vertically
        }
    }

    canvas.renderAll(); // Render the canvas with new object positions
});

canvas.on('object:modified', function() {
    clearGuidelines(); // Clear guidelines after the object has been moved
});

// Clear all guidelines
function clearGuidelines() {
    const guidelines = canvas.getObjects().filter(obj => obj.type === 'line' && !obj.selectable);
    guidelines.forEach(line => canvas.remove(line));
}

// Function to draw guidelines from one object to the edges of the canvas (or nearby object)
function drawGuideline(x1, y1, x2, y2, color) {
    const line = new fabric.Line([x1, y1, x2, y2], {
        stroke: color,
        strokeWidth: 1,
        selectable: false,
        evented: false,
        objectCaching: false,
    });
    canvas.add(line);
    return line;
}

function showAlert(header, body, buttonText) {
  $("#alertModalLabel").text(header);
  $("#alertModalBody").text(body);
  $("#alertModalButton").text(buttonText);
  $("#alertModal").modal("show");
}



});
  


canvas.on("object:selected", function (e) {
  var activeObject = e.target;
  if (activeObject) {
    canvas.bringToFront(activeObject);
    canvas.renderAll();
    activeObject.bringForward();

    if (activeObject.type === "textbox") {
      // Check if the activeObject is part of textObjects
      if (!textObjects.includes(activeObject)) {
        textObjects.push(activeObject); // Add to textObjects if not already included
      }
      activeTextIndex = textObjects.indexOf(activeObject); // Set the active text index

      // Update text editor values for the selected text object
      updateTextEditorValues(activeObject);
      $("#textEditor").show();
    } else {
      updateShapeEditorValues(activeObject);
      $("#shapeEditor").show();
    }
  } else {
    $("#textEditor").hide();
    $("#shapeEditor").hide();
  }
});

canvas.on("selection:cleared", function (e) {
  var lastSelectedObject = canvas._objects[canvas._objects.length - 1];
  if (lastSelectedObject) {
    canvas.bringToFront(lastSelectedObject);
    canvas.renderAll();
  }
});



