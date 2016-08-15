/**
 * Created by CC on 2016/7/28.
 */
var YHLayer = {
    global_load_index : -1,	// 全局控制一个弹出等待层的index
    loading:function(msg){
        if(null==msg || ""==msg){
            msg = "处理中，请稍后……";
        }
        global_load_index = layer.msg(msg, {icon: 16, time: 30000});
        return global_load_index;
    },
    closeLoading:function(i){
        if(null==i || typeof i == "undefined") {
            return layer.close(global_load_index);
        }
        return layer.close(i);
    },
    closeAllLayer: function(){
        layer.closeAll();
    }
};