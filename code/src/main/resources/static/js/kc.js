var idd;

function getMc() {
    $ajax({
        type: 'post',
        url: '/spmc/getList',
    }, false, '', function (res) {
        if (res.code == 200) {
            for (var i = 0; i < res.data.length; i++) {
                $("#add-spmc").append("<option>" + res.data[i].mc + "</option>");
                $("#update-spmc").append("<option>" + res.data[i].mc + "</option>");
            }
        }
    })
}


function getGsm() {
    $ajax({
        type: 'post',
        url: '/khzl/hqxlGsm',
    }, false, '', function (res) {
        if (res.code == 200) {
            for (var i = 0; i < res.data.length; i++) {
                $("#add-shdw").append("<option>" + res.data[i].gsm + "</option>");
                $("#update-shdw").append("<option>" + res.data[i].gsm + "</option>");
            }
        }
    })
}







function getList1() {
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
        url: '/kc/getList',
    }, false, '', function (res) {
        if (res.code == 200) {
            setTable(res.data);
            $("#kcTable").colResizable({
                liveDrag: true,
                gripInnerHtml: "<div class='grip'></div>",
                draggingClass: "dragging",
                resizeMode: 'fit'
            });
            for (i=0;i<=res.data.id;i++){
                idd=i;
            }
        }
    })

}
function getList2() {
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
        url: '/kc/getList2',
    }, false, '', function (res) {
        if (res.code == 200) {
            setTable(res.data);
            $("#kcTable").colResizable({
                liveDrag: true,
                gripInnerHtml: "<div class='grip'></div>",
                draggingClass: "dragging",
                resizeMode: 'fit'
            });
            for (i=0;i<=res.data.id;i++){
                idd=i;
            }
        }
    })

}

