var duong;
var canh;
var giaoDiem;
window.onload = async function() {
  const responseCanh = await fetch(
    "https://raw.githubusercontent.com/helscarthe/AI-BTL-Nhom11/main/canh.json"
  );
  const jsonDataCanh = await responseCanh.json();
  canh = jsonDataCanh;
  const responseDuong = await fetch(
    "https://raw.githubusercontent.com/helscarthe/AI-BTL-Nhom11/main/duong.json"
  );
  const jsonDataDuong = await responseDuong.json();
  duong = jsonDataDuong;
  const responseGD = await fetch(
    "https://raw.githubusercontent.com/helscarthe/AI-BTL-Nhom11/main/giao_diem.json"
  );
  const jsonDataGD = await responseGD.json();
  giaoDiem = jsonDataGD;
  var html_code = '<option value="">Không</option>';
  $.each(duong, function (index, value) {
    if (value.cap === 0) {
      html_code +=
        '<option value="' + value.tenDuong + '">' + value.tenDuong + '</option>';
    }
  })
  $('#Duong-start').html(html_code);
  $('#Duong-end').html(html_code);
}

$('#Ngo-start-section').hide();
$('#Ngo-end-section').hide();
$('#submit'). prop('disabled', true);

function updateDuong(duongVal) {
  canhID = [];
  $.each(duong, function (index, value) {
    if (value.tenDuong === duongVal) {
      canhID = value.listCanh;
      return false;
    }
  })

  var html_code = '<option value="">Không</option>';
  // TODO: REMOVE DEBUG vvv
  console.log(duongVal);
  // TODO: REMOVE DEBUG ^^^
  soNha = []
  $.each(canhID, function (index, value) {
    curID = value;
    // TODO: REMOVE DEBUG vvv
    console.log(curID);
    console.log(canh[curID-1].id);
    console.log(canh[curID-1].listSoNha);
    // TODO: REMOVE DEBUG ^^^
    $.each(canh[curID-1].listSoNha, function (index, value) {
      soNha.push(value);
    })
  })
  soNha.sort(function(a, b){return a - b});
  $.each(soNha, function (index, value) {
    html_code +=
      '<option value="' + value + '">' + value + '</option>';
  })
  return html_code;
}

$('#Duong-start').change(function() {
  $('#Ngo-start-section').hide();
  var dropVal = $(this).val();
  var html_code = '<option value="">Không</option>';
  if (dropVal === "") {
    $('#SoNha-start').html(html_code);
    return false;
  }

  $('#SoNha-start').html(updateDuong(dropVal));

  ngoID = [];
  $.each(duong, function (index, value) {
    if (value.tenDuong === dropVal) {
      ngoID = value.listDuongNho;
      return false;
    }
  })

  html_code = '<option value="">Không</option>';
  $.each(ngoID, function (index, value) {
    html_code +=
      '<option value="' + duong[value - 1].tenDuong + '">' + duong[value - 1].tenDuong + '</option>';
  })
  $('#Ngo-start').html(html_code);
  $('#Ngo-start-section').show();
});

$('#Duong-end').change(function() {
  $('#Ngo-end-section').hide();
  var dropVal = $(this).val();
  var html_code = '<option value="">Không</option>';
  if (dropVal === "") {
    $('#SoNha-end').html(html_code);
    return false;
  }

  $('#SoNha-end').html(updateDuong(dropVal));

  ngoID = [];
  $.each(duong, function (index, value) {
    if (value.tenDuong === dropVal) {
      ngoID = value.listDuongNho;
      return false;
    }
  })

  html_code = '<option value="">Không</option>';
  $.each(ngoID, function (index, value) {
    html_code +=
      '<option value="' + duong[value - 1].tenDuong + '">' + duong[value - 1].tenDuong + '</option>';
  })
  $('#Ngo-end').html(html_code);
  $('#Ngo-end-section').show();
});

$('#Ngo-start').change(function() {
  var dropVal = $(this).val();
  if (dropVal === "") {
    $('#SoNha-start').html(updateDuong($('#Duong-start').val()));
    return false;
  }

  $('#SoNha-start').html(updateDuong(dropVal));
})

