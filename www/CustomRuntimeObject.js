var gdjs;(function(r){const o=new r.Logger("CustomRuntimeObject");class h extends r.RuntimeObject{constructor(t,e){super(t,e);this._isUntransformedHitBoxesDirty=!0;this._untransformedHitBoxes=[];this._unrotatedAABB={min:[0,0],max:[0,0]};this._innerArea=null;this._isInnerAreaFollowingParentSize=!1;this._scaleX=1;this._scaleY=1;this._flippedX=!1;this._flippedY=!1;this.opacity=255;this._customCenter=null;this._localTransformation=new r.AffineTransformation;this._localInverseTransformation=new r.AffineTransformation;this._isLocalTransformationDirty=!0;this._type=e.type,this._instanceContainer=new r.CustomRuntimeObjectInstanceContainer(t,this),this._renderer=this._createRender(),this._initializeFromObjectData(e)}_initializeFromObjectData(t){const e=this._runtimeScene.getGame().getEventsBasedObjectData(t.type);if(!e){o.error(`A CustomRuntimeObject was initialized (or re-initialized) from object data referring to an non existing events based object data with type "${t.type}".`);return}this._isInnerAreaFollowingParentSize=e.isInnerAreaFollowingParentSize,e.instances.length>0&&(this._innerArea||(this._innerArea={min:[0,0,0],max:[0,0,0]}),this._innerArea.min[0]=e.areaMinX,this._innerArea.min[1]=e.areaMinY,this._innerArea.min[2]=e.areaMinZ,this._innerArea.max[0]=e.areaMaxX,this._innerArea.max[1]=e.areaMaxY,this._innerArea.max[2]=e.areaMaxZ),this._instanceContainer.loadFrom(t,e)}reinitialize(t){super.reinitialize(t),this._initializeFromObjectData(t),this._reinitializeRenderer(),this.onCreated()}updateFromObjectData(t,e){const i=this.getAnimator();return i&&i.updateFromObjectData(t.animatable||[],e.animatable||[]),!0}extraInitializationFromInitialInstance(t){const e=this.getAnimator();if(t.numberProperties)for(let i=0,n=t.numberProperties.length;i<n;++i){const s=t.numberProperties[i];e&&s.name==="animation"&&e.setAnimationIndex(s.value)}t.customSize&&(this.setWidth(t.width),this.setHeight(t.height))}onDeletedFromScene(t){this.onDestroy(t),super.onDeletedFromScene(t),this._instanceContainer.onDestroyFromScene(t)}update(t){this._instanceContainer._updateObjectsPreEvents(),this.doStepPreEvents(this._instanceContainer);const e=this.getRuntimeScene().getProfiler();e&&e.begin(this.type),this.doStepPostEvents(this._instanceContainer),e&&e.end(this.type),this._instanceContainer._updateObjectsPostEvents()}onHotReloading(t){}doStepPreEvents(t){}doStepPostEvents(t){}onDestroy(t){}updatePreRender(t){this._instanceContainer._updateObjectsPreRender(),this.getRenderer().ensureUpToDate()}getRenderer(){return this._renderer}getChildrenContainer(){return this._instanceContainer}onChildrenLocationChanged(){this._isUntransformedHitBoxesDirty=!0,this.invalidateHitboxes(),this.getRenderer().update()}updateHitBoxes(){this._isUntransformedHitBoxesDirty&&this._updateUntransformedHitBoxes();const t=this.getLocalTransformation();for(let e=0;e<this._untransformedHitBoxes.length;++e){e>=this.hitBoxes.length&&this.hitBoxes.push(new r.Polygon);for(let i=0;i<this._untransformedHitBoxes[e].vertices.length;++i)i>=this.hitBoxes[e].vertices.length&&this.hitBoxes[e].vertices.push([0,0]),t.transform(this._untransformedHitBoxes[e].vertices[i],this.hitBoxes[e].vertices[i]);this.hitBoxes[e].vertices.length=this._untransformedHitBoxes[e].vertices.length}}_updateUntransformedHitBoxes(){this._isUntransformedHitBoxesDirty=!1,this._untransformedHitBoxes.length=0;let t=Number.MAX_VALUE,e=Number.MAX_VALUE,i=-Number.MAX_VALUE,n=-Number.MAX_VALUE;for(const s of this._instanceContainer.getAdhocListOfAllInstances()){if(!s.isIncludedInParentCollisionMask())continue;Array.prototype.push.apply(this._untransformedHitBoxes,s.getHitBoxes());const a=s.getAABB();t=Math.min(t,a.min[0]),e=Math.min(e,a.min[1]),i=Math.max(i,a.max[0]),n=Math.max(n,a.max[1])}for(t===Number.MAX_VALUE&&(t=0,e=0,i=1,n=1),this._unrotatedAABB.min[0]=t,this._unrotatedAABB.min[1]=e,this._unrotatedAABB.max[0]=i,this._unrotatedAABB.max[1]=n;this.hitBoxes.length<this._untransformedHitBoxes.length;)this.hitBoxes.push(new r.Polygon);this.hitBoxes.length=this._untransformedHitBoxes.length}applyObjectTransformation(t,e,i){const n=i;n[0]=t,n[1]=e,this.getLocalTransformation().transform(n,i)}getLocalTransformation(){return this._isLocalTransformationDirty&&this._updateLocalTransformation(),this._localTransformation}getLocalInverseTransformation(){return this._isLocalTransformationDirty&&this._updateLocalTransformation(),this._localInverseTransformation}_updateLocalTransformation(){const t=Math.abs(this._scaleX),e=Math.abs(this._scaleY),i=this.getUnscaledCenterX()*t,n=this.getUnscaledCenterY()*e,s=this.angle*Math.PI/180;this._localTransformation.setToTranslation(this.x,this.y),this._localTransformation.rotateAround(s,i,n),this._flippedX&&this._localTransformation.flipX(i),this._flippedY&&this._localTransformation.flipY(n),this._localTransformation.scale(t,e),this._localInverseTransformation.copyFrom(this._localTransformation),this._localInverseTransformation.invert(),this._isLocalTransformationDirty=!1}applyObjectInverseTransformation(t,e,i){const n=i;n[0]=t,n[1]=e,this.getLocalInverseTransformation().transform(n,i)}getDrawableX(){let t=0;this._innerArea?t=this._innerArea.min[0]:(this._isUntransformedHitBoxesDirty&&this._updateUntransformedHitBoxes(),t=this._unrotatedAABB.min[0]);const e=this.getScaleX();return this._flippedX?this.x+(-t-this.getUnscaledWidth()+2*this.getUnscaledCenterX())*e:this.x+t*e}getDrawableY(){let t=0;this._innerArea?t=this._innerArea.min[1]:(this._isUntransformedHitBoxesDirty&&this._updateUntransformedHitBoxes(),t=this._unrotatedAABB.min[1]);const e=this.getScaleY();return this._flippedY?this.y+(-t-this.getUnscaledHeight()+2*this.getUnscaledCenterY())*e:this.y+t*e}getInnerAreaMinX(){return this._innerArea?this._innerArea.min[0]:(this._isUntransformedHitBoxesDirty&&this._updateUntransformedHitBoxes(),this._unrotatedAABB.min[0])}getInnerAreaMinY(){return this._innerArea?this._innerArea.min[1]:(this._isUntransformedHitBoxesDirty&&this._updateUntransformedHitBoxes(),this._unrotatedAABB.min[1])}getInnerAreaMaxX(){return this._innerArea?this._innerArea.max[0]:(this._isUntransformedHitBoxesDirty&&this._updateUntransformedHitBoxes(),this._unrotatedAABB.max[0])}getInnerAreaMaxY(){return this._innerArea?this._innerArea.max[1]:(this._isUntransformedHitBoxesDirty&&this._updateUntransformedHitBoxes(),this._unrotatedAABB.max[1])}getUnscaledWidth(){return this._innerArea?this._innerArea.max[0]-this._innerArea.min[0]:(this._isUntransformedHitBoxesDirty&&this._updateUntransformedHitBoxes(),this._unrotatedAABB.max[0]-this._unrotatedAABB.min[0])}getUnscaledHeight(){return this._innerArea?this._innerArea.max[1]-this._innerArea.min[1]:(this._isUntransformedHitBoxesDirty&&this._updateUntransformedHitBoxes(),this._unrotatedAABB.max[1]-this._unrotatedAABB.min[1])}getUnscaledCenterX(){return this._customCenter?this._customCenter[0]:this._innerArea?(this._innerArea.min[0]+this._innerArea.max[0])/2:(this._isUntransformedHitBoxesDirty&&this._updateUntransformedHitBoxes(),(this._unrotatedAABB.min[0]+this._unrotatedAABB.max[0])/2)}getUnscaledCenterY(){return this._customCenter?this._customCenter[1]:this._innerArea?(this._innerArea.min[1]+this._innerArea.max[1])/2:(this._isUntransformedHitBoxesDirty&&this._updateUntransformedHitBoxes(),(this._unrotatedAABB.min[1]+this._unrotatedAABB.max[1])/2)}setRotationCenter(t,e){this._customCenter||(this._customCenter=[0,0]),this._customCenter[0]=t,this._customCenter[1]=e,this._isLocalTransformationDirty=!0,this.invalidateHitboxes()}hasCustomRotationCenter(){return!!this._customCenter}getCenterX(){return(this.getUnscaledCenterX()-this._unrotatedAABB.min[0])*this.getScaleX()}getCenterY(){return(this.getUnscaledCenterY()-this._unrotatedAABB.min[1])*this.getScaleY()}getWidth(){return this.getUnscaledWidth()*this.getScaleX()}getHeight(){return this.getUnscaledHeight()*this.getScaleY()}setWidth(t){const e=this.getUnscaledWidth();if(e===0)return;const i=t/e;this._innerArea&&this._isInnerAreaFollowingParentSize?(this._innerArea.min[0]*=i,this._innerArea.max[0]*=i):this.setScaleX(i)}setHeight(t){const e=this.getUnscaledHeight();if(e===0)return;const i=t/e;this._innerArea&&this._isInnerAreaFollowingParentSize?(this._innerArea.min[1]*=i,this._innerArea.max[1]*=i):this.setScaleY(i)}setSize(t,e){this.setWidth(t),this.setHeight(e)}setX(t){t!==this.x&&(this.x=t,this._isLocalTransformationDirty=!0,this.invalidateHitboxes(),this.getRenderer().updateX())}setY(t){t!==this.y&&(this.y=t,this._isLocalTransformationDirty=!0,this.invalidateHitboxes(),this.getRenderer().updateY())}setAngle(t){this.angle!==t&&(this.angle=t,this._isLocalTransformationDirty=!0,this.invalidateHitboxes(),this.getRenderer().updateAngle())}setScale(t){this._innerArea&&this._isInnerAreaFollowingParentSize||(t<0&&(t=0),!(t===Math.abs(this._scaleX)&&t===Math.abs(this._scaleY))&&(this._scaleX=t*(this._flippedX?-1:1),this._scaleY=t*(this._flippedY?-1:1),this._isLocalTransformationDirty=!0,this.invalidateHitboxes(),this.getRenderer().update()))}setScaleX(t){this._innerArea&&this._isInnerAreaFollowingParentSize||(t<0&&(t=0),t!==Math.abs(this._scaleX)&&(this._scaleX=t*(this._flippedX?-1:1),this._isLocalTransformationDirty=!0,this.invalidateHitboxes(),this.getRenderer().update()))}setScaleY(t){this._innerArea&&this._isInnerAreaFollowingParentSize||(t<0&&(t=0),t!==Math.abs(this._scaleY)&&(this._scaleY=t*(this._flippedY?-1:1),this.invalidateHitboxes(),this.getRenderer().update()))}getScaleMean(){return(Math.abs(this._scaleX)+Math.abs(this._scaleY))/2}getScale(){const t=Math.abs(this._scaleX),e=Math.abs(this._scaleY);return t===e?t:Math.sqrt(t*e)}getScaleY(){return Math.abs(this._scaleY)}getScaleX(){return Math.abs(this._scaleX)}setOpacity(t){t<0&&(t=0),t>255&&(t=255),this.opacity=t,this.getRenderer().updateOpacity()}getOpacity(){return this.opacity}hide(t){t===void 0&&(t=!0),this.hidden=t,this.getRenderer().updateVisibility()}flipX(t){t!==this._flippedX&&(this._scaleX*=-1,this._flippedX=t,this.invalidateHitboxes(),this.getRenderer().update())}flipY(t){t!==this._flippedY&&(this._scaleY*=-1,this._flippedY=t,this.invalidateHitboxes(),this.getRenderer().update())}isFlippedX(){return this._flippedX}isFlippedY(){return this._flippedY}getAnimator(){return null}}r.CustomRuntimeObject=h,h.supportsReinitialization=!1})(gdjs||(gdjs={}));
//# sourceMappingURL=CustomRuntimeObject.js.map
