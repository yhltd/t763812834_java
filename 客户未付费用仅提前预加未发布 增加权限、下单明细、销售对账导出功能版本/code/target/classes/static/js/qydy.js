// idd = 0;
//
// var aa;
//
// function getGsm() {
//     $ajax({
//         type: 'post',
//         url: '/khzl/hqxlGsm',
//     }, false, '', function (res) {
//         if (res.code == 200) {
//             var item = "";
//             select = res.data;
//             for (var i = 0; i < res.data.length; i++) {
//                 $("#add-shdw").append("<option>" + res.data[i].gsm + "</option>");
//                 $("#shdw").append("<option>" + res.data[i].gsm + "</option>");
//                 item = "<option value=\"" + res.data[i].gsm + "\">" + res.data[i].gsm + "</option>"
//                 // $("#update-shdw").append("<option>" + res.data[i].gsm + "</option>");
//             }
//         }
//     })
// }
//
// function deleteq1() {
//     $ajax({
//         type: 'post',
//         url: '/shdp/delete',
//     })
// }
//
// function getMc() {
//     $ajax({
//         type: 'post',
//         url: '/spmc/getList',
//     }, false, '', function (res) {
//         if (res.code == 200) {
//
//             for (var i = 0; i < res.data.length; i++) {
//                 for (n = 0; n < 20; n++) {
//                     if (n == 0) {
//                         $("#mc").append("<option>" + res.data[i].mc + "</option>");
//                     } else {
//                         $("#mc" + n).append("<option>" + res.data[i].mc + "</option>");
//                     }
//                 }
//
//
//             }
//         }
//     })
// }
//
// function getList() {
//     var dh = document.getElementById("dh").value;
//     $ajax({
//         type: 'post',
//         url: '/xsd/getList2',
//         data:{
//             dh:dh
//         }
//
//     }, false, '', function (res) {
//         if (res.code == 200) {
//             for (i=0;i<res.data.length;i++){
//             var t1 = res.data[0].shdw;
//             var t2 =res.data[0].dh;
//             var t3 =res.data[0].riqi;
//             var t4 =res.data[0].zdr;
//             var t5 =res.data[0].gd;
//             var t6 = res.data[0].shdwjjsr;
//             var t7 =res.data[i].mc;
//             var t8 =res.data[i].gg;
//             var t9 = res.data[i].js;
//             var t10 = res.data[i].zl;
//             var t11 = res.data[i].dj;
//             var t12 = res.data[i].mh;
//             var t13 = res.data[i].je;
//             var t14 = res.data[i].bz;
//             var t15 = res.data[0].shdz;
//             var t16 = res.data[0].kddh;
//             var t17 = res.data[0].sfyj;
//             var t18 = res.data[0].fkfs;
//             var t19 = res.data[0].sfhs;
//             var t22 = res.data[0].hsdj;
//             var t23 = res.data[0].whsdj;
//             var t24 = res.data[i].hjje;
//             var t25 = res.data[i].hjzl;
//             var t28 =res.data[0].bzld;
//             var Hjzl = 0;
//             var h1 = parseFloat(t25);
//             Hjzl = Hjzl+h1;
//             var Hjje = 0;
//             var h2 = parseFloat(t24);
//             Hjje = Hjje+h2;
//             if(i=0){
//                 $("#mc").val(t7);
//                 $("#gg").val(t8);
//                 $("#js").val(t9);
//                 $("#dj").val(t10);
//                 $("#mh").val(t11);
//                 $("#je").val(t12);
//                 $("#bz").val(t13);
//             }else {
//                 $("#mc" + i).val(t7);
//                 $("#gg" + i).val(t8);
//                 $("#js" + i).val(t9);
//                 $("#dj" + i).val(t10);
//                 $("#mh" + i).val(t11);
//                 $("#je" + i).val(t12);
//                 $("#bz" + i).val(t13);
//             }
//             }
//             $("#shdw").val(t1);
//             $("#dh").val(t2);
//             $("#riqi").val(t3);
//             $("#jgf").val(t5);
//             $("#kdf").val(t6);
//             $("#kddh").val(t16);
//             $("#sfyj").val(t17);
//             $("#gd").val(t5);
//             $("#zdr").val(t4);
//             $("#shdwjjsr").val(t6);
//             t26 = Hjzl.toString();
//             $("#hjzl").val(t26);
//             t27 = Hjje.toString();
//             $("#hjje").val(t27);
//             $("#sfhs").val(t19);
//             $("#fkfs").val(t18);
//             $("#bzld").val(t28);
//             $("#shdz").val(t14);
//             aa = t27;
//             getHjje();
//             for (i = 0; i <= res.data.id; i++) {
//                 idd = i;
//             }
//         }
//     })
// }
//
// $(function () {
//     getMc();
//     getGsm();
//     // 获取当前日期
//     const currentDate = new Date().toLocaleDateString();
// // 从localStorage中获取上次存储的日期和计数器值
//     let lastDate = localStorage.getItem('lastDate');
//     let count = parseInt(localStorage.getItem('count'), 10) || 0;
// // 检查当前日期是否与上次存储的日期相同
//     if (currentDate !== lastDate) {
//         // 如果不同，重置计数器
//         count = 1;
//     } else {
//         // 如果相同，递增计数器
//         count++;
//     }
// // 更新localStorage中的日期和计数器值
//     localStorage.setItem('lastDate', currentDate);
//     localStorage.setItem('count', count.toString().padStart(4, '0'));
//     const date = new Date(currentDate);
//     const year = date.getFullYear(); // 获取年份
//     const month = String(date.getMonth() + 1).padStart(2, '0'); // 获取月份并补齐两位
//     const day = String(date.getDate()).padStart(2, '0'); // 获取日期并补齐两位
//     const dh = `${year}${month}${day}${count.toString().padStart(4, '0')}`;
//     // const dh = "${year}${month}${day}${count.toString().padStart(4, '0')}";
//     document.getElementById("dh").value = dh;
//     $('#add-btn2').click(function () {
//         for (i = 0; i < 20; i = i + 1) {
//             var riqi = document.getElementById("riqi").value;
//             var dh = document.getElementById("dh").value;
//             var kddh = document.getElementById("kddh").value;
//             var shdwjjsr = document.getElementById("shdwjjsr").value;
//             var shdw = document.getElementById("shdw").value;
//             var fkfs = document.getElementById("fkfs").value;
//             var sfhs = document.getElementById("sfhs").value;
//             var sd = document.getElementById("sd").value;
//             var sfyj = document.getElementById("sfyj").value;
//             var kdf = document.getElementById("kdf").value;
//             var bzld = document.getElementById("bzld").value;
//             if(i==0){
//                 var mc = document.getElementById("mc").value;
//                 if (mc==""){
//                     break;
//                 }
//                 var mh = document.getElementById("mh").value;
//                 var gg = document.getElementById("gg").value;
//                 var js =document.getElementById("js").value;
//                 var zl = document.getElementById("zl").value;
//                 var dj = document.getElementById("dj").value;
//                 var je = document.getElementById("je").value;
//                 var bz = document.getElementById("bz").value;
//             }else {
//                 var mc = document.getElementById("mc"+i).value;
//                 if (mc==""){
//                     break;
//                 }
//                 var mh = document.getElementById("mh"+i).value;
//                 var gg = document.getElementById("gg"+i).value;
//                 var js = document.getElementById("js"+i).value;
//                 var zl = document.getElementById("zl"+i).value;
//                 var dj = document.getElementById("dj"+i).value;
//                 var je =document.getElementById("je"+i).value;
//                 var bz = document.getElementById("bz"+i).value;
//
//             }
//             $ajax({
//                     type: 'post',
//                     url: '/shdp/add4',
//                     data: {
//                         riqi: riqi,
//                         dh: dh,
//                         kddh: kddh,
//                         shdwjjsr: shdwjjsr,
//                         shdw: shdw,
//                         fkfs: fkfs,
//                         sfhs: sfhs,
//                         sd: sd,
//                         sfyj: sfyj,
//                         kdf: kdf,
//                         mc: mc,
//                         mh: mh,
//                         gg: gg,
//                         js: js,
//                         zl: zl,
//                         dj: dj,
//                         je: je,
//                         bz: bz,
//
//                         bzld: bzld
//                     },
//
//                 }, false, '', function (res) {
//                     swal("", res.msg, "success");
//
//                     getList();
//                 }
//             )
//         }
//     })
//
//
//     $('#add-cgx').click(function () {
//
//         for (i = 0; i < 20; i = i + 1) {
//             var riqi = document.getElementById("riqi").value;
//             var dh = document.getElementById("dh").value;
//             var kddh = document.getElementById("kddh").value;
//             var shdwjjsr = document.getElementById("shdwjjsr").value;
//             var shdw = document.getElementById("shdw").value;
//             var fkfs = document.getElementById("fkfs").value;
//             var sfhs = document.getElementById("sfhs").value;
//             var sd = document.getElementById("sd").value;
//             var sfyj = document.getElementById("sfyj").value;
//             var kdf = document.getElementById("kdf").value;
//             var bzld = document.getElementById("bzld").value;
//            if(i==0){
//                var mc = document.getElementById("mc").value;
//                if (mc==""){
//                    break;
//                }
//                var mh = document.getElementById("mh").value;
//                var gg = document.getElementById("gg").value;
//                var js =document.getElementById("js").value;
//                var zl = document.getElementById("zl").value;
//                var dj = document.getElementById("dj").value;
//                var je = document.getElementById("je").value;
//                var bz = document.getElementById("bz").value;
//            }else {
//                var mc = document.getElementById("mc"+i).value;
//                if (mc==""){
//                    break;
//                }
//                var mh = document.getElementById("mh"+i).value;
//                var gg = document.getElementById("gg"+i).value;
//                var js = document.getElementById("js"+i).value;
//                var zl = document.getElementById("zl"+i).value;
//                var dj = document.getElementById("dj"+i).value;
//                var je =document.getElementById("je"+i).value;
//                var bz = document.getElementById("bz"+i).value;
//
//            }
//             $ajax({
//                     type: 'post',
//                     url: '/cgx/add',
//                     data: {
//                         riqi: riqi,
//                         dh: dh,
//                         kddh: kddh,
//                         shdwjjsr: shdwjjsr,
//                         shdw: shdw,
//                         fkfs: fkfs,
//                         sfhs: sfhs,
//                         sd: sd,
//                         sfyj: sfyj,
//                         kdf: kdf,
//                         mc: mc,
//                         mh: mh,
//                         gg: gg,
//                         js: js,
//                         zl: zl,
//                         dj: dj,
//                         je: je,
//                         bz: bz,
//
//                         bzld: bzld
//                     },
//
//                 }, false, '', function (res) {
//                     swal("", res.msg, "success");
//
//                     getList();
//                 }
//             )
//         }
//     })
//
//     $("#print-btn").click(function () {
//         document.getElementById("print-btn").hidden = true;
//         document.getElementById("add-btn2").hidden = true;
//         document.getElementById("add-cgx").hidden = true;
//         window.print();
//     })
//
// })
//
//
// function getHjje() {
//     $("#zjedx").val(menoyToUppercase(aa));
// }
//
// function menoyToUppercase(money) {
//
//     var cnNums = new Array('零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'); //汉字的数字
//
//     var cnIntRadice = new Array('', '拾', '佰', '仟'); //基本单位
//
//     var cnIntUnits = new Array('', '万', '亿', '兆'); //对应整数部分扩展单位
//
//     var cnDecUnits = new Array('角', '分', '毫', '厘'); //对应小数部分单位
//
//     var cnInteger = '整'; //整数金额时后面跟的字符
//
//     var cnIntLast = '元'; //整数完以后的单位
//
// //最大处理的数字
//
//     var maxNum = 999999999999999.9999;
//
//     var integerNum; //金额整数部分
//
//     var decimalNum; //金额小数部分
//
// //输出的中文金额字符串
//
//     var chineseStr = '';
//
//     var parts; //分离金额后用的数组，预定义
//
//     if (money == '') {
//         return '';
//     }
//
//     money = parseFloat(money);
//
//     if (money >= maxNum) {
//
// //超出最大处理数字
//
//         return '超出最大处理数字';
//
//     }
//
//     if (money == 0) {
//
//         chineseStr = cnNums[0] + cnIntLast + cnInteger;
//
//         return chineseStr;
//
//     }
//
// //四舍五入保留两位小数,转换为字符串
//
//     money = Math.round(money * 100).toString();
//
//     integerNum = money.substr(0, money.length - 2);
//
//     decimalNum = money.substr(money.length - 2);
//
// //获取整型部分转换
//
//     if (parseInt(integerNum, 10) > 0) {
//
//         var zeroCount = 0;
//
//         var IntLen = integerNum.length;
//
//         for (var i = 0; i < IntLen; i++) {
//
//             var n = integerNum.substr(i, 1);
//
//             var p = IntLen - i - 1;
//
//             var q = p / 4;
//
//             var m = p % 4;
//
//             if (n == '0') {
//
//                 zeroCount++;
//
//             } else {
//
//                 if (zeroCount > 0) {
//
//                     chineseStr += cnNums[0];
//
//                 }
//
// //归零
//
//                 zeroCount = 0;
//
//                 chineseStr += cnNums[parseInt(n)] + cnIntRadice[m];
//
//             }
//
//             if (m == 0 && zeroCount < 4) {
//
//                 chineseStr += cnIntUnits[q];
//
//             }
//
//         }
//
//         chineseStr += cnIntLast;
//
//     }
//
// //小数部分
//
//     if (decimalNum != '') {
//
//         var decLen = decimalNum.length;
//
//         for (var i = 0; i < decLen; i++) {
//
//             var n = decimalNum.substr(i, 1);
//
//             if (n != '0') {
//
//                 chineseStr += cnNums[Number(n)] + cnDecUnits[i];
//
//             }
//
//         }
//
//     }
//
//     if (chineseStr == '') {
//
//         chineseStr += cnNums[0] + cnIntLast + cnInteger;
//
//     } else if (decimalNum == '' || /^0*$/.test(decimalNum)) {
//
//         chineseStr += cnInteger;
//
//     }
//
//     return chineseStr;
//
// }
idd = 0;

