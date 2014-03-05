//函数用于生成指定提示信息
//message:提示语
//zindex:传入z-index值，以保证提示消息显示级别最高
//direction:相对于调用对象,产生提示语的位置
//close_method  click:点击关闭 delay:延迟delay_time ms关闭
//delay_time:延迟关闭时间(ms)
//closeall:如果传递参数为true，函数不进行其他操作，直接关闭现有所有提示信息
//close:如果传递参数为true，关闭当前对象的消息提示
//若直接传递字符串，则默认设置z-index=500,direction=top
$.fn.popover = function(option) {
	//默认属性
	var settings = {
		'message': '输入错误！',
		'zindex': 500,
		'direction': 'top',
		'close_method': '',
		'delay_time': 3000,
		'closeall': false,
		'close': false
	};
	//处理参数为字符串类型
	if(typeof option == 'string') {
		settings.message = option;
		option = settings;
	} else {
		option = $.extend(settings,option);
	}
	//关闭所有提示信息
	if(option.closeall == true) {
		$popover.remove();
		return this;
	}
	//计算传入对象在界面种的位置函数
	var get_obj_pos = function(obj) {
		var jobj = obj;
		var width = jobj.width();
		var height = jobj.height();
		var obj_pos = jobj.position();
		return {'top': obj_pos.top, 'left': obj_pos.left, 'width': width, 'height': height};
	}
	//定位html块位置
	var message_pos = function(obj, top, left) {
		obj.css({
			'top': top,
			'left': left
		});						
	}
	//关闭当前对象的提示信息
	if(option.close == true) {
		var jnext = $(this[0]).next();
		if(jnext.attr('class') == 'popover') {
			jnext.remove();
		}
		return this;
	}
	this.each(function(){
		var top = 0; //提示信息的position.top
		var left = 0; //提示信息的position.left
		var k = 0; //状态标记，０:对象未有提示信息 1:对象已有提示信息
		//提示语
		var jpopover = $(this).next();
		var jmessage = jpopover.find('.pop_message').find('p');
		if(jpopover.attr('class') == 'popover') {
			k = 1 ;
			jmessage.text(option.message);
		}
		if(k != 1) {
			//html字符串
			var str = "<div class='popover' style='z-index: " + option.zindex + "'><div class='pop_arrow'></div><div class='pop_message'><p style='margin: 0px;'></p></div></div>";
			$(this).after(str);
			jpopover = $(this).next();
			jmessage = jpopover.find('.pop_message').find('p');
			jmessage.text(option.message);
			var jpop_message = jpopover.find('.pop_message');
			var message_width = jpop_message.width();
			var message_height = jpop_message.height();
			//根据参数direction，添加不同class，实现在对象的不同位置弹出提示信息
			jpopover.find('.pop_arrow').addClass('pop_arrow_' + option.direction);
			//position:对象在界面中的位置信息
			var position = get_obj_pos($(this));
			if(option.direction == 'right') {
				top = position.top;
				left = position.left + position.width + 14;
			}else if(option.direction == 'left') {
				top = position.top;
				left = position.left - message_width - 10;
				if(message_width > 100) {
					jpopover.find('.pop_arrow').css('left', message_width - 1);
				}
			}else if(option.direction == 'top') {
				top = position.top - message_height - 8;
				left = position.left;
			}else if(option.direction == 'bottom') {
				top = position.top + position.height + 14;
				left = position.left;
			}
			//定位html块在界面种的位置
			message_pos(jpopover, top, left);
			//根据参数，判断以何种方式关闭提示信息
			if(option.close_method == 'click') {
				jpopover.on('click tap', function(){
					$(this).remove();
				});
			} else if(option.close_method == 'delay') {
				setTimeout(function(){
					jpopover.remove();
				}, option.delay_time);
			}
		}
	});
	return this;
};