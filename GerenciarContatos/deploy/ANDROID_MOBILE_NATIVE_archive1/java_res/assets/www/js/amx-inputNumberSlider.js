/* Copyright (c) 2011, 2012, Oracle and/or its affiliates. All rights reserved. */
/* ------------------------------------------------------------- */
/* ------------------- amx-inputNumberSlider.js ---------------- */
/* ------------------------------------------------------------- */

(function()
{
  var amxRenderers =
  {
    inputNumberSlider:
    {
      createChildrenNodes: function(amxNode)
      {
        // Call the register input value during node creation as it requires the EL context
        // to be setup and rendering is not performed in EL context (expects all EL to already
        // be resolved during rendering)
        amx.registerInputValue(amxNode, "value");

        // Return false to let the framework create the children
        return false;
      },

      create: function(amxNode)
      {
        var field = amx.createField(amxNode); // generate the fieldRoot/fieldLabel/fieldValue structure
        var domNode = field.fieldRoot;
        var disable = field.isDisable;
        var isReadOnly = amx.isValueTrue(amxNode.getAttribute("readOnly"));
        var isRequired = amx.isValueTrue(amxNode.getAttribute("required"));
        var container = document.createElement("div");
        container.className = "container"
        field.fieldValue.appendChild(container);
//        var inputTextNumber = document.createElement("div");
//        inputTextNumber.className = "inputTextNumber";
//        var input = document.createElement("input");
//        input.setAttribute("maxlength", "4");
//        input.setAttribute("type", "text");
//        inputTextNumber.appendChild(input);

        var slider = document.createElement("div");
        slider.className = "slider";

        var valve_bg = document.createElement("div");
        valve_bg.className = "valve-background";
        slider.appendChild(valve_bg);

        var valve = document.createElement("div");
        valve.className = "valve";

        // Set this using ARIA slider role and set ARIA metadata
        // ARIA slider doesn't support aria-readOnly assignment, so we'll instead not assign ARIA
        // values when readOnly is set.
        if (!isReadOnly)
        {
          valve.setAttribute("role", "slider");
          var labelId = amxNode.getId() + "::" + "lbl";
          valve.setAttribute("aria-labelledby", labelId);
          valve.setAttribute("aria-orientation", "horizontal");
          valve.setAttribute("aria-valuemin", amxNode.getAttribute("minimum"));
          valve.setAttribute("aria-valuemax", amxNode.getAttribute("maximum"));
          valve.setAttribute("aria-valuenow", amxNode.getAttribute("value"));
          if (disable)
            valve.setAttribute("aria-disabled", "true");
          if (isRequired)
            valve.setAttribute("aria-required", "true");
        }
  
        valve_bg.appendChild(valve);

        var selected = document.createElement("div");
        selected.className = "selected";

        if (isReadOnly)
        {
          adf.mf.internal.amx.addCSSClassName(domNode, "amx-readOnly");
        }
        else // enabled
        {
          slider.appendChild(selected);
        }

        container.appendChild(slider);

        // for now, we do not add these buttons
        //var buttonUp = document.createElement("div");
        //var buttonDown = document.createElement("div");
        //inputTextNumber.append(buttonUp);
        //inputTextNumber.append(buttonDown);

        var minAttr = amxNode.getAttribute("minimum");
        if (minAttr != null && !isNaN(minAttr))
        {
          slider.setAttribute("data-min", minAttr);
          amxNode._min = minAttr * 1;
        }
        else
        {
          slider.setAttribute("data-min", 0);
          amxNode._min = 0;
        }

        var maxAttr = amxNode.getAttribute("maximum");
        if (maxAttr && !isNaN(maxAttr))
        {
          slider.setAttribute("data-max", maxAttr);
          amxNode._max = maxAttr * 1;
        }
        else
        {
          slider.setAttribute("data-max", 100);
          amxNode._max = 100;
        }

        var stepSizeAttr = amxNode.getAttribute("stepSize");
        if (stepSizeAttr != null)
        {
          slider.setAttribute("step", stepSizeAttr);
          amxNode._step = stepSizeAttr;
        }
        else
        {
          slider.setAttribute("step", 1);
          amxNode._step = 1;
        }

        var valueAttr = amxNode.getAttribute("value");
        if (valueAttr !== undefined)
        {
          slider.setAttribute("data-value", valueAttr);
          amxNode._currentValue = valueAttr * 1;
        }

        if (disable)
        {
          adf.mf.internal.amx.addCSSClassName(domNode, "amx-disabled");
          var disable = document.createElement("div");
          disable.className = "disable";
          field.fieldValue.appendChild(disable);
        }

        // calls applyRequiredMarker in amx-core.js to determine and implement required/showRequired style
        adf.mf.api.amx.applyRequiredMarker(amxNode, field);

        /* for now, we do not have the .btn
        $(inputTextNumber).delegate(".btn","click",function()
        {
          var $btn = $(this);
          var p = $btn.hasClass("up") ? 1 : -1;
          var value = amxNode._currentValue + p * amxNode._step;
          setValue($valve,value);
        });
        */

        /* good one, but for now, let's not have keyboard support
        $(input).bind("keyup",function(e)
        {
          var value = $input.val() * 1;
          if (!isNaN(value))
          {
            setValue($valve,value);
          }
        });
        */

        if (!disable && !field.isReadOnly)
        {
          var $slider = $(slider); // TODO make non-jq
          var $node = $(domNode); // TODO make non-jq
          $slider.tap(function(e)
          {
            var pageX;
            if (e.pageX != undefined)
            {
              pageX = e.pageX;
            }
            else
            {
              var oe = e.originalEvent;
              if (oe.touches && oe.touches.length > 0)
              {
                pageX = oe.touches[0].pageX;
              }
              // on 'touchend' oe.touches is empty, need to check oe.changedTouches
              else if (oe.changedTouches && oe.changedTouches.length > 0)
              {
                pageX = oe.changedTouches[0].pageX;
              }
              else
              {
                return;
              }
            }
            var startX = adf.mf.internal.amx.getElementLeft(slider);
            var deltaX = pageX - startX;
            var value = deltaX / slider.offsetWidth * (amxNode._max - amxNode._min) + amxNode._min;
            amxNode["_oldValue"] = amxNode._currentValue;
            setValue(valve_bg, value);
            // set the amxNode value so that it stays in sync
            amxNode.setAttributeResolvedValue("value", amxNode._currentValue);
            var vce = new amx.ValueChangeEvent(amxNode._oldValue, amxNode._currentValue);
            amx.processAmxEvent(amxNode,"valueChange","value",amxNode._currentValue, vce);
          });

          $slider.drag(".valve-background",
          {
            start: function(event,dragExtra)
            {
              event.preventDefault();
              event.stopPropagation();
              dragExtra.preventDefault = true;
              dragExtra.stopPropagation = true;
              amxNode["_oldValue"] = amxNode._currentValue;
            },
            drag: function(event,dragExtra)
            {
              event.preventDefault();
              event.stopPropagation();
              dragExtra.preventDefault = true;
              dragExtra.stopPropagation = true;
              var left = parseInt(valve_bg.style.left, 10);
              var offset = valve_bg.offsetWidth / 2;
              left = left + dragExtra.deltaPageX;
              var value;
              if (left < -offset)
              {
                left = -offset;
                value = amxNode._min;
              }
              else if (left > slider.offsetWidth - offset)
              {
                left = slider.offsetWidth - offset;
                value = amxNode._max;
              }
              // Checking to see if the value is not a number, set it to the min-value in that case
              else
              {
              	if (isNaN(value))
						  	{  
									value = amxNode._min;
						  	}
                value = (left + offset) / slider.offsetWidth * (amxNode._max - amxNode._min) + amxNode._min;
                value = Math.round(value / amxNode._step) * amxNode._step;
              }
              valve_bg.style.left = left+"px";
              selected.style.width = (left+offset)+"px";
              slider.setAttribute("data-value", value);
              if (amxNode._currentValue != value)
              {
                amxNode._currentValue = value;
              }
            },
            end: function(event,dragExtra)
            {
              event.preventDefault();
              event.stopPropagation();
              dragExtra.preventDefault = true;
              dragExtra.stopPropagation = true;
              var valve_bg = this;
              setValue(valve_bg, amxNode._currentValue);
              // set the amxNode value so that it stays in sync
              amxNode.setAttributeResolvedValue("value", amxNode._currentValue);
              var vce = new amx.ValueChangeEvent(amxNode._oldValue, amxNode._currentValue);
              amx.processAmxEvent(amxNode,"valueChange","value",amxNode._currentValue, vce);
              amxNode["_oldValue"] = amxNode._currentValue;
            }
          });
        }

        function setValue(valve_bg, value, width)
        {
          if (!width)
          {
            width = slider.offsetWidth;
          }
          // Checking to see if the value is not a number, set it to the min-value in that case
          if (isNaN(value))
					{  
					  value = amxNode._min; 
					}
          value = Math.round(value / amxNode._step) * amxNode._step;
          
          if (value <= amxNode._min)
          {
            value = amxNode._min;
          }
          if (value >= amxNode._max)
          {
            value = amxNode._max;
          }
          var offset = valve_bg.offsetWidth / 2;
          var left = (value - amxNode._min)/(amxNode._max - amxNode._min) * width ;
          valve_bg.style.left = (left - offset)+"px";
          selected.style.width = left+"px";
          slider.setAttribute("data-value", value);
          if (amxNode._currentValue != value)
          {
            amxNode._currentValue = value;
          }
        }
        amxNode.setValue = setValue;
        return domNode;
      },

      init: function(domNode, amxNode)
      {
        var fieldValue = domNode.childNodes[1];
        var container = fieldValue.firstChild;
        var slider = container.firstChild;

        var childNodes = slider.childNodes;
        var length = childNodes.length;
        var valve_bg;
        var slider;
        for (var i = 0; i < length; ++i)
        {
          var child = childNodes[i];
          if (adf.mf.internal.amx.getCSSClassNameIndex(child.className, "valve-background") != -1)
          {
            valve_bg = child;
      }
          else if (adf.mf.internal.amx.getCSSClassNameIndex(child.className, "slider") != -1)
          {
            slider = child;
    }
        }
        amxNode.setValue(valve_bg, slider.getAttribute("data-value") * 1, slider.offsetWidth);
      }
    }

  }; // /var amxRenderers

  // add this renderer
  amx.registerRenderers("amx",amxRenderers);

})();

