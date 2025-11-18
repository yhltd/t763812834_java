var idd;
let count = 1;

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
        url: '/yssj/getList',
    }, false, '', function (res) {
        if (res.code == 200) {
            setTable(res.data);
            $("#yssjTable").colResizable({
                liveDrag: true,
                gripInnerHtml: "<div class='grip'></div>",
                draggingClass: "dragging",
                resizeMode: 'fit'
            });
            // var table = document.getElementById("xsdTable");
            // var rows = table.rows;
            // var cells = table.cells;
            // var colums = table.rows[0].cells.length;
            // for(var x=1;x<colums;x++){
            //     var zje = 0;
            //     for(var j = 1;j<rows.length-1;j++){
            //         var a = parseInt(rows[j].cells[9].innerHTML);
            //         zje = zje+a
            //     }
            //     document.getElementById('zje').value = zje
            // }

            for (i=0;i<=res.data.id;i++){
                idd=i;
            }
        }
    })
}

$(function () {
    getList();
    // getGsm();

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
        $ajax({
            type: 'post',
            url: '/yssj/queryList',
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
    // $("#add-btn").click(function () {
    //     $('#add-modal').modal('show');
    //
    //     const now = new Date();
    //     const year = now.getFullYear();
    //     const month = (now.getMonth() + 1).toString().padStart(2, '0');
    //     const day = now.getDate().toString().padStart(2, '0');
    //     const serial = (count++).toString().padStart(3, '0');
    //     var aa = `${year}${month}${day}${serial}`;
    //     document.getElementById('add-dh').value = aa;
    //
    //     $ajax({
    //         type: 'post',
    //         url: '/user/getName',
    //     }, false, '', function (res) {
    //         var this_name = res.data
    //         $("#add-zdr").val = this_name
    //         document.getElementById("add-zdr").value = this_name
    //     })
    //
    // });

    //新增弹窗里点击关闭按钮
    // $('#add-close-btn').click(function () {
    //     $('#add-modal').modal('hide');
    // });

    //新增弹窗里点击提交按钮
    // $("#add-submit-btn").click(function () {
    //
    //     var js = parseFloat(document.getElementById('add-js').value);
    //     var zl = parseFloat(document.getElementById('add-zl').value);
    //     var dj = parseFloat(document.getElementById('add-dj').value);
    //     var je = js * zl * dj
    //     document.getElementById("add-je").value = je
    //
    //     if (parseFloat(document.getElementById('add-sd').value) != 0 ){
    //         var hsdj = parseFloat(document.getElementById('add-hsdj').value);
    //         var sd = parseFloat(document.getElementById('add-sd').value);
    //         var whsdj = hsdj / sd
    //         document.getElementById("add-whsdj").value = whsdj
    //     }
    //
    //     let params = formToJson("#add-form");
    //     if (checkForm('#add-form')) {
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
    //     }
    // });

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
    // });

    //修改弹窗点击关闭按钮
    // $('#update-close-btn').click(function () {
    //     $('#update-form')[0].reset();
    //     $('#update-modal').modal('hide');
    // });

    //修改弹窗里点击提交按钮
    // $('#update-submit-btn').click(function () {
    //     var msg = confirm("确认要修改吗？");
    //
    //     var js = parseFloat(document.getElementById('update-js').value);
    //     var zl = parseFloat(document.getElementById('update-zl').value);
    //     var dj = parseFloat(document.getElementById('update-dj').value);
    //     var je = js * zl * dj
    //     document.getElementById("update-je").value = je
    //
    //     if (parseFloat(document.getElementById('update-sd').value) != 0 ){
    //         var hsdj = parseFloat(document.getElementById('update-hsdj').value);
    //         var sd = parseFloat(document.getElementById('update-sd').value);
    //         var whsdj = hsdj / sd
    //         document.getElementById("update-whsdj").value = whsdj
    //     }
    //
    //     if (msg) {
    //         if (checkForm('#update-form')) {
    //             let params = formToJson('#update-form');
    //             $ajax({
    //                 type: 'post',
    //                 url: '/xsd/update',
    //                 data: {
    //                     updateJson: JSON.stringify(params)
    //                 },
    //                 dataType: 'json',
    //                 contentType: 'application/json;charset=utf-8'
    //             }, false, '', function (res) {
    //                 if (res.code == 200) {
    //                     swal("", res.msg, "success");
    //                     $('#update-close-btn').click();
    //                     $('#update-modal').modal('hide');
    //                     getList();
    //                 } else {
    //                     swal("", res.msg, "error");
    //                 }
    //             })
    //         }
    //     }
    // });

    //点击删除按钮
    // $('#delete-btn').click(function () {
    //     var msg = confirm("确认要删除吗？");
    //     if (msg) {
    //         let rows = getTableSelection("#xsdTable");
    //         if (rows.length == 0) {
    //             swal('请选择要删除的数据！');
    //             return;
    //         }
    //         let idList = [];
    //         $.each(rows, function (index, row) {
    //             idList.push(row.data.id)
    //         });
    //         $ajax({
    //             type: 'post',
    //             url: '/xsd/delete',
    //             data: JSON.stringify({
    //                 idList: idList
    //             }),
    //             dataType: 'json',
    //             contentType: 'application/json;charset=utf-8'
    //         }, false, '', function (res) {
    //             if (res.code == 200) {
    //                 swal("", res.msg, "success");
    //                 getList();
    //             } else {
    //                 swal("", res.msg, "error");
    //             }
    //         })
    //     }
    // })
});

function setTable(data) {
    if ($('#yssjTable').html != '') {
        $('#yssjTable').bootstrapTable('load', data);
    }

    $('#yssjTable').bootstrapTable({
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
                field: 'sfhs',
                title: '是否含税',
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