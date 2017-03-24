cc.Class({
    extends: cc.Component,

    editor: {
        executeInEditMode: true,
    },

    properties: {
       easing: {
           default: require('easing-helper').nope,
           type: require('easing-helper')
       },
       deltaTime: 0,
       updateAll: {
            get: function(){
                return false;
            },
            set: function(value){
                if(value){
                     this.moveTo = this.node.position;
                     this.scaleTo = cc.v2(this.node.scaleX,this.node.scaleY);
                     this.rotateTo = this.node.rotation;
                }

            }
       },
       moveTo: cc.v2(),
       updatePosition: {
            get: function(){
                return false;
            },
            set: function(value){
                if(value){
                    this.moveTo = this.node.position;
                }
            }
       },
       scaleTo: cc.v2(),
       updateScale: {
            get: function(){
                return false;
            },
            set: function(value){
                if(value){
                    this.scaleTo = cc.v2(this.node.scaleX,this.node.scaleY);
                }
            }
    },
       rotateTo: 0,
       updateRotate: {
           get: function(){
               return false;
           },
           set: function(value){
                if(value){
                    this.rotateTo = this.node.rotation;
                }
           }
       },
       
    },

});