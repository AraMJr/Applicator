
function applicate() {
    console.log('applicating');
    const firstName = document.getElementById('firstName').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;

    const fieldsToFill = {
        'firstName': firstName,
        'phone': phone,
        'email': email
    };

    console.log(fieldsToFill);
    browser.tabs.query({active: true, currentWindow: true}).then(async function(tabs) {
        browser.tabs.sendMessage(tabs[0].id, {action: "fillFormFields", fields: fieldsToFill});
    }).catch(console.error);
}
