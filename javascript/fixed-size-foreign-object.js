(function(win){
  let svgs, els=[];

  win.fixedSizeForeignObjects = function fixedSizeForeignObjects(...all) {
    all.forEach( fixedSizeForeignObject );
  }

  win.fixedSizeForeignObject = function fixedSizeForeignObject(el) {
      if (!svgs) { svgs = []; win.addEventListener('resize',resizeSVGs,false) }
      let svg=el.ownerSVGElement, found=false;
      for (let i=svgs.length;i--;) if (svgs[i]===svg) found=true;
      if (!found) svgs.push(svg);
      let info = {
        el:el, svg:svg,
        w:el.getAttribute('width')*1, h:el.getAttribute('height')*1,
        x:el.getAttribute('x')*1, y:el.getAttribute('y')*1
      };
      els.push(info);
      el.removeAttribute('x');
      el.removeAttribute('y');
      calculateSVGScale(svg);
      fixScale(info);
  }

  function resizeSVGs(evt) {
    svgs.forEach(calculateSVGScale);
    els.forEach(fixScale);
  }

  function calculateSVGScale(svg) {
    let w1=svg.viewBox.animVal.width, h1=svg.viewBox.animVal.height;
    if (!w1 && !h1) svg.scaleRatios = [1,1]; // No viewBox
    else {
      let info = getComputedStyle(svg);
      let w2=parseFloat(info.width), h2=parseFloat(info.height);
      let par=svg.preserveAspectRatio.animVal;
      if (par.align===SVGPreserveAspectRatio.SVG_PRESERVEASPECTRATIO_NONE) {
        svg.scaleRatios = [w2/w1, h2/h1];
      } else {
        let meet = par.meetOrSlice === SVGPreserveAspectRatio.SVG_MEETORSLICE_MEET;
        let ratio = (w1/h1 > w2/h2) != meet ? h2/h1 : w2/w1;
        svg.scaleRatios = [ratio, ratio];
      }
    }
  }

  function fixScale(info) {
    let s = info.svg.scaleRatios;
    info.el.setAttribute('width', info.w*s[0]);
    info.el.setAttribute('height',info.h*s[1]);
    info.el.setAttribute('transform','translate('+info.x+','+info.y+') scale('+1/s[0]+','+1/s[1]+')');
  }

  })(window);