// // var idd;
// // let count = 1;
// // var ziduan="出库";
// // function getGsm() {
// //     $ajax({
// //         type: 'post',
// //         url: '/khzl/hqxlGsm',
// //     }, false, '', function (res) {
// //         if (res.code == 200) {
// //             for (var i = 0; i < res.data.length; i++) {
// //                 $("#add-shdw").append("<option>" + res.data[i].gsm + "</option>");
// //                 $("#update-shdw").append("<option>" + res.data[i].gsm + "</option>");
// //             }
// //         }
// //     })
// // }
// //
// // function getList() {
// //     // $('#ksrq').val("");
// //     // $('#jsrq').val("");
// //
// //     var  date = new Date();
// //     date.setMonth(date.getMonth()-3);
// //     var year = date.getFullYear();
// //     var month = ('0'+(date.getMonth()+1)).slice(-2);
// //     var day = ('0'+date.getDate()).slice(-2);
// //     var ks = year+'-'+month+'-'+day
// //     document.getElementById("ksrq").value = ks;
// //     var jsyear = date.getFullYear();
// //     var jsmonth = ('0'+(date.getMonth()+4)).slice(-2);
// //     var jsday = ('0'+date.getDate()).slice(-2);
// //     var js = jsyear+'-'+jsmonth+'-'+jsday
// //     document.getElementById("jsrq").value = js;
// //
// //     $ajax({
// //         type: 'post',
// //         url: '/xsd/getList',
// //     }, false, '', function (res) {
// //         if (res.code == 200) {
// //             setTable(res.data);
// //             $("#xsdTable").colResizable({
// //                 liveDrag: true,
// //                 gripInnerHtml: "<div class='grip'></div>",
// //                 draggingClass: "dragging",
// //                 resizeMode: 'fit'
// //             });
// //             var table = document.getElementById("xsdTable");
// //             var rows = table.rows;
// //             var cells = table.cells;
// //             var colums = table.rows[0].cells.length;
// //             for(var x=1;x<colums;x++){
// //                 var zje = 0;
// //                 for(var j = 1;j<rows.length-1;j++){
// //                     var a = parseInt(rows[j].cells[10].innerHTML);
// //                     zje = zje+a
// //                 }
// //                 document.getElementById('zje').value = zje
// //             }
// //
// //             for(var q=1;q<colums;q++){
// //                 var jgf = 0;
// //                 for(var w = 1;w<rows.length-1;w++){
// //                     var b = parseInt(rows[w].cells[20].innerHTML);
// //                     jgf = jgf+b
// //                 }
// //                 document.getElementById('add-jgf').value = jgf
// //             }
// //             for (i=0;i<=res.data.id;i++){
// //                 idd=i;
// //             }
// //         }
// //     })
// // }
//
// var idd;
// let count = 1;
// // let n = 0;
// let index = 0;
// var ziduan="出库";
// var HJDJ=0;
// var HJJE=0;
// var HJZL=0;
// function getGsm() {
//     $ajax({
//         type: 'post',
//         url: '/khzl/hqxlGsm',
//     }, false, '', function (res) {
//         if (res.code == 200) {
//             for (var i = 0; i < res.data.length; i++) {
//                 $("#add-shdw").append("<option>" + res.data[i].gsm + "</option>");
//                 $("#update-shdw").append("<option>" + res.data[i].gsm + "</option>");
//                 $("#update1-shdw").append("<option>" + res.data[i].gsm + "</option>");
//             }
//         }
//     })
// }
// function getMc() {
//     $ajax({
//         type: 'post',
//         url: '/spmc/getList',
//     }, false, '', function (res) {
//         if (res.code == 200) {
//             for (var i = 0; i < res.data.length; i++) {
//                 $("#add-mc").append("<option>" + res.data[i].mc + "</option>");
//                 $("#update-mc").append("<option>" + res.data[i].mc + "</option>");
//                 $("#update-mc1").append("<option>" + res.data[i].mc + "</option>");
//                 $("#update-mc2").append("<option>" + res.data[i].mc + "</option>");
//                 $("#update-mc3").append("<option>" + res.data[i].mc + "</option>");
//                 $("#update-mc4").append("<option>" + res.data[i].mc + "</option>");
//                 $("#update-mc5").append("<option>" + res.data[i].mc + "</option>");
//                 $("#update-mc6").append("<option>" + res.data[i].mc + "</option>");
//                 $("#update-mc7").append("<option>" + res.data[i].mc + "</option>");
//                 $("#update-mc8").append("<option>" + res.data[i].mc + "</option>");
//                 $("#update-mc9").append("<option>" + res.data[i].mc + "</option>");
//                 $("#update-mc10").append("<option>" + res.data[i].mc + "</option>");
//                 $("#update-mc11").append("<option>" + res.data[i].mc + "</option>");
//                 $("#update-mc12").append("<option>" + res.data[i].mc + "</option>");
//                 $("#update-mc13").append("<option>" + res.data[i].mc + "</option>");
//                 $("#update-mc14").append("<option>" + res.data[i].mc + "</option>");
//                 $("#update-mc15").append("<option>" + res.data[i].mc + "</option>");
//                 $("#update-mc16").append("<option>" + res.data[i].mc + "</option>");
//                 $("#update-mc17").append("<option>" + res.data[i].mc + "</option>");
//                 $("#update-mc18").append("<option>" + res.data[i].mc + "</option>");
//                 $("#update-mc19").append("<option>" + res.data[i].mc + "</option>");
//                 $("#update1-mc").append("<option>" + res.data[i].mc + "</option>");
//                 $("#update1-mc1").append("<option>" + res.data[i].mc + "</option>");
//                 $("#update1-mc2").append("<option>" + res.data[i].mc + "</option>");
//                 $("#update1-mc3").append("<option>" + res.data[i].mc + "</option>");
//                 $("#update1-mc4").append("<option>" + res.data[i].mc + "</option>");
//                 $("#update1-mc5").append("<option>" + res.data[i].mc + "</option>");
//                 $("#update1-mc6").append("<option>" + res.data[i].mc + "</option>");
//                 $("#update1-mc7").append("<option>" + res.data[i].mc + "</option>");
//                 $("#update1-mc8").append("<option>" + res.data[i].mc + "</option>");
//                 $("#update1-mc9").append("<option>" + res.data[i].mc + "</option>");
//                 $("#update1-mc10").append("<option>" + res.data[i].mc + "</option>");
//                 $("#update1-mc11").append("<option>" + res.data[i].mc + "</option>");
//                 $("#update1-mc12").append("<option>" + res.data[i].mc + "</option>");
//                 $("#update1-mc13").append("<option>" + res.data[i].mc + "</option>");
//                 $("#update1-mc14").append("<option>" + res.data[i].mc + "</option>");
//                 $("#update1-mc15").append("<option>" + res.data[i].mc + "</option>");
//                 $("#update1-mc16").append("<option>" + res.data[i].mc + "</option>");
//                 $("#update1-mc17").append("<option>" + res.data[i].mc + "</option>");
//                 $("#update1-mc18").append("<option>" + res.data[i].mc + "</option>");
//                 $("#update1-mc19").append("<option>" + res.data[i].mc + "</option>");
//             }
//         }
//     })
// }
//
// function getList() {
//     // $('#ksrq').val("");
//     // $('#jsrq').val("");
//
//     var  date = new Date();
//     date.setMonth(date.getMonth()-3);
//     var year = date.getFullYear();
//     var month = ('0'+(date.getMonth()+1)).slice(-2);
//     var day = ('0'+date.getDate()).slice(-2);
//     var ks = year+'-'+month+'-'+day
//     document.getElementById("ksrq").value = ks;
//     var jsyear = date.getFullYear();
//     var jsmonth = ('0'+(date.getMonth()+4)).slice(-2);
//     var jsday = ('0'+date.getDate()).slice(-2);
//     var js = jsyear+'-'+jsmonth+'-'+jsday
//     document.getElementById("jsrq").value = js;
//
//     $ajax({
//         type: 'post',
//         url: '/xsd/getList',
//     }, false, '', function (res) {
//         if (res.code == 200) {
//             setTable(res.data);
//             $("#xsdTable").colResizable({
//                 liveDrag: true,
//                 gripInnerHtml: "<div class='grip'></div>",
//                 draggingClass: "dragging",
//                 resizeMode: 'fit'
//             });
//             var table = document.getElementById("xsdTable");
//             var rows = table.rows;
//             var cells = table.cells;
//             var colums = table.rows[0].cells.length;
//             for(var x=1;x<colums;x++){
//                 var zje = 0;
//                 for(var j = 1;j<rows.length-1;j++){
//                     var a = parseInt(rows[j].cells[10].innerHTML);
//                     zje = zje+a
//                 }
//                 // document.getElementById('zje').value = zje
//             }
//
//             // for(var q=1;q<colums;q++){
//             //     var jgf = 0;
//             //     for(var w = 1;w<rows.length-1;w++){
//             //         var b = parseInt(rows[w].cells[20].innerHTML);
//             //         jgf = jgf+b
//             //     }
//             //     document.getElementById('add-jgf').value = jgf
//             // }
//             for (i=0;i<=res.data.id;i++){
//                 idd=i;
//             }
//         }
//     })
// }
//
//
//
//
//
//
//
//
//
//
//
// $(function () {
//     getList();
//     getGsm();
//     getMc();
//     var date = new Date();
//     date.setMonth(date.getMonth()-3);
//     var year = date.getFullYear();
//     var month = ('0'+(date.getMonth()+1)).slice(-2);
//     var day = ('0'+date.getDate()).slice(-2);
//     var ks = year+'-'+month+'-'+day
//     document.getElementById("ksrq").value = ks;
//     var jsyear = date.getFullYear();
//     var jsmonth = ('0'+(date.getMonth()+4)).slice(-2);
//     var jsday = ('0'+date.getDate()).slice(-2);
//     var js = jsyear+'-'+jsmonth+'-'+jsday
//     document.getElementById("jsrq").value = js;
//
//     $ajax({
//         type: 'post',
//         url: '/user/getName',
//     }, false, '', function (res) {
//         var this_name = res.data
//         document.getElementById("dlm").innerText = this_name;
//     })
//
//     $('#select-btn').click(function () {
//         var ksrq = $('#ksrq').val();
//         var jsrq = $('#jsrq').val();
//         var shdw = $('#shdw').val();
//         $ajax({
//             type: 'post',
//             url: '/xsd/queryList',
//             data: {
//                 ksrq: ksrq,
//                 jsrq: jsrq,
//                 shdw:shdw
//             }
//         }, true, '', function (res) {
//             if (res.code == 200) {
//                 setTable(res.data);
//             }
//         })
//     });
//
//     //刷新
//     $("#refresh-btn").click(function () {
//         getList();
//     });
//
//     //点击新增按钮显示弹窗
//     $("#add-btn").click(function () {
//         $('#add-modal').modal('show');
//
//         const now = new Date();
//         const year = now.getFullYear();
//         const month = (now.getMonth() + 1).toString().padStart(2, '0');
//         const day = now.getDate().toString().padStart(2, '0');
//         const serial = (count++).toString().padStart(3, '0');
//         var aa = `${year}${month}${day}${serial}`;
//         document.getElementById('add-dh').value = aa;
//
//         $ajax({
//             type: 'post',
//             url: '/user/getName',
//         }, false, '', function (res) {
//             var this_name = res.data
//             $("#add-zdr").val = this_name
//             document.getElementById("add-zdr").value = this_name
//         })
//
//         //未含税锁定
//         document.getElementById('add-sfhs').addEventListener('change', function() {
//             var selectedOption = this.value;
//             var textBoxes = document.querySelectorAll('input[type="text"]');
//             // 根据选择的option值锁定对应的文本框
//             if (selectedOption === '未含税') {
//                 document.getElementById('add-hsdj').disabled = true;
//                 document.getElementById('add-sd').disabled = true;
//                 document.getElementById('add-whsdj').disabled = false;
//             }else{
//                 document.getElementById('add-whsdj').disabled = true;
//                 document.getElementById('add-hsdj').disabled = false;
//                 document.getElementById('add-sd').disabled = false;
//             }
//         });
//     });
//
//     //新增弹窗里点击关闭按钮
//     $('#add-close-btn').click(function () {
//         $('#add-modal').modal('hide');
//     });
//
//     //新增弹窗里点击提交按钮
//     $("#add-submit-btn").click(function () {
//
//         var js = parseFloat(document.getElementById('add-js').value);
//         var zl = parseFloat(document.getElementById('add-zl').value);
//         var dj = parseFloat(document.getElementById('add-dj').value);
//         var je = js * zl * dj
//         document.getElementById("add-je").value = je
//
//         var js = parseFloat(document.getElementById('add-js').value);
//         var jgf = js * 0.5
//         document.getElementById("add-jgf").value = jgf
//
//         if (parseFloat(document.getElementById('add-sd').value) != 0 ){
//             var hsdj = parseFloat(document.getElementById('add-hsdj').value);
//             var sd = parseFloat(document.getElementById('add-sd').value);
//             var whsdj = hsdj / sd
//             document.getElementById("add-whsdj").value = whsdj
//         }
//
//         var  date = new Date();
//         date.setMonth(date.getMonth()-3);
//         var year = date.getFullYear();
//         var month = ('0'+(date.getMonth()+1)).slice(-2);
//         var day = ('0'+date.getDate()).slice(-2);
//         const hours = date.getHours().toString().padStart(2, '0');
//         const minutes = date.getMinutes().toString().padStart(2, '0');
//         const seconds = date.getSeconds().toString().padStart(2, '0');
//         var danhao =year+''+month+''+day+''+hours+''+minutes+seconds;
//         console.log(danhao)
//         document.getElementById("add-danhao").value = danhao;
//
//         // var d1 = document.getElementById('mc').value;
//         // var d2 = document.getElementById('dj').value;
//         // var d3 = document.getElementById('je').value;
//
//         let params = formToJson("#add-form");
//         if (checkForm('#add-form')) {
//             $ajax({
//                 type: 'post',
//                 url: '/xsd/add1',
//                 data: JSON.stringify({
//                     addInfo: params
//                 }),
//                 dataType: 'json',
//                 contentType: 'application/json;charset=utf-8'
//             }, false, '', function (res) {
//                 if (res.code == 200) {
//                     $ajax({
//                         type: 'post',
//                         url: '/mx/add1',
//                         data: JSON.stringify({
//                             addInfo: params,
//                             // cksl: js,
//                             // ziduan:ziduan
//                         }),
//                         dataType: 'json',
//                         contentType: 'application/json;charset=utf-8'
//                     }, false, '', function (res) {
//                         if (res.code == 200) {
//                             swal("", res.msg, "success");
//                             $('#add-form')[0].reset();
//                             getList();
//                             $('#add-close-btn').click();
//                         }
//                     })
//                     swal("", res.msg, "success");
//                     $('#add-form')[0].reset();
//                     getList();
//                     $('#add-close-btn').click();
//                 }
//             })
//             // var d1 = document.getElementById('mc').value;
//             // var d2 = document.getElementById('dj').value;
//             // var d3 = document.getElementById('je').value;
//
//         }
//
//         // var d1 = document.getElementById('mc').value;
//         // var d2 = document.getElementById('dj').value;
//         // var d3 = document.getElementById('je').value;
//         // $ajax({
//         //     type: 'post',
//         //     url: '/xsd/add',
//         //     data: JSON.stringify({
//         //         addInfo: params
//         //     }),
//         //     dataType: 'json',
//         //     contentType: 'application/json;charset=utf-8'
//         // }, false, '', function (res) {
//         //     if (res.code == 200) {
//         //         $ajax({
//         //             type: 'post',
//         //             url: '/xsd/add',
//         //             data: JSON.stringify({
//         //                 addInfo: params
//         //             }),
//         //             dataType: 'json',
//         //             contentType: 'application/json;charset=utf-8'
//         //         }, false, '', function (res) {
//         //             if (res.code == 200) {
//         //                 swal("", res.msg, "success");
//         //                 $('#add-form')[0].reset();
//         //                 getList();
//         //                 $('#add-close-btn').click();
//         //             }
//         //         })
//         //         swal("", res.msg, "success");
//         //         $('#add-form')[0].reset();
//         //         getList();
//         //         $('#add-close-btn').click();
//         //     }
//         // })
//
//     });
//
//     //点击修改按钮显示弹窗
//     // $('#update-btn').click(function () {
//     //     let rows = getTableSelection('#xsdTable');
//     //     if (rows.length > 1 || rows.length == 0) {
//     //         swal('请选择一条数据修改!');
//     //         return;
//     //     }
//     //     $('#update-modal').modal('show');
//     //     setForm(rows[0].data, '#update-form');
//     //     $('#update-riqi').val(rows[0].data.riqi);
//     //      $('#update-dh').val(rows[0].data.dh);
//     //     $('#update-shdw').val(rows[0].data.shdw);
//     //     $('#update-mc').val(rows[0].data.mc);
//     //     $('#update-mh').val(rows[0].data.mh);
//     //     $('#update-gg').val(rows[0].data.gg);
//     //     $('#update-js').val(rows[0].data.js);
//     //     $('#update-zl').val(rows[0].data.zl);
//     //     $('#update-dj').val(rows[0].data.dj);
//     //     $('#update-je').val(rows[0].data.je);
//     //     $('#update-bz').val(rows[0].data.bz);
//     //     $('#update-shdz').val(rows[0].data.shdz);
//     //     $('#update-kddh').val(rows[0].data.kddh);
//     //     $('#update-sfyj').val(rows[0].data.sfyj);
//     //     $('#update-fkfs').val(rows[0].data.fkfs);
//     //     $('#update-sfhs').val(rows[0].data.sfhs);
//     //     $('#update-gd').val(rows[0].data.gd);
//     //     $('#update-zdr').val(rows[0].data.zdr);
//     //     $('#update-shdwjjsr').val(rows[0].data.shdwjjsr);
//     //     $('#update-jgf').val(rows[0].data.jgf);
//     //     $('#update-kdf').val(rows[0].data.kdf);
//     //     $('#update-hsdj').val(rows[0].data.hsdj);
//     //     $('#update-sd').val(rows[0].data.sd);
//     //     $('#update-whsdj').val(rows[0].data.whsdj);
//     //     var dh = document.getElementById("update-dh").value;
//     //     $ajax({
//     //         type: 'post',
//     //         url: '/xsd/getList2',
//     //         data:{
//     //             dh:dh
//     //         }
//     //     }, false, '', function (res) {
//     //         if (res.code == 200) {
//     //             setTable2(res.data);
//     //             $("#xsdTable2").colResizable({
//     //                 liveDrag: true,
//     //                 gripInnerHtml: "<div class='grip'></div>",
//     //                 draggingClass: "dragging",
//     //                 resizeMode: 'fit'
//     //             });
//     //             for (i=0;i<=res.data.id;i++){
//     //                 idd=i;
//     //             }
//     //         }
//     //     })
//     //     //未含税锁定
//     //     // document.getElementById('update-sfhs').addEventListener('change', function() {
//     //     //     var selectedOption = this.value;
//     //     //     var textBoxes = document.querySelectorAll('input[type="text"]');
//     //     //     // 根据选择的option值锁定对应的文本框
//     //     //     if (selectedOption === '未含税') {
//     //     //         document.getElementById('update-hsdj').disabled = true;
//     //     //         document.getElementById('update-sd').disabled = true;
//     //     //         document.getElementById('update-whsdj').disabled = false;
//     //     //     }else{
//     //     //         document.getElementById('update-whsdj').disabled = true;
//     //     //         document.getElementById('update-hsdj').disabled = false;
//     //     //         document.getElementById('update-sd').disabled = false;
//     //     //     }
//     //     // });
//     // });
//     //点击修改按钮显示弹窗
//     $('#update-btn').click(function () {
//         const inputs = document.querySelectorAll('#tbupd input');
//         inputs.forEach(function(input) {
//             input.disabled = true;
//         });
//
//         let rows = getTableSelection('#xsdTable');
//         if (rows.length > 1 || rows.length == 0) {
//             swal('请选择一条数据修改!');
//             return;
//         }
//         $('#update-modal').modal('show');
//         // setForm(rows[0].data, '#update-form');
//         // $('#update-riqi').val(rows[0].data.riqi);
//         //  $('#update-dh').val(rows[0].data.dh);
//         // $('#update-shdw').val(rows[0].data.shdw);
//         // $('#update-mc').val(rows[0].data.mc);
//         // $('#update-mh').val(rows[0].data.mh);
//         // $('#update-gg').val(rows[0].data.gg);
//         // $('#update-js').val(rows[0].data.js);
//         // $('#update-zl').val(rows[0].data.zl);
//         // $('#update-dj').val(rows[0].data.dj);
//         // $('#update-je').val(rows[0].data.je);
//         // $('#update-bz').val(rows[0].data.bz);
//         // $('#update-shdz').val(rows[0].data.shdz);
//         // $('#update-kddh').val(rows[0].data.kddh);
//         // $('#update-sfyj').val(rows[0].data.sfyj);
//         // $('#update-fkfs').val(rows[0].data.fkfs);
//         // $('#update-sfhs').val(rows[0].data.sfhs);
//         // $('#update-gd').val(rows[0].data.gd);
//         // $('#update-zdr').val(rows[0].data.zdr);
//         // $('#update-shdwjjsr').val(rows[0].data.shdwjjsr);
//         // $('#update-jgf').val(rows[0].data.jgf);
//         // $('#update-kdf').val(rows[0].data.kdf);
//         // $('#update-hsdj').val(rows[0].data.hsdj);
//         // $('#update-sd').val(rows[0].data.sd);
//         // $('#update-whsdj').val(rows[0].data.whsdj);
//         // var dh = document.getElementById("update-dh").value;
//         var dh = rows[0].data.dh;
//         $ajax({
//             type: 'post',
//             url: '/xsd/getList2',
//             data:{
//                 dh:dh
//             }
//         }, false, '', function (res) {
//             if (res.code == 200) {
//                 // setTable2(res.data);
//                 // $("#xsdTable2").colResizable({
//                 //     liveDrag: true,
//                 //     gripInnerHtml: "<div class='grip'></div>",
//                 //     draggingClass: "dragging",
//                 //     resizeMode: 'fit'
//                 // });
//                 // for (i=0;i<=res.data.id;i++){
//                 //     idd=i;
//                 // }
//
//                 document.getElementById("update-shdw").value = res.data[0].shdw;
//                 document.getElementById("update-kddh").value = res.data[0].kddh;
//                 document.getElementById("update-riqi").value = res.data[0].riqi;
//                 document.getElementById("update-dh").value = res.data[0].dh;
//                 document.getElementById("update-xuhao").value = 1;
//                 document.getElementById("update-mc").value = res.data[0].mc;
//                 document.getElementById("update-gg").value = res.data[0].gg;
//                 document.getElementById("update-mh").value = res.data[0].mh;
//                 document.getElementById("update-zl").value = res.data[0].zl;
//                 document.getElementById("update-dj").value = res.data[0].dj;
//                 document.getElementById("update-js").value = res.data[0].js;
//                 document.getElementById("update-je").value = res.data[0].je;
//                 document.getElementById("update-bz").value = res.data[0].bz;
//                 document.getElementById("update-kdf").value = res.data[0].kdf;
//                 document.getElementById("update-sd").value = res.data[0].sd;
//                 document.getElementById("update-sfhs").value = res.data[0].sfhs;
//                 document.getElementById("update-sfyj").value = res.data[0].sfyj;
//                 // document.getElementById("update-hjzl").value = res.data[0].hjzl;
//                 var zl=res.data[0].zl;
//                 var kdf =res.data[0].kdf;
//                 // if (res.data.sfhs=="含税"||res.data.sfhs=="金额含税"){
//                 //     var sd = res.data[0].sd;
//                 //     HJZL=HJZL+parseFloat(zl);
//                 // }
//                 HJZL=HJZL+parseFloat(zl)
//                 document.getElementById("update-hsdj").value = res.data[0].hsdj;
//                 // var dj=res.data[0].dj;
//                 // HSDJ=HSDJ+parseFloat(dj);
//                 // document.getElementById("update-hjje").value = res.data[0].hjje;
//                 var je=res.data[0].je;
//                 HJJE=HJJE+parseFloat(je);
//                 document.getElementById("update-fkfs").value = res.data[0].fkfs;
//                 document.getElementById("update-gd").value = res.data[0].gd;
//                 document.getElementById("update-zdr").value = res.data[0].zdr;
//                 document.getElementById("update-bzld").value = res.data[0].bzld;
//
//                 for (var n = 1; n < res.data.length; n++) {
//                     index++;
//                     document.getElementById("update-xuhao" + n).value = index;
//                     document.getElementById("update-mc" + n).value = res.data[n].mc;
//                     document.getElementById("update-gg" + n).value = res.data[n].gg;
//                     document.getElementById("update-mh" + n).value = res.data[n].mh;
//                     document.getElementById("update-zl" + n).value = res.data[n].zl;
//                     var zl=res.data[i].zl;
//                     HJZL=HJZL+parseFloat(zl);
//                     document.getElementById("update-dj" + n).value = res.data[n].dj;
//                     // var dj=res.data[i].dj;
//                     // HJZL=HJZL+parseFloat(dj);
//                     document.getElementById("update-js" + n).value = res.data[n].js;
//                     document.getElementById("update-je" + n).value = res.data[n].je;
//                     var je=res.data[i].je;
//                     HJJE=HJJE+parseFloat(je);
//                     document.getElementById("update-bz" + n).value = res.data[n].bz;
//                 }
//                 document.getElementById("update-hjzl").value = HJZL.toString();
//                 // document.getElementById("update-hsdj").value =toString(HSDJ);
//                 document.getElementById("update-hjje").value = HJJE.toString();
//
//             }
//         })
//         //未含税锁定
//         // document.getElementById('update-sfhs').addEventListener('change', function() {
//         //     var selectedOption = this.value;
//         //     var textBoxes = document.querySelectorAll('input[type="text"]');
//         //     // 根据选择的option值锁定对应的文本框
//         //     if (selectedOption === '未含税') {
//         //         document.getElementById('update-hsdj').disabled = true;
//         //         document.getElementById('update-sd').disabled = true;
//         //         document.getElementById('update-whsdj').disabled = false;
//         //     }else{
//         //         document.getElementById('update-whsdj').disabled = true;
//         //         document.getElementById('update-hsdj').disabled = false;
//         //         document.getElementById('update-sd').disabled = false;
//         //     }
//         // });
//     });
//
//
//     //修改弹窗点击关闭按钮
//     // $('#update-close-btn').click(function () {
//     //     $('#update-form')[0].reset();
//     //     $('#update-modal').modal('hide');
//     // });
//     //修改弹窗点击关闭按钮
//     $('#update-close-btn').click(function () {
//         // $('#update-form')[0].reset();
//         $('#update-modal').modal('hide');
//     });
//
//     //修改弹窗里点击提交按钮
//     $('#update-submit-btn').click(function () {
//         var msg = confirm("确认要修改吗？");
//
//         // var js = parseFloat(document.getElementById('update-js').value);
//         // var zl = parseFloat(document.getElementById('update-zl').value);
//         // var dj = parseFloat(document.getElementById('update-dj').value);
//         // var je = js * zl * dj
//         // document.getElementById("update-je").value = je
// //         var jgf = js * 0.5
// //         document.getElementById("update-jgf").value = jgf
// //
// // // ---------------
// //         var js = parseFloat(document.getElementById('update-js').value);
// //         var dj = parseFloat(document.getElementById('update-dj').value);
// //         var zl = parseFloat(document.getElementById('update-zl').value);
// //         // var zje = rksl * rkdj * rkzl
// //         var je = js * dj
// //         document.getElementById("update-je").value = je
// //
// //         var d1 = document.getElementById('update-mc').value;
// //         var d2 = document.getElementById('update-js').value;
// //         var d3 = document.getElementById('update-je').value;
// //         var d4 = document.getElementById('update-zl').value;
// //         var d5 = document.getElementById('update-dh').value;
// //         var d6 = document.getElementById('id').value;
// //         var d7 = document.getElementById('update-dj').value;
// // // -------------
// //
// //         if (parseFloat(document.getElementById('update-sd').value) != 0 ){
// //             var hsdj = parseFloat(document.getElementById('update-hsdj').value);
// //             var sd = parseFloat(document.getElementById('update-sd').value);
// //             var whsdj = hsdj / sd
// //             var aa= whsdj.toFixed(2)
// //             document.getElementById("update-whsdj").value = aa
// //         }
//
//         if (msg) {
//             if (checkForm('#update-form')) {
//                 let params = formToJson('#update-form');
//                 $ajax({
//                     type: 'post',
//                     url: '/xsd/update',
//                     data: {
//                         updateJson: JSON.stringify(params)
//                     },
//                     dataType: 'json',
//                     contentType: 'application/json;charset=utf-8'
//                 }, false, '', function (res) {
//                     if (res.code == 200) {
//                         swal("", res.msg, "success");
//                         // $('#update-close-btn').click();
//                         // $('#update-modal').modal('hide');
//                         // getList();
//                     } else {
//                         swal("", res.msg, "error");
//                     }
//                 })
//
// // -----------
//                 $ajax({
//                     type: 'post',
//                     url: '/mx/queryListMingxi1',
//                     data: {
//                         dh: d5,
//                         id: d6,
//                         mc: d1,
//                         js: d2,
//                         zl:d4,
//                         je:d3,
//                         dj:d7,
//
//                     }
//                 }, true, '', function (res) {
//                     if (res.code == 200) {
//                         // setTable(res.data);
//                         console.log(res.data)
//                         getList();
//                     }
//                 })
//
//             }
//         }
//     });
//
//     $('#update1-btn').click(function () {
//         const inputs = document.querySelectorAll('#tbupd input');
//         inputs.forEach(function(input) {
//             input.disabled = true;
//         });
//
//         let rows = getTableSelection('#xsdTable');
//         if (rows.length > 1 || rows.length == 0) {
//             swal('请选择一条数据修改!');
//             return;
//         }
//         $('#update1-modal').modal('show');
//
//         var dh = rows[0].data.dh;
//         $ajax({
//             type: 'post',
//             url: '/xsd/getList2',
//             data:{
//                 dh:dh
//             }
//         }, false, '', function (res) {
//             if (res.code == 200) {
//                 if(res.data.length==1){
//                     document.getElementById("tq1").hidden=true
//                     document.getElementById("tq2").hidden=true
//                     document.getElementById("tq3").hidden=true
//                     document.getElementById("tq4").hidden=true
//                     document.getElementById("tq5").hidden=true
//                     document.getElementById("tq6").hidden=true
//                     document.getElementById("tq7").hidden=true
//                     document.getElementById("tq8").hidden=true
//                     document.getElementById("tq9").hidden=true
//                     document.getElementById("tq10").hidden=true
//                     // document.getElementById("t11").hidden=true
//                     document.getElementById("t12").hidden=true
//                     document.getElementById("t13").hidden=true
//                     document.getElementById("t14").hidden=true
//                     document.getElementById("t15").hidden=true
//                     document.getElementById("t16").hidden=true
//                     document.getElementById("t17").hidden=true
//                     document.getElementById("t18").hidden=true
//                     document.getElementById("t19").hidden=true
//                     document.getElementById("t20").hidden=true
//                 }else if(res.data.length==2){
//                     document.getElementById("tq1").hidden=true
//                     document.getElementById("tq2").hidden=true
//                     document.getElementById("tq3").hidden=true
//                     document.getElementById("tq4").hidden=true
//                     document.getElementById("tq5").hidden=true
//                     document.getElementById("tq6").hidden=true
//                     document.getElementById("tq7").hidden=true
//                     document.getElementById("tq8").hidden=true
//                     document.getElementById("tq9").hidden=true
//                     document.getElementById("tq10").hidden=true
//                     // document.getElementById("t11").hidden=true
//                     // document.getElementById("t12").hidden=true
//                     document.getElementById("t13").hidden=true
//                     document.getElementById("t14").hidden=true
//                     document.getElementById("t15").hidden=true
//                     document.getElementById("t16").hidden=true
//                     document.getElementById("t17").hidden=true
//                     document.getElementById("t18").hidden=true
//                     document.getElementById("t19").hidden=true
//                     document.getElementById("t20").hidden=true
//                 }else if(res.data.length==3){
//                     document.getElementById("tq1").hidden=true
//                     document.getElementById("tq2").hidden=true
//                     document.getElementById("tq3").hidden=true
//                     document.getElementById("tq4").hidden=true
//                     document.getElementById("tq5").hidden=true
//                     document.getElementById("tq6").hidden=true
//                     document.getElementById("tq7").hidden=true
//                     document.getElementById("tq8").hidden=true
//                     document.getElementById("tq9").hidden=true
//                     document.getElementById("tq10").hidden=true
//                     // document.getElementById("t11").hidden=true
//                     // document.getElementById("t12").hidden=true
//                     // document.getElementById("t13").hidden=true
//                     document.getElementById("t14").hidden=true
//                     document.getElementById("t15").hidden=true
//                     document.getElementById("t16").hidden=true
//                     document.getElementById("t17").hidden=true
//                     document.getElementById("t18").hidden=true
//                     document.getElementById("t19").hidden=true
//                     document.getElementById("t20").hidden=true
//                 }else if(res.data.length==4){
//                     document.getElementById("tq1").hidden=true
//                     document.getElementById("tq2").hidden=true
//                     document.getElementById("tq3").hidden=true
//                     document.getElementById("tq4").hidden=true
//                     document.getElementById("tq5").hidden=true
//                     document.getElementById("tq6").hidden=true
//                     document.getElementById("tq7").hidden=true
//                     document.getElementById("tq8").hidden=true
//                     document.getElementById("tq9").hidden=true
//                     document.getElementById("tq10").hidden=true
//                     // document.getElementById("t11").hidden=true
//                     // document.getElementById("t12").hidden=true
//                     // document.getElementById("t13").hidden=true
//                     // document.getElementById("t14").hidden=true
//                     document.getElementById("t15").hidden=true
//                     document.getElementById("t16").hidden=true
//                     document.getElementById("t17").hidden=true
//                     document.getElementById("t18").hidden=true
//                     document.getElementById("t19").hidden=true
//                     document.getElementById("t20").hidden=true
//                 }else if(res.data.length==5){
//                     document.getElementById("tq1").hidden=true
//                     document.getElementById("tq2").hidden=true
//                     document.getElementById("tq3").hidden=true
//                     document.getElementById("tq4").hidden=true
//                     document.getElementById("tq5").hidden=true
//                     document.getElementById("tq6").hidden=true
//                     document.getElementById("tq7").hidden=true
//                     document.getElementById("tq8").hidden=true
//                     document.getElementById("tq9").hidden=true
//                     document.getElementById("tq10").hidden=true
//                     // document.getElementById("t11").hidden=true
//                     // document.getElementById("t12").hidden=true
//                     // document.getElementById("t13").hidden=true
//                     // document.getElementById("t14").hidden=true
//                     // document.getElementById("t15").hidden=true
//                     document.getElementById("t16").hidden=true
//                     document.getElementById("t17").hidden=true
//                     document.getElementById("t18").hidden=true
//                     document.getElementById("t19").hidden=true
//                     document.getElementById("t20").hidden=true
//                 }else if(res.data.length==6){
//                     document.getElementById("tq1").hidden=true
//                     document.getElementById("tq2").hidden=true
//                     document.getElementById("tq3").hidden=true
//                     document.getElementById("tq4").hidden=true
//                     document.getElementById("tq5").hidden=true
//                     document.getElementById("tq6").hidden=true
//                     document.getElementById("tq7").hidden=true
//                     document.getElementById("tq8").hidden=true
//                     document.getElementById("tq9").hidden=true
//                     document.getElementById("tq10").hidden=true
//                     // document.getElementById("t11").hidden=true
//                     // document.getElementById("t12").hidden=true
//                     // document.getElementById("t13").hidden=true
//                     // document.getElementById("t14").hidden=true
//                     // document.getElementById("t15").hidden=true
//                     // document.getElementById("t16").hidden=true
//                     document.getElementById("t17").hidden=true
//                     document.getElementById("t18").hidden=true
//                     document.getElementById("t19").hidden=true
//                     document.getElementById("t20").hidden=true
//                 }else if(res.data.length==7){
//                     document.getElementById("tq1").hidden=true
//                     document.getElementById("tq2").hidden=true
//                     document.getElementById("tq3").hidden=true
//                     document.getElementById("tq4").hidden=true
//                     document.getElementById("tq5").hidden=true
//                     document.getElementById("tq6").hidden=true
//                     document.getElementById("tq7").hidden=true
//                     document.getElementById("tq8").hidden=true
//                     document.getElementById("tq9").hidden=true
//                     document.getElementById("tq10").hidden=true
//                     // document.getElementById("t11").hidden=true
//                     // document.getElementById("t12").hidden=true
//                     // document.getElementById("t13").hidden=true
//                     // document.getElementById("t14").hidden=true
//                     // document.getElementById("t15").hidden=true
//                     // document.getElementById("t16").hidden=true
//                     // document.getElementById("t17").hidden=true
//                     document.getElementById("t18").hidden=true
//                     document.getElementById("t19").hidden=true
//                     document.getElementById("t20").hidden=true
//                 }else if(res.data.length==8){
//                     document.getElementById("tq1").hidden=true
//                     document.getElementById("tq2").hidden=true
//                     document.getElementById("tq3").hidden=true
//                     document.getElementById("tq4").hidden=true
//                     document.getElementById("tq5").hidden=true
//                     document.getElementById("tq6").hidden=true
//                     document.getElementById("tq7").hidden=true
//                     document.getElementById("tq8").hidden=true
//                     document.getElementById("tq9").hidden=true
//                     document.getElementById("tq10").hidden=true
//                     // document.getElementById("t11").hidden=true
//                     // document.getElementById("t12").hidden=true
//                     // document.getElementById("t13").hidden=true
//                     // document.getElementById("t14").hidden=true
//                     // document.getElementById("t15").hidden=true
//                     // document.getElementById("t16").hidden=true
//                     // document.getElementById("t17").hidden=true
//                     // document.getElementById("t18").hidden=true
//                     document.getElementById("t19").hidden=true
//                     document.getElementById("t20").hidden=true
//                 }else if(res.data.length==9){
//                     document.getElementById("tq1").hidden=true
//                     document.getElementById("tq2").hidden=true
//                     document.getElementById("tq3").hidden=true
//                     document.getElementById("tq4").hidden=true
//                     document.getElementById("tq5").hidden=true
//                     document.getElementById("tq6").hidden=true
//                     document.getElementById("tq7").hidden=true
//                     document.getElementById("tq8").hidden=true
//                     document.getElementById("tq9").hidden=true
//                     document.getElementById("tq10").hidden=true
//                     // document.getElementById("t11").hidden=true
//                     // document.getElementById("t12").hidden=true
//                     // document.getElementById("t13").hidden=true
//                     // document.getElementById("t14").hidden=true
//                     // document.getElementById("t15").hidden=true
//                     // document.getElementById("t16").hidden=true
//                     // document.getElementById("t17").hidden=true
//                     // document.getElementById("t18").hidden=true
//                     // document.getElementById("t19").hidden=true
//                     document.getElementById("t20").hidden=true
//                 }
//                 else if(res.data.length==10){
//                     document.getElementById("tq1").hidden=true
//                     document.getElementById("tq2").hidden=true
//                     document.getElementById("tq3").hidden=true
//                     document.getElementById("tq4").hidden=true
//                     document.getElementById("tq5").hidden=true
//                     document.getElementById("tq6").hidden=true
//                     document.getElementById("tq7").hidden=true
//                     document.getElementById("tq8").hidden=true
//                     document.getElementById("tq9").hidden=true
//                     document.getElementById("tq10").hidden=true
//                 }
//                 document.getElementById("update1-shdw").value = res.data[0].shdw;
//                 document.getElementById("update1-kddh").value = res.data[0].kddh;
//                 document.getElementById("update1-riqi").value = res.data[0].riqi;
//                 document.getElementById("update1-dh").value = res.data[0].dh;
//                 document.getElementById("update1-xuhao").value = 1;
//                 document.getElementById("update1-mc").value = res.data[0].mc;
//                 // document.getElementById("update1-mc").value = "ava";
//                 document.getElementById("update1-gg").value = res.data[0].gg;
//                 document.getElementById("update1-mh").value = res.data[0].mh;
//                 document.getElementById("update1-zl").value = res.data[0].zl;
//                 document.getElementById("update1-dj").value = res.data[0].dj;
//                 document.getElementById("update1-js").value = res.data[0].js;
//                 document.getElementById("update1-je").value = res.data[0].je;
//                 document.getElementById("update1-bz").value = res.data[0].bz;
//                 document.getElementById("update1-kdf").value = res.data[0].kdf;
//                 document.getElementById("update1-sd").value = res.data[0].sd;
//                 document.getElementById("update1-sfhs").value = res.data[0].sfhs;
//                 document.getElementById("update1-sfyj").value = res.data[0].sfyj;
//                 document.getElementById("id").value = res.data[0].id;
//                 // document.getElementById("update1-hjzl").value = res.data[0].hjzl;
//                 var zl=res.data[0].zl;
//                 var kdf =res.data[0].kdf;
//                 // if (res.data.sfhs=="含税"||res.data.sfhs=="金额含税"){
//                 //     var sd = res.data[0].sd;
//                 //     HJZL=HJZL+parseFloat(zl);
//                 // }
//                 HJZL=HJZL+parseFloat(zl)
//                 document.getElementById("update1-hsdj").value = res.data[0].hsdj;
//                 // var dj=res.data[0].dj;
//                 // HSDJ=HSDJ+parseFloat(dj);
//                 // document.getElementById("update1-hjje").value = res.data[0].hjje;
//                 var je=res.data[0].je;
//                 HJJE=HJJE+parseFloat(je);
//                 document.getElementById("update1-fkfs").value = res.data[0].fkfs;
//                 document.getElementById("update1-gd").value = res.data[0].gd;
//                 document.getElementById("update1-zdr").value = res.data[0].zdr;
//                 document.getElementById("update1-bzld").value = res.data[0].bzld;
//
//                 for (var n = 1; n < res.data.length; n++) {
//                     index++;
//                     document.getElementById("update1-xuhao" + n).value = index;
//                     document.getElementById("update1-mc" + n).value = res.data[n].mc;
//                     // document.getElementById("update1-mc"+n).value = "ava";
//                     document.getElementById("update1-gg" + n).value = res.data[n].gg;
//                     if(res.data[n].mh==null){
//                         document.getElementById("update1-mh" + n).value ="";
//                     }else {
//                         document.getElementById("update1-mh" + n).value = res.data[n].mh;
//                     }
//                     document.getElementById("update1-zl" + n).value = res.data[n].zl;
//                     var zl=res.data[i].zl;
//                     HJZL=HJZL+parseFloat(zl);
//                     document.getElementById("update1-dj" + n).value = res.data[n].dj;
//                     // var dj=res.data[i].dj;
//                     // HJZL=HJZL+parseFloat(dj);
//                     document.getElementById("update1-js" + n).value = res.data[n].js;
//                     document.getElementById("update1-je" + n).value = res.data[n].je;
//                     var je=res.data[i].je;
//                     HJJE=HJJE+parseFloat(je);
//                     document.getElementById("update1-bz" + n).value = res.data[n].bz;
//                 }
//                 document.getElementById("update1-hjzl").value = HJZL.toString();
//                 // document.getElementById("update1-hsdj").value =toString(HSDJ);
//                 document.getElementById("update1-hjje").value = HJJE.toString();
//                 document.getElementById("id"+n).value = res.data[n].id;
//             }
//         })
//         //未含税锁定
//         // document.getElementById('update1-sfhs').addEventListener('change', function() {
//         //     var selectedOption = this.value;
//         //     var textBoxes = document.querySelectorAll('input[type="text"]');
//         //     // 根据选择的option值锁定对应的文本框
//         //     if (selectedOption === '未含税') {
//         //         document.getElementById('update1-hsdj').disabled = true;
//         //         document.getElementById('update1-sd').disabled = true;
//         //         document.getElementById('update1-whsdj').disabled = false;
//         //     }else{
//         //         document.getElementById('update1-whsdj').disabled = true;
//         //         document.getElementById('update1-hsdj').disabled = false;
//         //         document.getElementById('update1-sd').disabled = false;
//         //     }
//         // });
//     });
//     //修改弹窗点击关闭按钮
//     $('#update1-close-btn').click(function () {
//         // $('#update-form')[0].reset();
//         $('#update1-modal').modal('hide');
//     });
//
//     //修改弹窗里点击提交按钮
//     $('#update1-submit-btn').click(function () {
//         // var msg = confirm("确认要修改吗？");
//         //
//         // var js = parseFloat(document.getElementById('update1-js').value);
//         // var zl = parseFloat(document.getElementById('update1-zl').value);
//         // var dj = parseFloat(document.getElementById('update1-dj').value);
//         // var je = js * zl * dj
//         // document.getElementById("update1-je").value = je
//         //
//         // if (parseFloat(document.getElementById('update1-sd').value) != 0) {
//         //     var hsdj = parseFloat(document.getElementById('update1-hsdj').value);
//         //     var sd = parseFloat(document.getElementById('update1-sd').value);
//         //     var whsdj = hsdj / sd
//         //     document.getElementById("update1-whsdj").value = whsdj
//         // }
//         //
//         // if (msg) {
//         //     if (checkForm('#update1-form')) {
//         //         let params = formToJson('#update1-form');
//         //         $ajax({
//         //             type: 'post',
//         //             url: '/xsd/add',
//         //             data: {
//         //                 update1Json: JSON.stringify(params)
//         //             },
//         //             dataType: 'json',
//         //             contentType: 'application/json;charset=utf-8'
//         //         }, false, '', function (res) {
//         //             if (res.code == 200) {
//         //                 swal("", res.msg, "success");
//         //                 $('#update1-close-btn').click();
//         //                 $('#update1-modal').modal('hide');
//         //                 getList();
//         //             } else {
//         //                 swal("", res.msg, "error");
//         //             }
//         //         })
//         //     }
//         // }
//
//         // var js = parseFloat(document.getElementById('update1-js').value);
//         // var zl = parseFloat(document.getElementById('update1-zl').value);
//         // var dj = parseFloat(document.getElementById('update1-dj').value);
//         // var je = js * zl * dj
//         // var hjzl = zl;
//         // document.getElementById("update1-je").value = je
//         // var jgf = js * 0.5
//         // document.getElementById("update1-jgf").value = jgf
//         // var kdf = document.getElementById("update1-kdf").value;
//         // var hjje = jgf +je+kdf;
//         // if (parseFloat(document.getElementById('update1-sd').value) != 0 ){
//         //     var hsdj = parseFloat(document.getElementById('update1-hsdj').value);
//         //     var sd = parseFloat(document.getElementById('update1-sd').value);
//         //     var whsdj = hsdj / sd
//         //     var aa = whsdj.toFixed(2)
//         //     document.getElementById("update1-whsdj").value = aa
//         // }
//         for (i = 0; i < 20; i++) {
//             if (i == 0) {
//                 var mc = document.getElementById("update1-mc").value;
//                 var mh = document.getElementById("update1-mh").value;
//                 var gg = document.getElementById("update1-gg").value;
//                 var js = document.getElementById("update1-js").value;
//                 var zl = document.getElementById("update1-zl").value;
//                 var dj = document.getElementById("update1-dj").value;
//                 var dh = document.getElementById("update1-dh").value;
//                 // var je = document.getElementById("update1-je").value;
//                 var bz = document.getElementById("update1-bz").value;
//                 var id = document.getElementById("id").value;
//             } else {
//                 var mc = document.getElementById("update1-mc" + i).value;
//                 var mh = document.getElementById("update1-mh" + i).value;
//                 var gg = document.getElementById("update1-gg" + i).value;
//                 var js = document.getElementById("update1-js" + i).value;
//                 var zl = document.getElementById("update1-zl" + i).value;
//                 var dj = document.getElementById("update1-dj" + i).value;
//                 // var je = document.getElementById("update1-je"+i).value;
//                 var bz = document.getElementById("update1-bz" + i).value;
//                 var id = document.getElementById("id"+i).value;
//                 if(id==""){
//                     break;
//                 }
//             }
//             var riqi = $('#update1-riqi').val();
//             var dh = $('#update1-dh').val();
//             var shdw = $('#update1-shdw').val();
//             var shdz = $('#update1-shdz').val();
//             var kddh = $('#update1-kddh').val();
//             var sfyj = $('#update1-sfyj').val();
//             var fkfs = $('#update1-fkfs').val();
//             var sfhs = $('#update1-sfhs').val();
//             var gd = $('#update1-gd').val();
//             var zdr = $('#update1-zdr').val();
//             var kdf = $('#update1-kdf').val();
//             var sd = $('#update1-sd').val();
//             var bzld = $('#update1-bzld').val();
//
//             $ajax({
//                 type: 'post',
//                 url: '/xsd/update',
//                 data: {
//                     riqi: riqi,
//                     dh: dh,
//                     mc: mc,
//                     mh: mh,
//                     gg: gg,
//                     js: js,
//                     zl: zl,
//                     dj: dj,
//                     shdw: shdw,
//                     bz: bz,
//                     kdf: kdf,
//                     sd: sd,
//                     zdr: zdr,
//                     gd: gd,
//                     sfhs: sfhs,
//                     sfyj: sfyj,
//                     kddh: kddh,
//                     shdz: shdz,
//                     fkfs: fkfs,
//                     shdz: shdz,
//                     bzld: bzld,
//                     id:id
//                 },
//
//             }, false, '', function (res) {
//                 if (res.code == 200) {
//                     swal("", res.msg, "success");
//                     $('#update1-form')[0].reset();
//                     getList();
//                     $('#update1-close-btn').click();
//                 }
//             })
//
//         }
//     })
//     // $('#update-submit-btn').click(function () {
//     //
//     //     var js = parseFloat(document.getElementById('update-js').value);
//     //     var dj = parseFloat(document.getElementById('update-dj').value);
//     //     var zl = parseFloat(document.getElementById('update-zl').value);
//     //     // var zje = rksl * rkdj * rkzl
//     //     var je = js * dj
//     //     document.getElementById("update-je").value = je
//     //
//     //     var d1 = document.getElementById('update-mc').value;
//     //     var d2 = document.getElementById('update-js').value;
//     //     var d3 = document.getElementById('update-je').value;
//     //     var d4 = document.getElementById('update-zl').value;
//     //     var d5 = document.getElementById('update-dh').value;
//     //     var d6 = document.getElementById('id').value;
//     //     var d7 = document.getElementById('update-dj').value;
//     //
//     //     var msg = confirm("确认保存吗？");
//     //     if (msg) {
//     //         $ajax({
//     //             type: 'post',
//     //             url: '/mx/queryListMingxi1',
//     //             data: {
//     //                 dh: d5,
//     //                 id: d6,
//     //                 mc: d1,
//     //                 js: d2,
//     //                 zl:d4,
//     //                 je:d3,
//     //                 dj:d7,
//     //
//     //             }
//     //         }, true, '', function (res) {
//     //             if (res.code == 200) {
//     //                 // setTable(res.data);
//     //                 console.log(res.data)
//     //             }
//     //         })
//     //     }
//     // });
//
//     //点击删除按钮
//     $('#delete-btn').click(function () {
//         var msg = confirm("确认要删除吗？");
//         if (msg) {
//             let rows = getTableSelection("#xsdTable");
//             if (rows.length == 0) {
//                 swal('请选择要删除的数据！');
//                 return;
//             }
//             var dh = rows[0].data.dh;
//             $ajax({
//                 type: 'post',
//                 url: '/xsd/delete1',
//                 data:{
//                     dh:dh
//                 },
//
//             }, false, '', function (res) {
//                 if (res.code == 200) {
//                     swal("", res.msg, "success");
//                     getList();
//                 } else {
//                     swal("", res.msg, "error");
//                 }
//             })
//         }
//     })
// });
//
// function setTable(data) {
//     if ($('#xsdTable').html != '') {
//         $('#xsdTable').bootstrapTable('load', data);
//     }
//
//     $('#xsdTable').bootstrapTable({
//         data: data,
//         sortStable: true,
//         classes: 'table table-hover text-nowrap table table-bordered',
//         idField: 'id',
//         pagination: true,
//         pageSize: 15,//单页记录数
//         clickToSelect: true,
//         locale: 'zh-CN',
//         toolbar: '#table-toolbar',
//         toolbarAlign: 'left',
//         theadClasses: "thead-light",//这里设置表头样式
//         style:'table-layout:fixed',
//         columns: [
//             {
//                 field: '',
//                 title: '序号',
//                 align: 'center',
//                 width: 50,
//                 formatter: function (value, row, index) {
//                     return index + 1;
//                 }
//             }, {
//                 field: 'riqi',
//                 title: '日期',
//                 align: 'center',
//                 sortable: true,
//                 width: 80,
//             }, {
//                 field: 'dh',
//                 title: '单号',
//                 align: 'center',
//                 sortable: true,
//                 width: 80,
//             }, {
//                 field: 'shdw',
//                 title: '收货单位',
//                 align: 'center',
//                 sortable: true,
//                 width: 130,
//             }
//             // , {
//             //     field: 'mc',
//             //     title: '名称',
//             //     align: 'center',
//             //     sortable: true,
//             //     width: 80,
//             // }, {
//             //     field: 'mh',
//             //     title: '模号',
//             //     align: 'center',
//             //     sortable: true,
//             //     width: 80,
//             // }, {
//             //     field: 'gg',
//             //     title: '规格',
//             //     align: 'center',
//             //     sortable: true,
//             //     width: 80,
//             // }, {
//             //     field: 'js',
//             //     title: '件数',
//             //     align: 'center',
//             //     sortable: true,
//             //     width: 80,
//             // }, {
//             //     field: 'zl',
//             //     title: '重量',
//             //     align: 'center',
//             //     sortable: true,
//             //     width: 80,
//             // }, {
//             //     field: 'dj',
//             //     title: '单价',
//             //     align: 'center',
//             //     sortable: true,
//             //     width: 80,
//             // }, {
//             //     field: 'je',
//             //     title: '金额',
//             //     align: 'center',
//             //     sortable: true,
//             //     width: 80,
//             //     // formatter: function (value, row, index) {
//             //     //     for(i=0;i<row.index;i++){
//             //     //         document.getElementById('zje').value = row[i].je++;
//             //     //     }
//             //     // }
//             // }, {
//             //     field: 'bz',
//             //     title: '备注',
//             //     align: 'center',
//             //     sortable: true,
//             //     width: 150,
//             // }
//             , {
//                 field: 'shdz',
//                 title: '收货地址',
//                 align: 'center',
//                 sortable: true,
//                 width: 150,
//             }, {
//                 field: 'kddh',
//                 title: '快递单号',
//                 align: 'center',
//                 sortable: true,
//                 width: 100,
//             }, {
//                 field: 'sfyj',
//                 title: '是否月结',
//                 align: 'center',
//                 sortable: true,
//                 width: 100,
//             }, {
//                 field: 'fkfs',
//                 title: '付款方式',
//                 align: 'center',
//                 sortable: true,
//                 width: 100,
//             }, {
//                 field: 'sfhs',
//                 title: '是否含税',
//                 align: 'center',
//                 sortable: true,
//                 width: 100,
//             }, {
//                 field: 'gd',
//                 title: '跟单',
//                 align: 'center',
//                 sortable: true,
//                 width: 80,
//             }, {
//                 field: 'zdr',
//                 title: '制单人',
//                 align: 'center',
//                 sortable: true,
//                 width: 80,
//             }
//             , {
//                 field: 'shdwjjsr',
//                 title: '收货单位及经手人',
//                 align: 'center',
//                 sortable: true,
//                 width: 150,
//             }, {
//                 field: 'jgf',
//                 title: '锯工费',
//                 align: 'center',
//                 sortable: true,
//                 width: 80,
//             }, {
//                 field: 'kdf',
//                 title: '快递费',
//                 align: 'center',
//                 sortable: true,
//                 width: 80,
//             }, {
//                 field: 'hsdj',
//                 title: '含税单价',
//                 align: 'center',
//                 sortable: true,
//                 width: 100,
//             }, {
//                 field: 'sd',
//                 title: '税点',
//                 align: 'center',
//                 sortable: true,
//                 width: 80,
//             }, {
//                 field: 'whsdj',
//                 title: '未含税单价',
//                 align: 'center',
//                 sortable: true,
//                 width: 130,
//             }, {
//                 field: 'bz',
//                 title: '备注',
//                 align: 'center',
//                 sortable: true,
//                 width: 150,
//             }
//         ],
//         onClickRow: function (row, el) {
//             let isSelect = $(el).hasClass('selected')
//             if (isSelect) {
//                 $(el).removeClass('selected')
//             } else {
//                 $(el).addClass('selected')
//             }
//         }
//     })
// }
//
//
// function setTable2(data) {
//     if ($('#xsdTable2').html != '') {
//         $('#xsdTable2').bootstrapTable('load', data);
//     }
//
//     $('#xsdTable2').bootstrapTable({
//         data: data,
//         sortStable: true,
//         classes: 'table table-hover text-nowrap table table-bordered',
//         idField: 'id',
//         pagination: true,
//         pageSize: 15,//单页记录数
//         clickToSelect: true,
//         locale: 'zh-CN',
//         toolbarAlign: 'left',
//         theadClasses: "thead-light",//这里设置表头样式
//         style:'table-layout:fixed',
//         columns: [
//             {
//                 field: '',
//                 title: '序号',
//                 align: 'center',
//                 width: 50,
//                 formatter: function (value, row, index) {
//                     return index + 1;
//                 }
//             }, {
//                 field: 'riqi',
//                 title: '日期',
//                 align: 'center',
//                 sortable: true,
//                 width: 80,
//             }, {
//                 field: 'dh',
//                 title: '单号',
//                 align: 'center',
//                 sortable: true,
//                 width: 80,
//             }, {
//                 field: 'shdw',
//                 title: '收货单位',
//                 align: 'center',
//                 sortable: true,
//                 width: 130,
//             }
//             // , {
//             //     field: 'mc',
//             //     title: '名称',
//             //     align: 'center',
//             //     sortable: true,
//             //     width: 80,
//             // }, {
//             //     field: 'mh',
//             //     title: '模号',
//             //     align: 'center',
//             //     sortable: true,
//             //     width: 80,
//             // }, {
//             //     field: 'gg',
//             //     title: '规格',
//             //     align: 'center',
//             //     sortable: true,
//             //     width: 80,
//             // }, {
//             //     field: 'js',
//             //     title: '件数',
//             //     align: 'center',
//             //     sortable: true,
//             //     width: 80,
//             // }, {
//             //     field: 'zl',
//             //     title: '重量',
//             //     align: 'center',
//             //     sortable: true,
//             //     width: 80,
//             // }, {
//             //     field: 'dj',
//             //     title: '单价',
//             //     align: 'center',
//             //     sortable: true,
//             //     width: 80,
//             // }, {
//             //     field: 'je',
//             //     title: '金额',
//             //     align: 'center',
//             //     sortable: true,
//             //     width: 80,
//             //     // formatter: function (value, row, index) {
//             //     //     for(i=0;i<row.index;i++){
//             //     //         document.getElementById('zje').value = row[i].je++;
//             //     //     }
//             //     // }
//             // }, {
//             //     field: 'bz',
//             //     title: '备注',
//             //     align: 'center',
//             //     sortable: true,
//             //     width: 150,
//             // }
//             , {
//                 field: 'shdz',
//                 title: '收货地址',
//                 align: 'center',
//                 sortable: true,
//                 width: 150,
//             }, {
//                 field: 'kddh',
//                 title: '快递单号',
//                 align: 'center',
//                 sortable: true,
//                 width: 100,
//             }, {
//                 field: 'sfyj',
//                 title: '是否月结',
//                 align: 'center',
//                 sortable: true,
//                 width: 100,
//             }, {
//                 field: 'fkfs',
//                 title: '付款方式',
//                 align: 'center',
//                 sortable: true,
//                 width: 100,
//             }, {
//                 field: 'sfhs',
//                 title: '是否含税',
//                 align: 'center',
//                 sortable: true,
//                 width: 100,
//             }, {
//                 field: 'gd',
//                 title: '跟单',
//                 align: 'center',
//                 sortable: true,
//                 width: 80,
//             }, {
//                 field: 'zdr',
//                 title: '制单人',
//                 align: 'center',
//                 sortable: true,
//                 width: 80,
//             }, {
//                 field: 'shdwjjsr',
//                 title: '收货单位及经手人',
//                 align: 'center',
//                 sortable: true,
//                 width: 150,
//             }, {
//                 field: 'jgf',
//                 title: '锯工费',
//                 align: 'center',
//                 sortable: true,
//                 width: 80,
//             }, {
//                 field: 'kdf',
//                 title: '快递费',
//                 align: 'center',
//                 sortable: true,
//                 width: 80,
//             }, {
//                 field: 'hsdj',
//                 title: '含税单价',
//                 align: 'center',
//                 sortable: true,
//                 width: 100,
//             }, {
//                 field: 'sd',
//                 title: '税点',
//                 align: 'center',
//                 sortable: true,
//                 width: 80,
//             }, {
//                 field: 'whsdj',
//                 title: '未含税单价',
//                 align: 'center',
//                 sortable: true,
//                 width: 130,
//             }, {
//                 field: 'bz',
//                 title: '备注',
//                 align: 'center',
//                 sortable: true,
//                 width: 150,
//             }
//         ],
//         onClickRow: function (row, el) {
//             let isSelect = $(el).hasClass('selected')
//             if (isSelect) {
//                 $(el).removeClass('selected')
//             } else {
//                 $(el).addClass('selected')
//             }
//         }
//     })
// }
// var idd;
// let count = 1;
// var ziduan="出库";
// function getGsm() {
//     $ajax({
//         type: 'post',
//         url: '/khzl/hqxlGsm',
//     }, false, '', function (res) {
//         if (res.code == 200) {
//             for (var i = 0; i < res.data.length; i++) {
//                 $("#add-shdw").append("<option>" + res.data[i].gsm + "</option>");
//                 $("#update-shdw").append("<option>" + res.data[i].gsm + "</option>");
//             }
//         }
//     })
// }
//
// function getList() {
//     // $('#ksrq').val("");
//     // $('#jsrq').val("");
//
//     var  date = new Date();
//     date.setMonth(date.getMonth()-3);
//     var year = date.getFullYear();
//     var month = ('0'+(date.getMonth()+1)).slice(-2);
//     var day = ('0'+date.getDate()).slice(-2);
//     var ks = year+'-'+month+'-'+day
//     document.getElementById("ksrq").value = ks;
//     var jsyear = date.getFullYear();
//     var jsmonth = ('0'+(date.getMonth()+4)).slice(-2);
//     var jsday = ('0'+date.getDate()).slice(-2);
//     var js = jsyear+'-'+jsmonth+'-'+jsday
//     document.getElementById("jsrq").value = js;
//
//     $ajax({
//         type: 'post',
//         url: '/xsd/getList',
//     }, false, '', function (res) {
//         if (res.code == 200) {
//             setTable(res.data);
//             $("#xsdTable").colResizable({
//                 liveDrag: true,
//                 gripInnerHtml: "<div class='grip'></div>",
//                 draggingClass: "dragging",
//                 resizeMode: 'fit'
//             });
//             var table = document.getElementById("xsdTable");
//             var rows = table.rows;
//             var cells = table.cells;
//             var colums = table.rows[0].cells.length;
//             for(var x=1;x<colums;x++){
//                 var zje = 0;
//                 for(var j = 1;j<rows.length-1;j++){
//                     var a = parseInt(rows[j].cells[10].innerHTML);
//                     zje = zje+a
//                 }
//                 document.getElementById('zje').value = zje
//             }
//
//             for(var q=1;q<colums;q++){
//                 var jgf = 0;
//                 for(var w = 1;w<rows.length-1;w++){
//                     var b = parseInt(rows[w].cells[20].innerHTML);
//                     jgf = jgf+b
//                 }
//                 document.getElementById('add-jgf').value = jgf
//             }
//             for (i=0;i<=res.data.id;i++){
//                 idd=i;
//             }
//         }
//     })
// }

