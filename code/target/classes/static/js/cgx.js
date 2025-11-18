// var idd;
// let count = 1;
// let shuzi = 0;
//
// function getGsm() {
//     $ajax({
//         type: 'post',
//         url: '/khzl/hqxlGsm',
//     }, false, '', function (res) {
//         if (res.code == 200) {
//             var item = "";
//             for (let i = 0; i < res.data.length; i++) {
//                 $("#add-shdw").append("<option>" + res.data[i].gsm + "</option>");
//                 $("#update-shdw").append("<option>" + res.data[i].gsm + "</option>");
//                 item = "<option value=\"" + res.data[i].gsm + "\">" + res.data[i].gsm + "</option>"
//             }
//         }
//     })
// }
//
// // $('#update-model').on('shown.bs.modal', function () {
// //     $('#update-shdw').select2({
// //         placeholder: "请选择",
// //         allowClear: true,
// //         minimumInputLength: 1,
// //         ajax: {
// //             url: '/khzl/hqxlGsm', // 替换为你的API地址
// //             dataType: 'json',
// //             delay: 250,
// //             data: function (params) {
// //                 return {
// //                     q: params.term, // 搜索词
// //                     page: params.page || 1
// //                 };
// //             },
// //             processResults: function (data, params) {
// //                 params.page = params.page || 1;
// //                 return {
// //                     results: data.items,
// //                     pagination: {
// //                         more: (params.page * 30) < data.total_count
// //                     }
// //                 };
// //             },
// //             cache: true
// //         },
// //         escapeMarkup: function (markup) { return markup; }, // let our custom formatter work
// //         minimumInputLength: 1,
// //         templateResult: formatRepo, // omitted for brevity, see the next section
// //         templateSelection: formatRepoSelection // omitted for brevity, see the next section
// //     });
// // });
// function shdp() {
//     window.location.href = "shd.html?biaoji=123";
// }
//
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
//             }
//         }
//     })
// }
//
// function getList() {
//     // $('#ksrq').val("");
//     // $('#jsrq').val("");
//
//     var date = new Date();
//     date.setMonth(date.getMonth() - 3);
//     var year = date.getFullYear();
//     var month = ('0' + (date.getMonth() + 1)).slice(-2);
//     var day = ('0' + date.getDate()).slice(-2);
//     var ks = year + '-' + month + '-' + day
//     document.getElementById("ksrq").value = ks;
//     var jsyear = date.getFullYear();
//     var jsmonth = ('0' + (date.getMonth() + 4)).slice(-2);
//     var jsday = ('0' + date.getDate()).slice(-2);
//     var js = jsyear + '-' + jsmonth + '-' + jsday
//     document.getElementById("jsrq").value = js;
//
//     $ajax({
//         type: 'post',
//         url: '/cgx/getList',
//     }, false, '', function (res) {
//         if (res.code == 200) {
//             setTable(res.data);
//             $("#cgxTable").colResizable({
//                 liveDrag: true,
//                 gripInnerHtml: "<div class='grip'></div>",
//                 draggingClass: "dragging",
//                 resizeMode: 'fit'
//             });
//             var table = document.getElementById("cgxTable");
//             var rows = table.rows;
//             var cells = table.cells;
//             var colums = table.rows[0].cells.length;
//             // for(var x=1;x<colums;x++){
//             //     var zje = 0;
//             //     for(var j = 1;j<rows.length-1;j++){
//             //         var a = parseInt(rows[j].cells[10].innerHTML);
//             //         zje = zje+a
//             //     }
//             //     document.getElementById('zje').value = zje
//             // }
//             for (i = 0; i <= res.data.id; i++) {
//                 idd = i;
//             }
//         }
//     })
// }
//
// $(function () {
//     getList();
//     getGsm();
//     getMc();
//     var date = new Date();
//     date.setMonth(date.getMonth() - 3);
//     var year = date.getFullYear();
//     var month = ('0' + (date.getMonth() + 1)).slice(-2);
//     var day = ('0' + date.getDate()).slice(-2);
//     var ks = year + '-' + month + '-' + day
//     document.getElementById("ksrq").value = ks;
//     var jsyear = date.getFullYear();
//     var jsmonth = ('0' + (date.getMonth() + 4)).slice(-2);
//     var jsday = ('0' + date.getDate()).slice(-2);
//     var js = jsyear + '-' + jsmonth + '-' + jsday
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
//         $ajax({
//             type: 'post',
//             url: '/cgx/queryList',
//             data: {
//                 ksrq: ksrq,
//                 jsrq: jsrq,
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
//         // document.getElementById('add-sfhs').addEventListener('change', function() {
//         //     var selectedOption = this.value;
//         //     var textBoxes = document.querySelectorAll('input[type="text"]');
//         //     // 根据选择的option值锁定对应的文本框
//         //     if (selectedOption === '未含税') {
//         //         document.getElementById('add-hsdj').disabled = true;
//         //         document.getElementById('add-sd').disabled = true;
//         //         document.getElementById('add-whsdj').disabled = false;
//         //     }else{
//         //         document.getElementById('add-whsdj').disabled = true;
//         //         document.getElementById('add-hsdj').disabled = false;
//         //         document.getElementById('add-sd').disabled = false;
//         //     }
//         // });
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
//         // var js = parseFloat(document.getElementById('add-js').value);
//         // var jgf = js * 0.5
//         // document.getElementById("add-jgf").value = jgf
//         if (parseFloat(document.getElementById('add-sd').value) != 0) {
//             var hsdj = parseFloat(document.getElementById('add-hsdj').value);
//             var sd = parseFloat(document.getElementById('add-sd').value);
//             var whsdj = hsdj / sd
//             document.getElementById("add-whsdj").value = whsdj
//         }
//
//         let params = formToJson("#add-form");
//         if (checkForm('#add-form')) {
//             $ajax({
//                 type: 'post',
//                 url: '/xsd/add',
//                 data: JSON.stringify({
//                     addInfo: params
//                 }),
//                 dataType: 'json',
//                 contentType: 'application/json;charset=utf-8'
//             }, false, '', function (res) {
//                 if (res.code == 200) {
//                     swal("", res.msg, "success");
//                     $('#add-form')[0].reset();
//                     getList();
//                     $('#add-close-btn').click();
//                 }
//             })
//         }
//     });
//
//     //新增弹窗里点击暂存按钮
//     $("#add-zancun-btn").click(function () {
//
//         var js = parseFloat(document.getElementById('add-js').value);
//         var zl = parseFloat(document.getElementById('add-zl').value);
//         var dj = parseFloat(document.getElementById('add-dj').value);
//         var je = js * zl * dj
//         document.getElementById("add-je").value = je
//
//         var jgf = js * 0.5
//         document.getElementById("update-jgf").value = jgf
//
//         if (parseFloat(document.getElementById('add-sd').value) != 0) {
//             var hsdj = parseFloat(document.getElementById('add-hsdj').value);
//             var sd = parseFloat(document.getElementById('add-sd').value);
//             var whsdj = hsdj / sd
//             document.getElementById("add-whsdj").value = whsdj
//         }
//
//         let params = formToJson("#add-form");
//         if (checkForm('#add-form')) {
//             $ajax({
//                 type: 'post',
//                 url: '/cgx/add',
//                 data: JSON.stringify({
//                     addInfo: params
//                 }),
//                 dataType: 'json',
//                 contentType: 'application/json;charset=utf-8'
//             }, false, '', function (res) {
//                 if (res.code == 200) {
//                     swal("", res.msg, "success");
//                     $('#add-form')[0].reset();
//                     getList();
//                     $('#add-close-btn').click();
//                 }
//             })
//         }
//     });
//     // $('#print-btn').click(function (){
//     //     let rows = getTableSelection('#cgxTable');
//     //     if (rows.length > 1 || rows.length == 0) {
//     //         swal('请选择一条数据打印!');
//     //         return;
//     //     }
//     //     $('#update-modal').modal('show');
//     //     setForm(rows[0].data, '#update-form');
//     //     $('#update-riqi').val(rows[0].data.riqi);
//     //     $('#update-dh').val(rows[0].data.dh);
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
//     //     $('#update-shhs').val(rows[0].data.sfhs);
//     //     $('#update-gd').val(rows[0].data.gd);
//     //     $('#update-zdr').val(rows[0].data.zdr);
//     //     $('#update-shdwjjsr').val(rows[0].data.shdwjjsr);
//     //     $('#update-jgf').val(rows[0].data.jgf);
//     //     $('#update-kdf').val(rows[0].data.kdf);
//     //     $('#update-hsdj').val(rows[0].data.hsdj);
//     //     $('#update-sd').val(rows[0].data.sd);
//     //     $('#update-whsdj').val(rows[0].data.whsdj);
//     //     $ajax()
//     // })
//
//
//     //点击修改按钮显示弹窗
//     $('#update-btn').click(function () {
//         // $('#update-shdw').select2({
//         //     placeholder: '请选择收货单位',
//         //     ajax: {
//         //         url: '/khzl/hqxlGsm', // 替换为你的API地址
//         //         dataType: 'json',
//         //         delay: 250,
//         //         processResults: function (data) {
//         //             return {
//         //                 results: data.items
//         //             };
//         //         },
//         //         cache: true
//         //     }
//         // });
//         let rows = getTableSelection('#cgxTable');
//         if (rows.length > 1 || rows.length == 0) {
//             swal('请选择一条数据修改!');
//             return;
//         }
//         var dh = rows[0].data.dh;
//         $ajax({
//             type: 'post',
//             url: '/cgx/getListdh',
//             data: {
//                 dh: dh
//             },
//         }, false, '', function (res) {
//             if (res.code == 200) {
//                 $('#update-modal').modal('show');
//                 // setForm(rows[0].data, '#update-form');
//                 if (res.data.length == 1) {
//                     document.getElementById("t1").hidden = true
//                     document.getElementById("t2").hidden = true
//                     document.getElementById("t3").hidden = true
//                     document.getElementById("t4").hidden = true
//                     document.getElementById("t5").hidden = true
//                     document.getElementById("t6").hidden = true
//                     document.getElementById("t7").hidden = true
//                     document.getElementById("t8").hidden = true
//                     document.getElementById("t9").hidden = true
//                     document.getElementById("t10").hidden = true
//                     // document.getElementById("t11").hidden=true
//                     document.getElementById("t12").hidden = true
//                     document.getElementById("t13").hidden = true
//                     document.getElementById("t14").hidden = true
//                     document.getElementById("t15").hidden = true
//                     document.getElementById("t16").hidden = true
//                     document.getElementById("t17").hidden = true
//                     document.getElementById("t18").hidden = true
//                     document.getElementById("t19").hidden = true
//                     document.getElementById("t20").hidden = true
//                 } else if (res.data.length == 2) {
//                     document.getElementById("t1").hidden = true
//                     document.getElementById("t2").hidden = true
//                     document.getElementById("t3").hidden = true
//                     document.getElementById("t4").hidden = true
//                     document.getElementById("t5").hidden = true
//                     document.getElementById("t6").hidden = true
//                     document.getElementById("t7").hidden = true
//                     document.getElementById("t8").hidden = true
//                     document.getElementById("t9").hidden = true
//                     document.getElementById("t10").hidden = true
//                     // document.getElementById("t11").hidden=true
//                     // document.getElementById("t12").hidden=true
//                     document.getElementById("t13").hidden = true
//                     document.getElementById("t14").hidden = true
//                     document.getElementById("t15").hidden = true
//                     document.getElementById("t16").hidden = true
//                     document.getElementById("t17").hidden = true
//                     document.getElementById("t18").hidden = true
//                     document.getElementById("t19").hidden = true
//                     document.getElementById("t20").hidden = true
//                 } else if (res.data.length == 3) {
//                     document.getElementById("t1").hidden = true
//                     document.getElementById("t2").hidden = true
//                     document.getElementById("t3").hidden = true
//                     document.getElementById("t4").hidden = true
//                     document.getElementById("t5").hidden = true
//                     document.getElementById("t6").hidden = true
//                     document.getElementById("t7").hidden = true
//                     document.getElementById("t8").hidden = true
//                     document.getElementById("t9").hidden = true
//                     document.getElementById("t10").hidden = true
//                     // document.getElementById("t11").hidden=true
//                     // document.getElementById("t12").hidden=true
//                     // document.getElementById("t13").hidden=true
//                     document.getElementById("t14").hidden = true
//                     document.getElementById("t15").hidden = true
//                     document.getElementById("t16").hidden = true
//                     document.getElementById("t17").hidden = true
//                     document.getElementById("t18").hidden = true
//                     document.getElementById("t19").hidden = true
//                     document.getElementById("t20").hidden = true
//                 } else if (res.data.length == 4) {
//                     document.getElementById("t1").hidden = true
//                     document.getElementById("t2").hidden = true
//                     document.getElementById("t3").hidden = true
//                     document.getElementById("t4").hidden = true
//                     document.getElementById("t5").hidden = true
//                     document.getElementById("t6").hidden = true
//                     document.getElementById("t7").hidden = true
//                     document.getElementById("t8").hidden = true
//                     document.getElementById("t9").hidden = true
//                     document.getElementById("t10").hidden = true
//                     // document.getElementById("t11").hidden=true
//                     // document.getElementById("t12").hidden=true
//                     // document.getElementById("t13").hidden=true
//                     // document.getElementById("t14").hidden=true
//                     document.getElementById("t15").hidden = true
//                     document.getElementById("t16").hidden = true
//                     document.getElementById("t17").hidden = true
//                     document.getElementById("t18").hidden = true
//                     document.getElementById("t19").hidden = true
//                     document.getElementById("t20").hidden = true
//                 } else if (res.data.length == 5) {
//                     document.getElementById("t1").hidden = true
//                     document.getElementById("t2").hidden = true
//                     document.getElementById("t3").hidden = true
//                     document.getElementById("t4").hidden = true
//                     document.getElementById("t5").hidden = true
//                     document.getElementById("t6").hidden = true
//                     document.getElementById("t7").hidden = true
//                     document.getElementById("t8").hidden = true
//                     document.getElementById("t9").hidden = true
//                     document.getElementById("t10").hidden = true
//                     // document.getElementById("t11").hidden=true
//                     // document.getElementById("t12").hidden=true
//                     // document.getElementById("t13").hidden=true
//                     // document.getElementById("t14").hidden=true
//                     // document.getElementById("t15").hidden=true
//                     document.getElementById("t16").hidden = true
//                     document.getElementById("t17").hidden = true
//                     document.getElementById("t18").hidden = true
//                     document.getElementById("t19").hidden = true
//                     document.getElementById("t20").hidden = true
//                 } else if (res.data.length == 6) {
//                     document.getElementById("t1").hidden = true
//                     document.getElementById("t2").hidden = true
//                     document.getElementById("t3").hidden = true
//                     document.getElementById("t4").hidden = true
//                     document.getElementById("t5").hidden = true
//                     document.getElementById("t6").hidden = true
//                     document.getElementById("t7").hidden = true
//                     document.getElementById("t8").hidden = true
//                     document.getElementById("t9").hidden = true
//                     document.getElementById("t10").hidden = true
//                     // document.getElementById("t11").hidden=true
//                     // document.getElementById("t12").hidden=true
//                     // document.getElementById("t13").hidden=true
//                     // document.getElementById("t14").hidden=true
//                     // document.getElementById("t15").hidden=true
//                     // document.getElementById("t16").hidden=true
//                     document.getElementById("t17").hidden = true
//                     document.getElementById("t18").hidden = true
//                     document.getElementById("t19").hidden = true
//                     document.getElementById("t20").hidden = true
//                 } else if (res.data.length == 7) {
//                     document.getElementById("t1").hidden = true
//                     document.getElementById("t2").hidden = true
//                     document.getElementById("t3").hidden = true
//                     document.getElementById("t4").hidden = true
//                     document.getElementById("t5").hidden = true
//                     document.getElementById("t6").hidden = true
//                     document.getElementById("t7").hidden = true
//                     document.getElementById("t8").hidden = true
//                     document.getElementById("t9").hidden = true
//                     document.getElementById("t10").hidden = true
//                     // document.getElementById("t11").hidden=true
//                     // document.getElementById("t12").hidden=true
//                     // document.getElementById("t13").hidden=true
//                     // document.getElementById("t14").hidden=true
//                     // document.getElementById("t15").hidden=true
//                     // document.getElementById("t16").hidden=true
//                     // document.getElementById("t17").hidden=true
//                     document.getElementById("t18").hidden = true
//                     document.getElementById("t19").hidden = true
//                     document.getElementById("t20").hidden = true
//                 } else if (res.data.length == 8) {
//                     document.getElementById("t1").hidden = true
//                     document.getElementById("t2").hidden = true
//                     document.getElementById("t3").hidden = true
//                     document.getElementById("t4").hidden = true
//                     document.getElementById("t5").hidden = true
//                     document.getElementById("t6").hidden = true
//                     document.getElementById("t7").hidden = true
//                     document.getElementById("t8").hidden = true
//                     document.getElementById("t9").hidden = true
//                     document.getElementById("t10").hidden = true
//                     // document.getElementById("t11").hidden=true
//                     // document.getElementById("t12").hidden=true
//                     // document.getElementById("t13").hidden=true
//                     // document.getElementById("t14").hidden=true
//                     // document.getElementById("t15").hidden=true
//                     // document.getElementById("t16").hidden=true
//                     // document.getElementById("t17").hidden=true
//                     // document.getElementById("t18").hidden=true
//                     document.getElementById("t19").hidden = true
//                     document.getElementById("t20").hidden = true
//                 } else if (res.data.length == 9) {
//                     document.getElementById("t1").hidden = true
//                     document.getElementById("t2").hidden = true
//                     document.getElementById("t3").hidden = true
//                     document.getElementById("t4").hidden = true
//                     document.getElementById("t5").hidden = true
//                     document.getElementById("t6").hidden = true
//                     document.getElementById("t7").hidden = true
//                     document.getElementById("t8").hidden = true
//                     document.getElementById("t9").hidden = true
//                     document.getElementById("t10").hidden = true
//                     // document.getElementById("t11").hidden=true
//                     // document.getElementById("t12").hidden=true
//                     // document.getElementById("t13").hidden=true
//                     // document.getElementById("t14").hidden=true
//                     // document.getElementById("t15").hidden=true
//                     // document.getElementById("t16").hidden=true
//                     // document.getElementById("t17").hidden=true
//                     // document.getElementById("t18").hidden=true
//                     // document.getElementById("t19").hidden=true
//                     document.getElementById("t20").hidden = true
//                 } else if (res.data.length == 10) {
//                     document.getElementById("t1").hidden = true
//                     document.getElementById("t2").hidden = true
//                     document.getElementById("t3").hidden = true
//                     document.getElementById("t4").hidden = true
//                     document.getElementById("t5").hidden = true
//                     document.getElementById("t6").hidden = true
//                     document.getElementById("t7").hidden = true
//                     document.getElementById("t8").hidden = true
//                     document.getElementById("t9").hidden = true
//                     document.getElementById("t10").hidden = true
//                 }
//                 for (i = 0; i < res.data.length; i++) {
//                     if (i == 0) {
//                         $('#update-xuhao').val(i + 1);
//                         $('#update-riqi').val(res.data[0].riqi);
//                         $('#update-dh').val(res.data[0].dh);
//                         $('#update-shdw').val(res.data[0].shdw);
//                         $('#update-mc').val(res.data[0].mc);
//                         $('#update-mh').val(res.data[0].mh);
//                         $('#update-gg').val(res.data[0].gg);
//                         $('#update-js').val(res.data[0].js);
//                         $('#update-zl').val(res.data[0].zl);
//                         $('#update-dj').val(res.data[0].dj);
//                         $('#update-je').val(res.data[0].je);
//                         $('#update-bz').val(res.data[0].bz);
//                         $('#update-shdz').val(res.data[0].shdz);
//                         $('#update-kddh').val(res.data[0].kddh);
//                         $('#update-sfyj').val(res.data[0].sfyj);
//                         $('#update-fkfs').val(res.data[0].fkfs);
//                         $('#update-sfhs').val(res.data[0].sfhs);
//                         $('#update-gd').val(res.data[0].gd);
//                         $('#update-zdr').val(res.data[0].zdr);
//                         $('#update-shdwjjsr').val(res.data[0].shdwjjsr);
//                         $('#update-jgf').val(res.data[0].jgf);
//                         $('#update-kdf').val(res.data[0].kdf);
//                         $('#update-hsdj').val(res.data[0].hsdj);
//                         $('#update-sd').val(res.data[0].sd);
//                         $('#update-whsdj').val(res.data[0].whsdj);
//                         $('#update-bzld').val(res.data[0].bzld);
//                     } else {
//                         document.getElementById("update-xuhao" + i).value = i + 1;
//                         // document.getElementById("update-riqi"+i).value=res.data[i].riqi;
//                         // document.getElementById("update-dh"+i).value=res.data[i].dh;
//                         // document.getElementById("update-shdw"+i).value=res.data[i].shdw;
//                         document.getElementById("update-mc" + i).value = res.data[i].mc;
//                         document.getElementById("update-mh" + i).value = res.data[i].mh;
//                         document.getElementById("update-gg" + i).value = res.data[i].gg;
//                         document.getElementById("update-js" + i).value = res.data[i].js;
//                         document.getElementById("update-zl" + i).value = res.data[i].zl;
//                         document.getElementById("update-dj" + i).value = res.data[i].dj;
//                         document.getElementById("update-je" + i).value = res.data[i].je;
//                         document.getElementById("update-bz" + i).value = res.data[i].bz;
//                         // document.getElementById("update-shdz"+i).value=res.data[i].shdz;
//                         // document.getElementById("update-kddh"+i).value=res.data[i].kddh;
//                         // document.getElementById("update-sfyj"+i).value=res.data[i].sfyj;
//                         // document.getElementById("update-fkfs"+i).value=res.data[i].fkfs;
//                         // document.getElementById("update-shhs"+i).value=res.data[i].sfhs;
//                         // document.getElementById("update-gd"+i).value=res.data[i].gd;
//                         // document.getElementById("update-zdr"+i).value=res.data[i].zdr;
//                         // document.getElementById("update-shdwjjsr"+i).value=res.data[i].shdwjjsr;
//                         // document.getElementById("update-jgf"+i).value=res.data[i].jgf;
//                         // document.getElementById("update-kdf"+i).value=res.data[i].kdf;
//                         // document.getElementById("update-hsdj"+i).value=res.data[i].hsdj;
//                         // document.getElementById("update-sd"+i).value=res.data[i].sd;
//                         // document.getElementById("update-whsdj"+i).value=res.data[i].whsdj;
//                     }
//                 }
//             }
//         })
//
//         // var riqi= $('#update-riqi').val();
//         // var dh= $('#update-dh').val();
//         // var shdw= $('#update-shdw').val();
//         // var shdz= $('#update-shdz').val();
//         // var kddh= $('#update-kddh').val();
//         // var sfyj=$('#update-sfyj').val();
//         // var fkfs= $('#update-fkfs').val();
//         //  var sfhs=$('#update-sfhs').val();
//         // var gd= $('#update-gd').val();
//         // var zdr = $('#update-zdr').val();
//         //
//         // var kdf =$('#update-kdf').val();
//         // var sd =  $('#update-sd').val();
//
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
//     //修改弹窗点击关闭按钮
//     $('#update-close-btn').click(function () {
//         $('#update-form')[0].reset();
//         $('#update-modal').modal('hide');
//     });
//
//     //修改弹窗里点击提交按钮
//     $('#update-submit-btn').click(function () {
//         // var msg = confirm("确认要修改吗？");
//         //
//         // var js = parseFloat(document.getElementById('update-js').value);
//         // var zl = parseFloat(document.getElementById('update-zl').value);
//         // var dj = parseFloat(document.getElementById('update-dj').value);
//         // var je = js * zl * dj
//         // document.getElementById("update-je").value = je
//         //
//         // if (parseFloat(document.getElementById('update-sd').value) != 0) {
//         //     var hsdj = parseFloat(document.getElementById('update-hsdj').value);
//         //     var sd = parseFloat(document.getElementById('update-sd').value);
//         //     var whsdj = hsdj / sd
//         //     document.getElementById("update-whsdj").value = whsdj
//         // }
//         //
//         // if (msg) {
//         //     if (checkForm('#update-form')) {
//         //         let params = formToJson('#update-form');
//         //         $ajax({
//         //             type: 'post',
//         //             url: '/xsd/add',
//         //             data: {
//         //                 updateJson: JSON.stringify(params)
//         //             },
//         //             dataType: 'json',
//         //             contentType: 'application/json;charset=utf-8'
//         //         }, false, '', function (res) {
//         //             if (res.code == 200) {
//         //                 swal("", res.msg, "success");
//         //                 $('#update-close-btn').click();
//         //                 $('#update-modal').modal('hide');
//         //                 getList();
//         //             } else {
//         //                 swal("", res.msg, "error");
//         //             }
//         //         })
//         //     }
//         // }
//
//         // var js = parseFloat(document.getElementById('update-js').value);
//         // var zl = parseFloat(document.getElementById('update-zl').value);
//         // var dj = parseFloat(document.getElementById('update-dj').value);
//         // var je = js * zl * dj
//         // var hjzl = zl;
//         // document.getElementById("update-je").value = je
//         // var jgf = js * 0.5
//         // document.getElementById("update-jgf").value = jgf
//         // var kdf = document.getElementById("update-kdf").value;
//         // var hjje = jgf +je+kdf;
//         // if (parseFloat(document.getElementById('update-sd').value) != 0 ){
//         //     var hsdj = parseFloat(document.getElementById('update-hsdj').value);
//         //     var sd = parseFloat(document.getElementById('update-sd').value);
//         //     var whsdj = hsdj / sd
//         //     var aa = whsdj.toFixed(2)
//         //     document.getElementById("update-whsdj").value = aa
//         // }
//         for (i = 0; i < 20; i++) {
//             if (i == 0) {
//                 var mc = document.getElementById("update-mc").value;
//                 var mh = document.getElementById("update-mh").value;
//                 var gg = document.getElementById("update-gg").value;
//                 var js = document.getElementById("update-js").value;
//                 var zl = document.getElementById("update-zl").value;
//                 var dj = document.getElementById("update-dj").value;
//                 var dh = document.getElementById("update-dh").value;
//                 // var je = document.getElementById("update-je").value;
//                 var bz = document.getElementById("update-bz").value;
//             } else {
//                 var mc = document.getElementById("update-mc" + i).value;
//                 var mh = document.getElementById("update-mh" + i).value;
//                 var gg = document.getElementById("update-gg" + i).value;
//                 var js = document.getElementById("update-js" + i).value;
//                 var zl = document.getElementById("update-zl" + i).value;
//                 var dj = document.getElementById("update-dj" + i).value;
//                 // var je = document.getElementById("update-je"+i).value;
//                 var bz = document.getElementById("update-bz" + i).value;
//             }
//             var riqi = $('#update-riqi').val();
//             var dh = $('#update-dh').val();
//             var shdw = $('#update-shdw').val();
//             var shdz = $('#update-shdz').val();
//             var kddh = $('#update-kddh').val();
//             var sfyj = $('#update-sfyj').val();
//             var fkfs = $('#update-fkfs').val();
//             var sfhs = $('#update-sfhs').val();
//             var gd = $('#update-gd').val();
//             var zdr = $('#update-zdr').val();
//             var kdf = $('#update-kdf').val();
//             var sd = $('#update-sd').val();
//             var bzld = $('#update-bzld').val();
//
//             $ajax({
//                 type: 'post',
//                 url: '/xsd/add',
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
//                     bzld: bzld
//                 },
//
//             }, false, '', function (res) {
//                 if (res.code == 200) {
//                     swal("", res.msg, "success");
//                     $('#update-form')[0].reset();
//                     getList();
//                     $('#update-close-btn').click();
//                 }
//             })
//
//         }
//         //
//         // let rows = getTableSelection("#cgxTable");
//         // if (rows.length == 0) {
//         //     swal('请选择要删除的数据！');
//         //     return;
//         // }
//         // let idList = [];
//         // $.each(rows, function (index, row) {
//         //     idList.push(row.data.id)
//         // });
//         // $ajax({
//         //     type: 'post',
//         //     url: '/cgx/delete',
//         //     data: JSON.stringify({
//         //         idList: idList
//         //     }),
//         //     dataType: 'json',
//         //     contentType: 'application/json;charset=utf-8'
//         // }, false, '', function (res) {
//         //     if (res.code == 200) {
//         //         swal("", res.msg, "success");
//         //         getList();
//         //     } else {
//         //         swal("", res.msg, "error");
//         //     }
//         // })
//     });
//
//     //修改弹窗里点击暂存按钮
//     $('#update-zancun-btn').click(function () {
//         var msg = confirm("确认要修改吗？");
//         if (msg) {
//             if (checkForm('#update-form')) {
//                 let params = formToJson('#update-form');
//                 $ajax({
//                     type: 'post',
//                     url: '/cgx/update',
//                     data: {
//                         updateJson: JSON.stringify(params)
//                     },
//                     dataType: 'json',
//                     contentType: 'application/json;charset=utf-8'
//                 }, false, '', function (res) {
//                     if (res.code == 200) {
//                         swal("", res.msg, "success");
//                         $('#update-close-btn').click();
//                         $('#update-modal').modal('hide');
//                         getList();
//                     } else {
//                         swal("", res.msg, "error");
//                     }
//                 })
//             }
//         }
//     });
//
//     //点击删除按钮
//     $('#delete-btn').click(function () {
//         var msg = confirm("确认要删除吗？");
//         if (msg) {
//             let rows = getTableSelection("#cgxTable");
//             if (rows.length == 0) {
//                 swal('请选择要删除的数据！');
//                 return;
//             }
//             let idList = [];
//             $.each(rows, function (index, row) {
//                 idList.push(row.data.id)
//             });
//             $ajax({
//                 type: 'post',
//                 url: '/cgx/delete',
//                 data: JSON.stringify({
//                     idList: idList
//                 }),
//                 dataType: 'json',
//                 contentType: 'application/json;charset=utf-8'
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
//
//     $('#update1-btn').click(function () {
//         var c=window.confirm("修改会删除旧数据，确认修改？")
//         if(c) {
//             let rows = getTableSelection('#cgxTable');
//             if (rows.length > 1 || rows.length == 0) {
//                 swal('请选择一条数据修改!');
//                 return;
//             }
//             let idList = [];
//             $.each(rows, function (index, row) {
//                 idList.push(row.data.id)
//             });
//             var dh = rows[0].data.dh;
//             $ajax({
//                 type: 'post',
//                 url: '/cgx/getListdh',
//                 data: {
//                     dh: dh
//                 },
//             }, false, '', function (res) {
//                 shuzi = res.data.length;
//                 for (i = 0; i < res.data.length; i++) {
//
//                     if (i == 0) {
//                         $('#update-xuhao').val(i + 1);
//                         $('#update-riqi').val(res.data[0].riqi);
//                         $('#update-dh').val(res.data[0].dh);
//                         $('#update-shdw').val(res.data[0].shdw);
//                         $('#update-mc').val(res.data[0].mc);
//                         $('#update-mh').val(res.data[0].mh);
//                         $('#update-gg').val(res.data[0].gg);
//                         $('#update-js').val(res.data[0].js);
//                         $('#update-zl').val(res.data[0].zl);
//                         $('#update-dj').val(res.data[0].dj);
//                         $('#update-je').val(res.data[0].je);
//                         $('#update-bz').val(res.data[0].bz);
//                         $('#update-shdz').val(res.data[0].shdz);
//                         $('#update-kddh').val(res.data[0].kddh);
//                         $('#update-sfyj').val(res.data[0].sfyj);
//                         $('#update-fkfs').val(res.data[0].fkfs);
//                         $('#update-sfhs').val(res.data[0].sfhs);
//                         $('#update-gd').val(res.data[0].gd);
//                         $('#update-zdr').val(res.data[0].zdr);
//                         $('#update-shdwjjsr').val(res.data[0].shdwjjsr);
//                         $('#update-jgf').val(res.data[0].jgf);
//                         $('#update-kdf').val(res.data[0].kdf);
//                         $('#update-hsdj').val(res.data[0].hsdj);
//                         $('#update-sd').val(res.data[0].sd);
//                         $('#update-whsdj').val(res.data[0].whsdj);
//                         $('#update-bzld').val(res.data[0].bzld);
//                     } else {
//                         document.getElementById("update-xuhao" + i).value = i + 1;
//
//                         document.getElementById("update-mc" + i).value = res.data[i].mc;
//                         document.getElementById("update-mh" + i).value = res.data[i].mh;
//                         document.getElementById("update-gg" + i).value = res.data[i].gg;
//                         document.getElementById("update-js" + i).value = res.data[i].js;
//                         document.getElementById("update-zl" + i).value = res.data[i].zl;
//                         document.getElementById("update-dj" + i).value = res.data[i].dj;
//                         document.getElementById("update-je" + i).value = res.data[i].je;
//                         document.getElementById("update-bz" + i).value = res.data[i].bz;
//
//                     }
//                 }
//                 for (i = 0; i < shuzi; i++) {
//                     if (i == 0) {
//                         var mc = document.getElementById("update-mc").value;
//                         var mh = document.getElementById("update-mh").value;
//                         var gg = document.getElementById("update-gg").value;
//                         var js = document.getElementById("update-js").value;
//                         var zl = document.getElementById("update-zl").value;
//                         var dj = document.getElementById("update-dj").value;
//                         var dh = document.getElementById("update-dh").value;
//                         // var je = document.getElementById("update-je").value;
//                         var bz = document.getElementById("update-bz").value;
//                     } else {
//                         var mc = document.getElementById("update-mc" + i).value;
//                         var mh = document.getElementById("update-mh" + i).value;
//                         var gg = document.getElementById("update-gg" + i).value;
//                         var js = document.getElementById("update-js" + i).value;
//                         var zl = document.getElementById("update-zl" + i).value;
//                         var dj = document.getElementById("update-dj" + i).value;
//                         // var je = document.getElementById("update-je"+i).value;
//                         var bz = document.getElementById("update-bz" + i).value;
//                     }
//                     var riqi = $('#update-riqi').val();
//                     var dh = $('#update-dh').val();
//                     var shdw = $('#update-shdw').val();
//                     var shdz = $('#update-shdz').val();
//                     var kddh = $('#update-kddh').val();
//                     var sfyj = $('#update-sfyj').val();
//                     var fkfs = $('#update-fkfs').val();
//                     var sfhs = $('#update-sfhs').val();
//                     var gd = $('#update-gd').val();
//                     var zdr = $('#update-zdr').val();
//                     var kdf = $('#update-kdf').val();
//                     var sd = $('#update-sd').val();
//                     var bzld = $('#update-bzld').val();
//
//                     $ajax({
//                         type: 'post',
//                         url: '/shdp/add1',
//                         data: {
//                             riqi: riqi,
//                             dh: dh,
//                             mc: mc,
//                             mh: mh,
//                             gg: gg,
//                             js: js,
//                             zl: zl,
//                             dj: dj,
//                             shdw: shdw,
//                             bz: bz,
//                             kdf: kdf,
//                             sd: sd,
//                             zdr: zdr,
//                             gd: gd,
//                             sfhs: sfhs,
//                             sfyj: sfyj,
//                             kddh: kddh,
//                             shdz: shdz,
//                             fkfs: fkfs,
//                             shdz: shdz,
//                             bzld: bzld
//                         },
//
//                     }, false, '', function (res) {
//                         if (res.code == 200) {
//                             swal("", res.msg, "success");
//                             $('#update-form')[0].reset();
//                             getList();
//                             $('#update-close-btn').click();
//                         }
//                     })
//                 }
//                 $ajax({
//                     type: 'post',
//                     url: '/cgx/delete1',
//                     data:{
//                         dh: dh
//                     },
//                 }, false, '', function (res) {
//                     if (res.code == 200) {
//                         swal("", res.msg, "success");
//                         getList();
//                     } else {
//                         swal("", res.msg, "error");
//                     }
//                 })
//                 shdp();
//             })
//
//
//         }
//     });
// })
//
// function setTable(data) {
//     if ($('#cgxTable').html != '') {
//         $('#cgxTable').bootstrapTable('load', data);
//     }
//
//     $('#cgxTable').bootstrapTable({
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
//         style: 'table-layout:fixed',
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
//             }, {
//                 field: 'mc',
//                 title: '名称',
//                 align: 'center',
//                 sortable: true,
//                 width: 80,
//             }, {
//                 field: 'mh',
//                 title: '模号',
//                 align: 'center',
//                 sortable: true,
//                 width: 80,
//             }, {
//                 field: 'gg',
//                 title: '规格',
//                 align: 'center',
//                 sortable: true,
//                 width: 80,
//             }, {
//                 field: 'js',
//                 title: '件数',
//                 align: 'center',
//                 sortable: true,
//                 width: 80,
//             }, {
//                 field: 'zl',
//                 title: '重量',
//                 align: 'center',
//                 sortable: true,
//                 width: 80,
//             }, {
//                 field: 'dj',
//                 title: '单价',
//                 align: 'center',
//                 sortable: true,
//                 width: 80,
//             }, {
//                 field: 'je',
//                 title: '金额',
//                 align: 'center',
//                 sortable: true,
//                 width: 80,
//             }, {
//                 field: 'bz',
//                 title: '备注',
//                 align: 'center',
//                 sortable: true,
//                 width: 150,
//             }, {
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
//             // , {
//             //     field: 'shdwjjsr',
//             //     title: '收货单位及经手人',
//             //     align: 'center',
//             //     sortable: true,
//             //     width: 150,
//             // }, {
//             //     field: 'jgf',
//             //     title: '锯工费',
//             //     align: 'center',
//             //     sortable: true,
//             //     width: 80,
//             // }, {
//             //     field: 'kdf',
//             //     title: '快递费',
//             //     align: 'center',
//             //     sortable: true,
//             //     width: 80,
//             // }, {
//             //     field: 'hsdj',
//             //     title: '含税单价',
//             //     align: 'center',
//             //     sortable: true,
//             //     width: 100,
//             // }, {
//             //     field: 'sd',
//             //     title: '税点',
//             //     align: 'center',
//             //     sortable: true,
//             //     width: 80,
//             // }, {
//             //     field: 'whsdj',
//             //     title: '未含税单价',
//             //     align: 'center',
//             //     sortable: true,
//             //     width: 130,
//             // }
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
var idd;
let count = 1;
let shuzi = 0;

