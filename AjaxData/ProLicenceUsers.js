ProLicenceUsersTable = {};
ProLicenceUsersTable = {
    "ProLicenceUsers": {
        "1ad344c0-40c4-4ffe-b1b0-142f6918d437": {
            "reason": "LMauthor",
            "notes": "Jimboy3100"
        },
        "1ad344c0-40c4-4ffe-b1b0-142f6918d437": {
            "reason": "LMauthor",
            "notes": ""
        }
    },
    "versionsInfo": ["v-0.3", "LM-v2.5"]
};

if (ProLicenceUsersTable.ProLicenceUsers[window.ironrv_userId] != undefined) {
console.log("Authorised User");
buydeals();
}
else{
console.log("Non Authorised User");
toastr["info"]("This Function is enabled to those who donated 6$ to author, contact Skype Id: Jimboy3100 and refer you <font color='red'><b>UID</b></font color='red'>", "", { timeOut: 4000, extendedTimeOut: 2000 }).css("width", "300px");
}