var idd;
let count = 1;
// let n = 0;
let index = 0;
var ziduan="出库";
var HJDJ=0;
var HJJE=0;
var HJZL=0;
function getGsm() {
    $ajax({
        type: 'post',
        url: '/khzl/hqxlGsm',
    }, false, '', function (res) {
        if (res.code == 200) {
            for (var i = 0; i < res.data.length; i++) {
                $("#add-shdw").append("<option>" + res.data[i].gsm + "</option>");
                $("#update-shdw").append("<option>" + res.data[i].gsm + "</option>");
                $("#update1-shdw").append("<option>" + res.data[i].gsm + "</option>");
            }
        }
    })
}
function qinkong(){
    $ajax({
        type: 'post',
        url: '/shdp/delete',
    })
}
function getMc() {
    $ajax({
        type: 'post',
        url: '/spmc/getList',
    }, false, '', function (res) {
        if (res.code == 200) {
            for (var i = 0; i < res.data.length; i++) {
                $("#add-mc").append("<option>" + res.data[i].mc + "</option>");
                $("#update-mc").append("<option>" + res.data[i].mc + "</option>");
                $("#update-mc1").append("<option>" + res.data[i].mc + "</option>");
                $("#update-mc2").append("<option>" + res.data[i].mc + "</option>");
                $("#update-mc3").append("<option>" + res.data[i].mc + "</option>");
                $("#update-mc4").append("<option>" + res.data[i].mc + "</option>");
                $("#update-mc5").append("<option>" + res.data[i].mc + "</option>");
                $("#update-mc6").append("<option>" + res.data[i].mc + "</option>");
                $("#update-mc7").append("<option>" + res.data[i].mc + "</option>");
                $("#update-mc8").append("<option>" + res.data[i].mc + "</option>");
                $("#update-mc9").append("<option>" + res.data[i].mc + "</option>");
                $("#update-mc10").append("<option>" + res.data[i].mc + "</option>");
                $("#update-mc11").append("<option>" + res.data[i].mc + "</option>");
                $("#update-mc12").append("<option>" + res.data[i].mc + "</option>");
                $("#update-mc13").append("<option>" + res.data[i].mc + "</option>");
                $("#update-mc14").append("<option>" + res.data[i].mc + "</option>");
                $("#update-mc15").append("<option>" + res.data[i].mc + "</option>");
                $("#update-mc16").append("<option>" + res.data[i].mc + "</option>");
                $("#update-mc17").append("<option>" + res.data[i].mc + "</option>");
                $("#update-mc18").append("<option>" + res.data[i].mc + "</option>");
                $("#update-mc19").append("<option>" + res.data[i].mc + "</option>");
                $("#update1-mc").append("<option>" + res.data[i].mc + "</option>");
                $("#update1-mc1").append("<option>" + res.data[i].mc + "</option>");
                $("#update1-mc2").append("<option>" + res.data[i].mc + "</option>");
                $("#update1-mc3").append("<option>" + res.data[i].mc + "</option>");
                $("#update1-mc4").append("<option>" + res.data[i].mc + "</option>");
                $("#update1-mc5").append("<option>" + res.data[i].mc + "</option>");
                $("#update1-mc6").append("<option>" + res.data[i].mc + "</option>");
                $("#update1-mc7").append("<option>" + res.data[i].mc + "</option>");
                $("#update1-mc8").append("<option>" + res.data[i].mc + "</option>");
                $("#update1-mc9").append("<option>" + res.data[i].mc + "</option>");
                $("#update1-mc10").append("<option>" + res.data[i].mc + "</option>");
                $("#update1-mc11").append("<option>" + res.data[i].mc + "</option>");
                $("#update1-mc12").append("<option>" + res.data[i].mc + "</option>");
                $("#update1-mc13").append("<option>" + res.data[i].mc + "</option>");
                $("#update1-mc14").append("<option>" + res.data[i].mc + "</option>");
                $("#update1-mc15").append("<option>" + res.data[i].mc + "</option>");
                $("#update1-mc16").append("<option>" + res.data[i].mc + "</option>");
                $("#update1-mc17").append("<option>" + res.data[i].mc + "</option>");
                $("#update1-mc18").append("<option>" + res.data[i].mc + "</option>");
                $("#update1-mc19").append("<option>" + res.data[i].mc + "</option>");
            }
        }
    })
}

