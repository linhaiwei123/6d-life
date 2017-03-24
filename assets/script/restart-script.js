cc.Class({
    extends: cc.Component,

    properties: {
       
    },

    onLoad: function () {
        this.node.on('touchstart',this.onTouchStart,this)
    },

    onTouchStart: function(){
        cc.find('Canvas').emit('restart');
    }
});
