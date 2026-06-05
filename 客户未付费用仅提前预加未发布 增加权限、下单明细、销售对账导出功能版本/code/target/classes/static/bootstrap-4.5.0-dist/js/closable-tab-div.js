var closableTab = {
    //frame加载完成后设置父容器的高度，使iframe页面与父页面无缝对接
    frameLoad:function (frame){

        var mainheight = $(frame).contents().find('body').height();
        $(frame).parent().height(mainheight);
    },

    //添加tab
    addTab:function(tabItem){ //tabItem = {id,name,url,closable}

        var id = "tabSeed" + tabItem.id;
        var container ="tab_container_" + tabItem.id;
        var href="#"+id
        var a_id="a"+id
        var tab=a_id+"-tab"
        $("li[id^=tab_seed_]").removeClass("active");
        $("div[id^=tab_container_]").removeClass("active");

        if(!$('#'+id)[0]){
            var li_tab = '<li class="nav-item"><a class="nav-link" id="'+ a_id +'" data-toggle="tab" href="'+ href +'" role="tab" aria-controls="profile" aria-selected="false"><span>'+ tabItem.name +'</span>';
            if(tabItem.closable){
                li_tab = li_tab + '<i class="bi bi-x" tabclose="'+id+'" style="position: absolute;right:4px;top: 4px;"  onclick="closableTab.closeTab(this)"></i></li> ';
            }else{
                li_tab = li_tab + '</li>';
            }

            var tabpanel = '<div  class="tab-pane fade" id="'+id+'" role="tabpanel" aria-labelledby="'+ a_id +'" style="height: 100%">'+
                '<ul class="list-group list-group-flush" style="height: 100%"  onload="closableTab.frameLoad(this)"><div class="embed-responsive embed-responsive-1by1 h-100" style="height: 100%" id="'+container+'"></div></ul>';


            $('.nav-tabs').append(li_tab);
            $('.tab-content').append(tabpanel);
        }
        // $("#"+id).addClass("active");
        // $("#"+container).addClass("show active");
    },

    //关闭tab
    closeTab:function(item){
        var val = $(item).attr('tabclose');
        var containerId = "tab_container_"+val.substring(9);

        if($('#'+containerId).hasClass('active')){
            $('#'+val).prev().addClass('active');
            $('#'+containerId).prev().addClass('active');
        }


        $("#"+val).remove();
        $("#"+containerId).remove();
    }
}