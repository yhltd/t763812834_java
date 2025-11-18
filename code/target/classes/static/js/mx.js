var idd;
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
        url: '/mx/getList',
    }, false, '', function (res) {
        if (res.code == 200) {
            setTable(res.data);
            $("#mxTable").colResizable({
                liveDrag: true,
                gripInnerHtml: "<div class='grip'></div>",
                draggingClass: "dragging",
                resizeMode: 'fit'
            });
            for (i=0;i<=res.data.id;i++){
                idd=i;
            }
            // document.getElementById("ziduan").value="入库"
        }
    })
}


$(function () {
    getList();

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
        url: '/user/getName',
    }, false, '', function (res) {
        var this_name = res.data
        document.getElementById("dlm").innerText = this_name;
    })

    // $ajax({
    //     type: 'post',
    //     url: '/rk/getKcjj',
    // }, false, '', function (res) {
    //     // var dataArray  = res
    //     var kcjj = res.data[0].kcjj
    //     document.getElementById("kcjj").value = kcjj;
    // })

    $('#select-btn').click(function () {
        var ksrq = $('#ksrq').val();
        var jsrq = $('#jsrq').val();
        var gsm = $('#gsm').val();
        $ajax({
            type: 'post',
            url: '/mx/queryList',
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
    })
      });

    //刷新
    $("#refresh-btn").click(function () {
        getList();
    });


function setTable(data) {
    if ($('#mxTable').html != '') {
        $('#mxTable').bootstrapTable('load', data);
    }

    $('#mxTable').bootstrapTable({
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
                field: 'mc',
                title: '商品名称',
                align: 'center',
                sortable: true,
                width: 150,
            },  {
                field: 'gsm',
                title: '公司名',
                align: 'center',
                sortable: true,
                width: 150,
            }
            // ,{
            //     field: 'rksl',
            //     title: '入库数量',
            //     align: 'center',
            //     sortable: true,
            //     width: 150,
            // }
            , {
                field: 'rkzl',
                title: '入库重量',
                align: 'center',
                sortable: true,
                width: 150,
            }, {
                field: 'zje',
                title: '入库总金额',
                align: 'center',
                sortable: true,
                width: 150,
            }, {
                field: 'js',
                title: '出库数量',
                align: 'center',
                sortable: true,
                width: 150,
            }
            , {
                field: 'zl',
                title: '出库重量',
                align: 'center',
                sortable: true,
                width: 150,
            }, {
                field: 'je',
                title: '出库总金额',
                align: 'center',
                sortable: true,
                width: 150,
            }, {
                field: 'ziduan',
                title: '类型',
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
