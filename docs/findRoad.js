const fs = require("fs");
const data = fs.readFileSync("giao_diem.json", "utf8");
const dinhs = JSON.parse(data);
function calculateEuclidDistance(x1, y1, x2, y2) {
  var delx = x1 - x2;
  var dely = y1 - y2;
  return Math.sqrt(delx * delx + dely * dely);
}
function calculateF(prePoint, curPoint, endPoint, c) {
  var f =
    prePoint.f -
    calculateEuclidDistance(
      prePoint.toaDo[0],
      prePoint.toaDo[1],
      endPoint.toaDo[0],
      endPoint.toaDo[1]
    ) +
    c +
    calculateEuclidDistance(
      curPoint.toaDo[0],
      curPoint.toaDo[1],
      endPoint.toaDo[0],
      endPoint.toaDo[1]
    );
  return f;
}
function getNextPoint(waitList, prePoint, endPoint) {
  var minIndex = 0;
  var fmin = 1000000;
  for (var i = 0; i < waitList.length; i++) {
    if (dinhs[waitList[i].tenDinh - 1].pre === prePoint) {
      var f = calculateF(
        prePoint,
        dinhs[waitList[i].tenDinh - 1],
        endPoint,
        waitList[i].doDai
      );
      if (fmin > f) {
        fmin = f;
        minIndex = i;
      }
    }
  }
  var tmp = waitList[minIndex];
  waitList[minIndex] = waitList[0];
  waitList[0] = tmp;
  var nextPoint = dinhs[waitList.shift().tenDinh - 1];
  nextPoint.f = fmin;
  return nextPoint;
}

function findRoadByA(startPointName, endPointName) {
  var startPoint = dinhs[startPointName - 1];
  var endPoint = dinhs[endPointName - 1];
  var prePoint = startPoint;
  prePoint.f = calculateEuclidDistance(
    prePoint.toaDo[0],
    prePoint.toaDo[1],
    endPoint.toaDo[0],
    endPoint.toaDo[1]
  );
  var waitList = [];
  startPoint.pre = startPoint;
  for (var i = 0; i < startPoint.listDinhKe.length; i++) {
    var linkedPoint = dinhs[startPoint.listDinhKe[i].tenDinh - 1];
    linkedPoint.pre = startPoint;
    waitList.push(startPoint.listDinhKe[i]);
  }

  while (endPoint.pre === undefined && waitList.length != 0) {
    var curPoint = getNextPoint(waitList, prePoint, endPoint);
    for (var i = 0; i < curPoint.listDinhKe.length; i++) {
      var linkedPoint = dinhs[curPoint.listDinhKe[i].tenDinh - 1];
      if (waitList.includes(linkedPoint)) {
        linkedPoint.pre = curPoint;
      } else if (linkedPoint.pre === undefined) {
        linkedPoint.pre = curPoint;
        waitList.push(curPoint.listDinhKe[i]);
      }
    }
    prePoint = curPoint;
  }

  if (endPoint.pre === undefined) {
    return {
      totalDistance: -1,
      listPointID: [],
    };
  }

  var listPointId = [endPoint.tenDinh];
  var point = endPoint;
  while (point.pre != point) {
    point = point.pre;
    listPointId.unshift(point.tenDinh);
  }
  return {
    totalDistance: endPoint.pre.f,
    listPointID: listPointId,
  };
}

var result = findRoadByA(1, 49);

console.log(result);
