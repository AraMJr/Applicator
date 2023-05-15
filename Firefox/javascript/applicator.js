
const formContainer = document.getElementById("form-container");

const formFields = [
    { label: "Full Name", id: "full-name", fieldType: "name", placeholder: "Full Name", hidden: false},
    { label: "First Name", id: "first-name", fieldType: "text", placeholder: "First Name", hidden: true},
    { label: "Last Name", id: "last-name", fieldType: "text", placeholder: "Last Name", hidden: true},
    { label: "Email", id: "email", fieldType: "email", placeholder: "text@website.ext", hidden: false},
    { label: "Phone Number", id: "phone-number", fieldType: "tel", placeholder: "xxx-xxx-xxxx", hidden: false},
    { label: "Date of Birth", id: "date-of-birth", fieldType: "dob", placeholder: "mm/dd/yyyy", hidden: false},
    { label: "Mailing Address", id: "mailing-address", fieldType: "add", placeholder: "Mailing Address", hidden: true},
    { label: "Address", id: "address", fieldType: "text", placeholder: "Street Address", hidden: false},
    { label: "City", id: "city", fieldType: "text", placeholder: "City", hidden: false},
    { label: "State", id: "state", fieldType: "state", placeholder: "State", hidden: false},
    { label: "Zip Code", id: "zip-code", fieldType: "zip", placeholder: "xxxxx-xxxx", hidden: false},
    { label: "Country", id: "country", fieldType: "country", placeholder: "Country", hidden: false},
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
    if (field.hidden) {
        label.classList.add("hidden");
    }
    // input
    const input = document.createElement("input");
    input.type = field.fieldType;
    input.fieldType = field.fieldType;
    input.id = field.id;
    input.dataset.field = field.id;
    input.placeholder = field.placeholder;
    if (field.hidden) {
        input.classList.add("hidden");
    }
    // lineBreak
    const lineBreak = document.createElement("br");
    if (field.hidden) {
        lineBreak.classList.add("hidden");
    }
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
        var counter = 0;
        for (var i = 0; i < inputs.length; i++) {
            console.log(inputs[i])
            var field = inputs[i].dataset.field;
            if (result[field]) {
                counter++;
                inputs[i].value = autoFormat(inputs[i].fieldType, result[field].value);
            }
        }
        if (counter === 0) {
            applicateButton.classList.add('invalidButton');
        } else {
            applicateButton.classList.remove('invalidButton');
        }
    });

    console.log(inputs)

    // Save the values when the user types or changes the input fields
    for (var i = 0; i < inputs.length; i++) {
        inputs[i].addEventListener('input', function(event) {
            var field = event.target.dataset.field;
            var value = event.target.value;
            var fieldType = event.target.fieldType;
            var invalidFound = false
            // Store the last entered value in storage
            if (value === null || value === "" || value === undefined ||validateField(fieldType, value)) {
                var data = {};
                data[field] = {"value": value, "fieldType": fieldType};
                browser.storage.local.set(data);
                event.target.classList.remove('invalid');
            } else {
                invalidFound = true
                event.target.classList.add('invalid')
            }
            if (invalidFound || allFieldsEmpty(inputs)) {
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
        applicateButton.classList.add('invalidButton');
    });

    applicateButton.addEventListener('click', function() {
        // Load the last entered values from storage and populate the input fields
        if (validInputs && !allFieldsEmpty(inputs)) {
            console.log("applicating:", inputs);
            browser.storage.local.get(null, function(result) {
                for (var i = 0; i < inputs.length; i++) {
                    var field = inputs[i].dataset.field;
                    if (result[field]) {
                        var value = result[field].value;
                        // Populate the value onto the page if it is not empty
                        if (value) {
                            applicate(field, value);
                        }
                    } 
                }
            });
        }
    });

});

function allFieldsEmpty(inputs) {
    return Array.from(inputs).every(function(input) {
        return input.value === "" || input.value === null || input.value === undefined;
    });
}

function validateField(type, value) {
    switch (type) {
        case "email":
            return /^[^\s]+@[^\s]+\.[^\s]+$/.test(value);
        case "tel":
            return /(^(\d{1,2}-)?((\d{3})-|(\(\d{3}\) ?))\d{3}-\d{4}$)|(^\d{10}$)/.test(value);
        case "state":
            return value.toLowerCase() in us_states ? true : false;
        case "zip":
            return /^\d{5}(-\d{4})*$/.test(value);
        case "country":
            return /^united states( of america)*$/.test(value.toLowerCase());
        default:
            return true;
    }
}

function autoFormat(type, value) {
    switch (type) {
        case "tel":
            value = value.replace(/\D/g, '').substring(0, 13);
            length = value.length;
            if (length > 10 && length <= 13) {
                return value.substring(0, length - 10) + '-' + value.substring(length - 10, length - 7) + '-' + value.substring(length - 7, length - 4) + '-' + value.substring(length - 4, length);
            } else if (length > 6) {
                return value.substring(0, 3) + '-' + value.substring(3, 6) + '-' + value.substring(6, 10);
            } else if (length > 3) {
                return value.substring(0, 3) + '-' + value.substring(3, 6);
            } else {
                return value;
            }
        case "zip":
            return value;
        default:
            return value;
    }
}

function applicate(field, value) {
    console.log("applicating:", field, value);
    switch (field.toLowerCase()) {
        case "email":
            var email = document.getElementById("email");
            email.value = value;
            email.dispatchEvent(new Event('input'));
            break;
        case "phone-number":
            var phone = document.getElementById("phone");
            phone.value = value;
            phone.dispatchEvent(new Event('input'));
            break;
        case "address":
            var address = document.getElementById("address");
            address.value = value;
            address.dispatchEvent(new Event('input'));
            break;
        case "city":
            var city = document.getElementById("city");
            city.value = value;
            city.dispatchEvent(new Event('input'));
            break;
        case "state":
            var state = document.getElementById("state");
            state.value = value;
            state.dispatchEvent(new Event('input'));
            break;
        case "zip-code":
            var zip = document.getElementById("zip");
            zip.value = value;
            zip.dispatchEvent(new Event('input'));
            break;
        case "country":
            var country = document.getElementById("country");
            country.value = value;
            country.dispatchEvent(new Event('input'));
            break;
        case "full-name":
            var name = document.getElementById("name");
            name.value = value;
            name.dispatchEvent(new Event('input'));
            break;
        case "date-of-birth":
            var dob = document.getElementById("dob");
            dob.value = value;
            dob.dispatchEvent(new Event('input'));
            break;
        default:
            console.log("Unknown field:", field);
    }
}