var aa;

function getGsm() {
    $ajax({
        type: 'post',
        url: '/khzl/hqxlGsm',
    }, false, '', function (res) {
        if (res.code == 200) {
            var item = "";
            select = res.data;
            for (var i = 0; i < res.data.length; i++) {
                $("#add-shdw").append("<option>" + res.data[i].gsm + "</option>");
                $("#shdw").append("<option>" + res.data[i].gsm + "</option>");
                item = "<option value=\"" + res.data[i].gsm + "\">" + res.data[i].gsm + "</option>"
                // $("#update-shdw").append("<option>" + res.data[i].gsm + "</option>");
            }
        }
    })
}

function deleteq1() {
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
                for (n = 0; n < 20; n++) {
                    if (n == 0) {
                        $("#mc").append("<option>" + res.data[i].mc + "</option>");
                    } else {
                        $("#mc" + n).append("<option>" + res.data[i].mc + "</option>");
                    }
                }


            }
        }
    })
}

function getList() {
    var dh = document.getElementById("dh").value;
    $ajax({
        type: 'post',
        url: '/xsd/getList2',
        data:{
            dh:dh
        }

    }, false, '', function (res) {
        if (res.code == 200) {
            for (i=0;i<res.data.length;i++){
                var t1 = res.data[0].shdw;
                var t2 =res.data[0].dh;
                var t3 =res.data[0].riqi;
                var t4 =res.data[0].zdr;
                var t5 =res.data[0].gd;
                // var t6 = res.data[0].shdwjjsr;
                var t7 =res.data[i].mc;
                var t8 =res.data[i].gg;
                // var t9 = res.data[i].js;
                var t10 = res.data[i].zl;
                var t11 = res.data[i].dj;
                var t12 = res.data[i].mh;
                var t13 = res.data[i].je;
                var t14 = res.data[i].bz;
                var t15 = res.data[0].shdz;
                var t16 = res.data[0].kddh;
                var t17 = res.data[0].sfyj;
                var t18 = res.data[0].fkfs;
                var t19 = res.data[0].sfhs;
                var t22 = res.data[0].hsdj;
                var t23 = res.data[0].whsdj;
                var t24 = res.data[i].hjje;
                var t25 = res.data[i].hjzl;
                var t28 =res.data[0].bzld;
                var Hjzl = 0;
                var h1 = parseFloat(t25);
                Hjzl = Hjzl+h1;
                var Hjje = 0;
                var h2 = parseFloat(t24);
                Hjje = Hjje+h2;
                if(i=0){
                    $("#mc").val(t7);
                    $("#gg").val(t8);
                    // $("#js").val(t9);
                    $("#dj").val(t10);
                    $("#mh").val(t11);
                    $("#je").val(t12);
                    $("#bz").val(t13);
                }else {
                    $("#mc" + i).val(t7);
                    $("#gg" + i).val(t8);
                    // $("#js" + i).val(t9);
                    $("#dj" + i).val(t10);
                    $("#mh" + i).val(t11);
                    $("#je" + i).val(t12);
                    $("#bz" + i).val(t13);
                }
            }
            $("#shdw").val(t1);
            $("#dh").val(t2);
            $("#riqi").val(t3);
            $("#jgf").val(t5);
            $("#kdf").val(t6);
            $("#kddh").val(t16);
            $("#sfyj").val(t17);
            $("#gd").val(t5);
            $("#zdr").val(t4);
            // $("#shdwjjsr").val(t6);
            t26 = Hjzl.toString();
            $("#hjzl").val(t26);
            t27 = Hjje.toString();
            $("#hjje").val(t27);
            $("#sfhs").val(t19);
            $("#fkfs").val(t18);
            $("#bzld").val(t28);
            $("#shdz").val(t14);
            aa = t27;
            getHjje();
            for (i = 0; i <= res.data.id; i++) {
                idd = i;
            }
        }
    })
}

