
const formContainer = document.getElementById("form-container");

const formFields = [
    { label: "First Name", id: "first-name", type: "text", placeholder: "First Name", formatted: false, abbrev: false},
    { label: "Last Name", id: "last-name", type: "text", placeholder: "Last Name", formatted: false, abbrev: false},
    { label: "Email", id: "email", type: "email", placeholder: "text@website.ext", formatted: false, abbrev: false},
    { label: "Phone Number", id: "phone-number", type: "tel", placeholder: "xxx-xxx-xxxx", formatted: true, abbrev: false},
    { label: "Address", id: "address", type: "text", placeholder: "Street Address", formatted: false, abbrev: false},
    { label: "City", id: "city", type: "text", placeholder: "City", formatted: false, abbrev: false},
    { label: "State", id: "state", type: "state", placeholder: "State", formatted: false, abbrev: true},
    { label: "Zip Code", id: "zip-code", type: "zip", placeholder: "xxxxx-xxxx", formatted: true, abbrev: false},
    { label: "Country", id: "country", type: "country", placeholder: "Country", formatted: false, abbrev: false},
];

const us_states = {
    'alabama': 'al',
    'alaska': 'ak',
    'arizona': 'az',
    'arkansas': 'ar',
    'california': 'ca',
    'colorado': 'co',
    'connecticut': 'ct',
    'delaware': 'de',
    'florida': 'fl',
    'georgia': 'ga',
    'hawaii': 'hi',
    'idaho': 'id',
    'illinois': 'il',
    'indiana': 'in',
    'iowa': 'ia',
    'kansas': 'ks',
    'kentucky': 'ky',
    'louisiana': 'la',
    'maine': 'me',
    'maryland': 'md',
    'massachusetts': 'ma',
    'michigan': 'mi',
    'minnesota': 'mn',
    'mississippi': 'ms',
    'missouri': 'mo',
    'montana': 'mt',
    'nebraska': 'ne',
    'nevada': 'nv',
    'new hampshire': 'nh',
    'new jersey': 'nj',
    'new mexico': 'nm',
    'new york': 'ny',
    'north carolina': 'nc',
    'north dakota': 'nd',
    'ohio': 'oh',
    'oklahoma': 'ok',
    'oregon': 'or',
    'pennsylvania': 'pa',
    'rhode island': 'ri',
    'south carolina': 'sc',
    'south dakota': 'sd',
    'tennessee': 'tn',
    'texas': 'tx',
    'utah': 'ut',
    'vermont': 'vt',
    'virginia': 'va',
    'washington': 'wa',
    'west virginia': 'wv',
    'wisconsin': 'wi',
    'wyoming': 'wy'
}

formFields.forEach((field) => {
    // label
    const label = document.createElement("label");
    label.textContent = field.label;
    label.htmlFor = field.id;
    // input
    const input = document.createElement("input");
    input.type = field.type;
    input.id = field.id;
    input.dataset.field = field.id;
    input.placeholder = field.placeholder;
    // lineBreak
    const lineBreak = document.createElement("br");
    // generate form
    if (formContainer) {
        formContainer.appendChild(label);
        formContainer.appendChild(input);
        formContainer.appendChild(lineBreak);
    }
});

var validInputs = true

console.log("Applicator extension loaded");

// Define the interface
document.addEventListener('DOMContentLoaded', function() {
    var inputs = document.querySelectorAll('input[data-field]');
    var applicateButton = document.getElementById('applicate');
    var clearButton = document.getElementById('clear');

    // Load the last entered values from storage and populate the input fields
    browser.storage.local.get(null, function(result) {
        for (var i = 0; i < inputs.length; i++) {
            var field = inputs[i].dataset.field;
            if (result[field]) {
                inputs[i].value = result[field];
            }
        }
    });

    console.log(inputs)

    // Save the values when the user types or changes the input fields
    for (var i = 0; i < inputs.length; i++) {
        inputs[i].addEventListener('input', function(event) {
            var field = event.target.dataset.field;
            var value = event.target.value;
            var fieldType = formFields.find((field) => field.id === event.target.id)?.type;
            var invalidFound = false
            // Store the last entered value in storage
            if (validateField(fieldType, value) || value === null || value === "") {
                var data = {};
                data[field] = value;
                browser.storage.local.set(data);
                event.target.classList.remove('invalid');
            } else {
                invalidFound = true
                event.target.classList.add('invalid')
            }
            if (invalidFound) {
                validInputs = false
                applicateButton.classList.add('invalidButton')
            } else {
                validInputs = true
                applicateButton.classList.remove('invalidButton')
            }
        });
    }

    // Clear the values when the user clicks the clear button
    clearButton.addEventListener('click', function() {
        // Clear the values in storage
        browser.storage.local.clear();
        // Clear the values on the page
        for (var i = 0; i < inputs.length; i++) {
            inputs[i].value = "";
        }
    });

    applicateButton.addEventListener('click', function() {
        // Load the last entered values from storage and populate the input fields
        if (validInputs) {
            browser.storage.local.get(null, function(result) {
                for (var i = 0; i < inputs.length; i++) {
                    var field = inputs[i].dataset.field;
                    var value = result[field];
                    // Populate the value onto the page if it is not empty
                    if (value) {
                        applicate(field, value);
                    }
                }
            });
        }
    });

});

function validateField(type, value) {
    switch (type) {
        case "email":
            return /^[^\s]+@[^\s]+\.[^\s]+$/.test(value);
        case "tel":
            return /(^((\d{3})-|(\(\d{3}\) ?))\d{3}-\d{4}$)|(^\d{10}$)/.test(value);
        case "state":
            return value.toLowerCase() in us_states ? true : false;
        case "zip-code":
            return /^\d{5}(-\d{4})*$/.test(value);
        case "country":
            return /^united states( of america)*$/.test(value.toLowerCase());
        default:
            return true;
    }
}

function applicate(field, value) {
    console.log(field + ": " + value);
}


