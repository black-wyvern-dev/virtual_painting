/* Main page dispatcher.
*/

//<--CUSTOMIZED CODE
/**
 * IMPORTANT:
 *    BACKGROUND IS DEFINED AS [255,255,255]
 *    WHITE COLOR SHOULD BE PRESENT AS [255, 255, 254] ...
 */
var colorMapArray = [
  [255, 255, 255], //background
  [255, 0, 0], //red
  [0, 255, 0], //green
  [0, 0, 255], //blue
  [127, 0, 255], //custom1
  [0, 127, 255], //custom2
  [127, 127, 255], //custom3
  [127, 0, 127], //custom4
  [0, 127, 127], //custom5
];

var colorMapLabel = [
  'background',
  'red',
  'green',
  'blue',
  'custom1',
  'custom2',
  'custom3',
  'custom4',
  'custom5',
]
//-->

requirejs(['app/index',
           'app/edit',
           'helper/colormap',
           'helper/util',
          ],
function(indexPage, editPage, colormap, util) {
  var dataURL = "data/example.json",  // Change this to another dataset.
      params = util.getQueryParams();

  // Create a colormap for display. The following is an example.
  function createColormap(label, labels) {
    return (label) ?
      colormap.create("single", {
        size: labels.length,
        index: labels.indexOf(label)
      }) :
      [[255, 255, 255],
       [226, 196, 196],
       [64, 32, 32]].concat(colormap.create("hsv", {
        size: labels.length - 3
      }));
  }

  // Load dataset before rendering a view.
  function renderPage(renderer) {
    util.requestJSON(dataURL, function(data) {
      // data.colormap = createColormap(params.label, data.labels);

      //<-- CUSTOMIZED CODE standard is become comment.
      data.colormap = colorMapArray;
      data.labels = colorMapLabel;
      //-->
      renderer(data, params);
    });
  }

  switch(params.view) {
    case "index":
      renderPage(indexPage);
      break;
    case "edit":
      renderPage(editPage);
      break;
    default:
      params.view = "index";
      window.location = util.makeQueryParams(params);
      break;
  }
});