$(function () {
    getMc();
    getGsm();
    // 获取当前日期
    const currentDate = new Date().toLocaleDateString();
// 从localStorage中获取上次存储的日期和计数器值
    let lastDate = localStorage.getItem('lastDate');
    let count = parseInt(localStorage.getItem('count'), 10) || 0;
// 检查当前日期是否与上次存储的日期相同
    if (currentDate !== lastDate) {
        // 如果不同，重置计数器
        count = 1;
    } else {
        // 如果相同，递增计数器
        count++;
    }
// 更新localStorage中的日期和计数器值
    localStorage.setItem('lastDate', currentDate);
    localStorage.setItem('count', count.toString().padStart(4, '0'));
    const date = new Date(currentDate);
    const year = date.getFullYear(); // 获取年份
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 获取月份并补齐两位
    const day = String(date.getDate()).padStart(2, '0'); // 获取日期并补齐两位
    const dh = `${year}${month}${day}${count.toString().padStart(4, '0')}`;
    // const dh = "${year}${month}${day}${count.toString().padStart(4, '0')}";
    document.getElementById("dh").value = dh;
    $('#add-btn2').click(function () {
        for (i = 0; i < 20; i = i + 1) {
            var riqi = document.getElementById("riqi").value;
            var dh = document.getElementById("dh").value;
            var kddh = document.getElementById("kddh").value;
            // var shdwjjsr = document.getElementById("shdwjjsr").value;
            var shdw = document.getElementById("shdw").value;
            var fkfs = document.getElementById("fkfs").value;
            var sfhs = document.getElementById("sfhs").value;
            var sd = document.getElementById("sd").value;
            var sfyj = document.getElementById("sfyj").value;
            var kdf = document.getElementById("kdf").value;
            var bzld = document.getElementById("bzld").value;
            if(i==0){
                var mc = document.getElementById("mc").value;
                if (mc==""){
                    break;
                }
                var mh = document.getElementById("mh").value;
                var gg = document.getElementById("gg").value;
                // var js =document.getElementById("js").value;
                var zl = document.getElementById("zl").value;
                var dj = document.getElementById("dj").value;
                var je = document.getElementById("je").value;
                var bz = document.getElementById("bz").value;
            }else {
                var mc = document.getElementById("mc"+i).value;
                if (mc==""){
                    break;
                }
                var mh = document.getElementById("mh"+i).value;
                var gg = document.getElementById("gg"+i).value;
                // var js = document.getElementById("js"+i).value;
                var zl = document.getElementById("zl"+i).value;
                var dj = document.getElementById("dj"+i).value;
                var je =document.getElementById("je"+i).value;
                var bz = document.getElementById("bz"+i).value;

            }
            $ajax({
                    type: 'post',
                    url: '/shdp/add4',
                    data: {
                        riqi: riqi,
                        dh: dh,
                        kddh: kddh,
                        // shdwjjsr: shdwjjsr,
                        shdw: shdw,
                        fkfs: fkfs,
                        sfhs: sfhs,
                        sd: sd,
                        sfyj: sfyj,
                        kdf: kdf,
                        mc: mc,
                        mh: mh,
                        gg: gg,
                        // js: js,
                        zl: zl,
                        dj: dj,
                        je: je,
                        bz: bz,

                        bzld: bzld
                    },

                }, false, '', function (res) {
                    swal("", res.msg, "success");

                    getList();
                }
            )
        }
    })


    $('#add-cgx').click(function () {

        for (i = 0; i < 20; i = i + 1) {
            var riqi = document.getElementById("riqi").value;
            var dh = document.getElementById("dh").value;
            var kddh = document.getElementById("kddh").value;
            // var shdwjjsr = document.getElementById("shdwjjsr").value;
            var shdw = document.getElementById("shdw").value;
            var fkfs = document.getElementById("fkfs").value;
            var sfhs = document.getElementById("sfhs").value;
            var sd = document.getElementById("sd").value;
            var sfyj = document.getElementById("sfyj").value;
            var kdf = document.getElementById("kdf").value;
            var bzld = document.getElementById("bzld").value;
            if(i==0){
                var mc = document.getElementById("mc").value;
                if (mc==""){
                    break;
                }
                var mh = document.getElementById("mh").value;
                var gg = document.getElementById("gg").value;
                // var js =document.getElementById("js").value;
                var zl = document.getElementById("zl").value;
                var dj = document.getElementById("dj").value;
                var je = document.getElementById("je").value;
                var bz = document.getElementById("bz").value;
            }else {
                var mc = document.getElementById("mc"+i).value;
                if (mc==""){
                    break;
                }
                var mh = document.getElementById("mh"+i).value;
                var gg = document.getElementById("gg"+i).value;
                // var js = document.getElementById("js"+i).value;
                var zl = document.getElementById("zl"+i).value;
                var dj = document.getElementById("dj"+i).value;
                var je =document.getElementById("je"+i).value;
                var bz = document.getElementById("bz"+i).value;

            }
            $ajax({
                    type: 'post',
                    url: '/cgx/add',
                    data: {
                        riqi: riqi,
                        dh: dh,
                        kddh: kddh,
                        // shdwjjsr: shdwjjsr,
                        shdw: shdw,
                        fkfs: fkfs,
                        sfhs: sfhs,
                        sd: sd,
                        sfyj: sfyj,
                        kdf: kdf,
                        mc: mc,
                        mh: mh,
                        gg: gg,
                        // js: js,
                        zl: zl,
                        dj: dj,
                        je: je,
                        bz: bz,

                        bzld: bzld
                    },

                }, false, '', function (res) {
                    swal("", res.msg, "success");

                    getList();
                }
            )
        }
    })

    $("#print-btn").click(function () {
        document.getElementById("print-btn").hidden = true;
        document.getElementById("add-btn2").hidden = true;
        document.getElementById("add-cgx").hidden = true;
        window.print();
    })

})


