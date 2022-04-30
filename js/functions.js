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
        showResults(index);
   }
}

function cropImage(src, rect, index)
{
   cv.cvtColor(src, src, cv.COLOR_RGBA2GRAY, 0);
 //  cv.threshold(src, src, 110, 200, cv.THRESH_BINARY);
    let dst = new cv.Mat();
    dst = src.roi(rect);
    let dsize = new cv.Size(200, 50);
    // You can try more different parameters
    cv.resize(dst, dst, dsize, 0, 0, cv.INTER_AREA);
    cv.medianBlur(dst, dst, 15);
    cv.imshow('strip'+index, dst); // display the output to canvas
    src.delete();
    dst.delete();
}

function findMaxima(arr) {
    let positions = []
    let maximas = []
    for (let i = 1; i < arr.length - 1; i++) {
       if (arr[i] > arr[i - 1]) {
          if (arr[i] > arr[i + 1]) {
             positions.push(i)
             maximas.push(arr[i])
          } else if (arr[i] === arr[i + 1]) {
             let temp = i
             while (arr[i] === arr[temp]) i++
             if (arr[temp] > arr[i]) {
                positions.push(temp)
                maximas.push(arr[temp])
             }
          }
       }
    }
    return { maximas, positions };
 };

function showResults(index){
    var cell = document.getElementById("results"+index);
    testLineHeight = 1;
    controlLineHeight = 1;
   var peaks = findMaxima(points[index]);
   console.log(index, peaks);
    cell.innerHTML="RESULTS FOR STRIP "+index+":<br>" +
    "Control Line Height: "+ controlLineHeight + "<br>" +
    "Test Line Height: "+ testLineHeight + "<br>" +
    "FAT CAT Ratio: "+ testLineHeight/controlLineHeight + "<br>" 

}

function getRectangle(src, index){
         let dst = cv.Mat.zeros(src.rows, src.cols, cv.CV_8UC3);
         cv.cvtColor(src, src, cv.COLOR_RGBA2GRAY, 0);
         cv.threshold(src, src, 110, 200, cv.THRESH_BINARY);
         let contours = new cv.MatVector();
         let hierarchy = new cv.Mat();
         cv.findContours(src, contours, hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);
         let cnt = contours.get(0);
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
          if(rect.width==1){
              rect.x = rectX;
            rect.width = rectWidth;
          }
          if(rect.height ==1){
            rect.height = rectHeight;
            rect.Y = rectY;  
        }
        rect.x = 20;
        rect.y = 20;
          return rect;

}

function runFATCAT(src, index){
    let dst = cv.Mat.zeros(src.rows, src.cols, cv.CV_8UC3);
    points.push(index);
    points[index] = [];
     cv.cvtColor(src, src, cv.COLOR_RGBA2GRAY, 0);
    //cv.equalizeHist(src, dst);
    //  cv.threshold(src, src, 110, 200, cv.THRESH_BINARY);
    for(var x = 0; x < src.cols; x+=2)
 {
     var val = 0
   for (let y = 0; y < src.rows; y++) {
    val+=src.ucharPtr(y,x)[0];       
   }
    val = Math.floor(val/src.rows);
    let point1 = new cv.Point(x,src.rows-(val/4));
    let point2 = new cv.Point(x+1,src.rows);
    let color = new cv.Scalar(255,255,255);
    cv.rectangle(dst, point1, point2, color, cv.FILLED);
     points[index].push(x);
    points[index][x] = [];
    points[index][x].push(point1);
   
 }
  cv.imshow('algo'+index, dst); 
    
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
    cell5.innerHTML = '<div id=results'+ index + ' height ="50" width ="200" ></div>';
    }

}

