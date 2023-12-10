export const json = {
    "title": "Registration Form",
    "description": "Your privacy is important to us. All information received through our forms and other communications is subject to our Privacy Policy.",
    "logo": "https://api.surveyjs.io/private/Surveys/files?name=09b0ee2a-d256-4376-b328-8be12d868f14",
    "logoWidth": "auto",
    "logoHeight": "96",
    "completedHtml": "<div style=\"max-width:540px;text-align:left;margin:0px auto 16px auto;border: 1px solid rgba(0,0,0,0.25);padding:40px 48px 48px 48px;background-color:#fff;\">\n\n<h4>Thank you for completing your {userType} registration form.</h4>\n<br>\n<p>Dear {firstname-for-complete-page},\n<br>\nYour information has been successfully received, and we look forward to providing you with the highest level of care. \n<br><br>\n{additionalMessage}\n<br><br>\nIf you have any questions, please don't hesitate to reach out to our office. Our team is here to assist you every step of the way.\n<br><br>\nWarm regards,\n<br>\nCentral Hospital.</p>\n\n</div>",    "pages": [
      {
        "name": "page0",
        "elements":[
          {
            "type": "dropdown",
            "name": "userType",
            "title": "Select your role",
            "isRequired": true,
            "choices": ["Patient", "Doctor"],
          }
        ]
      },
      {
        "name": "page1",
        "elements": [
          {
            "type": "panel",
            "name": "personal-information",
            "elements": [
              {
                "type": "text",
                "name": "full-name",
                "width": "50%",
                "minWidth": "256px",
                "title": "Full Name",
                "isRequired": true,
              },
              {
                "type": "text",
                "isRequired": true,
                "name": "nationalid",
                "width": "50%",
                "minWidth": "256px",
                "startWithNewLine": false,
                "title": "National ID"
              },
              {
                "type": "text",
                "isRequired": true,
                "name": "birthdate",
                "width": "50%",
                "minWidth": "256px",
                "startWithNewLine": false,
                "title": "Date of Birth",
                "inputType": "date"
              },
              {
                "type": "dropdown",
                "isRequired": true,
                "name": "gender",
                "width": "50%",
                "minWidth": "256px",
                "startWithNewLine": false,
                "title": "Gender",
                "choices": [ "Male", "Female" ],
                "choicesOrder": "random",
                "placeholder": "",
                "allowClear": false
              }
            ],
            "width": "69%",
            "minWidth": "256px"
          },
          {
            "type": "panel",
            "name": "contact-information",
            "elements": [
              {
                "type": "text",
                "isRequired": true,
                "name": "phone",
                "width": "50%",
                "minWidth": "128px",
                "title": "Phone #"
              },
              {
                "type": "text",
                "isRequired": true,
                "name": "email",
                "width": "50%",
                "minWidth": "256px",
                "startWithNewLine": false,
                "title": "Email Address",
                "validators": [
                  {
                    "type": "email",
                    "text": "Please enter a valid email address."
                  }
                ]
              }
            ],
            "title": "Contact Information",
            "width": "100%",
            "minWidth": "256px"
          },
          {
            "type": "panel",
            "name": "emergency-contact",
            "visibleIf": "{userType} == 'Patient'",
            "elements": [
              {
                "type": "text",
                "isRequired": true,
                "name": "emergency-contact-full-name",
                "width": "50%",
                "minWidth": "256px",
                "title": "Full Name"
              },
              {
                "type": "dropdown",
                "name": "emergency-contact-relationship",
                "width": "50%",
                "minWidth": "128px",
                "isRequired": true,
                "startWithNewLine": false,
                "title": "Relationship",
                "choices": [ "Family Member", "Friend", "Partner", "Work Colleague" ], 
                "choicesOrder": "random",
                "placeholder": "",
                "allowClear": false
              },
              {
                "type": "text",
                "name": "emergency-contact-phone",
                "width": "50%",
                "isRequired": true,
                "minWidth": "128px",
                "title": "Phone #"
              },
              {
                "type": "text",
                "name": "emergency-email",
                "width": "50%",
                "minWidth": "256px",
                "startWithNewLine": false,
                "title": "Email"
              }
            ],
            "title": "Emergency Contact Information",
            "width": "100%",
            "minWidth": "256px"
          },
          {
            "type": "panel",
            "name": "login-crednetials",
            "elements": [
              {
                "type": "text",
                "name": "username",
                "width": "50%",
                "isRequired": true,
                "minWidth": "256px",
                "title": "Username"
              },
              {
                "type": "text",
                "name": "password",
                "width": "50%",
                "isRequired": true,
                "minWidth": "128px",
                "startWithNewLine": false,
                "title": "Password",
              },
             
            ],
            "title": "Login Credentials",
            "width": "100%",
            "minWidth": "256px"
          },
          {
            "type": "panel",
            "name": "professional-experience",
             "visibleIf": "{userType} == 'Doctor'",

            "elements": [
              {
                "type": "text",
                "name": "hourly-rate",
                "width": "50%",
                "minWidth": "128px",
                "title": "Hourly Rate",
                "isRequired": true
              },
              {
                "type": "dropdown",
                "name": "selectedSpecialty",
                "title": "Select Specialty",
                "width": "50%",
                "minWidth": "256px",
                "startWithNewLine": false,
                "choices": ["Cardiology", "Dermatology", "Orthopedics", "Ophthalmology", "Pediatrics"],
                "isRequired": true
              },
              {
                "type": "text",
                "name": "affiliation",
                "width": "50%",
                "minWidth": "128px",
                "title": "Affiliation",
                "isRequired": true
              },
              {
                "type": "text",
                "name": "educational-background",
                "width": "50%",
                "startWithNewLine": false,
                "minWidth": "256px",
                "title": "Educational Background",
                "isRequired": true
              },
              
              {
                "type": "file",
                "name": "medicalLicenses",
                "title": "Medical License",
                "accept": ".pdf,.jpg,.jpeg,.png",
                "isRequired": true,
                "multiple": true,
                "storeDataAsText":false 

              },
              {
                "type": "file",
                "name": "idDocument",
                "title": "ID Document",
                "accept": ".pdf,.jpg,.jpeg,.png",
                "isRequired": true,
                "storeDataAsText":false 
              },
              {
                "type": "file",
                "name": "medicalDegree",
                "title": "Medical Degree",
                "accept": ".pdf,.jpg,.jpeg,.png",
                "isRequired": true,
                "storeDataAsText":false 

              }
             
            ],
            "title": "Professional Experience",
            "width": "100%",
            "minWidth": "256px"
          },
        ]
      }
    ],
    "calculatedValues": [{
      "name": "firstname-for-complete-page",
      "expression": "iif({full-name} notempty, {full-name}, patient)"
    },
    {
      "name": "userTypeCompletionMessage",
      "expression": "iif({userType} == 'Doctor', 'Thank you for completing your Doctor Registration Form.', 'Thank you for completing your Patient Registration Form.')"
    },
    {
      "name": "additionalMessage",
      "expression": "userType === 'Doctor' ? 'The admin will review your request, and you will guarantee access to the system upon approval.' : ''"
    }],
    "showQuestionNumbers": "off",
    "questionErrorLocation": "bottom",
    "completeText": "Register",
    "questionsOnPageMode": "singlePage",
    "widthMode": "static",
    "width": "1024",
    "fitToContainer": true,
    "headerView": "advanced"
  };