function getList() {
    // $('#ksrq').val("");
    // $('#jsrq').val("");

    var  date = new Date();
    date.setMonth(date.getMonth()-3);
    var year = date.getFullYear();
    var month = ('0'+(date.getMonth()+1)).slice(-2);
    var day = ('0'+date.getDate()).slice(-2);
    var ks = year+'-'+month+'-'+day
    document.getElementById("ksrq").value = ks;
    var jsyear = date.getFullYear();
    var jsmonth = ('0'+(date.getMonth()+4)).slice(-2);
    var jsday = ('0'+date.getDate()).slice(-2);
    var js = jsyear+'-'+jsmonth+'-'+jsday
    document.getElementById("jsrq").value = js;

    $ajax({
        type: 'post',
        url: '/xsd/getList',
    }, false, '', function (res) {
        if (res.code == 200) {
            setTable(res.data);
            $("#xsdTable").colResizable({
                liveDrag: true,
                gripInnerHtml: "<div class='grip'></div>",
                draggingClass: "dragging",
                resizeMode: 'fit'
            });
            var table = document.getElementById("xsdTable");
            var rows = table.rows;
            var cells = table.cells;
            var colums = table.rows[0].cells.length;
            for(var x=1;x<colums;x++){
                var zje = 0;
                for(var j = 1;j<rows.length-1;j++){
                    var a = parseInt(rows[j].cells[10].innerHTML);
                    zje = zje+a
                }
                // document.getElementById('zje').value = zje
            }

            // for(var q=1;q<colums;q++){
            //     var jgf = 0;
            //     for(var w = 1;w<rows.length-1;w++){
            //         var b = parseInt(rows[w].cells[20].innerHTML);
            //         jgf = jgf+b
            //     }
            //     document.getElementById('add-jgf').value = jgf
            // }
            for (i=0;i<=res.data.id;i++){
                idd=i;
            }
        }
    })
}


