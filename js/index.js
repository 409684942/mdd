(function ($) {
    'use strict';
    
    // menu
    var dropdown={};
    $('.menu')
        .on('dropdown-show',function (e) {
            dropdown.loadOnce($(this),dropdown.buildMenuItem);
        })
        .dropdown({
            css3: true,
            js: false  
        });

        dropdown.buildMenuItem=function($elem,data) {
            var html='';

            if (data.length===0) return;

            for (var i = 0; i <data.length; i++) {
                html+='<li><a href="'+data[i].url+'" target="_blank" class="menu-item">'+data[i].name+'</a></li>';
            }
            $elem.find('.dropdown-layer').html(html);
        };

    // header search
    var search={};
    search.$headerSearch=$('#header-search');
    search.$headerSearch.html='';
    search.$headerSearch.maxNum=10;
    search.$headerSearch.on('search-getData',function (e,data) {
        var $this=$(this);
        search.$headerSearch.html=search.$headerSearch.creatHeaderSearchLayer(data,search.$headerSearch.maxNum);
        $this.search('appendLayer',search.$headerSearch.html);

        if (search.$headerSearch.html) {
            $this.search('showLayer');
        }else {
            $this.search('hideLayer');
        }
    }).on('search-noData',function (e) {
        $(this).search('hideLayer').search('appendLayer','');
    }).on('click','.search-layer-item', function() {
        search.$headerSearch.search('setInputVal',$(this).html());
        search.$headerSearch.search('submit');
    });
    search.$headerSearch.search({
        autocomplete:true,
        css3:false,
        js:false,
        animation:'fade',
        getDataInterval:200
    });
    search.$headerSearch.creatHeaderSearchLayer=function (data,maxNum){
        var html='',
            dataNum=data['result'].length;
        if (dataNum===0) {
            return '';
        }

        for(var i=0;i<dataNum;i++){
            if (i>=maxNum) break;

            html+='<li class="search-layer-item text-ellipsis">'+data['result'][i][0]+'</li>';
        }

        return html;
    }
    

    // focus-category
    $('#focus-category').find('.dropdown')
        .on('dropdown-show',function () {
            dropdown.loadOnce($(this),dropdown.createCategoryDetails);
        })
        .dropdown({
            css3:true,
            js:false,
            animation:'fadeslideLeftRight'
        });

    dropdown.createCategoryDetails=function ($elem,data) {
        var html='';

        for (var i = 0; i < data.length; i++) {
            html+='<dl class="category-details cf"><dt class="category-details-title fl"><a href="###" target="_blank" class="category-details-title-link">' + data[i].title + '</a></dt><dd class="category-details-item fl">';
            for (var j = 0; j < data[i].items.length; j++) {
                html += '<a href="###" target="_blank" class="link">' + data[i].items[j] + '</a>';
            }
            html += '</dd></dl>';
        }

        $elem.find('.dropdown-layer').html(html);
    };
    
    dropdown.loadOnce=function ($elem,success) {
        var dataLoad = $elem.data('load');
            
        if (!dataLoad) return;

        if (!$elem.data('loaded')) {
            $elem.data('loaded',true);
            $.getJSON(dataLoad).done(function (data) {
                if (typeof success==='function') success($elem,data);
            }).fail(function (){
                $elem.data('loaded',false);
            });
        }
    };
    // focus-slider
    var slider={};
    slider.$focusSlider=$('#focus-slider');
    slider.loadImg =function (url,imgLoaded,imgFailed) {
        var image=new Image();

        image.onerror=function () {
            if(typeof imgFailed==='function') imgFailed(url);
        };
        image.onload=function () {
            if(typeof imgLoaded==='function') imgLoaded(url);
        };
        image.src=url;
        // setTimeout(function () {
        //     image.src=url;
        // },1000);
    };
    slider.lazyLoad=function ($elem) {
        $elem.items={};
        $elem.loadedItemNum=0;
        $elem.totalItemNum=$elem.find('.slider-img').length;
        $elem.on('slider-show',$elem.loadItem = function(e,index,elem) {
            if($elem.items[index]!=='loaded'){
                $elem.trigger('slider-loadItem',[index,elem]);
            };
        });
        $elem.on('slider-loadItem',function (e,index,elem) {
            var $imgs=$(elem).find('.slider-img');

            $imgs.each(function(_, el) {
                var $img=$(el);

                slider.loadImg($img.data('src'),function (url) {
                    $img.attr('src', url);
                    $elem.items[index]='loaded';
                    $elem.loadedItemNum++;
                    console.log(index+':loaded');
                    if ($elem.loadedItemNum===$elem.totalItemNum) {
                        $elem.trigger('slider-itemsLoaded');
                    }
                },function (url) {
                    console.log('从'+url+'加载图片失败');
                    $img.attr('src', '../img/focus-slider/placeholder.png');
                });
            });
        });
        $elem.on('slider-itemsLoaded', function(e) {
            console.log('itemsLoaded');
            $elem.off('slider-show',$elem.loadItem);
        });
    };

    slider.lazyLoad(slider.$focusSlider);
    slider.$focusSlider.slider({
        css3:true,
        js:false,
        animation:'fade',
        activeIndex:0,
        interval:4
    });

    // todays-slider
    slider.$todaysSlider=$('#todays-slider');
    slider.lazyLoad(slider.$todaysSlider);
    slider.$todaysSlider.slider({
        css3:true,
        js:false,
        animation:'slide',
        activeIndex:0,
        interval:4
    });

    // floor
		var floor={};
    floor.$floor=$('.floor');

    floor.$floor.on('tab-show tab-shown tab-hide tab-hidden',function (e,type,index,elem) {
        console.log(type);
        console.log(index);
        console.log(elem);
    });
    floor.$floor.tab({
        event:'mouseenter',
        css3:false,
        js:false,
        animation:'fade',
        activeIndex:0,
        interval:0,
        delay:0
    });
		
})(jQuery);
