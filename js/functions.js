const NUM_TESTS = 18;
function runTest(){
    var table = document.getElementById("testTable");
    for (let index = 1; index < NUM_TESTS; index++) {
        var image = document.getElementById('image'+ index);
        var src = cv.imread(image); // load the image from <img>
        let dst = cv.Mat.zeros(src.rows, src.cols, cv.CV_8UC3);
        cv.cvtColor(src, src, cv.COLOR_RGBA2GRAY, 0);
        cv.threshold(src, src, 100, 200, cv.THRESH_BINARY);
        let contours = new cv.MatVector();
        let hierarchy = new cv.Mat();
        let poly = new cv.MatVector();
        cv.findContours(src, contours, hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);
        // approximates each contour to polygon
        for (let i = 0; i < contours.size(); ++i) {
            let tmp = new cv.Mat();
            let cnt = contours.get(i);
            // You can try more different parameters
            cv.approxPolyDP(cnt, tmp, 3, true);
            poly.push_back(tmp);
            cnt.delete(); tmp.delete();
        }
        //console.log(poly);
        // draw contours with random Scalar
        for (let i = 0; i < contours.size(); ++i) {
            let color = new cv.Scalar(255,255,255);
            cv.drawContours(dst, poly, i, color, 1, 8, hierarchy, 0);
        }
        cv.imshow('strip'+index, dst); // display the output to canvas
       src.delete(); dst.delete(); hierarchy.delete(); contours.delete(); poly.delete();
        
         
    //     src.delete(); // remember to free the memory
    //     dst.delete();
    }
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
    cell3.innerHTML = '<canvas id=strip'+ index + '></canvas>';
    cell4.innerHTML = '<canvas id=algo'+ index + '></canvas>';
    cell5.innerHTML = '<canvas id=results'+ index + '></canvas>';
    }

}

