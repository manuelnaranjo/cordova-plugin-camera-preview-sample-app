var app = {
  dimension: null,
  camera: 'front',

  startCameraAbove: function(){
    CameraPreview.startCamera({x: 50, y: 50, width: 300, height: 300, toBack: false, previewDrag: true, tapPhoto: true, disableExifHeaderStripping: true, camera: app.camera, storeToFile: true}, function(){
      app.initCameraSize();
    });
  },

  startCameraBelow: function(){
    CameraPreview.startCamera({x: 50, y: 50, width: 300, height:300, camera: app.camera, tapPhoto: true, previewDrag: false, toBack: true, disableExifHeaderStripping: true, storeToFile: true}, function(){
      app.initCameraSize();
    });
  },

  stopCamera: function(){
    CameraPreview.stopCamera();
  },

  displayImage(src) {
    let holder = document.getElementById('originalPicture');
    let width = holder.offsetWidth;
    loadImage(
      image,
      function(canvas) {
        console.log('loaded image');
        holder.innerHTML = "";
        if (app.camera === 'front') {
          // front camera requires we flip horizontally
          canvas.style.transform = 'scale(1, -1)';
        }
        holder.appendChild(canvas);
        console.log('image displayed');
      },
      {
        maxWidth: width,
        orientation: true,
        canvas: true
      }
    );
  }

  takePicture: function(){
    if (!app.dimension) {
      return;
    }
    CameraPreview.takePicture({width: app.dimension.width, height: app.dimension.height}, function(data){
      if (cordova.platformId === 'android') {
        CameraPreview.getBlob('file://' + data, function(image) {
          app.displayImage(image);
        });
      } else {
        app.displayImage('data:image/jpeg;base64,' + data);
      }
    });
  },

  switchCamera: function(){
    // keep track of the camera been used
    if (app.camera === 'front') {
      app.camera = 'back';
    } else {
      app.camera = 'front';
    }
    CameraPreview.switchCamera();
  },

  show: function(){
    CameraPreview.show();
  },

  hide: function(){
    CameraPreview.hide();
  },

  changeColorEffect: function(){
    var effect = document.getElementById('selectColorEffect').value;
    CameraPreview.setColorEffect(effect);
  },

  changeFlashMode: function(){
    var mode = document.getElementById('selectFlashMode').value;
    CameraPreview.setFlashMode(mode);
  },

  changeZoom: function(){
    var zoom = document.getElementById('zoomSlider').value;
    document.getElementById('zoomValue').innerHTML = zoom;
    CameraPreview.setZoom(zoom);
  },

  changePreviewSize: function(){
    window.smallPreview = !window.smallPreview;
    if(window.smallPreview){
      CameraPreview.setPreviewSize({width: 100, height: 100});
    }else{
      CameraPreview.setPreviewSize({width: window.screen.width, height: window.screen.height});
    }
  },

  showSupportedPictureSizes: function(){
    CameraPreview.getSupportedPictureSizes(function(dimensions){
      dimensions.forEach(function(dimension) {
        console.log(dimension.width + 'x' + dimension.height);
      });
    });
  },

  initCameraSize: function() {
    CameraPreview.getSupportedPictureSizes(function(dimensions){
      dimensions.sort(function(a, b){
        return (b.width * b.height) - (a.width * a.height);
      });
      app.dimension = dimensions[0];
    });
  },

  init: function(){

    document.getElementById('startCameraAboveButton').addEventListener('click', this.startCameraAbove, false);
    document.getElementById('startCameraBelowButton').addEventListener('click', this.startCameraBelow, false);

    document.getElementById('stopCameraButton').addEventListener('click', this.stopCamera, false);
    document.getElementById('switchCameraButton').addEventListener('click', this.switchCamera, false);
    document.getElementById('showButton').addEventListener('click', this.show, false);
    document.getElementById('hideButton').addEventListener('click', this.hide, false);
    document.getElementById('takePictureButton').addEventListener('click', this.takePicture, false);
    document.getElementById('selectColorEffect').addEventListener('change', this.changeColorEffect, false);
    document.getElementById('selectFlashMode').addEventListener('change', this.changeFlashMode, false);

    if(navigator.userAgent.match(/Android/i)  == "Android"){
      document.getElementById('zoomSlider').addEventListener('change', this.changeZoom, false);
    }else{
      document.getElementById('androidOnly').style.display = 'none';
    }

    window.smallPreview = false;
    document.getElementById('changePreviewSize').addEventListener('click', this.changePreviewSize, false);

    document.getElementById('showSupportedPictureSizes').addEventListener('click', this.showSupportedPictureSizes, false);

    // legacy - not sure if this was supposed to fix anything
    //window.addEventListener('orientationchange', this.onStopCamera, false);
  }
};

document.addEventListener('deviceready', function(){
  app.init();
}, false);
