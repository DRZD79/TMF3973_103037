const form = document.querySelector("form");

// Each item = one box in your form that needs checking
const fields = [
  { id: "fname",    label: "first name", valid: v => /^[A-Za-z ]+$/.test(v) },
  { id: "lname",    label: "last name",  valid: v => /^[A-Za-z ]+$/.test(v) },
  { id: "birthday", label: "birthday",   valid: v => true },
  { id: "age",      label: "age",        valid: v => /^[0-9]+$/.test(v) && Number(v) >= 1 && Number(v) <= 120 },
  { id: "tel",      label: "telephone number (###-###-####)", valid: v => /^[0-9]{3}-[0-9]{3}-[0-9]{4}$/.test(v) },
  { id: "email",    label: "email address", valid: v => /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/.test(v) },
  { id: "street",   label: "street",     valid: v => true },
  { id: "city",     label: "city",       valid: v => true },
  { id: "state",    label: "state",      valid: v => true },
  { id: "country",  label: "country",    valid: v => true },
  { id: "postcode", label: "postcode (#####)", valid: v => /^[0-9]{5}$/.test(v) }
];

function highlight(element) {
  element.classList.add("invalid");
}

function clearHighlights() {
  document.querySelectorAll(".invalid").forEach(el => el.classList.remove("invalid"));
}

form.addEventListener("submit", function (event) {
  clearHighlights();

  let somethingEmpty = false;   // did the user leave a box empty?
  let wrongList = [];           // boxes filled in the wrong way
  let firstBad = null;          // the first bad box (we will jump to it)

  // 1. Check the text boxes and dropdowns
  fields.forEach(function (f) {
    const box = document.getElementById(f.id);
    const value = box.value.trim();

    if (value === "") {
      somethingEmpty = true;
      highlight(box);
      if (!firstBad) firstBad = box;
    } else if (!f.valid(value)) {
      wrongList.push("Please enter correct " + f.label + ".");
      highlight(box);
      if (!firstBad) firstBad = box;
    }
  });

  // 2. Check gender (one radio button must be chosen)
  const genderChosen = form.querySelector('input[name="gender"]:checked');
  if (!genderChosen) {
    somethingEmpty = true;
    form.querySelectorAll('input[name="gender"] + label').forEach(highlight);
    if (!firstBad) firstBad = document.getElementById("male");
  }

  // 3. Check the 3 checkboxes (all must be ticked)
  form.querySelectorAll('input[type="checkbox"]').forEach(function (cb) {
    if (!cb.checked) {
      somethingEmpty = true;
      highlight(document.querySelector('label[for="' + cb.id + '"]'));
      if (!firstBad) firstBad = cb;
    }
  });

  // 4. Show the message
  let message = "";
  if (somethingEmpty) {
    message += "Please complete all the form.\n";
  }
  if (wrongList.length > 0) {
    message += "\n" + wrongList.join("\n");
  }

  if (message !== "") {
    event.preventDefault();   // stop the form from being sent
    alert(message);
    firstBad.focus();         // jump to the first problem
  } else {
    alert("Registration successful!");
  }
});

// When the user starts fixing a box, remove its red colour
form.addEventListener("input", function (event) {
  event.target.classList.remove("invalid");
});
form.addEventListener("change", function (event) {
  event.target.classList.remove("invalid");
});

// When the user presses "Clear", remove all red colours
form.addEventListener("reset", clearHighlights);