$('#Ngo-end').change(function() {
  var dropVal = $(this).val();
  if (dropVal === "") {
    $('#SoNha-end').html(updateDuong($('#Duong-end').val()));
    return false;
  }

  $('#SoNha-end').html(updateDuong(dropVal));
})

$('.input').change(function() {
  $('#submit'). prop('disabled', true);
  if ($('#SoNha-start').val() === "") {
    return false;
  }
  if ($('#SoNha-end').val() === "") {
    return false;
  }
  $('#submit'). prop('disabled', false);
})

function calcPos(soNha, canhID) {
  var parity = soNha % 2;
  var listSoNhaOneSide = [];
  $.each(canh[canhID - 1].listSoNha, function(index, value) {
    if (value % 2 == parity) {
      listSoNhaOneSide.push(value);
    }
  })
  var targetIndex;
  $.each(listSoNhaOneSide, function(index, value) {
    if (value == soNha) {
      targetIndex = index + 1;
      return false;
    }
  })
  var length = listSoNhaOneSide.length + 1;
  var diem1 = canh[canhID - 1].dinh[0];
  var diem2 = canh[canhID - 1].dinh[1];
  var pixelLengthX = giaoDiem[diem2 - 1].toaDo[0] - giaoDiem[diem1 - 1].toaDo[0];
  var pixelLengthY = giaoDiem[diem2 - 1].toaDo[1] - giaoDiem[diem1 - 1].toaDo[1];
  //super jank
  var x = Math.round(giaoDiem[diem1 - 1].toaDo[0] + (pixelLengthX/length)*targetIndex);
  var y = Math.round(giaoDiem[diem1 - 1].toaDo[1] + (pixelLengthY/length)*targetIndex);
  return {'x': x, 'y': y};
}

$('#submit').click(function() {
  console.log("running definitely");

  var startVal = Number($('#SoNha-start').val());
  var endVal = Number($('#SoNha-end').val());
  console.log(startVal);
  console.log(endVal);

  var roadName;
  if ($('#Ngo-start-section').is(":visible") && $('#Ngo-start').val() != "") {
    roadName = $('#Ngo-start').val();
  } else {
    roadName = $('#Duong-start').val();
  }
  console.log(roadName);

  var startCanhID;
  $.each(duong, function(index, value1) {
    if (value1.tenDuong === roadName) {
      $.each(value1.listCanh, function (index, value2) {
        $.each(canh[value2 - 1].listSoNha, function(index, value3) {
          if (startVal === value3) {
            startCanhID = value2;
            return false;
          }
        })
      })
      return false;
    }
  })
  console.log(startCanhID);

  if ($('#Ngo-end-section').is(":visible") && $('#Ngo-end').val() != "") {
    roadName = $('#Ngo-end').val();
  } else {
    roadName = $('#Duong-end').val();
  }
  console.log(roadName);

  var endCanhID;
  $.each(duong, function(index, value1) {
    if (value1.tenDuong === roadName) {
      $.each(value1.listCanh, function (index, value2) {
        $.each(canh[value2 - 1].listSoNha, function(index, value3) {
          if (endVal === value3) {
            endCanhID = value2;
            return false;
          }
        })
      })
      return false;
    }
  })
  console.log(endCanhID);

  var startPoints = [];
  startPoints.push(canh[startCanhID - 1].dinh[1]);
  if (!canh[startCanhID - 1].motChieu) {
    startPoints.push(canh[startCanhID - 1].dinh[0])
  }
  console.log(startPoints);

  var endPoints = [];
  endPoints.push(canh[endCanhID - 1].dinh[0]);
  if (!canh[endCanhID - 1].motChieu) {
    endPoints.push(canh[endCanhID - 1].dinh[1])
  }
  console.log(endPoints);

  var minLength = Number.MAX_SAFE_INTEGER;
  var results;

  $.each(startPoints, function(index, start) {
    $.each(endPoints, function(index, end) {
      var temp = findRoad(start, end, giaoDiem);
      console.log(temp.roadLength);
      if (temp.roadLength < minLength) {
        minLength = temp.roadLength;
        results = temp;
      }
    })
  })
  console.log(results);
  results.listPoints.unshift(calcPos(startVal, startCanhID));
  results.listPoints.push(calcPos(endVal, endCanhID));
  drawRoad(results.listPoints);
})