function getHjje() {
    $("#zjedx").val(menoyToUppercase(aa));
}

function menoyToUppercase(money) {

    var cnNums = new Array('零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'); //汉字的数字

    var cnIntRadice = new Array('', '拾', '佰', '仟'); //基本单位

    var cnIntUnits = new Array('', '万', '亿', '兆'); //对应整数部分扩展单位

    var cnDecUnits = new Array('角', '分', '毫', '厘'); //对应小数部分单位

    var cnInteger = '整'; //整数金额时后面跟的字符

    var cnIntLast = '元'; //整数完以后的单位

//最大处理的数字

    var maxNum = 999999999999999.9999;

    var integerNum; //金额整数部分

    var decimalNum; //金额小数部分

//输出的中文金额字符串

    var chineseStr = '';

    var parts; //分离金额后用的数组，预定义

    if (money == '') {
        return '';
    }

    money = parseFloat(money);

    if (money >= maxNum) {

//超出最大处理数字

        return '超出最大处理数字';

    }

    if (money == 0) {

        chineseStr = cnNums[0] + cnIntLast + cnInteger;

        return chineseStr;

    }

//四舍五入保留两位小数,转换为字符串

    money = Math.round(money * 100).toString();

    integerNum = money.substr(0, money.length - 2);

    decimalNum = money.substr(money.length - 2);

//获取整型部分转换

    if (parseInt(integerNum, 10) > 0) {

        var zeroCount = 0;

        var IntLen = integerNum.length;

        for (var i = 0; i < IntLen; i++) {

            var n = integerNum.substr(i, 1);

            var p = IntLen - i - 1;

            var q = p / 4;

            var m = p % 4;

            if (n == '0') {

                zeroCount++;

            } else {

                if (zeroCount > 0) {

                    chineseStr += cnNums[0];

                }

//归零

                zeroCount = 0;

                chineseStr += cnNums[parseInt(n)] + cnIntRadice[m];

            }

            if (m == 0 && zeroCount < 4) {

                chineseStr += cnIntUnits[q];

            }

        }

        chineseStr += cnIntLast;

    }

//小数部分

    if (decimalNum != '') {

        var decLen = decimalNum.length;

        for (var i = 0; i < decLen; i++) {

            var n = decimalNum.substr(i, 1);

            if (n != '0') {

                chineseStr += cnNums[Number(n)] + cnDecUnits[i];

            }

        }

    }

    if (chineseStr == '') {

        chineseStr += cnNums[0] + cnIntLast + cnInteger;

    } else if (decimalNum == '' || /^0*$/.test(decimalNum)) {

        chineseStr += cnInteger;

    }

    return chineseStr;

}