function getGsm() {
    $ajax({
        type: 'post',
        url: '/khzl/hqxlGsm',
    }, false, '', function (res) {
        if (res.code == 200) {
            var item = "";
            for (let i = 0; i < res.data.length; i++) {
                $("#add-shdw").append("<option>" + res.data[i].gsm + "</option>");
                $("#update-shdw").append("<option>" + res.data[i].gsm + "</option>");
                item = "<option value=\"" + res.data[i].gsm + "\">" + res.data[i].gsm + "</option>"
            }
        }
    })
}

// $('#update-model').on('shown.bs.modal', function () {
//     $('#update-shdw').select2({
//         placeholder: "请选择",
//         allowClear: true,
//         minimumInputLength: 1,
//         ajax: {
//             url: '/khzl/hqxlGsm', // 替换为你的API地址
//             dataType: 'json',
//             delay: 250,
//             data: function (params) {
//                 return {
//                     q: params.term, // 搜索词
//                     page: params.page || 1
//                 };
//             },
//             processResults: function (data, params) {
//                 params.page = params.page || 1;
//                 return {
//                     results: data.items,
//                     pagination: {
//                         more: (params.page * 30) < data.total_count
//                     }
//                 };
//             },
//             cache: true
//         },
//         escapeMarkup: function (markup) { return markup; }, // let our custom formatter work
//         minimumInputLength: 1,
//         templateResult: formatRepo, // omitted for brevity, see the next section
//         templateSelection: formatRepoSelection // omitted for brevity, see the next section
//     });
// });
function shdp() {
    window.location.assign("shd.html?biaoji=123");

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
            }
        }
    })
}

