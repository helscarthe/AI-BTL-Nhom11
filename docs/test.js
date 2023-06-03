async function showPoint() {
  const response = await fetch(
    "https://raw.githubusercontent.com/helscarthe/AI-BTL-Nhom11/main/giao_diem.json"
  );
  const jsonData = await response.json();
  var dinhs = jsonData;
  var a = document.getElementById("point");
  var ct = a.getContext("2d");
  for (var i = 0; i < dinhs.length; i++) {
    ct.beginPath();
    ct.arc(dinhs[i].toaDo[0], dinhs[i].toaDo[1], 3, 0, 2 * Math.PI);
    ct.lineWidth = 2;
    ct.strokeStyle = "blue";
    ct.shadowBlur = 0;
    ct.stroke();

    ct.font = "15px Arial";
    ct.fillText(i + 1, dinhs[i].toaDo[0], dinhs[i].toaDo[1]);
  }
}

var count = 0;
var btn = document.getElementById("toggle_btn");
btn.addEventListener("click", (e) => {
  if (count % 2 == 0) {
    showPoint();
    btn.textContent = "ON";
  } else {
    btn.textContent = "OFF";
    var a = document.getElementById("point");
    var ct = a.getContext("2d");
    ct.clearRect(0, 0, 10000, 100000);
  }
  count++;
});

var btn1 = document.getElementById("delete_canvas");
btn1.addEventListener("click", (e) => {
  var a1 = document.getElementById("myCanvas");
  var ct1 = a1.getContext("2d");
  ct1.clearRect(0, 0, 10000, 100000);
});
