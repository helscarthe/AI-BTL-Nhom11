var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
function drawRoad(listPoints) {
  ctx.clearRect(0, 0, 10000, 100000); // Xóa các đường vẽ cũ trên bản vẽ canvas
  ctx.beginPath();
  ctx.shadowBlur = 10;
  ctx.shadowColor = "red";
  ctx.lineWidth = 5; // Đặt giá trị độ rộng cho đường vẽ.
  ctx.strokeStyle = "red"; // Đặt giá trị màu cho đường vẽ
  ctx.moveTo(listPoints[0].x, listPoints[0].y); // Di chuyển điểm vẽ đến tọa độ vị trí điểm xuất phát
  for (var i = 1; i < listPoints.length; i++) {
    ctx.lineTo(listPoints[i].x, listPoints[i].y); // Vẽ đường lần lượt đến tường điểm tiếp theo trên đường đi cho tới điểm cuối cùng.
  }
  ctx.stroke();

  // Vẽ điểm xuất phát
  ctx.beginPath();
  ctx.arc(listPoints[0].x, listPoints[0].y, 5, 0, 2 * Math.PI);
  ctx.lineWidth = 6;
  ctx.shadowBlur = 10;
  ctx.shadowColor = "blue";
  ctx.strokeStyle = "white";
  ctx.stroke();
  ctx.fillStyle = "blue";
  ctx.fill();

  // Vẽ điểm đích
  ctx.beginPath();
  ctx.arc(
    listPoints[listPoints.length - 1].x,
    listPoints[listPoints.length - 1].y,
    2,
    0,
    2 * Math.PI
  );

  ctx.lineWidth = 12;
  ctx.shadowBlur = 10;
  ctx.shadowColor = "black";
  ctx.strokeStyle = "white";
  ctx.stroke();
  ctx.fillStyle = "black";
  ctx.fill();
}

class PriorityQueue {
  constructor() {
    this.heap = [];
  }

  // Helper Methods
  getLeftChildIndex(parentIndex) {
    return 2 * parentIndex + 1;
  }

  getRightChildIndex(parentIndex) {
    return 2 * parentIndex + 2;
  }

  getParentIndex(childIndex) {
    return Math.floor((childIndex - 1) / 2);
  }

  hasLeftChild(index) {
    return this.getLeftChildIndex(index) < this.heap.length;
  }

  hasRightChild(index) {
    return this.getRightChildIndex(index) < this.heap.length;
  }

  hasParent(index) {
    return this.getParentIndex(index) >= 0;
  }

  leftChild(index) {
    return this.heap[this.getLeftChildIndex(index)];
  }

  rightChild(index) {
    return this.heap[this.getRightChildIndex(index)];
  }

  parent(index) {
    return this.heap[this.getParentIndex(index)];
  }

  swap(indexOne, indexTwo) {
    const temp = this.heap[indexOne];
    this.heap[indexOne] = this.heap[indexTwo];
    this.heap[indexTwo] = temp;
  }

  peek() {
    if (this.heap.length === 0) {
      return null;
    }
    return this.heap[0];
  }

  // Removing an element will remove the
  // top element with highest priority then
  // heapifyDown will be called
  remove() {
    if (this.heap.length === 0) {
      return null;
    }
    const item = this.heap[0];
    this.heap[0] = this.heap[this.heap.length - 1];
    this.heap.pop();
    this.heapifyDown();
    return item;
  }

  add(item) {
    this.heap.push(item);
    this.heapifyUp();
  }

  // Việc sắp xếp các đỉnh trong tập mở được dựa trên giá trị f của đỉnh
  // đỉnh nào có f nhỏ nhất thì nằm ở đầu.
  heapifyUp() {
    let index = this.heap.length - 1;
    while (this.hasParent(index) && this.parent(index).f > this.heap[index].f) {
      this.swap(this.getParentIndex(index), index);
      index = this.getParentIndex(index);
    }
  }

  heapifyDown() {
    let index = 0;
    while (this.hasLeftChild(index)) {
      let smallerChildIndex = this.getLeftChildIndex(index);
      if (
        this.hasRightChild(index) &&
        this.rightChild(index).f < this.leftChild(index).f
      ) {
        smallerChildIndex = this.getRightChildIndex(index);
      }
      if (this.heap[index].f < this.heap[smallerChildIndex].f) {
        break;
      } else {
        this.swap(index, smallerChildIndex);
      }
      index = smallerChildIndex;
    }
  }
}

