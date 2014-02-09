/**
 * Creates a custom form select type element based on the elements passed
 * @author chris nasr
 * @copyright FUEL for the FIRE (free for non-commercial use)
 * @version 1.0
 * @date 2014-02-09
 */
(function($) {
	$.fn.customFormSelect	= function(in_opts) {
		// Default options
		var aOptions	= {
			"multiple":			false,
			"name":				"select",
			"onChange":			function() {},
			"selectedClass":	'selected'
		};

		// Override defaults with passed options
		if(in_opts) {
			$.extend(aOptions, in_opts);
		}

		// Default value
		var iValue	= (aOptions.value) ? aOptions.value : '';

		// Return this after looping through the elements
		return this.each(function() {
			// Store jQueried scope
			var $this		= $(this);

			// Get the name
			var sName	= $this.attr('name');
			if(!sName) {
				sName	= aOptions.name;
			}

			// Get multple
			var bMultiple	= $this.attr('multiple');
			if(bMultiple)	bMultiple	= (bMultiple == 'multiple') ? true : false;
			if(!bMultiple) {
				bMultiple	= aOptions.multiple;
			}

			$this.data('multiple', bMultiple);

			// If we're in multple select mode
			if(bMultiple)
			{
				if(!$this.data('select'))
				{
					var oSelect	= $('<select name="' + sName + '" multiple="multiple" style="display: none;"></select>');
					$this.after(oSelect);
					$this.data('select', oSelect);
				}
				else
				{
					$this.data('select').attr('name', sName);
				}
			}
			// Else we're in single select mode
			else
			{
				// If there's no old data, create a hidden input to store the
				//	current value in and append it to the current element
				if(!$this.data('input'))
				{
					var oInput	= $('<input type="hidden" name="' + sName + '" value="' + iValue + '" />');
					$this.after(oInput);
					$this.data('input', oInput);
				}
				else
				{
					$this.data('input').attr('name', sName);
				}

				// Clear last element selected
				$this.data('last', null);
			}

			// Then find all the children
			var aChildren	= $this.children();

			// Go through the children to see if one is selected
			aChildren.each(function() {
				var oEl	= $(this);

				// If we're in multple select mode
				if(bMultiple)
				{
					// Is the element selected?
					sSelected = (oEl.attr('selected') == 'selected') ?
									' selected="selected"' :
									'';

					if(sSelected) {
						oEl.attr('selected', 'selected')
						oEl.addClass(aOptions.selectedClass);
					}

					// Create a new option for the select
					var oOption	= $('<option value="' + oEl.attr('value') + '"' + sSelected + '>' + oEl.attr('value') + '</option>');

					// And append it
					$this.data('select').show();
					$this.data('select').append(oOption);
					$this.data('select').hide();
				}
				// Else we're in single select mode
				else
				{
					// If the value matches the current value, or the element
					//	has an attribute saying it's selected
					if(iValue == oEl.attr('value') || oEl.attr('selected') == 'selected')
					{
						oEl.addClass(aOptions.selectedClass);
						$this.data('last', oEl);
						$this.data('input').val(oEl.attr('value'));
					}
				}
			});

			// Attach a callback to each child for clicking
			aChildren.click(function(ev) {
				// Store the target
				var el		= $(this);

				// If we're in multiple select mode
				if(bMultiple)
				{
					// Show the select so it properly updates
					$this.data('select').show();

					// Get the option corresponding to the value clicked and
					//	flip it's selected state
					var opt	= $this.data('select').find('option[value="' + el.attr('value') + '"]');
					var newValue	= !opt.prop('selected');
					opt.prop('selected', newValue);

					// Get the new values
					var values	= $this.data('select').val();

					// Hide the select, we're done with it
					$this.data('select').hide();

					// If the value is now selected
					if(newValue) {
						el.attr('selected', 'selected');
						el.addClass(aOptions.selectedClass);
					} else {
						el.removeAttr('selected');
						el.removeClass(aOptions.selectedClass);
					}

					// Call the callback with the new values
					aOptions.onChange(values, ev);
				}
				// Else we're in single select mode
				else
				{
					// If the values are the same, do nothing
					if(el.attr('value') == $this.data('input').val()) {
						return;
					}

					// Pull the currently selected element
					var currSel	= $this.data('last');

					// If it exists, hide it
					if(currSel) {
						currSel.removeAttr('selected');
						currSel.removeClass(aOptions.selectedClass);
					}

					// Store the new value
					$this.data('input').val(el.attr('value'));

					// Store the new selected and add the class
					$this.data('last', el);
					el.attr('selected', 'selected');
					el.addClass(aOptions.selectedClass);

					// Call the callback with the new value
					aOptions.onChange(el.attr('value'), ev);
				}
			});
		});
	};

	$.fn.customFormSelectClear	= function() {
		// Return this after looping through the elements
		return this.each(function() {
			// Store scope
			var $this		= $(this);

			// Clear value(s)
			if($this.data('multiple')) {
				$this.data('select').show();
				$this.data('select').val([]);
				$this.data('select').hdie();
			} else {
				$this.data('input').val(iValue);
				$this.data('last', null);
			}
		});
	};
})(jQuery);