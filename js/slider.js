(function ($) {
	'use strict';

	function Slider($elem,options) {
		this.$elem=$elem;
		this.options=options;

		this.$items=this.$elem.find('.slider-item');
		this.$indicators=this.$elem.find('.slider-indicator');
		this.$controls=this.$elem.find('.slider-control');

		this.itemNum=this.$items.length;
		this.curIndex=this._getCorrectIndex(this.options.activeIndex);

		this._init();
	}
	Slider.DEFAULTS={
		css3:false,
		js:false,
		animation:'fade',
		activeIndex:0,
		interval:0,
		loop:false
	}
	Slider.prototype._init = function(){
		var self=this;
		
		this.$indicators.removeClass('slider-indicator-active');
		this.$indicators.eq(this.curIndex).addClass('slider-indicator-active');
		this.$elem.trigger('slider-show',[this.curIndex,this.$items[this.curIndex]]);

		if (this.options.animation==='slide') {
			this.$elem.addClass('slider-slide');

			this.$items.eq(this.curIndex).css('left',0);

			
			this.$items.on('move moved',function (e) {
				var index=self.$items.index(this);

				if (e.type==='move') {
					if (index===self.curIndex){
						self.$elem.trigger('slider-hide',[index,this]);
					}else {
						self.$elem.trigger('slider-show',[index,this]);
					}
				}else {
					if (index===self.curIndex){
						self.$elem.trigger('slider-shown',[index,this]);
					}else {
						self.$elem.trigger('slider-hidden',[index,this]);
					}
				}
			});
			this.$items.move(this.options);
			this.to=this._slide;
			// this.$container=this.$elem.find('.slider-container');
			// this.itemWidth=this.$items.eq(0).width();
			// this.$container.css('left', -1*this.curIndex*this.itemWidth);
			this.itemWidth=this.$items.eq(0).width();
			this.transitionClass=this.$items.eq(0).hasClass('transition') ? 'transition':'';
			// this.$container.move(this.options);

			if (this.options.loop){
				this.$container.append(this.$items.eq(0).clone());
				this.transitionClass=this.$container.hasClass('transition') ? 'transition':'';
				this.itemNum++;
			}
		}else {
			this.$elem.addClass('slider-fade');
			this.$items.eq(this.curIndex).show();

			this.$items.on('show shown hide hidden',function (e) {
				self.$elem.trigger('slider-'+e.type,[self.$items.index(this),this]);
			});

			this.$items.showHide(this.options);
			this.to=this._fade;
		}

		this.$elem
			.hover(function() {
				self.$controls.show();
			}, function() {
				self.$controls.hide();
			})
			.on('click','.slider-control-left',function() {
				self.to(self._getCorrectIndex(self.curIndex-1),1);
			})
			.on('click','.slider-control-right',function() {
				self.to(self._getCorrectIndex(self.curIndex+1),-1);
			})
			.on('click','.slider-indicator',function() {
				self.to(self._getCorrectIndex(self.$indicators.index(this)));
			});

		if (this.options.interval && !isNaN(Number(this.options.interval))){
			this.$elem.hover($.proxy(this.pause,this),$.proxy(this.auto,this));
			this.auto();
		}
		
	};
	Slider.prototype._getCorrectIndex = function(index,maxNum){
		maxNum=maxNum||this.itemNum;
		if (isNaN(Number(index))) return 0;
		if (index<0) return maxNum-1;
		if (index>maxNum-1) return 0;
		return index;
	};
	Slider.prototype._activeIndicators = function (index) {
		// this.$indicators.eq(this.curIndex).removeClass('slider-indicator-active');
		this.$indicators.removeClass('slider-indicator-active');
		this.$indicators.eq(index).addClass('slider-indicator-active');
	};
	Slider.prototype._fade = function(index){
		if(this.curIndex===index) return;

		this.$items.eq(this.curIndex).showHide('hide');
		this.$items.eq(index).showHide('show');

		this._activeIndicators(index);

		this.curIndex=index;
	};
	Slider.prototype._slide = function(index,direction){
		if (this.curIndex===index) return;

		var self=this;
		if (!direction) {
			if (this.curIndex < index) {
				direction=-1;
			}else if (this.curIndex > index) {
				direction=1;
			}
		}

		this.$items.eq(index).removeClass(this.transitionClass).css('left', -1*direction*this.itemWidth);

		setTimeout(function () {
			self.$items.eq(self.curIndex).move('x',direction*self.itemWidth);
			self.$items.eq(index).addClass(self.transitionClass).move('x',0);
			self.curIndex=index;
		},20);

		this._activeIndicators(index);
		// if (this.curIndex===index) return;

		// var self=this;
		// this.$container.move('x',-1*index*this.itemWidth);
		// this.curIndex=index;

		// if(this.options.loop && direction){
		// 	if (direction<0) {
		// 		if(index===0){
		// 			this.$container.removeClass(this.transitionClass).css('left',0);
		// 			this.curIndex=index=1;
		// 			setTimeout(function () {
		// 				self.$container.addClass(self.transitionClass).move('x',-1*index*self.itemWidth);
		// 			},20);
		// 		}
		// 	}else {
		// 		if (index===this.itemNum-1) {
		// 			this.$container.removeClass(this.transitionClass).css('left',-1*index*this.itemWidth);
		// 			this.curIndex=index=this.itemNum-2;
		// 			setTimeout(function () {
		// 				self.$container.addClass(self.transitionClass).move('x',-1*index*self.itemWidth);
		// 			},20);
		// 		}
		// 	}
		// 	index=this._getCorrectIndex(index,this.itemNum-1);
		// }

		// this._activeIndicators(index);
		
	};
	Slider.prototype.auto = function(){
		var self=this;
		this.intervalId=setInterval(function () {
			self.to(self._getCorrectIndex(self.curIndex+1),-1);
		},this.options.interval);
	};
	Slider.prototype.pause = function(){
		clearInterval(this.intervalId);
	};

	$.fn.extend({
		slider:function (option) {
			return this.each(function() {
                
                var $this=$(this),
                slider=$this.data('slider'),
                options = $.extend({}, Slider.DEFAULTS, $(this).data(), typeof option==='object'&&option);
                // slider(this, options);  
                if(!slider){//解决多次调用slider问题
                    $this.data('slider',slider=new Slider($this,options));

                }  

                if(typeof slider[option]==='function'){
                    slider[option]();

                }
            });
		}
	});
})(jQuery);