function clearTable() {
    var inputs = document.querySelectorAll('#tbupd input');
    for (var i = 0; i < inputs.length; i++) {
        inputs[i].value = '';
    }
}








$(function () {
    getList();
    getGsm();
    getMc();
    var date = new Date();
    date.setMonth(date.getMonth()-3);
    var year = date.getFullYear();
    var month = ('0'+(date.getMonth()+1)).slice(-2);
    var day = ('0'+date.getDate()).slice(-2);
    var ks = year+'-'+month+'-'+day
    document.getElementById("ksrq").value = ks;
    var jsyear = date.getFullYear();
    var jsmonth = ('0'+(date.getMonth()+4)).slice(-2);
    var jsday = ('0'+date.getDate()).slice(-2);
    var js = jsyear+'-'+jsmonth+'-'+jsday
    document.getElementById("jsrq").value = js;

    $ajax({
        type: 'post',
        url: '/user/getName',
    }, false, '', function (res) {
        var this_name = res.data
        document.getElementById("dlm").innerText = this_name;
    })

    $('#select-btn').click(function () {
        var ksrq = $('#ksrq').val();
        var jsrq = $('#jsrq').val();
        var shdw = $('#shdw').val();
        $ajax({
            type: 'post',
            url: '/xsd/queryList',
            data: {
                ksrq: ksrq,
                jsrq: jsrq,
                shdw:shdw
            }
        }, true, '', function (res) {
            if (res.code == 200) {
                setTable(res.data);
            }
        })
    });

    //刷新
    $("#refresh-btn").click(function () {
        getList();
    });

    //点击新增按钮显示弹窗
    $("#add-btn").click(function () {
        $('#add-modal').modal('show');

        const now = new Date();
        const year = now.getFullYear();
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const day = now.getDate().toString().padStart(2, '0');
        const serial = (count++).toString().padStart(3, '0');
        var aa = `${year}${month}${day}${serial}`;
        document.getElementById('add-dh').value = aa;

        $ajax({
            type: 'post',
            url: '/user/getName',
        }, false, '', function (res) {
            var this_name = res.data
            $("#add-zdr").val = this_name
            document.getElementById("add-zdr").value = this_name
        })

        //未含税锁定
        document.getElementById('add-sfhs').addEventListener('change', function() {
            var selectedOption = this.value;
            var textBoxes = document.querySelectorAll('input[type="text"]');
            // 根据选择的option值锁定对应的文本框
            if (selectedOption === '未含税') {
                document.getElementById('add-hsdj').disabled = true;
                document.getElementById('add-sd').disabled = true;
                document.getElementById('add-whsdj').disabled = false;
            }else{
                document.getElementById('add-whsdj').disabled = true;
                document.getElementById('add-hsdj').disabled = false;
                document.getElementById('add-sd').disabled = false;
            }
        });
    });

    //新增弹窗里点击关闭按钮
    $('#add-close-btn').click(function () {
        $('#add-modal').modal('hide');
    });

    //新增弹窗里点击提交按钮
    $("#add-submit-btn").click(function () {

        // var js = parseFloat(document.getElementById('add-js').value);
        var zl = parseFloat(document.getElementById('add-zl').value);
        var dj = parseFloat(document.getElementById('add-dj').value);
        var je = zl * dj
        document.getElementById("add-je").value = je

        // var js = parseFloat(document.getElementById('add-js').value);
        // var jgf = js * 0.5
        document.getElementById("add-jgf").value = jgf

        if (parseFloat(document.getElementById('add-sd').value) != 0 ){
            var hsdj = parseFloat(document.getElementById('add-hsdj').value);
            var sd = parseFloat(document.getElementById('add-sd').value);
            var whsdj = hsdj / sd
            document.getElementById("add-whsdj").value = whsdj
        }

        var  date = new Date();
        date.setMonth(date.getMonth()-3);
        var year = date.getFullYear();
        var month = ('0'+(date.getMonth()+1)).slice(-2);
        var day = ('0'+date.getDate()).slice(-2);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
        var danhao =year+''+month+''+day+''+hours+''+minutes+seconds;
        console.log(danhao)
        document.getElementById("add-danhao").value = danhao;

        // var d1 = document.getElementById('mc').value;
        // var d2 = document.getElementById('dj').value;
        // var d3 = document.getElementById('je').value;

        let params = formToJson("#add-form");
        if (checkForm('#add-form')) {
            $ajax({
                type: 'post',
                url: '/xsd/add1',
                data: JSON.stringify({
                    addInfo: params
                }),
                dataType: 'json',
                contentType: 'application/json;charset=utf-8'
            }, false, '', function (res) {
                if (res.code == 200) {
                    $ajax({
                        type: 'post',
                        url: '/mx/add1',
                        data: JSON.stringify({
                            addInfo: params,
                            // cksl: js,
                            // ziduan:ziduan
                        }),
                        dataType: 'json',
                        contentType: 'application/json;charset=utf-8'
                    }, false, '', function (res) {
                        if (res.code == 200) {
                            swal("", res.msg, "success");
                            $('#add-form')[0].reset();
                            getList();
                            $('#add-close-btn').click();
                        }
                    })
                    swal("", res.msg, "success");
                    $('#add-form')[0].reset();
                    getList();
                    $('#add-close-btn').click();
                }
            })
            // var d1 = document.getElementById('mc').value;
            // var d2 = document.getElementById('dj').value;
            // var d3 = document.getElementById('je').value;

        }

        // var d1 = document.getElementById('mc').value;
        // var d2 = document.getElementById('dj').value;
        // var d3 = document.getElementById('je').value;
        // $ajax({
        //     type: 'post',
        //     url: '/xsd/add',
        //     data: JSON.stringify({
        //         addInfo: params
        //     }),
        //     dataType: 'json',
        //     contentType: 'application/json;charset=utf-8'
        // }, false, '', function (res) {
        //     if (res.code == 200) {
        //         $ajax({
        //             type: 'post',
        //             url: '/xsd/add',
        //             data: JSON.stringify({
        //                 addInfo: params
        //             }),
        //             dataType: 'json',
        //             contentType: 'application/json;charset=utf-8'
        //         }, false, '', function (res) {
        //             if (res.code == 200) {
        //                 swal("", res.msg, "success");
        //                 $('#add-form')[0].reset();
        //                 getList();
        //                 $('#add-close-btn').click();
        //             }
        //         })
        //         swal("", res.msg, "success");
        //         $('#add-form')[0].reset();
        //         getList();
        //         $('#add-close-btn').click();
        //     }
        // })

    });

    //点击修改按钮显示弹窗
    // $('#update-btn').click(function () {
    //     let rows = getTableSelection('#xsdTable');
    //     if (rows.length > 1 || rows.length == 0) {
    //         swal('请选择一条数据修改!');
    //         return;
    //     }
    //     $('#update-modal').modal('show');
    //     setForm(rows[0].data, '#update-form');
    //     $('#update-riqi').val(rows[0].data.riqi);
    //      $('#update-dh').val(rows[0].data.dh);
    //     $('#update-shdw').val(rows[0].data.shdw);
    //     $('#update-mc').val(rows[0].data.mc);
    //     $('#update-mh').val(rows[0].data.mh);
    //     $('#update-gg').val(rows[0].data.gg);
    //     $('#update-js').val(rows[0].data.js);
    //     $('#update-zl').val(rows[0].data.zl);
    //     $('#update-dj').val(rows[0].data.dj);
    //     $('#update-je').val(rows[0].data.je);
    //     $('#update-bz').val(rows[0].data.bz);
    //     $('#update-shdz').val(rows[0].data.shdz);
    //     $('#update-kddh').val(rows[0].data.kddh);
    //     $('#update-sfyj').val(rows[0].data.sfyj);
    //     $('#update-fkfs').val(rows[0].data.fkfs);
    //     $('#update-sfhs').val(rows[0].data.sfhs);
    //     $('#update-gd').val(rows[0].data.gd);
    //     $('#update-zdr').val(rows[0].data.zdr);
    //     $('#update-shdwjjsr').val(rows[0].data.shdwjjsr);
    //     $('#update-jgf').val(rows[0].data.jgf);
    //     $('#update-kdf').val(rows[0].data.kdf);
    //     $('#update-hsdj').val(rows[0].data.hsdj);
    //     $('#update-sd').val(rows[0].data.sd);
    //     $('#update-whsdj').val(rows[0].data.whsdj);
    //     var dh = document.getElementById("update-dh").value;
    //     $ajax({
    //         type: 'post',
    //         url: '/xsd/getList2',
    //         data:{
    //             dh:dh
    //         }
    //     }, false, '', function (res) {
    //         if (res.code == 200) {
    //             setTable2(res.data);
    //             $("#xsdTable2").colResizable({
    //                 liveDrag: true,
    //                 gripInnerHtml: "<div class='grip'></div>",
    //                 draggingClass: "dragging",
    //                 resizeMode: 'fit'
    //             });
    //             for (i=0;i<=res.data.id;i++){
    //                 idd=i;
    //             }
    //         }
    //     })
    //     //未含税锁定
    //     // document.getElementById('update-sfhs').addEventListener('change', function() {
    //     //     var selectedOption = this.value;
    //     //     var textBoxes = document.querySelectorAll('input[type="text"]');
    //     //     // 根据选择的option值锁定对应的文本框
    //     //     if (selectedOption === '未含税') {
    //     //         document.getElementById('update-hsdj').disabled = true;
    //     //         document.getElementById('update-sd').disabled = true;
    //     //         document.getElementById('update-whsdj').disabled = false;
    //     //     }else{
    //     //         document.getElementById('update-whsdj').disabled = true;
    //     //         document.getElementById('update-hsdj').disabled = false;
    //     //         document.getElementById('update-sd').disabled = false;
    //     //     }
    //     // });
    // });
    //点击修改按钮显示弹窗
    $('#update-btn').click(function () {
        const inputs = document.querySelectorAll('#tbupd input');
        inputs.forEach(function(input) {
            input.disabled = true;
        });

        let rows = getTableSelection('#xsdTable');
        if (rows.length > 1 || rows.length == 0) {
            swal('请选择一条数据修改!');
            return;
        }
        $('#update-modal').modal('show');
        // setForm(rows[0].data, '#update-form');
        // $('#update-riqi').val(rows[0].data.riqi);
        //  $('#update-dh').val(rows[0].data.dh);
        // $('#update-shdw').val(rows[0].data.shdw);
        // $('#update-mc').val(rows[0].data.mc);
        // $('#update-mh').val(rows[0].data.mh);
        // $('#update-gg').val(rows[0].data.gg);
        // $('#update-js').val(rows[0].data.js);
        // $('#update-zl').val(rows[0].data.zl);
        // $('#update-dj').val(rows[0].data.dj);
        // $('#update-je').val(rows[0].data.je);
        // $('#update-bz').val(rows[0].data.bz);
        // $('#update-shdz').val(rows[0].data.shdz);
        // $('#update-kddh').val(rows[0].data.kddh);
        // $('#update-sfyj').val(rows[0].data.sfyj);
        // $('#update-fkfs').val(rows[0].data.fkfs);
        // $('#update-sfhs').val(rows[0].data.sfhs);
        // $('#update-gd').val(rows[0].data.gd);
        // $('#update-zdr').val(rows[0].data.zdr);
        // $('#update-shdwjjsr').val(rows[0].data.shdwjjsr);
        // $('#update-jgf').val(rows[0].data.jgf);
        // $('#update-kdf').val(rows[0].data.kdf);
        // $('#update-hsdj').val(rows[0].data.hsdj);
        // $('#update-sd').val(rows[0].data.sd);
        // $('#update-whsdj').val(rows[0].data.whsdj);
        // var dh = document.getElementById("update-dh").value;
        var dh = rows[0].data.dh;
        $ajax({
            type: 'post',
            url: '/xsd/getList2',
            data:{
                dh:dh
            }
        }, false, '', function (res) {
            if (res.code == 200) {
                // setTable2(res.data);
                // $("#xsdTable2").colResizable({
                //     liveDrag: true,
                //     gripInnerHtml: "<div class='grip'></div>",
                //     draggingClass: "dragging",
                //     resizeMode: 'fit'
                // });
                // for (i=0;i<=res.data.id;i++){
                //     idd=i;
                // }

                document.getElementById("update-shdw").value = res.data[0].shdw;
                document.getElementById("update-kddh").value = res.data[0].kddh;
                document.getElementById("update-riqi").value = res.data[0].riqi;
                document.getElementById("update-dh").value = res.data[0].dh;
                document.getElementById("update-xuhao").value = 1;
                document.getElementById("update-mc").value = res.data[0].mc;
                document.getElementById("update-gg").value = res.data[0].gg;
                document.getElementById("update-mh").value = res.data[0].mh;
                document.getElementById("update-zl").value = res.data[0].zl;
                document.getElementById("update-dj").value = res.data[0].dj;
                // document.getElementById("update-js").value = res.data[0].js;
                document.getElementById("update-je").value = res.data[0].je;
                document.getElementById("update-bz").value = res.data[0].bz;
                document.getElementById("update-kdf").value = res.data[0].kdf;
                document.getElementById("update-sd").value = res.data[0].sd;
                document.getElementById("update-sfhs").value = res.data[0].sfhs;
                document.getElementById("update-sfyj").value = res.data[0].sfyj;
                // document.getElementById("update-hjzl").value = res.data[0].hjzl;
                var zl=res.data[0].zl;
                var kdf =res.data[0].kdf;
                // if (res.data.sfhs=="含税"||res.data.sfhs=="金额含税"){
                //     var sd = res.data[0].sd;
                //     HJZL=HJZL+parseFloat(zl);
                // }
                HJZL=HJZL+parseFloat(zl)
                document.getElementById("update-hsdj").value = res.data[0].hsdj;
                // var dj=res.data[0].dj;
                // HSDJ=HSDJ+parseFloat(dj);
                // document.getElementById("update-hjje").value = res.data[0].hjje;
                var je=res.data[0].je;
                HJJE=HJJE+parseFloat(je);
                document.getElementById("update-fkfs").value = res.data[0].fkfs;
                document.getElementById("update-gd").value = res.data[0].gd;
                document.getElementById("update-zdr").value = res.data[0].zdr;
                document.getElementById("update-bzld").value = res.data[0].bzld;

                for (var n = 1; n < res.data.length; n++) {
                    index++;
                    document.getElementById("update-xuhao" + n).value = index;
                    document.getElementById("update-mc" + n).value = res.data[n].mc;
                    document.getElementById("update-gg" + n).value = res.data[n].gg;
                    document.getElementById("update-mh" + n).value = res.data[n].mh;
                    document.getElementById("update-zl" + n).value = res.data[n].zl;
                    var zl=res.data[i].zl;
                    HJZL=HJZL+parseFloat(zl);
                    document.getElementById("update-dj" + n).value = res.data[n].dj;
                    // var dj=res.data[i].dj;
                    // HJZL=HJZL+parseFloat(dj);
                    // document.getElementById("update-js" + n).value = res.data[n].js;
                    document.getElementById("update-je" + n).value = res.data[n].je;
                    var je=res.data[i].je;
                    HJJE=HJJE+parseFloat(je);
                    document.getElementById("update-bz" + n).value = res.data[n].bz;
                }
                document.getElementById("update-hjzl").value = HJZL.toString();
                // document.getElementById("update-hsdj").value =toString(HSDJ);
                document.getElementById("update-hjje").value = (HJJE.toFixed(2)).toString();

            }

        })
        //未含税锁定
        // document.getElementById('update-sfhs').addEventListener('change', function() {
        //     var selectedOption = this.value;
        //     var textBoxes = document.querySelectorAll('input[type="text"]');
        //     // 根据选择的option值锁定对应的文本框
        //     if (selectedOption === '未含税') {
        //         document.getElementById('update-hsdj').disabled = true;
        //         document.getElementById('update-sd').disabled = true;
        //         document.getElementById('update-whsdj').disabled = false;
        //     }else{
        //         document.getElementById('update-whsdj').disabled = true;
        //         document.getElementById('update-hsdj').disabled = false;
        //         document.getElementById('update-sd').disabled = false;
        //     }
        // });
    });
$('#close1').click(function (){
    HJJE=0;
    HJZL=0;
  clearTable();

})

    //修改弹窗点击关闭按钮
    // $('#update-close-btn').click(function () {
    //     $('#update-form')[0].reset();
    //     $('#update-modal').modal('hide');
    // });
    //修改弹窗点击关闭按钮
    $('#update-close-btn').click(function () {
        // $('#update-form')[0].reset();
        $('#update-modal').modal('hide');

    });

    //修改弹窗里点击提交按钮
    $('#update-submit-btn').click(function () {
        var msg = confirm("确认要修改吗？");

        // var js = parseFloat(document.getElementById('update-js').value);
        // var zl = parseFloat(document.getElementById('update-zl').value);
        // var dj = parseFloat(document.getElementById('update-dj').value);
        // var je = js * zl * dj
        // document.getElementById("update-je").value = je
//         var jgf = js * 0.5
//         document.getElementById("update-jgf").value = jgf
//
// // ---------------
//         var js = parseFloat(document.getElementById('update-js').value);
//         var dj = parseFloat(document.getElementById('update-dj').value);
//         var zl = parseFloat(document.getElementById('update-zl').value);
//         // var zje = rksl * rkdj * rkzl
//         var je = js * dj
//         document.getElementById("update-je").value = je
//
//         var d1 = document.getElementById('update-mc').value;
//         var d2 = document.getElementById('update-js').value;
//         var d3 = document.getElementById('update-je').value;
//         var d4 = document.getElementById('update-zl').value;
//         var d5 = document.getElementById('update-dh').value;
//         var d6 = document.getElementById('id').value;
//         var d7 = document.getElementById('update-dj').value;
// // -------------
//
//         if (parseFloat(document.getElementById('update-sd').value) != 0 ){
//             var hsdj = parseFloat(document.getElementById('update-hsdj').value);
//             var sd = parseFloat(document.getElementById('update-sd').value);
//             var whsdj = hsdj / sd
//             var aa= whsdj.toFixed(2)
//             document.getElementById("update-whsdj").value = aa
//         }

        if (msg) {
            if (checkForm('#update-form')) {
                let params = formToJson('#update-form');
                $ajax({
                    type: 'post',
                    url: '/xsd/update',
                    data: {
                        updateJson: JSON.stringify(params)
                    },
                    dataType: 'json',
                    contentType: 'application/json;charset=utf-8'
                }, false, '', function (res) {
                    if (res.code == 200) {
                        swal("", res.msg, "success");
                        // $('#update-close-btn').click();
                        // $('#update-modal').modal('hide');
                        // getList();
                    } else {
                        swal("", res.msg, "error");
                    }
                })

// -----------
                $ajax({
                    type: 'post',
                    url: '/mx/queryListMingxi1',
                    data: {
                        dh: d5,
                        id: d6,
                        mc: d1,
                        // js: d2,
                        zl:d4,
                        je:d3,
                        dj:d7,

                    }
                }, true, '', function (res) {
                    if (res.code == 200) {
                        // setTable(res.data);
                        console.log(res.data)
                        getList();
                    }
                })

            }
        }
    });


    $('#print-btn').click(function () {
        qinkong();
        let rows = getTableSelection('#xsdTable');
        if (rows.length > 1 || rows.length == 0) {
            swal('请选择一条数据!');
            return;
        }
        var dh = rows[0].data.dh;
        $ajax({
            type: 'post',
            url: '/xsd/getList2',
            data:{
                dh:dh
            }
        }, false, '', function (res) {
            for (var i = 0; i < res.data.length; i++) {
                var mc = res.data[i].mc;
                var mh = res.data[i].mh;
                var gg = res.data[i].gg;
                var zl = res.data[i].zl;
                var dj = res.data[i].dj;
                var dh = res.data[i].dh;
                var bz = res.data[i].bz;
                var je = res.data[i].je;
                var riqi = res.data[i].riqi;
                var dh = res.data[i].dh;
                var shdw = res.data[i].shdw;
                var shdz = res.data[i].shdz;
                var kddh = res.data[i].kddh;
                var sfyj = res.data[i].sfyj;
                var fkfs = res.data[i].fkfs;
                var sfhs = res.data[i].sfhs;
                var gd = res.data[i].gd;
                var zdr = res.data[i].zdr;
                var kdf = res.data[i].kdf;
                var sd = res.data[i].sd;
                var bzld = res.data[i].bzld;
                var hjje = res.data[i].hjje;
                var hjzl = res.data[i].hjzl;
                $ajax({
                    type: 'post',
                    url: '/shdp/add1',
                    data: {
                        riqi: riqi,
                        dh: dh,
                        mc: mc,
                        mh: mh,
                        gg: gg,
                        zl: zl,
                        dj: dj,
                        shdw: shdw,
                        bz: bz,
                        kdf: kdf,
                        sd: sd,
                        zdr: zdr,
                        gd: gd,
                        sfhs: sfhs,
                        sfyj: sfyj,
                        kddh: kddh,
                        shdz: shdz,
                        fkfs: fkfs,
                        shdz: shdz,
                        bzld: bzld,
                        je:je,
                        hjje:hjje,
                        hjzl:hjzl
                    },

                }, false, '', function (res) {
                    tzshd();
                })
                if (i >= 20){
                    break;
                }
            }
        })
    })

    function tzshd() {
        console.log("123123")
        window.location.assign("zhdy.html");
    }


    $('#update1-btn').click(function () {
        const inputs = document.querySelectorAll('#tbupd input');
        inputs.forEach(function(input) {
            input.disabled = true;
        });

        let rows = getTableSelection('#xsdTable');
        if (rows.length > 1 || rows.length == 0) {
            swal('请选择一条数据修改!');
            return;
        }
        $('#update1-modal').modal('show');

        var dh = rows[0].data.dh;
        $ajax({
            type: 'post',
            url: '/xsd/getList2',
            data:{
                dh:dh
            }
        }, false, '', function (res) {
            if (res.code == 200) {
                if(res.data.length==1){
                    document.getElementById("tq1").hidden=true
                    document.getElementById("tq2").hidden=true
                    document.getElementById("tq3").hidden=true
                    document.getElementById("tq4").hidden=true
                    document.getElementById("tq5").hidden=true
                    document.getElementById("tq6").hidden=true
                    document.getElementById("tq7").hidden=true
                    document.getElementById("tq8").hidden=true
                    document.getElementById("tq9").hidden=true
                    document.getElementById("tq10").hidden=true
                    // document.getElementById("t11").hidden=true
                    document.getElementById("t12").hidden=true
                    document.getElementById("t13").hidden=true
                    document.getElementById("t14").hidden=true
                    document.getElementById("t15").hidden=true
                    document.getElementById("t16").hidden=true
                    document.getElementById("t17").hidden=true
                    document.getElementById("t18").hidden=true
                    document.getElementById("t19").hidden=true
                    document.getElementById("t20").hidden=true
                }else if(res.data.length==2){
                    document.getElementById("tq1").hidden=true
                    document.getElementById("tq2").hidden=true
                    document.getElementById("tq3").hidden=true
                    document.getElementById("tq4").hidden=true
                    document.getElementById("tq5").hidden=true
                    document.getElementById("tq6").hidden=true
                    document.getElementById("tq7").hidden=true
                    document.getElementById("tq8").hidden=true
                    document.getElementById("tq9").hidden=true
                    document.getElementById("tq10").hidden=true
                    // document.getElementById("t11").hidden=true
                    // document.getElementById("t12").hidden=true
                    document.getElementById("t13").hidden=true
                    document.getElementById("t14").hidden=true
                    document.getElementById("t15").hidden=true
                    document.getElementById("t16").hidden=true
                    document.getElementById("t17").hidden=true
                    document.getElementById("t18").hidden=true
                    document.getElementById("t19").hidden=true
                    document.getElementById("t20").hidden=true
                }else if(res.data.length==3){
                    document.getElementById("tq1").hidden=true
                    document.getElementById("tq2").hidden=true
                    document.getElementById("tq3").hidden=true
                    document.getElementById("tq4").hidden=true
                    document.getElementById("tq5").hidden=true
                    document.getElementById("tq6").hidden=true
                    document.getElementById("tq7").hidden=true
                    document.getElementById("tq8").hidden=true
                    document.getElementById("tq9").hidden=true
                    document.getElementById("tq10").hidden=true
                    // document.getElementById("t11").hidden=true
                    // document.getElementById("t12").hidden=true
                    // document.getElementById("t13").hidden=true
                    document.getElementById("t14").hidden=true
                    document.getElementById("t15").hidden=true
                    document.getElementById("t16").hidden=true
                    document.getElementById("t17").hidden=true
                    document.getElementById("t18").hidden=true
                    document.getElementById("t19").hidden=true
                    document.getElementById("t20").hidden=true
                }else if(res.data.length==4){
                    document.getElementById("tq1").hidden=true
                    document.getElementById("tq2").hidden=true
                    document.getElementById("tq3").hidden=true
                    document.getElementById("tq4").hidden=true
                    document.getElementById("tq5").hidden=true
                    document.getElementById("tq6").hidden=true
                    document.getElementById("tq7").hidden=true
                    document.getElementById("tq8").hidden=true
                    document.getElementById("tq9").hidden=true
                    document.getElementById("tq10").hidden=true
                    // document.getElementById("t11").hidden=true
                    // document.getElementById("t12").hidden=true
                    // document.getElementById("t13").hidden=true
                    // document.getElementById("t14").hidden=true
                    document.getElementById("t15").hidden=true
                    document.getElementById("t16").hidden=true
                    document.getElementById("t17").hidden=true
                    document.getElementById("t18").hidden=true
                    document.getElementById("t19").hidden=true
                    document.getElementById("t20").hidden=true
                }else if(res.data.length==5){
                    document.getElementById("tq1").hidden=true
                    document.getElementById("tq2").hidden=true
                    document.getElementById("tq3").hidden=true
                    document.getElementById("tq4").hidden=true
                    document.getElementById("tq5").hidden=true
                    document.getElementById("tq6").hidden=true
                    document.getElementById("tq7").hidden=true
                    document.getElementById("tq8").hidden=true
                    document.getElementById("tq9").hidden=true
                    document.getElementById("tq10").hidden=true
                    // document.getElementById("t11").hidden=true
                    // document.getElementById("t12").hidden=true
                    // document.getElementById("t13").hidden=true
                    // document.getElementById("t14").hidden=true
                    // document.getElementById("t15").hidden=true
                    document.getElementById("t16").hidden=true
                    document.getElementById("t17").hidden=true
                    document.getElementById("t18").hidden=true
                    document.getElementById("t19").hidden=true
                    document.getElementById("t20").hidden=true
                }else if(res.data.length==6){
                    document.getElementById("tq1").hidden=true
                    document.getElementById("tq2").hidden=true
                    document.getElementById("tq3").hidden=true
                    document.getElementById("tq4").hidden=true
                    document.getElementById("tq5").hidden=true
                    document.getElementById("tq6").hidden=true
                    document.getElementById("tq7").hidden=true
                    document.getElementById("tq8").hidden=true
                    document.getElementById("tq9").hidden=true
                    document.getElementById("tq10").hidden=true
                    // document.getElementById("t11").hidden=true
                    // document.getElementById("t12").hidden=true
                    // document.getElementById("t13").hidden=true
                    // document.getElementById("t14").hidden=true
                    // document.getElementById("t15").hidden=true
                    // document.getElementById("t16").hidden=true
                    document.getElementById("t17").hidden=true
                    document.getElementById("t18").hidden=true
                    document.getElementById("t19").hidden=true
                    document.getElementById("t20").hidden=true
                }else if(res.data.length==7){
                    document.getElementById("tq1").hidden=true
                    document.getElementById("tq2").hidden=true
                    document.getElementById("tq3").hidden=true
                    document.getElementById("tq4").hidden=true
                    document.getElementById("tq5").hidden=true
                    document.getElementById("tq6").hidden=true
                    document.getElementById("tq7").hidden=true
                    document.getElementById("tq8").hidden=true
                    document.getElementById("tq9").hidden=true
                    document.getElementById("tq10").hidden=true
                    // document.getElementById("t11").hidden=true
                    // document.getElementById("t12").hidden=true
                    // document.getElementById("t13").hidden=true
                    // document.getElementById("t14").hidden=true
                    // document.getElementById("t15").hidden=true
                    // document.getElementById("t16").hidden=true
                    // document.getElementById("t17").hidden=true
                    document.getElementById("t18").hidden=true
                    document.getElementById("t19").hidden=true
                    document.getElementById("t20").hidden=true
                }else if(res.data.length==8){
                    document.getElementById("tq1").hidden=true
                    document.getElementById("tq2").hidden=true
                    document.getElementById("tq3").hidden=true
                    document.getElementById("tq4").hidden=true
                    document.getElementById("tq5").hidden=true
                    document.getElementById("tq6").hidden=true
                    document.getElementById("tq7").hidden=true
                    document.getElementById("tq8").hidden=true
                    document.getElementById("tq9").hidden=true
                    document.getElementById("tq10").hidden=true
                    // document.getElementById("t11").hidden=true
                    // document.getElementById("t12").hidden=true
                    // document.getElementById("t13").hidden=true
                    // document.getElementById("t14").hidden=true
                    // document.getElementById("t15").hidden=true
                    // document.getElementById("t16").hidden=true
                    // document.getElementById("t17").hidden=true
                    // document.getElementById("t18").hidden=true
                    document.getElementById("t19").hidden=true
                    document.getElementById("t20").hidden=true
                }else if(res.data.length==9){
                    document.getElementById("tq1").hidden=true
                    document.getElementById("tq2").hidden=true
                    document.getElementById("tq3").hidden=true
                    document.getElementById("tq4").hidden=true
                    document.getElementById("tq5").hidden=true
                    document.getElementById("tq6").hidden=true
                    document.getElementById("tq7").hidden=true
                    document.getElementById("tq8").hidden=true
                    document.getElementById("tq9").hidden=true
                    document.getElementById("tq10").hidden=true
                    // document.getElementById("t11").hidden=true
                    // document.getElementById("t12").hidden=true
                    // document.getElementById("t13").hidden=true
                    // document.getElementById("t14").hidden=true
                    // document.getElementById("t15").hidden=true
                    // document.getElementById("t16").hidden=true
                    // document.getElementById("t17").hidden=true
                    // document.getElementById("t18").hidden=true
                    // document.getElementById("t19").hidden=true
                    document.getElementById("t20").hidden=true
                }
                else if(res.data.length==10){
                    document.getElementById("tq1").hidden=true
                    document.getElementById("tq2").hidden=true
                    document.getElementById("tq3").hidden=true
                    document.getElementById("tq4").hidden=true
                    document.getElementById("tq5").hidden=true
                    document.getElementById("tq6").hidden=true
                    document.getElementById("tq7").hidden=true
                    document.getElementById("tq8").hidden=true
                    document.getElementById("tq9").hidden=true
                    document.getElementById("tq10").hidden=true
                }
                document.getElementById("update1-shdw").value = res.data[0].shdw;
                document.getElementById("update1-kddh").value = res.data[0].kddh;
                document.getElementById("update1-riqi").value = res.data[0].riqi;
                document.getElementById("update1-dh").value = res.data[0].dh;
                document.getElementById("update1-xuhao").value = 1;
                document.getElementById("update1-mc").value = res.data[0].mc;
                // document.getElementById("update1-mc").value = "ava";
                document.getElementById("update1-gg").value = res.data[0].gg;
                document.getElementById("update1-mh").value = res.data[0].mh;
                document.getElementById("update1-zl").value = res.data[0].zl;
                document.getElementById("update1-dj").value = res.data[0].dj;
                // document.getElementById("update1-js").value = res.data[0].js;
                document.getElementById("update1-je").value = res.data[0].je;
                document.getElementById("update1-bz").value = res.data[0].bz;
                document.getElementById("update1-kdf").value = res.data[0].kdf;
                document.getElementById("update1-sd").value = res.data[0].sd;
                document.getElementById("update1-sfhs").value = res.data[0].sfhs;
                document.getElementById("update1-sfyj").value = res.data[0].sfyj;
                document.getElementById("id").value = res.data[0].id;
                // document.getElementById("update1-hjzl").value = res.data[0].hjzl;
                var zl=res.data[0].zl;
                var kdf =res.data[0].kdf;
                // if (res.data.sfhs=="含税"||res.data.sfhs=="金额含税"){
                //     var sd = res.data[0].sd;
                //     HJZL=HJZL+parseFloat(zl);
                // }
                HJZL=HJZL+parseFloat(zl)
                document.getElementById("update1-hsdj").value = res.data[0].hsdj;
                // var dj=res.data[0].dj;
                // HSDJ=HSDJ+parseFloat(dj);
                // document.getElementById("update1-hjje").value = res.data[0].hjje;
                var je=res.data[0].je;
                HJJE=HJJE+parseFloat(je);
                document.getElementById("update1-fkfs").value = res.data[0].fkfs;
                document.getElementById("update1-gd").value = res.data[0].gd;
                document.getElementById("update1-zdr").value = res.data[0].zdr;
                document.getElementById("update1-bzld").value = res.data[0].bzld;

                for (var n = 1; n < res.data.length; n++) {
                    index++;
                    document.getElementById("update1-xuhao" + n).value = index;
                    document.getElementById("update1-mc" + n).value = res.data[n].mc;
                    // document.getElementById("update1-mc"+n).value = "ava";
                    document.getElementById("update1-gg" + n).value = res.data[n].gg;
                    if(res.data[n].mh==null){
                        document.getElementById("update1-mh" + n).value ="";
                    }else {
                        document.getElementById("update1-mh" + n).value = res.data[n].mh;
                    }
                    document.getElementById("update1-zl" + n).value = res.data[n].zl;
                    var zl=res.data[i].zl;
                    HJZL=HJZL+parseFloat(zl);
                    document.getElementById("update1-dj" + n).value = res.data[n].dj;
                    // var dj=res.data[i].dj;
                    // HJZL=HJZL+parseFloat(dj);
                    // document.getElementById("update1-js" + n).value = res.data[n].js;
                    document.getElementById("update1-je" + n).value = res.data[n].je;
                    var je=res.data[i].je;
                    HJJE=HJJE+parseFloat(je);
                    document.getElementById("update1-bz" + n).value = res.data[n].bz;
                }
                document.getElementById("update1-hjzl").value = HJZL.toString();
                // document.getElementById("update1-hsdj").value =toString(HSDJ);
                document.getElementById("update1-hjje").value = HJJE.toString();
                document.getElementById("id"+n).value = res.data[n].id;
            }
        })
        //未含税锁定
        // document.getElementById('update1-sfhs').addEventListener('change', function() {
        //     var selectedOption = this.value;
        //     var textBoxes = document.querySelectorAll('input[type="text"]');
        //     // 根据选择的option值锁定对应的文本框
        //     if (selectedOption === '未含税') {
        //         document.getElementById('update1-hsdj').disabled = true;
        //         document.getElementById('update1-sd').disabled = true;
        //         document.getElementById('update1-whsdj').disabled = false;
        //     }else{
        //         document.getElementById('update1-whsdj').disabled = true;
        //         document.getElementById('update1-hsdj').disabled = false;
        //         document.getElementById('update1-sd').disabled = false;
        //     }
        // });
    });
    //修改弹窗点击关闭按钮
    $('#update1-close-btn').click(function () {
        // $('#update-form')[0].reset();
        $('#update1-modal').modal('hide');
    });

    //修改弹窗里点击提交按钮
    $('#update1-submit-btn').click(function () {
        // var msg = confirm("确认要修改吗？");
        //
        // var js = parseFloat(document.getElementById('update1-js').value);
        // var zl = parseFloat(document.getElementById('update1-zl').value);
        // var dj = parseFloat(document.getElementById('update1-dj').value);
        // var je = js * zl * dj
        // document.getElementById("update1-je").value = je
        //
        // if (parseFloat(document.getElementById('update1-sd').value) != 0) {
        //     var hsdj = parseFloat(document.getElementById('update1-hsdj').value);
        //     var sd = parseFloat(document.getElementById('update1-sd').value);
        //     var whsdj = hsdj / sd
        //     document.getElementById("update1-whsdj").value = whsdj
        // }
        //
        // if (msg) {
        //     if (checkForm('#update1-form')) {
        //         let params = formToJson('#update1-form');
        //         $ajax({
        //             type: 'post',
        //             url: '/xsd/add',
        //             data: {
        //                 update1Json: JSON.stringify(params)
        //             },
        //             dataType: 'json',
        //             contentType: 'application/json;charset=utf-8'
        //         }, false, '', function (res) {
        //             if (res.code == 200) {
        //                 swal("", res.msg, "success");
        //                 $('#update1-close-btn').click();
        //                 $('#update1-modal').modal('hide');
        //                 getList();
        //             } else {
        //                 swal("", res.msg, "error");
        //             }
        //         })
        //     }
        // }

        // var js = parseFloat(document.getElementById('update1-js').value);
        // var zl = parseFloat(document.getElementById('update1-zl').value);
        // var dj = parseFloat(document.getElementById('update1-dj').value);
        // var je = js * zl * dj
        // var hjzl = zl;
        // document.getElementById("update1-je").value = je
        // var jgf = js * 0.5
        // document.getElementById("update1-jgf").value = jgf
        // var kdf = document.getElementById("update1-kdf").value;
        // var hjje = jgf +je+kdf;
        // if (parseFloat(document.getElementById('update1-sd').value) != 0 ){
        //     var hsdj = parseFloat(document.getElementById('update1-hsdj').value);
        //     var sd = parseFloat(document.getElementById('update1-sd').value);
        //     var whsdj = hsdj / sd
        //     var aa = whsdj.toFixed(2)
        //     document.getElementById("update1-whsdj").value = aa
        // }
        for (i = 0; i < 20; i++) {
            if (i == 0) {
                var mc = document.getElementById("update1-mc").value;
                var mh = document.getElementById("update1-mh").value;
                var gg = document.getElementById("update1-gg").value;
                // var js = document.getElementById("update1-js").value;
                var zl = document.getElementById("update1-zl").value;
                var dj = document.getElementById("update1-dj").value;
                var dh = document.getElementById("update1-dh").value;
                // var je = document.getElementById("update1-je").value;
                var bz = document.getElementById("update1-bz").value;
                var id = document.getElementById("id").value;
            } else {
                var mc = document.getElementById("update1-mc" + i).value;
                var mh = document.getElementById("update1-mh" + i).value;
                var gg = document.getElementById("update1-gg" + i).value;
                // var js = document.getElementById("update1-js" + i).value;
                var zl = document.getElementById("update1-zl" + i).value;
                var dj = document.getElementById("update1-dj" + i).value;
                // var je = document.getElementById("update1-je"+i).value;
                var bz = document.getElementById("update1-bz" + i).value;
                var id = document.getElementById("id"+i).value;
                if(id==""){
                    break;
                }
            }
            var riqi = $('#update1-riqi').val();
            var dh = $('#update1-dh').val();
            var shdw = $('#update1-shdw').val();
            var shdz = $('#update1-shdz').val();
            var kddh = $('#update1-kddh').val();
            var sfyj = $('#update1-sfyj').val();
            var fkfs = $('#update1-fkfs').val();
            var sfhs = $('#update1-sfhs').val();
            var gd = $('#update1-gd').val();
            var zdr = $('#update1-zdr').val();
            var kdf = $('#update1-kdf').val();
            var sd = $('#update1-sd').val();
            var bzld = $('#update1-bzld').val();

            $ajax({
                type: 'post',
                url: '/xsd/update',
                data: {
                    riqi: riqi,
                    dh: dh,
                    mc: mc,
                    mh: mh,
                    gg: gg,
                    // js: js,
                    zl: zl,
                    dj: dj,
                    shdw: shdw,
                    bz: bz,
                    kdf: kdf,
                    sd: sd,
                    zdr: zdr,
                    gd: gd,
                    sfhs: sfhs,
                    sfyj: sfyj,
                    kddh: kddh,
                    shdz: shdz,
                    fkfs: fkfs,
                    shdz: shdz,
                    bzld: bzld,
                    id:id
                },

            }, false, '', function (res) {
                if (res.code == 200) {
                    swal("", res.msg, "success");
                    $('#update1-form')[0].reset();
                    getList();
                    $('#update1-close-btn').click();
                }
            })

        }
    })
    // $('#update-submit-btn').click(function () {
    //
    //     var js = parseFloat(document.getElementById('update-js').value);
    //     var dj = parseFloat(document.getElementById('update-dj').value);
    //     var zl = parseFloat(document.getElementById('update-zl').value);
    //     // var zje = rksl * rkdj * rkzl
    //     var je = js * dj
    //     document.getElementById("update-je").value = je
    //
    //     var d1 = document.getElementById('update-mc').value;
    //     var d2 = document.getElementById('update-js').value;
    //     var d3 = document.getElementById('update-je').value;
    //     var d4 = document.getElementById('update-zl').value;
    //     var d5 = document.getElementById('update-dh').value;
    //     var d6 = document.getElementById('id').value;
    //     var d7 = document.getElementById('update-dj').value;
    //
    //     var msg = confirm("确认保存吗？");
    //     if (msg) {
    //         $ajax({
    //             type: 'post',
    //             url: '/mx/queryListMingxi1',
    //             data: {
    //                 dh: d5,
    //                 id: d6,
    //                 mc: d1,
    //                 js: d2,
    //                 zl:d4,
    //                 je:d3,
    //                 dj:d7,
    //
    //             }
    //         }, true, '', function (res) {
    //             if (res.code == 200) {
    //                 // setTable(res.data);
    //                 console.log(res.data)
    //             }
    //         })
    //     }
    // });

    //点击删除按钮
    $('#delete-btn').click(function () {
        var msg = confirm("确认要删除吗？");
        if (msg) {
            let rows = getTableSelection("#xsdTable");
            if (rows.length == 0) {
                swal('请选择要删除的数据！');
                return;
            }
            var dh = rows[0].data.dh;
            $ajax({
                type: 'post',
                url: '/xsd/delete1',
                data:{
                    dh:dh
                },

            }, false, '', function (res) {
                if (res.code == 200) {
                    swal("", res.msg, "success");
                    getList();
                } else {
                    swal("", res.msg, "error");
                }
            })
        }
    })
});