function getList() {
    // $('#ksrq').val("");
    // $('#jsrq').val("");

    var date = new Date();
    date.setMonth(date.getMonth() - 3);
    var year = date.getFullYear();
    var month = ('0' + (date.getMonth() + 1)).slice(-2);
    var day = ('0' + date.getDate()).slice(-2);
    var ks = year + '-' + month + '-' + day
    document.getElementById("ksrq").value = ks;
    var jsyear = date.getFullYear();
    var jsmonth = ('0' + (date.getMonth() + 4)).slice(-2);
    var jsday = ('0' + date.getDate()).slice(-2);
    var js = jsyear + '-' + jsmonth + '-' + jsday
    document.getElementById("jsrq").value = js;

    $ajax({
        type: 'post',
        url: '/cgx/getList',
    }, false, '', function (res) {
        if (res.code == 200) {
            setTable(res.data);
            $("#cgxTable").colResizable({
                liveDrag: true,
                gripInnerHtml: "<div class='grip'></div>",
                draggingClass: "dragging",
                resizeMode: 'fit'
            });
            var table = document.getElementById("cgxTable");
            var rows = table.rows;
            var cells = table.cells;
            var colums = table.rows[0].cells.length;
            // for(var x=1;x<colums;x++){
            //     var zje = 0;
            //     for(var j = 1;j<rows.length-1;j++){
            //         var a = parseInt(rows[j].cells[10].innerHTML);
            //         zje = zje+a
            //     }
            //     document.getElementById('zje').value = zje
            // }
            for (i = 0; i <= res.data.id; i++) {
                idd = i;
            }
        }
    })
}

