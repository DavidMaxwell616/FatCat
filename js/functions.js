const NUM_TESTS = 18;
var all_Point_XY = []
function runTest(){
    var table = document.getElementById("testTable");
    for (let index = 1; index <NUM_TESTS; index++) {
        var image = document.getElementById('image'+ index);
        var src = cv.imread(image);
        var rect = getRectangle(src, index);
        src = cv.imread(image);
        cropImage(src, rect, index);
        image = document.getElementById('strip'+ index);
        src = cv.imread(image);
        runFATCAT(src, index);
   }
}

function cropImage(src, rect, index)
{
    let dst = new cv.Mat();
    // You can try more different parameters
    dst = src.roi(rect);
    let dsize = new cv.Size(200, 50);
    // You can try more different parameters
    cv.resize(dst, dst, dsize, 0, 0, cv.INTER_AREA);
    cv.imshow('strip'+index, dst); // display the output to canvas
    src.delete();
    dst.delete();
}

function getRectangle(src, index){
         let dst = cv.Mat.zeros(src.rows, src.cols, cv.CV_8UC3);
         cv.cvtColor(src, src, cv.COLOR_RGBA2GRAY, 0);
         cv.threshold(src, src, 110, 200, cv.THRESH_BINARY);
         let contours = new cv.MatVector();
         let hierarchy = new cv.Mat();
         cv.findContours(src, contours, hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);
         let cnt = contours.get(0);
         if(!cnt) 
         {
             console.log('error');
             return new rectangle(100,100,100,100);
         }
         // You can try more different parameters
         let rect = cv.boundingRect(cnt);
         let contoursColor = new cv.Scalar(255, 255, 255);
         let rectangleColor = new cv.Scalar(255, 0, 0);
         cv.drawContours(dst, contours, 0, contoursColor, 1, 8, hierarchy, 100);
         let point1 = new cv.Point(rect.x, rect.y);
         let point2 = new cv.Point(rect.x + rect.width, rect.y + rect.height);
         cv.rectangle(dst, point1, point2, rectangleColor, 2, cv.LINE_AA, 0);
         src.delete(); dst.delete(); contours.delete(); hierarchy.delete(); 
          cnt.delete();
          return rect;

}
function runFATCAT(src, index){
    let dst = cv.Mat.zeros(src.rows, src.cols, cv.CV_8UC3);
    cv.cvtColor(src, src, cv.COLOR_RGBA2GRAY, 0);
    for(var j=0;j<src.cols;j++) 
    {
        var pixelValue = 0;
      for (var i=0;i<src.rows;i++)
      {
        pixelValue += src.ucharPtr(j,i)[0];
    }
    if(index==1)
    console.log(pixelValue);       
       var avg = pixelValue/src.rows;
    let point1 = new cv.Point(j, src.rows - 1);
    let point2 = new cv.Point(j + 1, src.rows - avg);
    let color = new cv.Scalar(255, 255, 255);
    cv.rectangle(dst, point1, point2, color, cv.FILLED);

}
    cv.imshow('algo'+index, dst); // display the output to canvas
}

function createHistogram(src,index){
    cv.cvtColor(src, src, cv.COLOR_RGBA2GRAY, 0);
    let srcVec = new cv.MatVector();
    srcVec.push_back(src);
    let accumulate = false;
    let channels = [0];
    let histSize = [256];
    let ranges = [0, 255];
    let hist = new cv.Mat();
    let mask = new cv.Mat();
    let color = new cv.Scalar(255, 255, 255);
    let scale = 1;
    //You can try more different parameters
    cv.calcHist(srcVec, channels, mask, hist, histSize, ranges, accumulate);
    let result = cv.minMaxLoc(hist, mask);
    let max = result.maxVal;
    let dst = new cv.Mat.zeros(src.rows, histSize[0] * scale, cv.CV_8UC3);
    //draw histogram
    for (let i = 0; i < histSize[0]; i++) {
        let binVal = hist.data32F[i] * src.rows / max;
        let point1 = new cv.Point(i * scale, src.rows - 1);
        let point2 = new cv.Point((i + 1) * scale - 1, src.rows - binVal);
        cv.rectangle(dst, point1, point2, color, cv.FILLED);
    }
   cv.imshow('algo'+index, dst); // display the output to canvas
    src.delete(); dst.delete(); srcVec.delete(); mask.delete(); hist.delete();
}

function loadData(){
    var table = document.getElementById("testTable");
        
    for (let index = 1; index < NUM_TESTS; index++) {
        var row = table.insertRow(index);
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);
        var cell5 = row.insertCell(4);
  
    cell1.innerHTML = '<div id="title2">'+index+'</div>';
    var padIndex = String(index).padStart(2, '0');
    cell2.innerHTML = '<img id=image'+ index + ' height ="50" width ="200" src="assets/images/'+ padIndex + '.bmp">';
    cell3.innerHTML = '<canvas id=strip'+ index + ' height ="50" width ="200" ></canvas>';
    cell4.innerHTML = '<canvas id=algo'+ index + ' height ="50" width ="200" ></canvas>';
    cell5.innerHTML = '<canvas id=results'+ index + ' height ="50" width ="200" ></canvas>';
    }

}

