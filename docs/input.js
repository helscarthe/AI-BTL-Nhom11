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
    "https://raw.githubusercontent.com/helscarthe/AI-BTL-Nhom11/main/duong.json"
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

$('#SoNha-start, #SoNha-end').change(function() {
  $('#submit'). prop('disabled', true);
  if ($('#SoNha-start').val() === "") {
    return false;
  }
  if ($('#SoNha-end').val() === "") {
    return false;
  }
  $('#submit'). prop('disabled', false);
})