$(function () {
    getList1();
    getMc();
    getGsm();
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

    $('#select-btn').click(function () {
        var ksrq = $('#ksrq').val();
        var jsrq = $('#jsrq').val();
        var mc = $('#mc').val();
        $ajax({
            type: 'post',
            url: '/kc/queryList',
            data: {
                ksrq: ksrq,
                jsrq: jsrq,
                mc: mc,
            }
        }, true, '', function (res) {
            if (res.code == 200) {
                setTable(res.data);
            }
        })
    });

        // var spmc = $('#spmc').val();
        // $ajax({
        //     type: 'post',
        //     url: '/mx/spmcList',
        //     data:''
        // }, true, '', function (res) {
        //     if (res.code == 200) {
        //         setTable(res.data);
        //     }
        // })


    //刷新
    $("#refresh-btn").click(function () {
        getList1();
    });

//点击新增按钮显示弹窗
$("#add-btn").click(function () {
    $('#add-modal').modal('show');
});

//新增弹窗里点击关闭按钮
$('#add-close-btn').click(function () {
    $('#add-modal').modal('hide');
});

//新增弹窗里点击提交按钮
$("#add-submit-btn").click(function () {
    getList2();
    var qcsl = parseFloat(document.getElementById('add-qcsl').value);
    var qcdj = parseFloat(document.getElementById('add-qcdj').value);
    var qczje =qcsl * qcdj
    document.getElementById("add-qczje").value = qczje
    // var jhsl = parseFloat(document.getElementById('add-jhsl').value);
    // var jhdj = parseFloat(document.getElementById('add-jhdj').value);
    // var jhzje =jhsl * jhdj
    // document.getElementById("add-jhzje").value = jhzje
    // var cksl = parseFloat(document.getElementById('add-cksl').value);
    // var ckdj = parseFloat(document.getElementById('add-ckdj').value);
    // var ckzje =cksl * ckdj
    // document.getElementById("add-ckzje").value = ckzje
    // var jcsl = qcsl+jhsl-cksl
    // document.getElementById("add-jcsl").value = jcsl
    // var jcdj = qcdj+jhdj-ckdj
    // document.getElementById("add-jcdj").value = jcdj
    // var jczje =jcsl * jcdj
    // document.getElementById("add-jczje").value = jczje

    let params = formToJson("#add-form");
    if (checkForm('#add-form')) {
        $ajax({
            type: 'post',
            url: '/qc/add',
            data: JSON.stringify({
                addInfo: params
            }),
            dataType: 'json',
            contentType: 'application/json;charset=utf-8'
        }, false, '', function (res) {
            if (res.code == 200) {
                $ajax({
                    type: 'post',
                    url: '/kc/getList2',
                    data: JSON.stringify({
                        addInfo: params
                    }),
                    dataType: 'json',
                    contentType: 'application/json;charset=utf-8'
                }, false, '', function (res) {
                    if (res.code == 200) {
                        swal("", res.msg, "success");
                        $('#add-form')[0].reset();
                        setTable(res.data);
                        $('#add-close-btn').click();
                    }
                })
                swal("", res.msg, "success");
                $('#add-form')[0].reset();
                getList2();
                $('#add-close-btn').click();
            }
        })

    }
});
//点击修改按钮显示弹窗
$('#update-btn').click(function () {

    let rows = getTableSelection('#kcTable');
    if (rows.length > 1 || rows.length == 0) {
        swal('请选择一条数据修改!');
        return;
    }
    $('#update-modal').modal('show');
    setForm(rows[0].data, '#update-form');
    $('#update-riqi').val(rows[0].data.riqi);
    $('#update-spmc').val(rows[0].data.spmc);
    $('#update-qcsl').val(rows[0].data.qcsl);
    $('#update-qcdj').val(rows[0].data.qcdj);
    $('#update-qczje').val(rows[0].data.qczje);
    // $('#update-jhsl').val(rows[0].data.jhsl);
    // $('#update-jhdj').val(rows[0].data.jhdj);
    // $('#update-juzje').val(rows[0].data.jhzje);
    // $('#update-cksl').val(rows[0].data.cksl);
    // $('#update-ckdj').val(rows[0].data.ckdj);
    // $('#update-ckzje').val(rows[0].data.ckzje);
    // $('#update-jcsl').val(rows[0].data.jcsl);
    // $('#update-jcdj').val(rows[0].data.jcdj);
    // $('#update-jczje').val(rows[0].data.jczje);
});

//修改弹窗点击关闭按钮
$('#update-close-btn').click(function () {
    $('#update-form')[0].reset();
    $('#update-modal').modal('hide');
});

//修改弹窗里点击提交按钮
$('#update-submit-btn').click(function () {
    var qcsl = parseFloat(document.getElementById('update-qcsl').value);
    var qcdj = parseFloat(document.getElementById('update-qcdj').value);
    var qczje =qcsl * qcdj
    document.getElementById("update-qczje").value = qczje
    // var jhsl = parseFloat(document.getElementById('update-jhsl').value);
    // var jhdj = parseFloat(document.getElementById('update-jhdj').value);
    // var jhzje =jhsl * jhdj
    // document.getElementById("update-jhzje").value = jhzje
    // var cksl = parseFloat(document.getElementById('update-cksl').value);
    // var ckdj = parseFloat(document.getElementById('update-ckdj').value);
    // var ckzje =cksl * ckdj
    // document.getElementById("update-ckzje").value = ckzje
    // var jcsl = qcsl+jhsl-cksl
    // document.getElementById("update-jcsl").value = jcsl
    // var jcdj = qcdj+jhdj-ckdj
    // document.getElementById("update-jcdj").value = jcdj
    // var jczje =jcsl * jcdj
    // document.getElementById("update-jczje").value = jczje
    var msg = confirm("确认要修改吗？");

    if (msg) {
        if (checkForm('#update-form')) {
            let params = formToJson('#update-form');
            $ajax({
                type: 'post',
                url: '/kc/update',
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
        let rows = getTableSelection("#kcTable");
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
            url: '/kc/delete',
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
});
function setTable(data) {
    if ($('#kcTable').html != '') {
        $('#kcTable').bootstrapTable('load', data);
    }
    $('#kcTable').bootstrapTable({
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
            },
            {
                field: 'riqi',
                title: '日期',
                align: 'center',
                sortable: true,
                width: 80,
            }, {
                field: 'mc',
                title: '商品名称',
                align: 'center',
                sortable: true,
                width: 100,
            }, {
                field: 'qcsl',
                title: '期初数量',
                align: 'center',
                sortable: true,
                width: 100,
            }, {
                field: 'qcdj',
                title: '期初单价',
                align: 'center',
                sortable: true,
                width: 100,
            }, {
                field: 'qczje',
                title: '期初总金额',
                align: 'center',
                sortable: true,
                width: 120,
            }, {
                field: 'rksl',
                title: '进货数量',
                align: 'center',
                sortable: true,
                width: 100,
            }, {
                field: 'rkdj',
                title: '进货单价',
                align: 'center',
                sortable: true,
                width: 100,
            }, {
                field: 'zje',
                title: '进货总金额',
                align: 'center',
                sortable: true,
                width: 120,
            }, {
                field: 'js',
                title: '出库数量',
                align: 'center',
                sortable: true,
                width: 100,
            }, {
                field: 'dj',
                title: '出库单价',
                align: 'center',
                sortable: true,
                width: 100,
            }, {
                field: 'zje',
                title: '出库总金额',
                align: 'center',
                sortable: true,
                width: 120,
            }, {
                field: 'jcsl',
                title: '结存数量',
                align: 'center',
                sortable: true,
                width: 100,
            }, {
                field: 'jcdj',
                title: '结存单价',
                align: 'center',
                sortable: true,
                width: 100,
            }, {
                field: 'jczje',
                title: '结存总金额',
                align: 'center',
                sortable: true,
                width: 120,
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
