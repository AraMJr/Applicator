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

    // Save the values when the user types or changes the input fields
    for (var i = 0; i < inputs.length; i++) {
        inputs[i].addEventListener('input', function(event) {
            var field = event.target.dataset.field;
            var value = event.target.value;

            // Store the last entered value in storage
            var data = {};
            data[field] = value;
            browser.storage.local.set(data);
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
    });

});

function applicate(field, value) {
    console.log(field + ": " + value);
}