function setTable(data) {
    if ($('#xsdTable').html != '') {
        $('#xsdTable').bootstrapTable('load', data);
    }

    $('#xsdTable').bootstrapTable({
        data: data,
        sortStable: true,
        classes: 'table table-hover text-nowrap table table-bordered',
        idField: 'id',
        pagination: true,
        pageSize: 15,//单页记录数
        clickToSelect: true,
        locale: 'zh-CN',
        toolbar: '#table-toolbar',
        toolbarAlign: 'left',
        theadClasses: "thead-light",//这里设置表头样式
        style:'table-layout:fixed',
        columns: [
            {
                field: '',
                title: '序号',
                align: 'center',
                width: 50,
                formatter: function (value, row, index) {
                    return index + 1;
                }
            }, {
                field: 'riqi',
                title: '日期',
                align: 'center',
                sortable: true,
                width: 80,
            }, {
                field: 'dh',
                title: '单号',
                align: 'center',
                sortable: true,
                width: 80,
            }, {
                field: 'shdw',
                title: '收货单位',
                align: 'center',
                sortable: true,
                width: 130,
            }
            // , {
            //     field: 'mc',
            //     title: '名称',
            //     align: 'center',
            //     sortable: true,
            //     width: 80,
            // }, {
            //     field: 'mh',
            //     title: '模号',
            //     align: 'center',
            //     sortable: true,
            //     width: 80,
            // }, {
            //     field: 'gg',
            //     title: '规格',
            //     align: 'center',
            //     sortable: true,
            //     width: 80,
            // }, {
            //     field: 'js',
            //     title: '件数',
            //     align: 'center',
            //     sortable: true,
            //     width: 80,
            // }, {
            //     field: 'zl',
            //     title: '重量',
            //     align: 'center',
            //     sortable: true,
            //     width: 80,
            // }, {
            //     field: 'dj',
            //     title: '单价',
            //     align: 'center',
            //     sortable: true,
            //     width: 80,
            // }, {
            //     field: 'je',
            //     title: '金额',
            //     align: 'center',
            //     sortable: true,
            //     width: 80,
            //     // formatter: function (value, row, index) {
            //     //     for(i=0;i<row.index;i++){
            //     //         document.getElementById('zje').value = row[i].je++;
            //     //     }
            //     // }
            // }, {
            //     field: 'bz',
            //     title: '备注',
            //     align: 'center',
            //     sortable: true,
            //     width: 150,
            // }
            , {
                field: 'shdz',
                title: '收货地址',
                align: 'center',
                sortable: true,
                width: 150,
            }, {
                field: 'kddh',
                title: '快递单号',
                align: 'center',
                sortable: true,
                width: 100,
            }, {
                field: 'sfyj',
                title: '是否月结',
                align: 'center',
                sortable: true,
                width: 100,
            }, {
                field: 'fkfs',
                title: '付款方式',
                align: 'center',
                sortable: true,
                width: 100,
            }, {
                field: 'sfhs',
                title: '是否含税',
                align: 'center',
                sortable: true,
                width: 100,
            }, {
                field: 'gd',
                title: '跟单',
                align: 'center',
                sortable: true,
                width: 80,
            }, {
                field: 'zdr',
                title: '制单人',
                align: 'center',
                sortable: true,
                width: 80,
            }
            // , {
            //     field: 'shdwjjsr',
            //     title: '收货单位及经手人',
            //     align: 'center',
            //     sortable: true,
            //     width: 150,
            // }
            , {
                field: 'jgf',
                title: '锯工费',
                align: 'center',
                sortable: true,
                width: 80,
            }, {
                field: 'kdf',
                title: '快递费',
                align: 'center',
                sortable: true,
                width: 80,
            }, {
                field: 'hsdj',
                title: '含税单价',
                align: 'center',
                sortable: true,
                width: 100,
            }, {
                field: 'sd',
                title: '税点',
                align: 'center',
                sortable: true,
                width: 80,
            }, {
                field: 'whsdj',
                title: '未含税单价',
                align: 'center',
                sortable: true,
                width: 130,
            }, {
                field: 'bz',
                title: '备注',
                align: 'center',
                sortable: true,
                width: 150,
            }
        ],
        onClickRow: function (row, el) {
            let isSelect = $(el).hasClass('selected')
            if (isSelect) {
                $(el).removeClass('selected')
            } else {
                $(el).addClass('selected')
            }
        }
    })
}


