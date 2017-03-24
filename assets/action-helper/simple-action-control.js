cc.Class({
    extends: cc.Component,
    
    // editor: {
    //     //requireComponent: require('simple-action-helper')
    // },

    properties: {
        //actionArray: [require('simple-action-item')]
        _simpleActionHelperArray: null,
        loop: false,
        easingRate: 3,
        _easingHelper: null,
    },

    onLoad: function () {
        this._easingHelper = require('easing-helper');
        this._simpleActionHelperArray = this.getComponents('simple-action-helper');
        this.anim();
    },

    anim: function(){
        let item = this._simpleActionHelperArray.shift();
            if(item){
                let moveToData = item.moveTo;
                let rotateToData = item.rotateTo;
                let scaleToData = item.scaleTo;
                let deltaTime = item.deltaTime;
                let easing = item.easing;
                let moveAction = null;
                let rotateAction = null;
                let scaleAction = null;
                if(easing == this._easingHelper.nope){
                    moveAction = cc.moveTo(deltaTime,moveToData);
                    rotateAction = cc.rotateTo(deltaTime,rotateToData);
                    scaleAction = cc.scaleTo(deltaTime,scaleToData.x,scaleToData.y);
                }else{
                    moveAction = cc.moveTo(deltaTime,moveToData).easing(cc[this._easingHelper[easing]](this.easingRate));
                    rotateAction = cc.rotateTo(deltaTime,rotateToData).easing(cc[this._easingHelper[easing]](this.easingRate));
                    scaleAction = cc.scaleTo(deltaTime,scaleToData.x,scaleToData.y).easing(cc[this._easingHelper[easing]](this.easingRate));
                }
                this.node.runAction(cc.sequence(
                        cc.spawn(
                            moveAction,
                            rotateAction,
                            scaleAction
                        ),
                        cc.callFunc(this.anim.bind(this))
                    )
                );
                if(this.loop){
                    this._simpleActionHelperArray.push(item);
                }
            }
            
    },

});
