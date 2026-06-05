idd=0;

var aa;
function getList() {

    $ajax({
        type: 'post',
        url: '/shdp/getList',
    }, false, '', function (res) {
        if (res.code == 200) {
            for (i = 0; i <= res.data.id; i++) {
                idd = i;
            }
        }
    })
}
$(function (){
    $ajax({
        type: 'post',
        url: '/shdp/getList',
        dataType: 'json',
        contentType: 'application/json;charset=utf-8'
    }, false, '', function (res) {
        if (res.code == 200) {
            $("[name='printData']").remove();
            var t1 = res.data[0].shdw;
            var t2 =res.data[0].dh;
            var t3 =res.data[0].riqi;
            var t13 =res.data[0].zdr;
            var t14 =res.data[0].gd;
            // var t15 = res.data[0].shdwjjsr;
            var jgf2 = 0;
            var hjzl2 = 0;
            var hjje2 = 0;
            for (var i = 0; i<res.data.length; i++) {
                var e = i+1
                var je = res.data[i].je;
                var sd= res.data[i].sd;
                if(res.data[i].sfhs=="金额含税"){
                    var Je = (parseFloat(je)*parseFloat(sd)).toFixed(2);
                }else{
                    var Je = parseFloat(je).toFixed(2);
                }
                var t4 = "<tr name='printData'>" +
                    "<td style='text-align: center'>" + e + "</td>" +
                    "<td style='text-align: center'>" + res.data[i].mc + "</td>" +
                    "<td style='text-align: center'>" + res.data[i].mh + "</td>" +
                    "<td style='text-align: center'>" + res.data[i].gg + "</td>" +
                    // "<td style='text-align: center'>" + res.data[i].js + "</td>" +
                    "<td style='text-align: center'>" + res.data[i].zl + "</td>" +
                    "<td style='text-align: center'>" + res.data[i].dj + "</td>" +
                    "<td style='text-align: center'>" + Je + "</td>" +
                    "<td style='text-align: center'>" + res.data[i].bz + "</td>" +
                    "</tr>";
                $("#data").append(t4);
                // var jgf1 = parseFloat(res.data[i].jgf);
                // jgf2 = jgf2 + jgf1;
                var hjzl1 = parseFloat(res.data[i].hjzl);
                hjzl2 = hjzl2 + hjzl1;
                var hjje1 = parseFloat(res.data[i].hjje);
                hjje2 = hjje2 + hjje1;
            }
            var t5 = jgf2.toString();
            var t6 = res.data[0].kdf;
            var t7 = res.data[0].kddh;
            var t8 = res.data[0].sfyj;
            var t9 = res.data[0].fkfs;
            var t10 = res.data[0].sfhs;
            var t11 = hjzl2.toString();
            var t12 = (hjje2.toFixed(2)).toString();
            var t16 = res.data[0].bzld;
            $("#shdw").append(t1);
            $("#dh").append(t2);
            $("#riqi").append(t3);
            $("#jgf").append(t5);
            $("#kdf").append(t6);
            $("#kddh").append(t7);
            $("#sfyj").append(t8);
            $("#gd").append(t14);
            $("#zdr").append(t13);
            // $("#shdwjjsr").append(t15);
            $("#hjzl").append(t11);
            $("#hjje").append(t12);
            $("#sfhs").append(t10);
            $("#fkfs").append(t9);
            $("#bzld").append(t16);
            aa = t12;
            if (t8 == "否") {
                document.getElementById("sfyjlab").hidden=true;
                document.getElementById("sfyj").hidden=true;
            }
            getHjje();
            getList();
        }
    })
    $("#print-btn").click(function () {
        document.getElementById("print-btn").hidden=true;
        window.print();
    })

})






function getHjje() {
    $("#zjedx").append(menoyToUppercase(aa));
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
window.onload = function() {
    setTimeout(function() {
        // 在这里放置你想在5秒后执行的代码
        console.log("5秒钟已过");
    }, 5000); // 5000毫秒等于5秒
};