function setTable2(data) {
    if ($('#xsdTable2').html != '') {
        $('#xsdTable2').bootstrapTable('load', data);
    }

    $('#xsdTable2').bootstrapTable({
        data: data,
        sortStable: true,
        classes: 'table table-hover text-nowrap table table-bordered',
        idField: 'id',
        pagination: true,
        pageSize: 15,//单页记录数
        clickToSelect: true,
        locale: 'zh-CN',
        toolbarAlign: 'left',
        theadClasses: "thead-light",//这里设置表头样式
        style:'table-layout:fixed',
        columns: [
            {
                field: '',
                title: '序号',
                align: 'center',
                width: 50,
                formatter: function (value, row, index) {
                    return index + 1;
                }
            }, {
                field: 'riqi',
                title: '日期',
                align: 'center',
                sortable: true,
                width: 80,
            }, {
                field: 'dh',
                title: '单号',
                align: 'center',
                sortable: true,
                width: 80,
            }, {
                field: 'shdw',
                title: '收货单位',
                align: 'center',
                sortable: true,
                width: 130,
            }
            // , {
            //     field: 'mc',
            //     title: '名称',
            //     align: 'center',
            //     sortable: true,
            //     width: 80,
            // }, {
            //     field: 'mh',
            //     title: '模号',
            //     align: 'center',
            //     sortable: true,
            //     width: 80,
            // }, {
            //     field: 'gg',
            //     title: '规格',
            //     align: 'center',
            //     sortable: true,
            //     width: 80,
            // }, {
            //     field: 'js',
            //     title: '件数',
            //     align: 'center',
            //     sortable: true,
            //     width: 80,
            // }, {
            //     field: 'zl',
            //     title: '重量',
            //     align: 'center',
            //     sortable: true,
            //     width: 80,
            // }, {
            //     field: 'dj',
            //     title: '单价',
            //     align: 'center',
            //     sortable: true,
            //     width: 80,
            // }, {
            //     field: 'je',
            //     title: '金额',
            //     align: 'center',
            //     sortable: true,
            //     width: 80,
            //     // formatter: function (value, row, index) {
            //     //     for(i=0;i<row.index;i++){
            //     //         document.getElementById('zje').value = row[i].je++;
            //     //     }
            //     // }
            // }, {
            //     field: 'bz',
            //     title: '备注',
            //     align: 'center',
            //     sortable: true,
            //     width: 150,
            // }
            , {
                field: 'shdz',
                title: '收货地址',
                align: 'center',
                sortable: true,
                width: 150,
            }, {
                field: 'kddh',
                title: '快递单号',
                align: 'center',
                sortable: true,
                width: 100,
            }, {
                field: 'sfyj',
                title: '是否月结',
                align: 'center',
                sortable: true,
                width: 100,
            }, {
                field: 'fkfs',
                title: '付款方式',
                align: 'center',
                sortable: true,
                width: 100,
            }, {
                field: 'sfhs',
                title: '是否含税',
                align: 'center',
                sortable: true,
                width: 100,
            }, {
                field: 'gd',
                title: '跟单',
                align: 'center',
                sortable: true,
                width: 80,
            }, {
                field: 'zdr',
                title: '制单人',
                align: 'center',
                sortable: true,
                width: 80,
            }
            // , {
            //     field: 'shdwjjsr',
            //     title: '收货单位及经手人',
            //     align: 'center',
            //     sortable: true,
            //     width: 150,
            // }
            , {
                field: 'jgf',
                title: '锯工费',
                align: 'center',
                sortable: true,
                width: 80,
            }, {
                field: 'kdf',
                title: '快递费',
                align: 'center',
                sortable: true,
                width: 80,
            }, {
                field: 'hsdj',
                title: '含税单价',
                align: 'center',
                sortable: true,
                width: 100,
            }, {
                field: 'sd',
                title: '税点',
                align: 'center',
                sortable: true,
                width: 80,
            }, {
                field: 'whsdj',
                title: '未含税单价',
                align: 'center',
                sortable: true,
                width: 130,
            }, {
                field: 'bz',
                title: '备注',
                align: 'center',
                sortable: true,
                width: 150,
            }
        ],
        onClickRow: function (row, el) {
            let isSelect = $(el).hasClass('selected')
            if (isSelect) {
                $(el).removeClass('selected')
            } else {
                $(el).addClass('selected')
            }
        }
    })
}
