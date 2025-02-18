
let currentWidth = null;
let currentHeight = null;
let arFrameTimeout = setTimeout(function(){},0);

function dimensionChange(e,dimname){

	if(dimname == 'Width|宽度'){
		currentWidth = e.target.value*1.0
	}
	if(dimname == 'Height|高度'){
		currentHeight = e.target.value*1.0
	}

	var inImg2img   = Boolean(gradioApp().querySelector("button.rounded-t-lg.border-gray-200"))

	if(!inImg2img){
		return;
	}

	var img2imgMode = gradioApp().querySelector('#mode_img2img.tabs > div > button.rounded-t-lg.border-gray-200')
	if(img2imgMode){
		img2imgMode=img2imgMode.innerText
	}else{
		return;
	}

	var redrawImage = gradioApp().querySelector('div[data-testid=image] img');
	var inpaintImage = gradioApp().querySelector('#img2maskimg div[data-testid=image] img')

	var targetElement = null;

	if(img2imgMode=='img2img|图像到图像' && redrawImage){
		targetElement = redrawImage;
	}else if(img2imgMode=='Inpaint|蒙板绘图' && inpaintImage){
		targetElement = inpaintImage;
	}

	if(targetElement){

		var arPreviewRect = gradioApp().querySelector('#imageARPreview');
		if(!arPreviewRect){
		    arPreviewRect = document.createElement('div')
		    arPreviewRect.id = "imageARPreview";
		    gradioApp().getRootNode().appendChild(arPreviewRect)
		}



		var viewportOffset = targetElement.getBoundingClientRect();

		viewportscale = Math.min(  targetElement.clientWidth/targetElement.naturalWidth, targetElement.clientHeight/targetElement.naturalHeight )

		scaledx = targetElement.naturalWidth*viewportscale
		scaledy = targetElement.naturalHeight*viewportscale

		cleintRectTop    = (viewportOffset.top+window.scrollY)
		cleintRectLeft   = (viewportOffset.left+window.scrollX)
		cleintRectCentreY = cleintRectTop  + (targetElement.clientHeight/2)
		cleintRectCentreX = cleintRectLeft + (targetElement.clientWidth/2)

		viewRectTop    = cleintRectCentreY-(scaledy/2)
		viewRectLeft   = cleintRectCentreX-(scaledx/2)
		arRectWidth  = scaledx
		arRectHeight = scaledy

		arscale = Math.min(  arRectWidth/currentWidth, arRectHeight/currentHeight )
		arscaledx = currentWidth*arscale
		arscaledy = currentHeight*arscale

		arRectTop    = cleintRectCentreY-(arscaledy/2)
		arRectLeft   = cleintRectCentreX-(arscaledx/2)
		arRectWidth  = arscaledx
		arRectHeight = arscaledy

	    arPreviewRect.style.top  = arRectTop+'px';
	    arPreviewRect.style.left = arRectLeft+'px';
	    arPreviewRect.style.width = arRectWidth+'px';
	    arPreviewRect.style.height = arRectHeight+'px';

	    clearTimeout(arFrameTimeout);
	    arFrameTimeout = setTimeout(function(){
	    	arPreviewRect.style.display = 'none';
	    },2000);

	    arPreviewRect.style.display = 'block';

	}

}


onUiUpdate(function(){
	var arPreviewRect = gradioApp().querySelector('#imageARPreview');
	if(arPreviewRect){
		arPreviewRect.style.display = 'none';
	}
	var inImg2img   = Boolean(gradioApp().querySelector("button.rounded-t-lg.border-gray-200"))
	if(inImg2img){
		let inputs = gradioApp().querySelectorAll('input');
		inputs.forEach(function(e){ 
			let parentLabel = e.parentElement.querySelector('label')
			if(parentLabel && parentLabel.innerText){
				if(!e.classList.contains('scrollwatch')){
					if(parentLabel.innerText == 'Width|宽度' || parentLabel.innerText == 'Height|高度'){
						e.addEventListener('input', function(e){dimensionChange(e,parentLabel.innerText)} )
						e.classList.add('scrollwatch')
					}
					if(parentLabel.innerText == 'Width|宽度'){
						currentWidth = e.value*1.0
					}
					if(parentLabel.innerText == 'Height|高度'){
						currentHeight = e.value*1.0
					}
				}
			} 
		})
	}
});
