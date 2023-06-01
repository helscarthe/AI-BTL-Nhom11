async function logJSONData() {
  const response = await fetch(
    "https://helscarthe.github.io/AI-BTL-Nhom11/giao_diem.json"
  );
  const jsonData = await response.json();
  var dinhs = jsonData;
  var c = document.getElementById("myCanvas");
  var ctx = c.getContext("2d");
  for (var i = 0; i < dinhs.length; i++) {
    ctx.beginPath();
    ctx.arc(dinhs[i].toaDo[0], dinhs[i].toaDo[1], 3, 0, 2 * Math.PI);
    ctx.lineWidth = 2;
    ctx.strokeStyle = "blue";
    ctx.stroke();

    ctx.font = "15px Arial";
    ctx.fillText(i + 1, dinhs[i].toaDo[0], dinhs[i].toaDo[1]);
  }
}
var btn = document.getElementById("a");
btn.addEventListener("click", (e) => {
  logJSONData();
});
