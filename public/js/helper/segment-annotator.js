/**
 * Segment annotation widget.
 *
 * var annotator = new SegmentAnnotator("/path/to/image.jpg", {
 *   onload: function () {},
 *   onerror: function () {},
 *   onchange: function () {},
 *   onrightclick: function () {},
 *   onleftclick: function () {}
 * });
 * document.body.appendChild(annotator.container);
 * 
 * NOT ALLOWED COLOR: [255, 255, 255], 
 *
 * Copyright 2021 Night Furry
 */
var ALPHA_INIT = 175;
define(['../image/layer',
        // '../image/segmentation',
        '../image/morph',
        '../dom-to-image',
        '../image/segmentation/detection'
        ],
function (Layer/*, segmentation*/, morph, Domtoimage, Detection) {
  // Segment annotator.
  function Annotator(imageURL, options) {
    options = options || {};
    if (typeof imageURL !== "string") {
      throw "Invalid imageURL";
    }
    this.colormap = options.colormap || [[255, 255, 255], [255, 0, 0]];
    this.boundaryColor = options.boundaryColor || [255, 255, 255];
    this.boundaryAlpha = options.boundaryAlpha || 127;
    this.visualizationAlpha = options.visualizationAlpha || ALPHA_INIT;
    this.highlightAlpha = options.highlightAlpha || 
                          Math.min(255, this.visualizationAlpha + 128);
    this.currentZoom = 1.0;
    this.defaultLabel = options.defaultLabel || 0;
    this.defaultPattern = options.defaultPattern || 0;
    this.maxHistoryRecord = options.maxHistoryRecord || 10;
    this.onchange = options.onchange || null;
    this.onrightclick = options.onrightclick || null;
    this.onleftclick = options.onleftclick || null;
    this.onhighlight = options.onhighlight || null;
    this.onmousemove = options.onmousemove || null;
    this.patternmap = options.patternmap || null;
    this._createLayers(options);
    this._initializeHistory(options);
    // this.mode = "superpixel";
    this.mode = "detection";
    this.polygonPoints = [];
    this.regions = [];
    this.boundaries = [];
    this.prevAnnotationImg = null;
    this.currentPixels = null;
    var annotator = this;
    this.layers.pattern.load(this.patternmap[0], {
      onload: function () {
        console.log('Pattern image load succeed.'); 
        // console.log(annotator.layers.pattern.imageData);
        annotator.patternWidth = annotator.layers.pattern.imageData.width;
        annotator.patternHeight = annotator.layers.pattern.imageData.height;
        annotator.layers.image.load(imageURL, {
          width: options.width,
          height: options.height,
          paintwidth: options.paintwidth,
          paintheight: options.paintheight,
          onload: function () { 
            annotator._initialize(options);
          },
          onerror: options.onerror
        });
      },
      onerror: function() {}
    });
  }

  // Run superpixel segmentation.
  Annotator.prototype.resetSuperpixels = function (options) {
    options = options || {};
    // this.layers.superpixel.copy(this.layers.image);
    // this.segmentation = segmentation.create(this.layers.image.imageData,
    //                                         options);
    // this._updateSuperpixels(options);
    return this;
  };

  // Adjust the superpixel resolution.
  Annotator.prototype.finer = function (options) {
    // this.segmentation.finer();
    // this._updateSuperpixels(options);
    return this;
  };

  // Adjust the superpixel resolution.
  Annotator.prototype.coarser = function (options) {
    // this.segmentation.coarser();
    // this._updateSuperpixels(options);
    return this;
  };

  // reset the edit.
  Annotator.prototype.reset = function () {
    this._initializeAnnotationLayer();
    this._initializeVisualizationLayer();
    this.mapPixelToRegion = new Int32Array(this.width * this.height);
    _fillArray(this.mapPixelToRegion, -1);
    this.regions = [];
    this.boundaries = [];
    this.lastHighlightColor = [255, 255, 255, 255];
    this.lastHighlightIndex = undefined;
    this.layers.boundary.setGrayAlpha();
    this.layers.boundary.render();
    if (typeof this.onchange === "function")
      this.onchange.call(this);
    return ;
  };

  // Undo the edit.
  Annotator.prototype.undo = function () {
    if (this.currentHistoryRecord < 0)
      return false;
    var record = this.history[this.currentHistoryRecord--];
    this._fillPixels(record.pixels, record.prev);
    this.layers.visualization.render();
    if (typeof this.onchange === "function")
      this.onchange.call(this);
    return this.currentHistoryRecord < 0;
  };

  // Redo the edit.
  Annotator.prototype.redo = function () {
    if (this.currentHistoryRecord >= this.history.length - 1)
      return false;
    var record = this.history[++this.currentHistoryRecord];
    this._fillPixels(record.pixels, record.next);
    this.layers.visualization.render();
    if (typeof this.onchange === "function")
      this.onchange.call(this);
    return this.currentHistoryRecord >= this.history.length;
  };

  // Get unique labels in the current annotation.
  Annotator.prototype.getUniqueLabels = function () {
    var uniqueIndex = [],
        data = this.layers.annotation.imageData.data;
    for (var i = 0; i < data.length; i += 4) {
      var label = _getEncodedLabel(data, i);
      if (uniqueIndex.indexOf(label) < 0) {
        uniqueIndex.push(label);
      }
    }
    return uniqueIndex.sort(function (a, b) { return a - b; });
  };

  // Fill all the pixels assigned the target label or all.
  Annotator.prototype.fill = function (targetLabel) {
    var pixels = [],
        annotationData = this.layers.annotation.imageData.data;
    for (var i = 0; i < annotationData.length; i += 4) {
      var label = _getEncodedLabel(annotationData, i);
      if (label === targetLabel || targetLabel === undefined)
        pixels.push(i);
    }
    if (pixels.length > 0)
      this._updateAnnotation(pixels, this.currentLabel);
    return this;
  };

  Annotator.prototype.setAlpha = function (alpha) {
    this.visualizationAlpha = Math.max(Math.min(alpha, 255), 0) ;
    this.layers.visualization.setAlpha(this.visualizationAlpha).render();
    return this;
  };

  Annotator.prototype.defaultAlpha = function (scale) {
    this.visualizationAlpha = ALPHA_INIT;
    return this.setAlpha(this.visualizationAlpha);
  };

  Annotator.prototype.lessAlpha = function (scale) {
    return this.setAlpha(this.visualizationAlpha - (scale || 1) * 20);
  };

  Annotator.prototype.moreAlpha = function (scale) {
    return this.setAlpha(this.visualizationAlpha + (scale || 1) * 20);
  };

  // Import an existing annotation.
  Annotator.prototype.import = function (annotationURL, options) {
    options = options || {};
    var annotator = this;
    this.layers.annotation.load(annotationURL, {
      onload: function () {
        if (options.grayscale)
          this.gray2index();
        annotator.layers
                 .visualization
                 .copy(this)
                 .applyColormap(annotator.colormap)
                 .setAlpha(annotator.visualizationAlpha)
                 .render();
        this.setAlpha(0).render();
        this.history = [];
        this.currentHistoryRecord = -1;
        if (typeof options.onload === "function")
          options.onload.call(annotator);
        if (typeof annotator.onchange === "function")
          annotator.onchange.call(annotator);
      },
      onerror: options.onerror
    });
    return this;
  };

  // Export the annotation in data URL.
  Annotator.prototype.export = function () {
    this.layers.annotation.setAlpha(255);
    this.layers.annotation.render();
    var data = this.layers.annotation.canvas.toDataURL();
    this.layers.annotation.setAlpha(0);
    this.layers.annotation.render();
    return data;
  };

  // Export the annotation as Image in data URL.
  Annotator.prototype.exportAsImage = function () {
    this.layers.annotation.setAlpha(255);
    this.layers.annotation.render();
    domtoimage.toPng(document.getElementById('visual-container')).then(function(dataUrl) {
        var link = document.createElement('a');
        link.download = 'painting.png';
        link.href = dataUrl;
        link.click();
    });
    this.layers.annotation.setAlpha(0);
    this.layers.annotation.render();
    return ;
  };
  // Show a specified layer.
  Annotator.prototype.show = function (layer) {
    this.layers[layer].canvas.style.display = "inline-block";
    return this;
  };

  // Hide a specified layer.
  Annotator.prototype.hide = function (layer) {
    this.layers[layer].canvas.style.display = "none";
    return this;
  };

  // Highlight a specified label.
  Annotator.prototype.highlightLabel = function (label) {
    // var pixels = [],
    //     annotationData = this.layers.annotation.imageData.data;
    // for (var i = 0; i < annotationData.length; i += 4) {
    //   var currentLabel = _getEncodedLabel(annotationData, i);
    //   if (currentLabel === label)
    //     pixels.push(i);
    // }
    // this._updateHighlight(pixels);
    return this;
  };

  // Disable highlight.
  Annotator.prototype.unhighlightLabel = function () {
    // this._updateHighlight(null);
    return this;
  };

  // Zoom to specific resolution.
  Annotator.prototype.zoom = function (scale) {
    this.currentZoom = Math.max(Math.min(scale || 1.0, 10.0), 1.0);
    this.innerContainer.style.zoom = this.currentZoom;
    this.innerContainer.style.MozTransform =
        "scale(" + this.currentZoom + ")";
    return this;
  };

  // Zoom in.
  Annotator.prototype.zoomIn = function (scale) {
    return this.zoom(this.currentZoom + (scale || 0.25));
  };

  // Zoom out.
  Annotator.prototype.zoomOut = function (scale) {
    return this.zoom(this.currentZoom - (scale || 0.25));
  };

  // // Align the current annotation to the boundary of superpixels.
  // Annotator.prototype.alignBoundary = function () {
  //   var annotationData = this.layers.annotation.imageData.data;
  //   for (var i = 0; i < this.pixelIndex.length; ++i) {
  //     var pixels = this.pixelIndex[i],
  //         label = _findMostFrequent(annotationData, pixels);
  //     this._fillPixels(pixels, label);
  //   }
  //   this.layers.visualization.render();
  //   this.history = [];
  //   this.currentHistoryRecord = 0;
  // };

  Annotator.prototype.denoise = function () {
    var indexImage = morph.decodeIndexImage(this.layers.annotation.imageData),
        result = morph.maxFilter(indexImage);
    var pixels = new Int32Array(result.data.length);
    for (var i = 0; i < pixels.length; ++i)
      pixels[i] = 4 * i;
    this._updateAnnotation(pixels, result.data);
    return this;
  };

  // Private methods.

  Annotator.prototype._createLayers = function (options) {
    var onload = options.onload;
    delete options.onload;
    this.container = document.createElement("div");
    this.container.classList.add("segment-annotator-outer-container");
    this.innerContainer = document.createElement("div");
    this.innerContainer.classList.add("segment-annotator-inner-container");
    this.innerContainer.setAttribute('id', 'visual-container');
    this.layers = {
      image: new Layer(options),
      pattern: new Layer(options),
      boundary: new Layer(options),
      superpixel: new Layer(options),
      visualization: new Layer(options),
      annotation: new Layer(options)
    };
    options.onload = onload;
    for (var key in this.layers) {
      var canvas = this.layers[key].canvas;
      canvas.classList.add("segment-annotator-layer");
      this.innerContainer.appendChild(canvas);
    }
    this.container.appendChild(this.innerContainer);
    this._resizeLayers(options);
  };

  Annotator.prototype._resizeLayers = function (options) {
    this.width = options.width || this.layers.image.canvas.width;
    this.height = options.height || this.layers.image.canvas.height;
    for (var key in this.layers) {
      if (key !== "image") {
        var canvas = this.layers[key].canvas;
        canvas.width = this.width;
        canvas.height = this.height;
      }
    }
    this.innerContainer.style.width = this.width + "px";
    this.innerContainer.style.height = this.height + "px";
    this.container.style.width = this.width + "px";
    this.container.style.height = this.height + "px";
  };

  Annotator.prototype._initializeHistory = function (options) {
    this.history = [];
    this.currentHistoryRecord = -1;
  };

  Annotator.prototype._initialize = function (options) {
    options = options || {};
    if (!options.width)
      this._resizeLayers(options);
    this._initializeAnnotationLayer();
    this._initializeVisualizationLayer();
    this._initializeEvents();
    this.resetSuperpixels(options.superpixelOptions);
    this.detection = new Detection(this.layers.image.imageData);
    this.layers.boundary.copy(this.layers.image);
    this.layers.boundary.convertGrayImage();
    this.layers.boundary.setGrayAlpha();
    this.mapPixelToRegion = new Int32Array(this.width * this.height);
    _fillArray(this.mapPixelToRegion, -1);
    if (typeof options.onload === "function")
      options.onload.call(this);
    if (typeof this.onchange === "function")
      this.onchange.call(this);
  };

  Annotator.prototype._initializeEvents = function () {
    var canvas = this.layers.annotation.canvas,
        mousestate = { down: false, button: 0 },
        annotator = this;
    canvas.oncontextmenu = function() { return false; };
    function updateIfActive(event) {
      var offset = annotator._getClickOffset(event),
          // superpixelData = annotator.layers.superpixel.imageData.data,
          annotationData = annotator.layers.annotation.imageData.data,
          // superpixelIndex = _getEncodedLabel(superpixelData, offset),
          existingLabel = _getEncodedLabel(annotationData, offset)
          // pixels = annotator.pixelIndex[existingLabel]
          ;
      if (annotator.mode === "detection" || annotator.mode === 'polygon')
        annotator._updateHighlight(annotator._getClickOffset(event));
        ;
      if (typeof annotator.onmousemove === "function")
        annotator.onmousemove.call(annotator, existingLabel);
      if (mousestate.down) {
        if (mousestate.button == 2 &&
            typeof annotator.onrightclick === "function") {
          if (annotator.mode === "polygon")
            annotator._emptyPolygonPoints(); //reset
          else
            annotator.onrightclick.call(annotator, existingLabel);
        } else {
          if (annotator.mode === "brush" && event.button === 0) {
            annotator.brush(annotator._getClickPos(event),
                            annotator.currentLabel);
          }
          if (event.button === 0 && annotator.mode === "polygon") {
            var isPainted = false;
            if (!annotator.polygonPoints.length) isPainted = annotator._paintByRegion(annotator._getClickPos(event));
            if (!isPainted) {
              annotator._addPolygonPoint(event);
              if (annotator._checkLineIntersection())
                annotator._addPolygonToAnnotation();
            }
          } else if (annotator.mode === "superpixel") {
            // annotator._updateAnnotation(pixels, annotator.currentLabel)
            ;
          } else if (annotator.mode === "detection") {
            $(".notification-pane").show();
            setTimeout(function(){
              annotator._updateAnnotationByDetection(
                annotator._getClickPos(event),
                annotator.currentLabel);
              $(".notification-pane").hide();
            }, 0);
          }
          annotator._updateBoundaryLayer();
          if (typeof annotator.onleftclick === "function")
            annotator.onleftclick.call(annotator, annotator.currentLabel);
        }
      }
    }
    canvas.addEventListener('mousemove', updateIfActive);
    canvas.addEventListener('mouseup', updateIfActive);
    canvas.addEventListener('mouseleave', function () {
      annotator._updateHighlight(null);
      if (typeof annotator.onmousemove === "function") {
        annotator.onmousemove.call(annotator, null);
      }
    });
    canvas.addEventListener('mousedown', function (event) {
      mousestate.down = true;
      mousestate.button = event.button;
    });
    window.addEventListener('mouseup', function () {
      mousestate.down = false;
    });
    //polygon on/off with ctrl-key
    window.onkeyup = function(e) {
      var key = e.keyCode ? e.keyCode : e.which;
      if (key == 17) {
        if (annotator.mode=="polygon") {
          annotator.mode = "superpixel";
        } else {
          annotator.mode = "polygon";
          annotator._updateHighlight(null);
        }
        annotator._emptyPolygonPoints();
      }
    };
  };

  Annotator.prototype._updateAnnotationByDetection = function (pos, label) {
    var offsets = [], labels = [], region, isExist = false;

    if (this.regions.length) {
      for (var i = 0; i < this.regions.length; i++) {
        region = this.regions[i];
        isExist = false;
        for (var j= 0; j < region.length; j++) {
          if (region[j] == pos[1] * this.width + pos[0]) {
            isExist = true;
            break;
          }
        }
        if(isExist) {
          break;
        }
      }
    }

    if (!isExist) {
      region = this.detection.getPoints(pos, 14);
      var newRegion = [],
        cntRegion = this.regions.length
        ;
      for ( var i = 0; i < region.length; i++) {
        if (this.mapPixelToRegion[region[i]] == -1) {
          newRegion.push(region[i]);
          this.mapPixelToRegion[region[i]] = cntRegion;
        }
      }

      var isBoundary, neighbors = [], boundary = [];
      for ( var i = 0; i < newRegion.length; i++) {
        isBoundary = false;
        neighbors = this.detection.getNeighbors(newRegion[i]);
        for ( var j = 0 ; j < neighbors.length; j++) {
          if(this.mapPixelToRegion[neighbors[j]] != cntRegion) {
            isBoundary = true;
            break;
          }
        }
        if (isBoundary) {
          boundary.push(newRegion[i]);
        }
      }

      this.boundaries.push(boundary);
      this.regions.push(newRegion);
      region = newRegion;
    }

    for ( var i = 0; i < region.length; i++) {
      offsets.push(4 * region[i]);
      labels.push(label);
    }

    this.lastHighlightColor = this.colormap[label].concat(this.visualizationAlpha);

    this._updateAnnotation(offsets, labels, this.currentPattern);
    this.layers.visualization.render();
    if (typeof this.onchange === "function")
      this.onchange.call(this);
  }

  Annotator.prototype._updateBoundaryLayer = function () {
    var boundaryLayer = this.layers.boundary;
    boundaryLayer.render();
  };

  Annotator.prototype._initializeAnnotationLayer = function () {
    var layer = this.layers.annotation;
    layer.resize(this.width, this.height);
    this.currentLabel = this.defaultLabel;
    this.currentPattern = this.defaultPattern;
    layer.fill([this.defaultLabel, 0, 0, 0]);
    layer.render();
  };

  Annotator.prototype._initializeVisualizationLayer = function () {
    var layer = this.layers.visualization;
    layer.resize(this.width, this.height);
    var initialColor = this.colormap[this.defaultLabel]
                           .concat([/*this.visualizationAlpha*/0]);
    layer.fill(initialColor);
    layer.render();
  };

  Annotator.prototype._updateSuperpixels = function () {
    var annotator = this;
    // this.layers.superpixel.process(function (imageData) {
      // imageData.data.set(annotator.segmentation.result.data);
      // annotator._createPixelIndex(annotator.segmentation.result.numSegments);
      // annotator._updateBoundaryLayer();
      // this.setAlpha(0).render();
    // });
  };

  Annotator.prototype._createPixelIndex = function (numSegments) {
    // var pixelIndex = new Array(numSegments),
    //     data = this.layers.superpixel.imageData.data,
    //     i;
    // for (i = 0; i < numSegments; ++i)
    //   pixelIndex[i] = [];
    // for (i = 0; i < data.length; i += 4) {
    //   var index = data[i] | (data[i + 1] << 8) | (data[i + 2] << 16);
    //   pixelIndex[index].push(i);
    // }
    // this.currentPixels = null;
    // this.pixelIndex = pixelIndex;
  };

  Annotator.prototype._getClickOffset = function (event) {
    var pos = this._getClickPos(event),
        x = pos[0],
        y = pos[1];
    return 4 * (y * this.layers.visualization.canvas.width + x);
  };

  Annotator.prototype._getClickPos = function (event) {
    var container = this.container,
        containerRect = container.getBoundingClientRect(),
        offsetLeft = containerRect.left + (
            window.pageXOffset || document.documentElement.scrollLeft
            ) - (document.documentElement.clientLeft || 0),
        offsetTop = containerRect.top + (
            window.pageYOffset || document.documentElement.scrollTop
            ) - (document.documentElement.clientTop || 0),
        x = Math.round(
          (event.pageX - offsetLeft + container.scrollLeft) *
          (container.offsetWidth / container.scrollWidth)
          ),
        y = Math.round(
          (event.pageY - offsetTop + container.scrollTop) *
          (container.offsetHeight / container.scrollHeight)
          ),
    x = Math.max(Math.min(x, this.layers.visualization.canvas.width - 1), 0);
    y = Math.max(Math.min(y, this.layers.visualization.canvas.height - 1), 0);
    return [x, y];
  };

  // polygon tool.
  Annotator.prototype._addPolygonPoint = function (event) {
    var annotator = this,
        pos = this._getClickPos(event),
        x = pos[0],
        y = pos[1];
    //get canvas.
    var canvas = annotator.layers.annotation.canvas,
        ctx = canvas.getContext('2d');
    if (this.polygonPoints.length === 0) {
        ctx.save();  // remember previous state.
        annotator.prevAnnotationImg =
          ctx.getImageData(0, 0, canvas.width, canvas.height);
    }
    // draw.
    ctx.fillStyle = '#FA6900';
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 1;
    if (this.polygonPoints.length === 0) {
      ctx.beginPath();
      ctx.moveTo( x, y);
    } else {
      ctx.lineTo( x, y);
      ctx.stroke();
    }
    this.polygonPoints.push(pos);
  };

  Annotator.prototype._emptyPolygonPoints = function () {
    var annotator = this,
        ctx = annotator.layers.annotation.canvas.getContext('2d');
    ctx.restore();
    if (annotator.prevAnnotationImg)
      ctx.putImageData(annotator.prevAnnotationImg,0,0);
    //reset polygon-points
    annotator.polygonPoints = [];
  };

  Annotator.prototype._paintByRegion = function (pos) {
    var annotator = this, offsets = [],
      region, isExist = false;

    if (this.regions.length) {
      for (var i = 0; i < this.regions.length; i++) {
        region = this.regions[i];
        for (var j= 0; j < region.length; j++) {
          if (region[j] == pos[1] * this.width + pos[0]) {
            isExist = true;
            break;
          }
        }
        if(isExist) {
          break;
        }
      }
    }
    if (!isExist) return false;

    for ( var i = 0; i < region.length; i++) {
        offsets.push(4 * region[i]);
    }
    this.lastHighlightColor = this.colormap[annotator.currentLabel].concat(this.visualizationAlpha);
    // console.log(this.lastHighlightColor);
    annotator._updateAnnotation(offsets, annotator.currentLabel, annotator.currentPattern);
    return true;
  };

  Annotator.prototype._addPolygonToAnnotation = function () {
    var annotator = this,
        canvas = document.createElement('canvas'),
        x, y;
    // set canvas dimensions.
    canvas.width = annotator.layers.annotation.canvas.width;
    canvas.height = annotator.layers.annotation.canvas.height;
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = "rgba(0, 0, 255, 255)";
    ctx.beginPath();
    ctx.moveTo(annotator.polygonPoints[0][0],annotator.polygonPoints[0][1]);
    for (i = 1; i < annotator.polygonPoints.length; ++i) {
      x = annotator.polygonPoints[i][0];
      y = annotator.polygonPoints[i][1];
      ctx.lineTo(x, y);
    }
    ctx.lineTo(annotator.polygonPoints[0][0], annotator.polygonPoints[0][1]);
    ctx.closePath();
    ctx.fill();
    //get pixels within polygon.
    var colorToCheck = [0, 0, 255, 255],
        imageData = ctx.getImageData(0, 0, canvas.width, canvas.height),
        data = imageData.data, cntRegion = this.regions.length, index,
        region = [],
        pixelsPolygon = [];
    for (x = 0; x < canvas.width; ++x) {
      for (y = 0; y < canvas.height; ++y) {
        index = (x + y * imageData.width) * 4;
        if (data[index + 0] == colorToCheck[0] &&
            data[index + 1] == colorToCheck[1] &&
            data[index + 2] == colorToCheck[2] &&
            data[index + 3] == colorToCheck[3]) {
          if(this.mapPixelToRegion[index / 4] == -1) {
            pixelsPolygon.push(index);
            region.push(index / 4);
            this.mapPixelToRegion[index / 4] = cntRegion;
          }
        }
      }
    }

    var isBoundary, neighbors = [], boundary = [];
    for ( var i = 0; i < region.length; i++) {
      isBoundary = false;
      neighbors = this.detection.getNeighbors(region[i]);
      for ( var j = 0 ; j < neighbors.length; j++) {
        if(this.mapPixelToRegion[neighbors[j]] != cntRegion) {
          isBoundary = true;
          break;
        }
      }
      if (isBoundary) {
        boundary.push(region[i]);
      }
    }

    this.lastHighlightColor = this.colormap[annotator.currentLabel].concat(this.visualizationAlpha);
    // console.log(this.lastHighlightColor);
    this.boundaries.push(boundary);
    this.regions.push(region);
    // update annotation.
    annotator._updateAnnotation(pixelsPolygon, annotator.currentLabel, annotator.currentPattern);
    annotator._emptyPolygonPoints();
  };

  Annotator.prototype._checkLineIntersection = function () {
    if (this.polygonPoints.length < 4)
      return false;
    var newLineStartX = this.polygonPoints[this.polygonPoints.length - 2][0],
        newLineStartY = this.polygonPoints[this.polygonPoints.length - 2][1],
        newLineEndX = this.polygonPoints[this.polygonPoints.length - 1][0],
        newLineEndY = this.polygonPoints[this.polygonPoints.length - 1][1];

    for (i = 1; i < this.polygonPoints.length - 2; ++i) {
      var line1StartX = this.polygonPoints[i - 1][0],
          line1StartY = this.polygonPoints[i - 1][1],
          line1EndX = this.polygonPoints[i][0],
          line1EndY = this.polygonPoints[i][1],
          denominator =
            ((newLineEndY - newLineStartY) * (line1EndX - line1StartX)) -
            ((newLineEndX - newLineStartX) * (line1EndY - line1StartY)),
          a = line1StartY - newLineStartY,
          b = line1StartX - newLineStartX,
          numerator1 = ((newLineEndX - newLineStartX) * a) -
                       ((newLineEndY - newLineStartY) * b),
          numerator2 = ((line1EndX - line1StartX) * a) -
                       ((line1EndY - line1StartY) * b);
      a = numerator1 / denominator;
      b = numerator2 / denominator;
      if (a > 0 && a < 1 && b > 0 && b < 1)
        return true;
    }
    return false;
  };

  Annotator.prototype._setMode = function (mode) {
    this.mode = mode;
  };

  Annotator.prototype._updateHighlight = function (dataOffset) {
    var offset, boundary,
        visualizationData = this.layers.visualization.imageData.data;

    if(this.lastHighlightIndex != undefined && this.lastHighlightIndex != -1) {
      //Clear Highlight boundary
      boundary = this.boundaries[this.lastHighlightIndex];

      for (var i = 0; i < boundary.length; ++i) {
        offset = boundary[i];
        visualizationData[4 * offset] = this.lastHighlightColor[0];
        visualizationData[4 * offset + 1] = this.lastHighlightColor[1];
        visualizationData[4 * offset + 2] = this.lastHighlightColor[2];
        visualizationData[4 * offset + 3] = this.lastHighlightColor[3];
      }
      
      this.layers.visualization.render();
    }

    if (dataOffset == null) {
      this.lastHighlightIndex = undefined;
      return;
    }
    
    var idx = this.mapPixelToRegion[dataOffset / 4];
    if (idx == -1) {
      this.lastHighlightIndex = idx;
      return;
    }

    //Highlight boundary
    boundary = this.boundaries[idx];

    if(this.lastHighlightIndex != idx) { 
      this.lastHighlightColor = [visualizationData[4 * boundary[0]],
        visualizationData[4 * boundary[0] + 1],
        visualizationData[4 * boundary[0] + 2],
        visualizationData[4 * boundary[0] + 3]];
      this.lastHighlightIndex = idx;
    }

    for (var i = 0; i < boundary.length; ++i) {
      offset = boundary[i];
      visualizationData[4 * offset] = 255;
      visualizationData[4 * offset + 1] = 255;
      visualizationData[4 * offset + 2] = 255;
      visualizationData[4 * offset + 3] = 255;
    }

    this.layers.visualization.render();
    if (typeof this.onhighlight === "function")
      this.onhighlight.call(this);
  };

  Annotator.prototype._fillPixels = function (pixels, labels, curPattern = null) {
    if (pixels.length !== labels.length)
      throw "Invalid fill: " + pixels.length + " !== " + labels.length;
    var annotationData = this.layers.annotation.imageData.data,
        w = this.layers.annotation.imageData.width, h = this.layers.annotation.imageData.height,
        patternData = this.layers.pattern.imageData.data,
        pW = this.layers.pattern.imageData.width, pH = this.layers.pattern.imageData.height,
        originOffset = pixels[0],
        visualizationData = this.layers.visualization.imageData.data;
    for (var i = 0; i < pixels.length; ++i) {
      var offset = pixels[i],
          label = labels[i],
          color = this.colormap[label];
      _setEncodedLabel(annotationData, offset, label);
      visualizationData[offset + 0] = color[0];
      visualizationData[offset + 1] = color[1];
      visualizationData[offset + 2] = color[2];
      if (curPattern != null) {
        var pos = offset / 4, posO = originOffset / 4, x, y, ox, oy, dx, dy, patOff;
        ox = posO % w;
        oy = Math.ceil(posO / w);
        x = pos % w;
        y = Math.ceil(pos / w);
        dx = x - ox;
        dy = y - oy;
        dx = dx % pW;
        dy = dy % pH;
        if (dx < 0) dx += pW;
        if (dy < 0) dy += pH;
        patOff = 4 * (dy * pW + dx);
        visualizationData[offset + 0] = patternData[patOff];
        visualizationData[offset + 1] = patternData[patOff + 1];
        visualizationData[offset + 2] = patternData[patOff + 2];
        if (patternData[patOff] == 255 && patternData[patOff + 1] == 255 && patternData[patOff + 2] == 255) patternData[patOff + 2] = 254;
      }
      if(color[0] == 255 && color[1] == 255 && color[2] == 255)  {
        visualizationData[offset + 3] = 0;
        this.layers.boundary.setGrayAlpha(offset, false);
      }
      else {
        visualizationData[offset + 3] = this.visualizationAlpha;
        this.layers.boundary.setGrayAlpha(offset, true);
      }
    }
    this.layers.boundary.render();
  };

  // Update label.
  Annotator.prototype._updateAnnotation = function (pixels, labels, curPattern = null) {
    var updates;
    labels = (typeof labels === "object") ?
        labels : _fillArray(new Int32Array(pixels.length), labels);
    updates = this._getDifferentialUpdates(pixels, labels);
    if (updates.pixels.length === 0)
      return this;
    this._updateHistory(updates);
    this._fillPixels(updates.pixels, updates.next, curPattern);
    this.layers.visualization.render();
    if (typeof this.onchange === "function")
      this.onchange.call(this);
    return this;
  };

  // Get the differential update of labels.
  Annotator.prototype._getDifferentialUpdates = function (pixels, labels) {
    if (pixels.length !== labels.length)
      throw "Invalid labels";
    var annotationData = this.layers.annotation.imageData.data,
        updates = { pixels: [], prev: [], next: [] };
    for (var i = 0; i < pixels.length; ++i) {
      var label = _getEncodedLabel(annotationData, pixels[i]);
      if (label !== labels[i]) {
        updates.pixels.push(pixels[i]);
        updates.prev.push(label);
        updates.next.push(labels[i]);
      }
    }
    return updates;
  };

  Annotator.prototype._updateHistory = function (updates) {
    this.history = this.history.slice(0, this.currentHistoryRecord + 1);
    this.history.push(updates);
    if (this.history.length > this.maxHistoryRecord)
      this.history = this.history.slice(1, this.history.length);
    else
      ++this.currentHistoryRecord;
  };

  function _fillArray(array, value) {
    for (var i = 0; i < array.length; ++i)
      array[i] = value;
    return array;
  }

  // function _findMostFrequent(annotationData, pixels) {
  //   var histogram = {},
  //       j;
  //   for (j = 0; j < pixels.length; ++j) {
  //     var label = _getEncodedLabel(annotationData, pixels[j]);
  //     histogram[label] = (histogram[label]) ? histogram[label] + 1 : 1;
  //   }
  //   var maxFrequency = 0,
  //       majorLabel = 0;
  //   for (j in histogram) {
  //     var frequency = histogram[j];
  //     if (frequency > maxFrequency) {
  //       maxFrequency = frequency;
  //       majorLabel = j;
  //     }
  //   }
  //   return majorLabel;
  // }

  function _getEncodedLabel(array, offset) {
    return array[offset] |
           (array[offset + 1] << 8) |
           (array[offset + 2] << 16);
  }

  function _setEncodedLabel(array, offset, label) {
    array[offset + 0] = label & 255;
    array[offset + 1] = (label >>> 8) & 255;
    array[offset + 2] = (label >>> 16) & 255;
    array[offset + 3] = 255;
  }

  return Annotator;
});
