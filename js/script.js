document.addEventListener("DOMContentLoaded", function () {
	const billInput = document.querySelector(".splitter__input--bill");
	const peopleInput = document.querySelector(".splitter__input--people");
	const tipBtns = document.querySelectorAll(".splitter__btn");
	const customTipInput = document.querySelector(".splitter__custom-input");
	const tipInfo = document.querySelector(".splitter__tip-tip");
	const totalSum = document.querySelector(".splitter__tip-total");
	const resetBtn = document.querySelector(".splitter__reset-btn");
	const inputs = [billInput, peopleInput];
	const customError = document.querySelector(".input-error-custom");
	const billRegexp = /^-?\d+(\.\d+)?$/;
	const peopleRegexp = /^[0-9]\d*$/;
	let parent;
	let errorTxt;
	let selectedValue = null;

	const handleSplitter = (input, regexp, msg1, msg2) => {
		let value = parseFloat(input.value);

		if (regexp.test(value)) {
			if (value === 0) {
				showError(input, msg1);
			} else if (value < 0) {
				showError(input, msg2);
			} else {
				removeError(input);
			}
		} else {
			showError(input, "Enter valid number");
		}

		countErrors();
	};

	const showError = (input, msg) => {
		input.classList.add("error");
		parent = input.closest(".splitter__billing-section");
		errorTxt = parent.querySelector(".input-error");
		errorTxt.style.visibility = "visible";
		errorTxt.textContent = msg;
	};
	const removeError = (input) => {
		input.classList.remove("error");
		parent = input.closest(".splitter__billing-section");
		errorTxt = parent.querySelector(".input-error");
		errorTxt.style.visibility = "hidden";
	};

	const unlockBtn = () => {
		resetBtn.removeAttribute("disabled");
	};
	const lockBtn = () => {
		resetBtn.setAttribute("disabled", "true");
	};

	const countErrors = () => {
		let errorCount = 0;
		inputs.forEach((input) => {
			if (input.classList.contains("error")) {
				errorCount++;
			}
		});

		if (errorCount === 0) {
			unlockBtn();
			calculateBill();
		} else {
			lockBtn();
		}
	};

	const calculateBill = () => {
		let value1 = parseFloat(billInput.value);
		let value2 = parseFloat(peopleInput.value);
		let tipAmount;
		let total;

		if (selectedValue !== null) {
			tipAmount = (value1 * selectedValue) / value2;
			total = value1 / value2 + tipAmount;
			tipInfo.textContent = `$${tipAmount.toFixed(2)}`;
		} else {
			total = value1 / value2;
		}
		totalSum.textContent = `$${total.toFixed(2)}`;
	};
	const resetAll = () => {
		selectedValue = null;
		billInput.value = "";
		peopleInput.value = "";
		customTipInput.value = "";
		tipBtns.forEach((btn) => btn.classList.remove("selected"));
		tipInfo.textContent = "$0.00";
		totalSum.textContent = "$0.00";
		lockBtn();
		inputs.forEach((input) => input.classList.add("error"));
	};
	customTipInput.addEventListener("click", () => {
		tipBtns.forEach((btn) => btn.classList.remove("selected"));
	});
	customTipInput.addEventListener("keyup", (e) => {
		if (e.key === "Tab") {
			tipBtns.forEach((btn) => btn.classList.remove("selected"));
		}
	});
	customTipInput.addEventListener("input", () => {
		let value = parseFloat(customTipInput.value);
		if (billRegexp.test(value)) {
			if (customTipInput.value === "") {
				customError.style.visibility = "visible";
				customError.textContent = "Can't be blank";
				customTipInput.classList.add("error");
			} else if (value <= 0) {
				customError.style.visibility = "visible";
				customError.textContent = "Wrong value";
				customTipInput.classList.add("error");
			} else {
				selectedValue = value / 100;
				customError.style.visibility = "hidden";
				customTipInput.classList.remove("error");
				countErrors();
			}
		} else {
			customTipInput.classList.add("error");
			customError.style.visibility = "visible";
			customError.textContent = "Wrong value";
		}
	});
	tipBtns.forEach((btn) =>
		btn.addEventListener("click", (e) => {
			tipBtns.forEach((btn) => btn.classList.remove("selected"));

			selectedValue = parseFloat(e.target.dataset.value);
			e.target.classList.add("selected");
			countErrors();
			customError.style.visibility = "hidden";
			customTipInput.classList.remove("error");
			customTipInput.value = "";
		})
	);
	billInput.addEventListener("input", () => {
		handleSplitter(
			billInput,
			billRegexp,
			"Can't be zero",
			"Must be greater than zero"
		);
	});
	resetBtn.addEventListener("click", resetAll);
	peopleInput.addEventListener("input", () => {
		handleSplitter(peopleInput, peopleRegexp, "Can't be zero");
	});
});
