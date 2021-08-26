<script type="text/javascript">
// remember, these are the possible parameters for Set_Cookie:
// name, value, expires, path, domain, secure
Set_Cookie( 'test', 'none', '', '/', '', '' );
// if Get_Cookie succeeds, cookies are enabled, since 
//the cookie was successfully created.
if ( Get_Cookie( 'test' ) )
{
    document.write( 'cookies are currently enabled.' );
    /* 
    this is an example of a set cookie variable, if 
    you want to use this on the page or on another script 
    instead of writing to the page you would just check that value
    for true or false and then do what you need to do.
    */
    cookie_set = true;
    // and these are the parameters for Delete_Cookie:
    // name, path, domain
    // make sure you use the same parameters in Set and Delete Cookie.
    Delete_Cookie('test', '/', '');
}
// if the Get_Cookie test fails, cookies are not enabled for this session.
else {
    document.write('cookies are not currently enabled.');
    cookie_set = false;
}
</script>

const checkboxValues = JSON.parse(localStorage.getItem("checkboxValues")) || {},
	buttons = Array.from(document.querySelectorAll(".checklist-item__expand")),
	labels = Array.from(document.querySelectorAll(".checklist-item__title")),
	checkboxes = Array.from(document.querySelectorAll('input[type="checkbox"]')),
	checkboxesLength = checkboxes.length,
	progress = document.querySelector(".progress__bar"),
	counter = document.querySelector(".progress__count"),
	reset = document.querySelector(".progress__reset");
window.onload = function() {
	loadIds(), loadValues(), checkboxes.forEach(a =>
			a.addEventListener("click", countChecked)
		), buttons.forEach(a =>
			a.addEventListener("click", toggleExpand)
		), labels.forEach(a =>
			a.addEventListener("click", toggleExpand)
		), reset.addEventListener("click", resetCheckboxes), reset.addEventListener(
			"animationend",
			function() {
				this.classList.remove("progress__reset--pressed");
			},
			!3
		), "serviceWorker" in navigator &&
		navigator.serviceWorker.register("./sw.js", {
			scope: "./"
		})
};

function loadIds() {
	for (let a = 0; a < checkboxesLength; a += 1) {
		const b = a => a.replace(/[ *êôềôệặếảìắíóừàđọẻã%èốểứạ,.!?;:'-]/g, "");
		(checkboxes[a].id = `${b(
			checkboxes[a].nextSibling.nextSibling.innerText
		).toLowerCase()}`), checkboxes[a].nextSibling.setAttribute(
			"for",
			`${b(checkboxes[a].nextSibling.nextSibling.innerText).toLowerCase()}`
		);
	}
}

function updateStorage(a) {
	(checkboxValues[a.id] = a.checked), localStorage.setItem(
		"checkboxValues",
		JSON.stringify(checkboxValues)
	);
}

function countChecked() {
	if ("checkbox" === this.type) {
		const a = this.parentNode.parentNode.parentNode,
			b =
			a.querySelectorAll("input:checked").length /
			a.querySelectorAll(".checklist-item").length;
		a.querySelector(
			".checklist__percentage-border"
		).style.transform = `scaleX(${b})`;
	} else
		Array.from(document.querySelectorAll(".checklist")).forEach(a => {
			const b =
				a.querySelectorAll("input:checked").length /
				a.querySelectorAll(".checklist-item").length;
			a.querySelector(
				".checklist__percentage-border"
			).style.transform = `scaleX(${b})`;
		});
	let a = 0;
	Array.from(document.querySelectorAll("input:checked")).forEach(() => {
		a += 1;
	}), (counter.innerText = `${a}/${checkboxesLength}`), (progress.style.transform = `scaleX(${a /
		checkboxesLength})`), (checkboxValues.globalCounter = a), updateStorage(this);
}

function loadValues() {
	const a = checkboxValues.globalCounter || 0;
	(counter.innerText = `${a}/${checkboxesLength}`), Object.keys(
		checkboxValues
	).forEach(a => {
		"globalCounter" !== a &&
			(document.getElementById(a).checked = checkboxValues[a]);
	}), countChecked();
}

function toggleExpand() {
	const a = this.parentNode;
	a.querySelector(".line").classList.toggle("closed"), a.classList.toggle(
		"open"
	);
}

function resetCheckboxes() {
	this.classList.add("progress__reset--pressed"), checkboxes.forEach(
		a => (a.checked = !1)
	), Object.keys(checkboxValues).forEach(
		a => delete checkboxValues[a]
	), countChecked();
}