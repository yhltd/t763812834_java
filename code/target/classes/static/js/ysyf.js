var idd;
let count = 1;

function getList() {
    // $('#ksrq').val("");
    // $('#jsrq').val("");

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
        url: '/ysyf/getList',
    }, false, '', function (res) {
        if (res.code == 200) {
            setTable(res.data);
            $("#ysyfTable").colResizable({
                liveDrag: true,
                gripInnerHtml: "<div class='grip'></div>",
                draggingClass: "dragging",
                resizeMode: 'fit'
            });
            // var table = document.getElementById("ysyfTable");
            // var rows = table.rows;
            // var cells = table.cells;
            // var colums = table.rows[0].cells.length;
            // for(var x=1;x<colums;x++){
            //     var zje = 0;
            //     for(var j = 1;j<rows.length-1;j++){
            //         var a = parseInt(rows[j].cells[10].innerHTML);
            //         zje = zje+a
            //     }
            //     document.getElementById('zje').value = zje
            // }
            // for (i=0;i<=res.data.id;i++){
            //     idd=i;
            // }
        }
    })
}

$(function () {
getList();

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
        var gsm = $('#gsm').val();
        $ajax({
            type: 'post',
            url: '/ysyf/queryList',
            data: {
                ksrq: ksrq,
                jsrq: jsrq,
                gsm:gsm
            }
        }, true, '', function (res) {
            if (res.code == 200) {
                setTable(res.data);
            }
        })
    });


    //点击修改按钮显示弹窗
    $('#upn-btn').click(function () {
        let rows = getTableSelection('#ysyfTable');
        if (rows.length > 1 || rows.length == 0) {
            swal('请选择一条数据修改!');
            return;
        }
        $('#upn-modal').modal('show');
        setForm(rows[0].data, '#update-form');
        $('#upn-skje').val(rows[0].data.skje);
        $('#upn-riqi').val(rows[0].data.riqi);
        $('#upn-gsm').val(rows[0].data.gsm);
        $('#upn-zys').val(rows[0].data.zys);
        $('#upn-fkriqi').val(rows[0].data.fkriqi);
        $('#upn-bh').val(rows[0].data.bh);
        $('#upn-ysje').val(rows[0].data.ysje);
        $('#id').val(rows[0].data.id);
    });

    //修改弹窗点击关闭按钮
    $('#cupn-btn').click(function () {
        $('#upn-form')[0].reset();
        $('#upn-modal').modal('hide');
    });

    //修改弹窗里点击提交按钮
    $('#uupn-btn').click(function () {
        var msg = confirm("确认要修改吗？");
        if (msg) {
                var zys = parseFloat(document.getElementById("upn-ysje").value)-parseFloat(document.getElementById("upn-skje").value)
                document.getElementById("upn-zys").value=zys;
                let params = formToJson('#upn-form');
                $ajax({
                    type: 'post',
                    url: '/ysyf/update',
                    data: {
                        updateJson: JSON.stringify(params)
                    },
                    dataType: 'json',
                    contentType: 'application/json;charset=utf-8'
                }, false, '', function (res) {
                    if (res.code == 200) {
                        swal("", res.msg, "success");
                        $('#cupn-btn').click();
                        $('#upn-modal').modal('hide');
                        getList();
                    } else {
                        swal("", res.msg, "error");
                    }
                })

        }
    });













//点击新增按钮
    $('#add-btn').click(function () {
        $ajax({
            type: 'post',
            url: '/qhd/getList',
        }, false, '', function (res) {
            if (res.code == 200) {
                setTable1(res.data);
                $('#qhd-modal').modal('show');
            }
        })
    });
    //点击关闭按钮
    $('#add-t-close-btn').click(function () {
        $('#qhd-modal').modal('hide');
    });








    $('#add-t-submit-btn').click(function () {
        let rows = getTableSelection('#show-qhd-table');
        if (rows.length > 1 || rows.length == 0) {
            swal('请选择一条数据修改!');
            return;
        }
        $('#updateje-modal').modal('show');
        setForm(rows[0].data, '#updateje-modal');
        $('#update-skje').val(rows[0].data.skje);
        $('#update-riqi').val(rows[0].data.riqi);
        $('#update-gsm').val(rows[0].data.gsm);
        $('#update-zys').val(rows[0].data.zys);
        $('#update-fkriqi').val(rows[0].data.fkriqi);
        $('#update-ysje').val(rows[0].data.ysje);
        $('#update-bh').val(rows[0].data.bh)
    });
