

$(document).ready(function () {
	// if the user clicks a suggested amount, clear the custom amount text box
	$("[id*=pnSuggestedDonationAmounts] input:radio").on("click",function () {
		$('[id*=tbCustomDonationAmount]').val("");
	});

	// if the user types in the custom amount text box, check its radio button
	$('[id*=tbCustomDonationAmount]').keypress(function () {
		$("[id*=pnSuggestedDonationAmounts] input:radio[value=0]").attr('checked', 'checked');
	});

	$('[id*=tbCustomDonationAmount]').focus(function () {
		$("[id*=pnSuggestedDonationAmounts] input:radio[value=0]").trigger('click');
	});

	// GiftAid calculation
	$(document).on("DonationAmountRequest", DonationAmountRequestHandler);
	$("[id*=pnSuggestedDonationAmounts] :radio").on("click",function () {
		SendNewDonationAmountValue();
	});
	$("[id*=tbCustomDonationAmount]").blur(function () {
		SendNewDonationAmountValue();
	});
	
	$("[id*=tbCustomDonationAmount]").focus(function () {
		SendNewDonationAmountValue();
	});

	SendNewDonationAmountValue();

	////////////////////////////
	// client side validation //
	////////////////////////////

	window.cvClientValidatorValidate = function (source, validator) {
		// can't use GetCustomTextBoxAmount because that doesn't distinguish between no selected amount and a bad custom amount and we want to do different messages in those 2 cases.
		$("#inlineError").hide(); // hope for the best.

		var suggestedAmounts = $("[id*=pnSuggestedDonationAmounts] :radio").filter(':visible');

		if (suggestedAmounts.length > 0 && suggestedAmounts.filter(':checked').length == 0) {
			// no suggested amount selected
			validator.IsValid = false;
			$("#inlineError").html($("#hiddenRfvDonationAmountErrorMessage").val()).show();
			return;
		}

		var selectedValue = suggestedAmounts.filter(':checked').parent().attr("Amount");

		if (selectedValue) { //We have a selected static suggested amount
			validator.IsValid = selectedValue == "0" ? validateCustomAmount() : true;

		} else { //We have dynamic donation amounts or just the textbox
			var dynamicSelectedValue = suggestedAmounts.filter(':checked').attr("value");

			validator.IsValid = !dynamicSelectedValue || dynamicSelectedValue == "0" ? validateCustomAmount() : true;
		}
	};

	function validateCustomAmount() {
		var textBoxValue = $("[id*=tbCustomDonationAmount]").val().trim();

		if (textBoxValue == "") {
			$("#inlineError").html($("#hiddenRfvDonationAmountErrorMessage").val()).show();
			return false;
		}

		if (!validateCurrencyAmount(textBoxValue, $("#hiddenCurrencyID").val(), $("#hiddenLanguageCode").val())) {
			$("#inlineError").html($("#hiddenCvDonationAmountErrorMessage").val()).show();
			return false;
		}

		var amount = currencyToNumber(textBoxValue, $("#hiddenLanguageCode").val());

		if (amount < $("#hiddenMinimumDonationAmount").val()) {
			$("#inlineError").html($("#hiddenCvMinimumAmountErrorMessage").val()).show();
			return false;
		}

		return true;
	}

	function validateCurrencyAmount(currencyString, currencyId, languageCode) {
		// please see 'coreSolution/MobileControls/currencyValidatorCommon.cs' for detailed comments about 
		// the different regExp used here.

		var pattern;

		switch (currencyId) {
			case "GBP": pattern = $("#hiddenGBPen").val();
				break;
			case "EUR": pattern = $("#hiddenEURen").val();
				break;
			case "AUD": pattern = $("#hiddenCADen").val();
				break;
			default:
				languageCode == 'fr-CA' ? pattern = $("#hiddenCADfr").val() : pattern = $("#hiddenCADen").val();
		}

		var regExp = new RegExp(pattern);
		return regExp.test(currencyString);
	};

	function currencyToNumber(currencyString, languageCode) {
		/// <summary>
		///   Convert a string containing a formatted currency amount
		///   to a number. French example: "1,23 $" -> "1.23"
		/// </summary>

		var result = currencyString.replace(/[^\d,.]/g, ""); // remove anything that is not a digit, a comma, or a dot.

		if (languageCode == 'en-CA') // if English, remove comma.
			result = result.replace(/,/, "");

		if (languageCode == 'fr-CA') // if French, change a comma to a dot.
			result = result.replace(/,/, ".");

		if (result == "")
			result = 0;

		return parseFloat(result);
	};

});

function DonationAmountRequestHandler() {
	SendNewDonationAmountValue();
}

function SendNewDonationAmountValue() {
	var amount = GetSelectedDonationAmount();
	$.event.trigger({
		type: "NewDonationAmount",
		message: amount
	});
}

function GetSelectedDonationAmount() {
	var selectedValue = $("[id*=pnSuggestedDonationAmounts] :radio").filter(':checked').parent().attr("Amount");

	if (selectedValue) { //We have suggestedDonation amounts
		var isCustomSelected = selectedValue == "0";

		if (isCustomSelected) {
			return GetCustomTextBoxAmount();
		} else {
			return selectedValue;
		}
	} else {  //We have dynamic donation amounts or just the textbox
		var dynamicSelectedValue = $("[id*=pnSuggestedDonationAmounts] :radio").filter(':checked').attr("value");

		if (!dynamicSelectedValue || dynamicSelectedValue == "0") {
			return GetCustomTextBoxAmount();
		}
		else {
			return dynamicSelectedValue;
		}
	}
}

function GetCustomTextBoxAmount() {
	var textBoxValue = $("[id*=tbCustomDonationAmount]").val();

	if (textBoxValue) {
		if ($("[id*=hiddenLangCode]").val() == 'fr-CA')
			textBoxValue = textBoxValue.replace(/,/, ".");
		var amount = textBoxValue.replace(/[^0-9.]/g, "");
		return isNaN(parseFloat(amount)) ? 0 : parseFloat(amount);
	}

	return 0;
}

var cvClientValidatorValidate; // globally defined function set in local namespace above.
	

