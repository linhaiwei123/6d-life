cc.Class({
    extends: cc.Component,

    properties: {
       fadeDuration: 1,
       delay: 4,
       onActionEnd: cc.Component.EventHandler,
    },

    onLoad: function () {
        this.node.opacity = 0;
        this.node.runAction(cc.sequence(
            cc.fadeIn(this.fadeDuration),
            cc.delayTime(this.delay),
            cc.fadeOut(this.fadeDuration),
            cc.callFunc(this.actionEnd.bind(this))
        ));
    },

    actionEnd: function(){
        //cc.find('Canvas').emit('action-end',this.eventInfo);
        //console.log(this.onActionEnd);
        this.onActionEnd.emit();
    },

});