$(function () {
    getList();
    getGsm();
    getMc();
    var date = new Date();
    date.setMonth(date.getMonth() - 3);
    var year = date.getFullYear();
    var month = ('0' + (date.getMonth() + 1)).slice(-2);
    var day = ('0' + date.getDate()).slice(-2);
    var ks = year + '-' + month + '-' + day
    document.getElementById("ksrq").value = ks;
    var jsyear = date.getFullYear();
    var jsmonth = ('0' + (date.getMonth() + 4)).slice(-2);
    var jsday = ('0' + date.getDate()).slice(-2);
    var js = jsyear + '-' + jsmonth + '-' + jsday
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
        $ajax({
            type: 'post',
            url: '/cgx/queryList',
            data: {
                ksrq: ksrq,
                jsrq: jsrq,
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
        // document.getElementById('add-sfhs').addEventListener('change', function() {
        //     var selectedOption = this.value;
        //     var textBoxes = document.querySelectorAll('input[type="text"]');
        //     // 根据选择的option值锁定对应的文本框
        //     if (selectedOption === '未含税') {
        //         document.getElementById('add-hsdj').disabled = true;
        //         document.getElementById('add-sd').disabled = true;
        //         document.getElementById('add-whsdj').disabled = false;
        //     }else{
        //         document.getElementById('add-whsdj').disabled = true;
        //         document.getElementById('add-hsdj').disabled = false;
        //         document.getElementById('add-sd').disabled = false;
        //     }
        // });
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
        // document.getElementById("add-jgf").value = jgf
        if (parseFloat(document.getElementById('add-sd').value) != 0) {
            var hsdj = parseFloat(document.getElementById('add-hsdj').value);
            var sd = parseFloat(document.getElementById('add-sd').value);
            var whsdj = hsdj / sd
            document.getElementById("add-whsdj").value = whsdj
        }

        let params = formToJson("#add-form");
        if (checkForm('#add-form')) {
            $ajax({
                type: 'post',
                url: '/xsd/add',
                data: JSON.stringify({
                    addInfo: params
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
        }
    });

    //新增弹窗里点击暂存按钮
    $("#add-zancun-btn").click(function () {

        // var js = parseFloat(document.getElementById('add-js').value);
        var zl = parseFloat(document.getElementById('add-zl').value);
        var dj = parseFloat(document.getElementById('add-dj').value);
        var je = zl * dj
        document.getElementById("add-je").value = je

        // var jgf = js * 0.5
        document.getElementById("update-jgf").value = jgf

        if (parseFloat(document.getElementById('add-sd').value) != 0) {
            var hsdj = parseFloat(document.getElementById('add-hsdj').value);
            var sd = parseFloat(document.getElementById('add-sd').value);
            var whsdj = hsdj / sd
            document.getElementById("add-whsdj").value = whsdj
        }

        let params = formToJson("#add-form");
        if (checkForm('#add-form')) {
            $ajax({
                type: 'post',
                url: '/cgx/add',
                data: JSON.stringify({
                    addInfo: params
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
        }
    });
    // $('#print-btn').click(function (){
    //     let rows = getTableSelection('#cgxTable');
    //     if (rows.length > 1 || rows.length == 0) {
    //         swal('请选择一条数据打印!');
    //         return;
    //     }
    //     $('#update-modal').modal('show');
    //     setForm(rows[0].data, '#update-form');
    //     $('#update-riqi').val(rows[0].data.riqi);
    //     $('#update-dh').val(rows[0].data.dh);
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
    //     $('#update-shhs').val(rows[0].data.sfhs);
    //     $('#update-gd').val(rows[0].data.gd);
    //     $('#update-zdr').val(rows[0].data.zdr);
    //     $('#update-shdwjjsr').val(rows[0].data.shdwjjsr);
    //     $('#update-jgf').val(rows[0].data.jgf);
    //     $('#update-kdf').val(rows[0].data.kdf);
    //     $('#update-hsdj').val(rows[0].data.hsdj);
    //     $('#update-sd').val(rows[0].data.sd);
    //     $('#update-whsdj').val(rows[0].data.whsdj);
    //     $ajax()
    // })


    //点击修改按钮显示弹窗
    $('#update-btn').click(function () {
        // $('#update-shdw').select2({
        //     placeholder: '请选择收货单位',
        //     ajax: {
        //         url: '/khzl/hqxlGsm', // 替换为你的API地址
        //         dataType: 'json',
        //         delay: 250,
        //         processResults: function (data) {
        //             return {
        //                 results: data.items
        //             };
        //         },
        //         cache: true
        //     }
        // });
        let rows = getTableSelection('#cgxTable');
        if (rows.length > 1 || rows.length == 0) {
            swal('请选择一条数据修改!');
            return;
        }
        var dh = rows[0].data.dh;
        $ajax({
            type: 'post',
            url: '/cgx/getListdh',
            data: {
                dh: dh
            },
        }, false, '', function (res) {
            if (res.code == 200) {
                $('#update-modal').modal('show');
                // setForm(rows[0].data, '#update-form');
                if (res.data.length == 1) {
                    document.getElementById("t1").hidden = true
                    document.getElementById("t2").hidden = true
                    document.getElementById("t3").hidden = true
                    document.getElementById("t4").hidden = true
                    document.getElementById("t5").hidden = true
                    document.getElementById("t6").hidden = true
                    document.getElementById("t7").hidden = true
                    document.getElementById("t8").hidden = true
                    document.getElementById("t9").hidden = true
                    document.getElementById("t10").hidden = true
                    // document.getElementById("t11").hidden=true
                    document.getElementById("t12").hidden = true
                    document.getElementById("t13").hidden = true
                    document.getElementById("t14").hidden = true
                    document.getElementById("t15").hidden = true
                    document.getElementById("t16").hidden = true
                    document.getElementById("t17").hidden = true
                    document.getElementById("t18").hidden = true
                    document.getElementById("t19").hidden = true
                    document.getElementById("t20").hidden = true
                } else if (res.data.length == 2) {
                    document.getElementById("t1").hidden = true
                    document.getElementById("t2").hidden = true
                    document.getElementById("t3").hidden = true
                    document.getElementById("t4").hidden = true
                    document.getElementById("t5").hidden = true
                    document.getElementById("t6").hidden = true
                    document.getElementById("t7").hidden = true
                    document.getElementById("t8").hidden = true
                    document.getElementById("t9").hidden = true
                    document.getElementById("t10").hidden = true
                    // document.getElementById("t11").hidden=true
                    // document.getElementById("t12").hidden=true
                    document.getElementById("t13").hidden = true
                    document.getElementById("t14").hidden = true
                    document.getElementById("t15").hidden = true
                    document.getElementById("t16").hidden = true
                    document.getElementById("t17").hidden = true
                    document.getElementById("t18").hidden = true
                    document.getElementById("t19").hidden = true
                    document.getElementById("t20").hidden = true
                } else if (res.data.length == 3) {
                    document.getElementById("t1").hidden = true
                    document.getElementById("t2").hidden = true
                    document.getElementById("t3").hidden = true
                    document.getElementById("t4").hidden = true
                    document.getElementById("t5").hidden = true
                    document.getElementById("t6").hidden = true
                    document.getElementById("t7").hidden = true
                    document.getElementById("t8").hidden = true
                    document.getElementById("t9").hidden = true
                    document.getElementById("t10").hidden = true
                    // document.getElementById("t11").hidden=true
                    // document.getElementById("t12").hidden=true
                    // document.getElementById("t13").hidden=true
                    document.getElementById("t14").hidden = true
                    document.getElementById("t15").hidden = true
                    document.getElementById("t16").hidden = true
                    document.getElementById("t17").hidden = true
                    document.getElementById("t18").hidden = true
                    document.getElementById("t19").hidden = true
                    document.getElementById("t20").hidden = true
                } else if (res.data.length == 4) {
                    document.getElementById("t1").hidden = true
                    document.getElementById("t2").hidden = true
                    document.getElementById("t3").hidden = true
                    document.getElementById("t4").hidden = true
                    document.getElementById("t5").hidden = true
                    document.getElementById("t6").hidden = true
                    document.getElementById("t7").hidden = true
                    document.getElementById("t8").hidden = true
                    document.getElementById("t9").hidden = true
                    document.getElementById("t10").hidden = true
                    // document.getElementById("t11").hidden=true
                    // document.getElementById("t12").hidden=true
                    // document.getElementById("t13").hidden=true
                    // document.getElementById("t14").hidden=true
                    document.getElementById("t15").hidden = true
                    document.getElementById("t16").hidden = true
                    document.getElementById("t17").hidden = true
                    document.getElementById("t18").hidden = true
                    document.getElementById("t19").hidden = true
                    document.getElementById("t20").hidden = true
                } else if (res.data.length == 5) {
                    document.getElementById("t1").hidden = true
                    document.getElementById("t2").hidden = true
                    document.getElementById("t3").hidden = true
                    document.getElementById("t4").hidden = true
                    document.getElementById("t5").hidden = true
                    document.getElementById("t6").hidden = true
                    document.getElementById("t7").hidden = true
                    document.getElementById("t8").hidden = true
                    document.getElementById("t9").hidden = true
                    document.getElementById("t10").hidden = true
                    // document.getElementById("t11").hidden=true
                    // document.getElementById("t12").hidden=true
                    // document.getElementById("t13").hidden=true
                    // document.getElementById("t14").hidden=true
                    // document.getElementById("t15").hidden=true
                    document.getElementById("t16").hidden = true
                    document.getElementById("t17").hidden = true
                    document.getElementById("t18").hidden = true
                    document.getElementById("t19").hidden = true
                    document.getElementById("t20").hidden = true
                } else if (res.data.length == 6) {
                    document.getElementById("t1").hidden = true
                    document.getElementById("t2").hidden = true
                    document.getElementById("t3").hidden = true
                    document.getElementById("t4").hidden = true
                    document.getElementById("t5").hidden = true
                    document.getElementById("t6").hidden = true
                    document.getElementById("t7").hidden = true
                    document.getElementById("t8").hidden = true
                    document.getElementById("t9").hidden = true
                    document.getElementById("t10").hidden = true
                    // document.getElementById("t11").hidden=true
                    // document.getElementById("t12").hidden=true
                    // document.getElementById("t13").hidden=true
                    // document.getElementById("t14").hidden=true
                    // document.getElementById("t15").hidden=true
                    // document.getElementById("t16").hidden=true
                    document.getElementById("t17").hidden = true
                    document.getElementById("t18").hidden = true
                    document.getElementById("t19").hidden = true
                    document.getElementById("t20").hidden = true
                } else if (res.data.length == 7) {
                    document.getElementById("t1").hidden = true
                    document.getElementById("t2").hidden = true
                    document.getElementById("t3").hidden = true
                    document.getElementById("t4").hidden = true
                    document.getElementById("t5").hidden = true
                    document.getElementById("t6").hidden = true
                    document.getElementById("t7").hidden = true
                    document.getElementById("t8").hidden = true
                    document.getElementById("t9").hidden = true
                    document.getElementById("t10").hidden = true
                    // document.getElementById("t11").hidden=true
                    // document.getElementById("t12").hidden=true
                    // document.getElementById("t13").hidden=true
                    // document.getElementById("t14").hidden=true
                    // document.getElementById("t15").hidden=true
                    // document.getElementById("t16").hidden=true
                    // document.getElementById("t17").hidden=true
                    document.getElementById("t18").hidden = true
                    document.getElementById("t19").hidden = true
                    document.getElementById("t20").hidden = true
                } else if (res.data.length == 8) {
                    document.getElementById("t1").hidden = true
                    document.getElementById("t2").hidden = true
                    document.getElementById("t3").hidden = true
                    document.getElementById("t4").hidden = true
                    document.getElementById("t5").hidden = true
                    document.getElementById("t6").hidden = true
                    document.getElementById("t7").hidden = true
                    document.getElementById("t8").hidden = true
                    document.getElementById("t9").hidden = true
                    document.getElementById("t10").hidden = true
                    // document.getElementById("t11").hidden=true
                    // document.getElementById("t12").hidden=true
                    // document.getElementById("t13").hidden=true
                    // document.getElementById("t14").hidden=true
                    // document.getElementById("t15").hidden=true
                    // document.getElementById("t16").hidden=true
                    // document.getElementById("t17").hidden=true
                    // document.getElementById("t18").hidden=true
                    document.getElementById("t19").hidden = true
                    document.getElementById("t20").hidden = true
                } else if (res.data.length == 9) {
                    document.getElementById("t1").hidden = true
                    document.getElementById("t2").hidden = true
                    document.getElementById("t3").hidden = true
                    document.getElementById("t4").hidden = true
                    document.getElementById("t5").hidden = true
                    document.getElementById("t6").hidden = true
                    document.getElementById("t7").hidden = true
                    document.getElementById("t8").hidden = true
                    document.getElementById("t9").hidden = true
                    document.getElementById("t10").hidden = true
                    // document.getElementById("t11").hidden=true
                    // document.getElementById("t12").hidden=true
                    // document.getElementById("t13").hidden=true
                    // document.getElementById("t14").hidden=true
                    // document.getElementById("t15").hidden=true
                    // document.getElementById("t16").hidden=true
                    // document.getElementById("t17").hidden=true
                    // document.getElementById("t18").hidden=true
                    // document.getElementById("t19").hidden=true
                    document.getElementById("t20").hidden = true
                } else if (res.data.length == 10) {
                    document.getElementById("t1").hidden = true
                    document.getElementById("t2").hidden = true
                    document.getElementById("t3").hidden = true
                    document.getElementById("t4").hidden = true
                    document.getElementById("t5").hidden = true
                    document.getElementById("t6").hidden = true
                    document.getElementById("t7").hidden = true
                    document.getElementById("t8").hidden = true
                    document.getElementById("t9").hidden = true
                    document.getElementById("t10").hidden = true
                }
                for (i = 0; i < res.data.length; i++) {
                    if (i == 0) {
                        $('#update-xuhao').val(i + 1);
                        $('#update-riqi').val(res.data[0].riqi);
                        $('#update-dh').val(res.data[0].dh);
                        $('#update-shdw').val(res.data[0].shdw);
                        $('#update-mc').val(res.data[0].mc);
                        $('#update-mh').val(res.data[0].mh);
                        $('#update-gg').val(res.data[0].gg);
                        // $('#update-js').val(res.data[0].js);
                        $('#update-zl').val(res.data[0].zl);
                        $('#update-dj').val(res.data[0].dj);
                        $('#update-je').val(res.data[0].je);
                        $('#update-bz').val(res.data[0].bz);
                        $('#update-shdz').val(res.data[0].shdz);
                        $('#update-kddh').val(res.data[0].kddh);
                        $('#update-sfyj').val(res.data[0].sfyj);
                        $('#update-fkfs').val(res.data[0].fkfs);
                        $('#update-sfhs').val(res.data[0].sfhs);
                        $('#update-gd').val(res.data[0].gd);
                        $('#update-zdr').val(res.data[0].zdr);
                        // $('#update-shdwjjsr').val(res.data[0].shdwjjsr);
                        $('#update-jgf').val(res.data[0].jgf);
                        $('#update-kdf').val(res.data[0].kdf);
                        $('#update-hsdj').val(res.data[0].hsdj);
                        $('#update-sd').val(res.data[0].sd);
                        $('#update-whsdj').val(res.data[0].whsdj);
                        $('#update-bzld').val(res.data[0].bzld);
                    } else {
                        document.getElementById("update-xuhao" + i).value = i + 1;
                        // document.getElementById("update-riqi"+i).value=res.data[i].riqi;
                        // document.getElementById("update-dh"+i).value=res.data[i].dh;
                        // document.getElementById("update-shdw"+i).value=res.data[i].shdw;
                        document.getElementById("update-mc" + i).value = res.data[i].mc;
                        document.getElementById("update-mh" + i).value = res.data[i].mh;
                        document.getElementById("update-gg" + i).value = res.data[i].gg;
                        // document.getElementById("update-js" + i).value = res.data[i].js;
                        document.getElementById("update-zl" + i).value = res.data[i].zl;
                        document.getElementById("update-dj" + i).value = res.data[i].dj;
                        document.getElementById("update-je" + i).value = res.data[i].je;
                        document.getElementById("update-bz" + i).value = res.data[i].bz;
                        // document.getElementById("update-shdz"+i).value=res.data[i].shdz;
                        // document.getElementById("update-kddh"+i).value=res.data[i].kddh;
                        // document.getElementById("update-sfyj"+i).value=res.data[i].sfyj;
                        // document.getElementById("update-fkfs"+i).value=res.data[i].fkfs;
                        // document.getElementById("update-shhs"+i).value=res.data[i].sfhs;
                        // document.getElementById("update-gd"+i).value=res.data[i].gd;
                        // document.getElementById("update-zdr"+i).value=res.data[i].zdr;
                        // document.getElementById("update-shdwjjsr"+i).value=res.data[i].shdwjjsr;
                        // document.getElementById("update-jgf"+i).value=res.data[i].jgf;
                        // document.getElementById("update-kdf"+i).value=res.data[i].kdf;
                        // document.getElementById("update-hsdj"+i).value=res.data[i].hsdj;
                        // document.getElementById("update-sd"+i).value=res.data[i].sd;
                        // document.getElementById("update-whsdj"+i).value=res.data[i].whsdj;
                    }
                }
            }
        })

        // var riqi= $('#update-riqi').val();
        // var dh= $('#update-dh').val();
        // var shdw= $('#update-shdw').val();
        // var shdz= $('#update-shdz').val();
        // var kddh= $('#update-kddh').val();
        // var sfyj=$('#update-sfyj').val();
        // var fkfs= $('#update-fkfs').val();
        //  var sfhs=$('#update-sfhs').val();
        // var gd= $('#update-gd').val();
        // var zdr = $('#update-zdr').val();
        //
        // var kdf =$('#update-kdf').val();
        // var sd =  $('#update-sd').val();

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

    //修改弹窗点击关闭按钮
    $('#update-close-btn').click(function () {
        $('#update-form')[0].reset();
        $('#update-modal').modal('hide');
    });

    //修改弹窗里点击提交按钮
    $('#update-submit-btn').click(function () {
        // var msg = confirm("确认要修改吗？");
        //
        // var js = parseFloat(document.getElementById('update-js').value);
        // var zl = parseFloat(document.getElementById('update-zl').value);
        // var dj = parseFloat(document.getElementById('update-dj').value);
        // var je = js * zl * dj
        // document.getElementById("update-je").value = je
        //
        // if (parseFloat(document.getElementById('update-sd').value) != 0) {
        //     var hsdj = parseFloat(document.getElementById('update-hsdj').value);
        //     var sd = parseFloat(document.getElementById('update-sd').value);
        //     var whsdj = hsdj / sd
        //     document.getElementById("update-whsdj").value = whsdj
        // }
        //
        // if (msg) {
        //     if (checkForm('#update-form')) {
        //         let params = formToJson('#update-form');
        //         $ajax({
        //             type: 'post',
        //             url: '/xsd/add',
        //             data: {
        //                 updateJson: JSON.stringify(params)
        //             },
        //             dataType: 'json',
        //             contentType: 'application/json;charset=utf-8'
        //         }, false, '', function (res) {
        //             if (res.code == 200) {
        //                 swal("", res.msg, "success");
        //                 $('#update-close-btn').click();
        //                 $('#update-modal').modal('hide');
        //                 getList();
        //             } else {
        //                 swal("", res.msg, "error");
        //             }
        //         })
        //     }
        // }

        // var js = parseFloat(document.getElementById('update-js').value);
        // var zl = parseFloat(document.getElementById('update-zl').value);
        // var dj = parseFloat(document.getElementById('update-dj').value);
        // var je = js * zl * dj
        // var hjzl = zl;
        // document.getElementById("update-je").value = je
        // var jgf = js * 0.5
        // document.getElementById("update-jgf").value = jgf
        // var kdf = document.getElementById("update-kdf").value;
        // var hjje = jgf +je+kdf;
        // if (parseFloat(document.getElementById('update-sd').value) != 0 ){
        //     var hsdj = parseFloat(document.getElementById('update-hsdj').value);
        //     var sd = parseFloat(document.getElementById('update-sd').value);
        //     var whsdj = hsdj / sd
        //     var aa = whsdj.toFixed(2)
        //     document.getElementById("update-whsdj").value = aa
        // }
        for (i = 0; i < 20; i++) {
            if (i == 0) {
                var mc = document.getElementById("update-mc").value;
                var mh = document.getElementById("update-mh").value;
                var gg = document.getElementById("update-gg").value;
                // var js = document.getElementById("update-js").value;
                var zl = document.getElementById("update-zl").value;
                var dj = document.getElementById("update-dj").value;
                var dh = document.getElementById("update-dh").value;
                // var je = document.getElementById("update-je").value;
                var bz = document.getElementById("update-bz").value;
            } else {
                var mc = document.getElementById("update-mc" + i).value;
                var mh = document.getElementById("update-mh" + i).value;
                var gg = document.getElementById("update-gg" + i).value;
                // var js = document.getElementById("update-js" + i).value;
                var zl = document.getElementById("update-zl" + i).value;
                var dj = document.getElementById("update-dj" + i).value;
                // var je = document.getElementById("update-je"+i).value;
                var bz = document.getElementById("update-bz" + i).value;
            }
            var riqi = $('#update-riqi').val();
            var dh = $('#update-dh').val();
            var shdw = $('#update-shdw').val();
            var shdz = $('#update-shdz').val();
            var kddh = $('#update-kddh').val();
            var sfyj = $('#update-sfyj').val();
            var fkfs = $('#update-fkfs').val();
            var sfhs = $('#update-sfhs').val();
            var gd = $('#update-gd').val();
            var zdr = $('#update-zdr').val();
            var kdf = $('#update-kdf').val();
            var sd = $('#update-sd').val();
            var bzld = $('#update-bzld').val();

            $ajax({
                type: 'post',
                url: '/xsd/add',
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
                    bzld: bzld
                },

            }, false, '', function (res) {
                if (res.code == 200) {
                    swal("", res.msg, "success");
                    $('#update-form')[0].reset();
                    getList();
                    $('#update-close-btn').click();
                }
            })

        }
        //
        // let rows = getTableSelection("#cgxTable");
        // if (rows.length == 0) {
        //     swal('请选择要删除的数据！');
        //     return;
        // }
        // let idList = [];
        // $.each(rows, function (index, row) {
        //     idList.push(row.data.id)
        // });
        // $ajax({
        //     type: 'post',
        //     url: '/cgx/delete',
        //     data: JSON.stringify({
        //         idList: idList
        //     }),
        //     dataType: 'json',
        //     contentType: 'application/json;charset=utf-8'
        // }, false, '', function (res) {
        //     if (res.code == 200) {
        //         swal("", res.msg, "success");
        //         getList();
        //     } else {
        //         swal("", res.msg, "error");
        //     }
        // })
    });

    //修改弹窗里点击暂存按钮
    $('#update-zancun-btn').click(function () {
        var msg = confirm("确认要修改吗？");
        if (msg) {
            if (checkForm('#update-form')) {
                let params = formToJson('#update-form');
                $ajax({
                    type: 'post',
                    url: '/cgx/update',
                    data: {
                        updateJson: JSON.stringify(params)
                    },
                    dataType: 'json',
                    contentType: 'application/json;charset=utf-8'
                }, false, '', function (res) {
                    if (res.code == 200) {
                        swal("", res.msg, "success");
                        $('#update-close-btn').click();
                        $('#update-modal').modal('hide');
                        getList();
                    } else {
                        swal("", res.msg, "error");
                    }
                })
            }
        }
    });

    //点击删除按钮
    $('#delete-btn').click(function () {
        var msg = confirm("确认要删除吗？");
        if (msg) {
            let rows = getTableSelection("#cgxTable");
            if (rows.length == 0) {
                swal('请选择要删除的数据！');
                return;
            }
            let idList = [];
            $.each(rows, function (index, row) {
                idList.push(row.data.id)
            });
            $ajax({
                type: 'post',
                url: '/cgx/delete',
                data: JSON.stringify({
                    idList: idList
                }),
                dataType: 'json',
                contentType: 'application/json;charset=utf-8'
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

    $('#update1-btn').click(function () {
        var c=window.confirm("修改会删除旧数据，确认修改？")
        if(c) {
            qinkong();
            let rows = getTableSelection('#cgxTable');
            if (rows.length > 1 || rows.length == 0) {
                swal('请选择一条数据修改!');
                return;
            }
            let idList = [];
            $.each(rows, function (index, row) {
                idList.push(row.data.id)
            });
            var dh = rows[0].data.dh;
            $ajax({
                type: 'post',
                url: '/cgx/getListdh',
                data: {
                    dh: dh
                },
            }, false, '', function (res) {
                shuzi = res.data.length;
                for (i = 0; i < res.data.length; i++) {

                    if (i == 0) {
                        $('#update-xuhao').val(i + 1);
                        $('#update-riqi').val(res.data[0].riqi);
                        $('#update-dh').val(res.data[0].dh);
                        $('#update-shdw').val(res.data[0].shdw);
                        $('#update-mc').val(res.data[0].mc);
                        $('#update-mh').val(res.data[0].mh);
                        $('#update-gg').val(res.data[0].gg);
                        // $('#update-js').val(res.data[0].js);
                        $('#update-zl').val(res.data[0].zl);
                        $('#update-dj').val(res.data[0].dj);
                        $('#update-je').val(res.data[0].je);
                        $('#update-bz').val(res.data[0].bz);
                        $('#update-shdz').val(res.data[0].shdz);
                        $('#update-kddh').val(res.data[0].kddh);
                        $('#update-sfyj').val(res.data[0].sfyj);
                        $('#update-fkfs').val(res.data[0].fkfs);
                        $('#update-sfhs').val(res.data[0].sfhs);
                        $('#update-gd').val(res.data[0].gd);
                        $('#update-zdr').val(res.data[0].zdr);
                        // $('#update-shdwjjsr').val(res.data[0].shdwjjsr);
                        $('#update-jgf').val(res.data[0].jgf);
                        $('#update-kdf').val(res.data[0].kdf);
                        $('#update-hsdj').val(res.data[0].hsdj);
                        $('#update-sd').val(res.data[0].sd);
                        $('#update-whsdj').val(res.data[0].whsdj);
                        $('#update-bzld').val(res.data[0].bzld);
                    } else {
                        document.getElementById("update-xuhao" + i).value = i + 1;

                        document.getElementById("update-mc" + i).value = res.data[i].mc;
                        document.getElementById("update-mh" + i).value = res.data[i].mh;
                        document.getElementById("update-gg" + i).value = res.data[i].gg;
                        // document.getElementById("update-js" + i).value = res.data[i].js;
                        document.getElementById("update-zl" + i).value = res.data[i].zl;
                        document.getElementById("update-dj" + i).value = res.data[i].dj;
                        document.getElementById("update-je" + i).value = res.data[i].je;
                        document.getElementById("update-bz" + i).value = res.data[i].bz;

                    }
                }
                for (i = 0; i < shuzi; i++) {
                    if (i == 0) {
                        var mc = document.getElementById("update-mc").value;
                        var mh = document.getElementById("update-mh").value;
                        var gg = document.getElementById("update-gg").value;
                        // var js = document.getElementById("update-js").value;
                        var zl = document.getElementById("update-zl").value;
                        var dj = document.getElementById("update-dj").value;
                        var dh = document.getElementById("update-dh").value;
                        // var je = document.getElementById("update-je").value;
                        var bz = document.getElementById("update-bz").value;
                    } else {
                        var mc = document.getElementById("update-mc" + i).value;
                        var mh = document.getElementById("update-mh" + i).value;
                        var gg = document.getElementById("update-gg" + i).value;
                        // var js = document.getElementById("update-js" + i).value;
                        var zl = document.getElementById("update-zl" + i).value;
                        var dj = document.getElementById("update-dj" + i).value;
                        // var je = document.getElementById("update-je"+i).value;
                        var bz = document.getElementById("update-bz" + i).value;
                    }
                    var riqi = $('#update-riqi').val();
                    var dh = $('#update-dh').val();
                    var shdw = $('#update-shdw').val();
                    var shdz = $('#update-shdz').val();
                    var kddh = $('#update-kddh').val();
                    var sfyj = $('#update-sfyj').val();
                    var fkfs = $('#update-fkfs').val();
                    var sfhs = $('#update-sfhs').val();
                    var gd = $('#update-gd').val();
                    var zdr = $('#update-zdr').val();
                    var kdf = $('#update-kdf').val();
                    var sd = $('#update-sd').val();
                    var bzld = $('#update-bzld').val();

                    $ajax({
                        type: 'post',
                        url: '/shdp/add1',
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
                        },

                    }, false, '', function (res) {
                        if (res.code == 200) {
                            swal("", res.msg, "success");
                            $('#update-form')[0].reset();
                            getList();
                            $('#update-close-btn').click();
                        }
                    })
                }
                $ajax({
                    type: 'post',
                    url: '/cgx/delete1',
                    data:{
                        dh: dh
                    },
                }, false, '', function (res) {
                    if (res.code == 200) {
                        swal("", res.msg, "success");
                        getList();
                    } else {
                        swal("", res.msg, "error");
                    }
                })
                shdp();
            })


        }
    });
})

function setTable(data) {
    if ($('#cgxTable').html != '') {
        $('#cgxTable').bootstrapTable('load', data);
    }

    $('#cgxTable').bootstrapTable({
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
        style: 'table-layout:fixed',
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
            }, {
                field: 'mc',
                title: '名称',
                align: 'center',
                sortable: true,
                width: 80,
            }, {
                field: 'mh',
                title: '模号',
                align: 'center',
                sortable: true,
                width: 80,
            }, {
                field: 'gg',
                title: '规格',
                align: 'center',
                sortable: true,
                width: 80,
            }
            // , {
            //     field: 'js',
            //     title: '件数',
            //     align: 'center',
            //     sortable: true,
            //     width: 80,
            // }
            , {
                field: 'zl',
                title: '重量',
                align: 'center',
                sortable: true,
                width: 80,
            }, {
                field: 'dj',
                title: '单价',
                align: 'center',
                sortable: true,
                width: 80,
            }, {
                field: 'je',
                title: '金额',
                align: 'center',
                sortable: true,
                width: 80,
            }, {
                field: 'bz',
                title: '备注',
                align: 'center',
                sortable: true,
                width: 150,
            }, {
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
            // }, {
            //     field: 'jgf',
            //     title: '锯工费',
            //     align: 'center',
            //     sortable: true,
            //     width: 80,
            // }, {
            //     field: 'kdf',
            //     title: '快递费',
            //     align: 'center',
            //     sortable: true,
            //     width: 80,
            // }, {
            //     field: 'hsdj',
            //     title: '含税单价',
            //     align: 'center',
            //     sortable: true,
            //     width: 100,
            // }, {
            //     field: 'sd',
            //     title: '税点',
            //     align: 'center',
            //     sortable: true,
            //     width: 80,
            // }, {
            //     field: 'whsdj',
            //     title: '未含税单价',
            //     align: 'center',
            //     sortable: true,
            //     width: 130,
            // }
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