function findRoad(startName, endName, jsonData) {
  var dinhs = jsonData;
  var start = dinhs[startName - 1];
  var goal = dinhs[endName - 1];

  function reconstruct_path(cameFrom, current) {
    // Hàm ghi nhận kết quả trả ra danh sách các đỉnh cần đi qua theo đúng thứ tự
    var dinh = current.tenDinh;
    var total_path = [dinh];
    while (dinh != cameFrom[dinh]) {
      dinh = cameFrom[dinh];
      total_path.unshift(dinh);
    }
    return total_path;
  }

  // Khai triển thuật toán A*
  function A_Star(start, goal, h) {
    var openSet = new PriorityQueue();
    var cameFrom = [];
    var gScore = []; // Mảng dùng để lưu giá trị g(n);
    var fScore = []; // Mảng dùng để luw giá trị f(n);

    // Khởi tạo các giá trị đầu cho thuật toán.
    dinhs.forEach((dinh) => {
      // Đặt đường đi đi từ điểm xuất phát đến điểm đích mà đi qua "dinh" là vô cùng.
      fScore[dinh.tenDinh] = 10000000;
      // Đặt đường đi đi từ điểm xuất phát đến điểm "dinh" là vô cùng.
      gScore[dinh.tenDinh] = 10000000;
    });
    gScore[start.tenDinh] = 0; // g(đỉnh xuất phát)  = 0
    fScore[start.tenDinh] = h(start); //
    cameFrom[start.tenDinh] = start.tenDinh;
    openSet.add({ dinh: start, f: fScore[start.tenDinh] }); // Ban đầu tập mở chỉ bao gồm đỉnh xuất phát.
    var isInOpenSet = [];
    isInOpenSet[start.tenDinh] = true;

    while (openSet.peek() != null) {
      // Lặp cho đến khi tập mở rỗng.
      var current = openSet.peek(); // Lấy đỉnh có f(n) nhỏ nhất trong tập mở.
      current = current.dinh;
      if (current === goal) {
        // Nếu đỉnh vừa lấy ra trùng đỉnh đính thì ta có được kết quả đường đi.
        return reconstruct_path(cameFrom, current); // gọi hàm ghi nhận kết quả và thoát vòng lặp.
      }
      openSet.remove(); // Xóa đỉnh đó ra khỏi tập mở;
      isInOpenSet[current.tenDinh] = false;
      current.listDinhKe.forEach(({ tenDinh, doDai }) => {
        // Duyệt qua tất cả các đường đi tới các đỉnh kề của đỉnh đang xét.
        var neighbor = dinhs[tenDinh - 1];
        var tentative_gScore = gScore[current.tenDinh] + doDai; // Tính g(n) là độ dài đường đi nếu đi qua đỉnh hàng xóm này.
        if (tentative_gScore < gScore[neighbor.tenDinh]) {
          // Nếu g() mới nhỏ hơn g() cũ thì cập nhật g() của đỉnh hàng xóm này và cập nhật lại đỉnh trước của đỉnh hàng xóm này.
          cameFrom[neighbor.tenDinh] = current.tenDinh;
          gScore[neighbor.tenDinh] = tentative_gScore;
          fScore[neighbor.tenDinh] = tentative_gScore + h(neighbor); // Tính h() cho đỉnh hàng xóm.
          if (!isInOpenSet[neighbor.tenDinh]) {
            // Nếu đỉnh hàng xóm không có trong danh sách mở thì thêm vào.
            openSet.add({ dinh: neighbor, f: fScore[neighbor.tenDinh] });
            isInOpenSet[neighbor.tenDinh] = true;
          }
        }
        // Open set is empty but goal was never reached
        return null;
      });
    }
  }

  // H(n)
  function h(dinh) {
    // goal là đỉnh đích được lưu trong closure của hàm bên ngoài.
    var dx = dinh.toaDo[0] - goal.toaDo[0];
    var dy = dinh.toaDo[1] - goal.toaDo[1];
    return Math.sqrt(dx * dx + dy * dy);
  }

  var result = A_Star(start, goal, h);
  var listPoints = [];
  result.forEach((e) => {
    listPoints.push({ x: dinhs[e - 1].toaDo[0], y: dinhs[e - 1].toaDo[1] });
  });
  return listPoints;
}

async function getJSONData() {
  const response = await fetch(
    "https://raw.githubusercontent.com/helscarthe/AI-BTL-Nhom11/main/giao_diem.json"
  );
  var jsonData = await response.json();
  var btn = document.getElementById("search");
  btn.addEventListener("click", (e) => {
    var startName = Number(document.getElementById("startName").value);
    var endName = Number(document.getElementById("endName").value);
    var result = findRoad(startName, endName, jsonData);
    drawRoad(result);
  });
}
getJSONData();
