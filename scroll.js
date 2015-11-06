var Page_scroll = {
    body : document.body,
    pagiAnchors : null,
    defaults : {
        container : document.getElementById('main'),
        pages : document.getElementById('main').getElementsByTagName('section'),
        hasPagination : false,
        animateTime : 0.5,
        animateFunc : 'ease'
    },
    init : function(config){
        var defaults = this.defaults,
            settings = config;
        this.defaults = this.extendDefault(defaults,settings);//初始化用户设置
        this.layoutInit();//初始化元素应该与的样式等
        this.wheelEvent();//初始化鼠标滚轮事件
    },
    layoutInit : function(){
        var container  = this.defaults.container,
            pages = this.defaults.pages,
            hasPagi = this.defaults.hasPagination;
        
        container.className = 'scroll-wrapper';
        for(var i = 0,len = pages.length;i < len;i++){
            pages[i].setAttribute('data-index', i);
        };
        pages[0].className = 'active';
        this.body.className = 'czm-page0'
        //判断是否有右侧导航
        this.hasPagination(hasPagi);
    },
    hasPagination : function(hasPagi){
        if(hasPagi){
            var len = this.defaults.pages.length,
                ulBox = document.createElement('ul'),
                oAnchor,
                oLi;
            ulBox.id = 'pagination';
            for(var i = 0;i < len;i++){
                oAnchor = document.createElement('a');
                oAnchor.href = 'javascript:;';
                oAnchor.setAttribute('data-index', i);//添加index
                if(i == 0) oAnchor.className = 'active';
                oLi = document.createElement('li');
                oLi.appendChild(oAnchor);
                ulBox.appendChild(oLi);
            }
            this.body.insertBefore(ulBox, this.defaults.container);
            this.pagiAnchors = document.getElementById('pagination').getElementsByTagName('a');
            this.rightNav();//触发右侧导航的点击事件
        }
    },
    extendDefault : function(defaults,settings){
        for(o in settings){
            if(settings.hasOwnProperty(o)){
                defaults[o] = settings[o];
            }
        }
        return defaults;
    },
    addEvent : function(){
        var eventCompat = function(event){
            if(event.type === 'mousewheel' || event.type === 'DOMMouseScroll'){
                event.delta = (event.wheelDelta) ? event.wheelDelta / 120 : -event.detail / 3;
            }
            return event;
        }
        if(window.addEventListener){
            return function(ele,type,fn){
                var evtType;
                if(type === 'mousewheel'){
                    evtType = (/Firefox/i.test(navigator.userAgent))? "DOMMouseScroll" : "mousewheel"
                }else{
                    evtType = type;
                }
                ele.addEventListener(evtType,function(event){
                    fn.call(this,eventCompat(event));
                });
            }
        }else if(window.attachEvent){
            return function(ele,type,fn){
                ele.attachEvent('on' + type,function(event){
                    var event = event || window.event;
                    fn.call(this,eventCompat(event));
                });
            }
        }
    }(),
    wheelEvent : function(){
        var _ = this;
        this.addEvent(document,'mousewheel',function(e){
            e.delta > 0 ? _.moveUp() : _.moveDown();
        });
    },
    attr : function(elements,attr,value){
        var o;
        for(var i = 0,len = elements.length;i < len;i++){
            o = elements[i].getAttribute(attr);
            if(o === value){
                return elements[i];
            }
        }
    },
    moveUp : function(){
        var _ = this,
            container = _.defaults.container,
            pages = _.defaults.pages,
            currentPage = _.attr(pages,'class','active'),
            currentIndex = parseInt(currentPage.getAttribute('data-index')),
            prevIndex = (currentIndex - 1).toString(),
            prevPage = _.attr(pages,'data-index',prevIndex);
        if(currentIndex === 0){
            return;  
        }else{
            if(this.defaults.hasPagination){
                this.pagiAnchors[currentIndex].className = '';
                this.pagiAnchors[prevIndex].className = 'active';
            }
            pos = -prevIndex * 100;
            currentPage.className = '';
            prevPage.className = 'active';
            this.body.className = 'czm-page' + prevIndex;
        }

        this.scrollAnimate(container,pos);
    },
    moveDown : function(){
        var _ = this,
            pos,
            container = _.defaults.container,
            pages = _.defaults.pages,
            currentPage = _.attr(pages,'class','active'),
            currentIndex = parseInt(currentPage.getAttribute('data-index')),
            nextIndex = (currentIndex + 1).toString(),
            nextPage = _.attr(pages,'data-index',nextIndex);
       
      if(currentIndex + 1 === pages.length){
            return;
      }else{
        if(this.defaults.hasPagination){
             this.pagiAnchors[currentIndex].className = '';
             this.pagiAnchors[nextIndex].className = 'active';
        }
         pos = -nextIndex * 100;
         currentPage.className = '';
         nextPage.className = 'active';
         this.body.className = 'czm-page' + nextIndex;
      }

       this.scrollAnimate(container,pos); 
    },
    moveTo : function(index){
        var _ = this,
            _index = index,
            pos = - (_index) * 100,
            pages = _.defaults.pages,
            currentPage = _.attr(pages,'class','active'),
            targetPage = _.attr(pages,'data-index',_index),
            container = _.defaults.container,
            pagiAnchors = _.pagiAnchors;
        for(var i = 0,len = pagiAnchors.length;i < len;i++){
            pagiAnchors[i].className = '';
        }
        pagiAnchors[_index].className = 'active';
        currentPage.className = '';
        targetPage.className = 'active';
        _.body.className = 'czm-page' + _index;
        _.scrollAnimate(container,pos);
    },
    rightNav : function(){
        var o,
            pagiAnchors = this.pagiAnchors,
            self = this;
        for(var i = 0,len = pagiAnchors.length;i < len;i++){
            pagiAnchors[i].onclick = function(){
                o = this.getAttribute('data-index');
                self.moveTo(o);
            };
        }
    },
    scrollAnimate : function(ele,position){
        var animateTime = this.defaults.animateTime,
            animateFunc = this.defaults.animateFunc;
        ele.style.webkitTransform = 'translateY(' + position + '%)';
        ele.style.mozTransform = 'translateY(' + position + '%)';
        ele.style.msTransform = 'translateY(' + position + '%)';
        ele.style.transform = 'translateY(' + position + '%)';
        ele.style.webkitTransition = 'all ' + animateTime + 's ' + animateFunc;
        ele.style.mozTransition = 'all ' + animateTime + 's ' + animateFunc;
        ele.style.msTransition = 'all ' + animateTime + 's ' + animateFunc;
        ele.style.transition = 'all ' + animateTime + 's ' + animateFunc;
    }
};