//点击关闭按钮
    $('#close-skje-btn').click(function () {
        $('#updateje-modal').modal('hide');
    });
    //新增提交
    $("#update-skje-btn").click(function () {
        var zys = parseFloat(document.getElementById("update-ysje").value)-parseFloat(document.getElementById("update-skje").value)
        document.getElementById("update-zys").value=zys;
        let params = formToJson("#updateje-form");
        if (checkForm('#updateje-form')) {
            $ajax({
                type: 'post',
                url: '/ysyf/add',
                data: JSON.stringify({
                    addInfo: params
                }),
                dataType: 'json',
                contentType: 'application/json;charset=utf-8'
            }, false, '', function (res) {
                if (res.code == 200) {
                    swal("", res.msg, "success");
                    $('#updateje-form')[0].reset();
                    getList();
                    $('#close-skje-btn').click();
                }
            })
        }
    });










    //刷新
    $("#refresh-btn").click(function () {
        getList();
    });



    //点击修改按钮显示弹窗
    $('#update-btn').click(function () {
        let rows = getTableSelection('#ysyfTable');
        if (rows.length > 1 || rows.length == 0) {
            swal('请选择一条数据修改!');
            return;
        }
        $('#update-modal').modal('show');
        setForm(rows[0].data, '#update-form');
        $('#update-riqi').val(rows[0].data.riqi);
        $('#update-gsm').val(rows[0].data.gsm);
        $('#update-pm').val(rows[0].data.pm);
        $('#update-zl').val(rows[0].data.zl);
        $('#update-dj').val(rows[0].data.dj);
        $('#update-je').val(rows[0].data.je);
        $('#update-ysyf').val(rows[0].data.ysyf);

    });

    //修改弹窗点击关闭按钮
    $('#update-close-btn').click(function () {
        $('#update-form')[0].reset();
        $('#update-modal').modal('hide');
    });


    //新增弹窗里点击关闭按钮
    $('#add-close-btn').click(function () {
        $('#add-modal').modal('hide');
    });

    //新增弹窗里点击提交按钮
    $("#update-skje-btn").click(function () {

        // var zl = parseFloat(document.getElementById('add-zl').value);
        // var dj = parseFloat(document.getElementById('add-dj').value);
        // var je = zl * dj
        // document.getElementById("add-je").value = je

        let params = formToJson("#add-form");
        if (checkForm('#add-form')) {
            $ajax({
                type: 'post',
                url: '/ysyf/add',
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

    //点击删除按钮
    $('#delete-btn').click(function () {
        var msg = confirm("确认要删除吗？");
        if (msg) {
            let rows = getTableSelection("#ysyfTable");
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
                url: '/ysyf/delete',
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
    if ($('#ysyfTable').html != '') {
        $('#ysyfTable').bootstrapTable('load', data);
    }

    $('#ysyfTable').bootstrapTable({
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
            }
            // , {
            //     field: 'bh',
            //     title: '编号',
            //     align: 'center',
            //     sortable: true,
            //     width: 80,
            // }
            , {
                field: 'fkriqi',
                title: '付款日期',
                align: 'center',
                sortable: true,
                width: 80,
            }, {
                field: 'gsm',
                title: '公司名',
                align: 'center',
                sortable: true,
                width: 80,
            }, {
                field: 'skje',
                title: '收款金额',
                align: 'center',
                sortable: true,
                width: 130,
            }, {
                field: 'zys',
                title: '总应收',
                align: 'center',
                sortable: true,
                width: 80,
            }, {
                field: 'yf',
                title: '月份',
                align: 'center',
                sortable: true,
                width: 80,
            }, {
                field: 'bz',
                title: '备注',
                align: 'center',
                sortable: true,
                width: 80,
            }, {
                field: 'id',
                title: 'id',
                align: 'center',
                sortable: true,
                width: 1,
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





function setTable1(data) {
    if ($('#show-qhd-table').html != '') {
        $('#show-qhd-table').bootstrapTable('load', data);
    }

    $('#show-qhd-table').bootstrapTable({
        data: data,
        sortStable: true,
        classes: 'table table-hover',
        idField: 'id',
        pagination: true,
        search: true,
        searchAlign: 'left',
        clickToSelect: false,
        locale: 'zh-CN',
        singleSelect: true,
        columns: [
            {
                checkbox: true
            }, {
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
                field: 'gsm',
                title: '公司名',
                align: 'center',
                sortable: true,
                width: 80,
            }, {
                field: 'ysje',
                title: '应收金额',
                align: 'center',
                sortable: true,
                width: 130,
            }, {
                field: 'zys',
                title: '总应收',
                align: 'center',
                sortable: true,
                width: 80,
            }, {
                field: 'bz',
                title: '备注',
                align: 'center',
                sortable: true,
                width: 80,
            }
            // , {
            //     field: 'bh',
            //     title: '编号',
            //     align: 'center',
            //     sortable: true,
            //     width: 0,
            // }
            // }, {
            //     field: 'bh',
            //     title: '编号',
            //     align: 'center',
            //     sortable: true,
            //     width: 0,
            // }
        ],
        // onClickRow: function (row, el) {
        //     let isSelect = $(el).hasClass('selected')
        //     if (isSelect) {
        //         $(el).removeClass('selected')
        //     } else {
        //         $(el).addClass('selected')
        //     }
        // }
    })
}

